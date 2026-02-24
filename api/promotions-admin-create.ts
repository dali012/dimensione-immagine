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

    const { fields, file } = await parsePromotionMultipart(req, {
      requireImage: true,
    });

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
      fields.isActive === undefined ? true : fields.isActive === "true";
    const sortOrder = Number.parseInt((fields.sortOrder || "").trim(), 10);
    const safeSortOrder = Number.isFinite(sortOrder) ? sortOrder : 1000;
    const discountPercent = computeDiscountPercent(oldPriceCents, newPriceCents);

    const { s3, bucket } = createPromotionStorageClient();
    const promotionFile = file!;
    const imageKey = createPromotionImageKey(
      promotionFile.filename,
      promotionFile.mimeType,
    );
    uploadedKey = imageKey;
    await uploadPromotionImage(s3, bucket, imageKey, promotionFile);

    const inserted = await db.query<{
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
      `INSERT INTO promotions
        (title, image_key, old_price_cents, new_price_cents, discount_percent, starts_at, ends_at, is_active, sort_order, created_by_profile_id, updated_by_profile_id)
       VALUES
        ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
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
        safeSortOrder,
        profile.id,
        profile.id,
      ],
    );

    const row = inserted.rows[0];
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
    console.error("Promotions create error:", error);
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
