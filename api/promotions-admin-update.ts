import type { VercelRequest, VercelResponse } from "@vercel/node";
import {
  createDbClient,
  ensureWholesaleAuthSchema,
  getRequestIp,
} from "../lib/wholesale-auth.js";
import {
  checkPromotionEditorMutationRateLimit,
  computeDiscountPercent,
  createPromotionImageKey,
  createPromotionStorageClient,
  deletePromotionImage,
  ensurePromotionsSchema,
  parsePriceToCents,
  parsePromotionMultipart,
  requirePromotionEditorProfile,
  signPromotionImageUrl,
  toUtcIsoFromRomeInput,
  uploadPromotionImage,
} from "../lib/promotions.js";

export const config = {
  api: { bodyParser: false },
};

type ExistingPromotionRow = {
  id: number;
  image_key: string;
  old_price_cents: number;
  new_price_cents: number;
  sort_order: number;
  is_active: boolean;
  starts_at: string | null;
  ends_at: string | null;
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const db = createDbClient();
  if (!db) {
    return res.status(500).json({
      error:
        "Invalid or missing database connection env (DATABASE_URL/POSTGRES_URL)",
    });
  }

  let uploadedKey = "";
  let oldImageKeyForCleanup = "";

  try {
    await db.connect();
    await ensureWholesaleAuthSchema(db);
    await ensurePromotionsSchema(db);

    const profile = await requirePromotionEditorProfile(req, res, db);
    if (!profile) return;

    const rateLimit = checkPromotionEditorMutationRateLimit(
      `${getRequestIp(req)}:${profile.id}`,
    );
    if (!rateLimit.allowed) {
      return res.status(429).json({
        error: "Too many requests",
        retryAfterMs: Math.max((rateLimit.resetAt || 0) - Date.now(), 0),
      });
    }

    const { fields, file } = await parsePromotionMultipart(req);
    const id = Number.parseInt((fields.id || "").trim(), 10);
    if (!Number.isFinite(id) || id <= 0) {
      return res.status(400).json({ error: "Invalid promotion id" });
    }

    const currentResult = await db.query<ExistingPromotionRow>(
      `SELECT id, image_key, old_price_cents, new_price_cents, sort_order, is_active, starts_at, ends_at
       FROM promotions
       WHERE id = $1
       LIMIT 1`,
      [id],
    );
    if (!currentResult.rows.length) {
      return res.status(404).json({ error: "Promotion not found" });
    }
    const current = currentResult.rows[0];

    const title = (fields.title || "").trim();
    if (!title || title.length > 160) {
      return res
        .status(400)
        .json({ error: "Title is required (max 160 characters)" });
    }

    const oldPriceCents = parsePriceToCents(fields.oldPrice || "");
    const newPriceCents = parsePriceToCents(fields.newPrice || "");
    if (!oldPriceCents || !newPriceCents) {
      return res.status(400).json({ error: "Invalid price values" });
    }
    if (newPriceCents > oldPriceCents) {
      return res
        .status(400)
        .json({ error: "New price must be lower than or equal to old price" });
    }

    let startsAt: string | null = null;
    let endsAt: string | null = null;

    try {
      startsAt = toUtcIsoFromRomeInput(fields.startsAt || "");
      endsAt = toUtcIsoFromRomeInput(fields.endsAt || "");
    } catch {
      return res.status(400).json({ error: "Invalid date format" });
    }

    if (startsAt && endsAt && new Date(startsAt) > new Date(endsAt)) {
      return res
        .status(400)
        .json({ error: "Start date must be before end date" });
    }

    const isActive =
      fields.isActive === undefined ? current.is_active : fields.isActive === "true";
    const sortOrderRaw = Number.parseInt((fields.sortOrder || "").trim(), 10);
    const sortOrder = Number.isFinite(sortOrderRaw)
      ? sortOrderRaw
      : current.sort_order;
    const discountPercent = computeDiscountPercent(oldPriceCents, newPriceCents);

    const { s3, bucket } = createPromotionStorageClient();

    let imageKey = current.image_key;
    if (file) {
      imageKey = createPromotionImageKey(file.filename, file.mimeType);
      uploadedKey = imageKey;
      oldImageKeyForCleanup = current.image_key;
      await uploadPromotionImage(s3, bucket, imageKey, file);
    }

    const updated = await db.query<{
      id: number;
      title: string;
      image_key: string;
      old_price_cents: number;
      new_price_cents: number;
      discount_percent: number;
      starts_at: string | null;
      ends_at: string | null;
      is_active: boolean;
      sort_order: number;
      created_at: string;
      updated_at: string;
    }>(
      `UPDATE promotions
       SET title = $1,
           image_key = $2,
           old_price_cents = $3,
           new_price_cents = $4,
           discount_percent = $5,
           starts_at = $6,
           ends_at = $7,
           is_active = $8,
           sort_order = $9,
           updated_at = NOW(),
           updated_by_profile_id = $10
       WHERE id = $11
       RETURNING
         id, title, image_key, old_price_cents, new_price_cents, discount_percent, starts_at, ends_at, is_active, sort_order, created_at, updated_at`,
      [
        title,
        imageKey,
        oldPriceCents,
        newPriceCents,
        discountPercent,
        startsAt,
        endsAt,
        isActive,
        sortOrder,
        profile.id,
        id,
      ],
    );

    if (oldImageKeyForCleanup) {
      await deletePromotionImage(s3, bucket, oldImageKeyForCleanup).catch(() => {});
    }

    const row = updated.rows[0];
    const imageUrl = await signPromotionImageUrl(s3, bucket, row.image_key);

    return res.status(200).json({
      success: true,
      item: {
        id: row.id,
        title: row.title,
        imageUrl,
        oldPriceCents: row.old_price_cents,
        newPriceCents: row.new_price_cents,
        discountPercent: row.discount_percent,
        startsAt: row.starts_at,
        endsAt: row.ends_at,
        isActive: row.is_active,
        sortOrder: row.sort_order,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      },
    });
  } catch (error: any) {
    console.error("Promotions update error:", error);
    if (uploadedKey) {
      try {
        const { s3, bucket } = createPromotionStorageClient();
        await deletePromotionImage(s3, bucket, uploadedKey);
      } catch {
        // ignore rollback cleanup failures
      }
    }

    const errorMessage = String(error?.message || "");
    const isValidation =
      errorMessage.includes("Image") ||
      errorMessage.includes("Unsupported image type");
    return res
      .status(isValidation ? 400 : 500)
      .json({ error: isValidation ? errorMessage : "Database error" });
  } finally {
    await db.end().catch(() => {});
  }
}
