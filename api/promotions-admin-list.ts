import type { VercelRequest, VercelResponse } from "@vercel/node";
import {
  createDbClient,
  ensureWholesaleAuthSchema,
} from "../lib/wholesale-auth.js";
import {
  createPromotionStorageClient,
  ensurePromotionsSchema,
  requirePromotionEditorProfile,
  signPromotionImageUrl,
  type PromotionRow,
} from "../lib/promotions.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const db = createDbClient();
  if (!db) {
    return res.status(500).json({
      error:
        "Invalid or missing database connection env (DATABASE_URL/POSTGRES_URL)",
    });
  }

  try {
    await db.connect();
    await ensureWholesaleAuthSchema(db);
    await ensurePromotionsSchema(db);

    const profile = await requirePromotionEditorProfile(req, res, db);
    if (!profile) return;

    const { rows } = await db.query<PromotionRow>(
      `SELECT
        id,
        created_at,
        updated_at,
        title,
        image_key,
        old_price_cents,
        new_price_cents,
        discount_percent,
        starts_at,
        ends_at,
        is_active,
        sort_order,
        created_by_profile_id,
        updated_by_profile_id
       FROM promotions
       ORDER BY sort_order ASC, created_at DESC`,
    );

    const { s3, bucket } = createPromotionStorageClient();
    const items = await Promise.all(
      rows.map(async (row) => {
        const imageUrl = await signPromotionImageUrl(s3, bucket, row.image_key);
        return {
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
        };
      }),
    );

    return res.status(200).json({ items });
  } catch (error) {
    console.error("Promotions admin list error:", error);
    return res.status(500).json({ error: "Database error" });
  } finally {
    await db.end().catch(() => {});
  }
}

