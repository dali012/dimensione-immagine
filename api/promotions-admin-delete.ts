import type { VercelRequest, VercelResponse } from "@vercel/node";
import {
  getRequestIp,
  createDbClient,
  ensureWholesaleAuthSchema,
} from "../lib/wholesale-auth.js";
import {
  checkPromotionEditorMutationRateLimit,
  createPromotionStorageClient,
  deletePromotionImage,
  ensurePromotionsSchema,
  requirePromotionEditorProfile,
} from "../lib/promotions.js";

type DeletePayload = {
  id?: number;
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const id = Number((req.body as DeletePayload)?.id);
  if (!Number.isFinite(id) || id <= 0) {
    return res.status(400).json({ error: "Invalid promotion id" });
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

    const rateLimit = checkPromotionEditorMutationRateLimit(
      `${getRequestIp(req)}:${profile.id}`,
    );
    if (!rateLimit.allowed) {
      return res.status(429).json({
        error: "Too many requests",
        retryAfterMs: Math.max((rateLimit.resetAt || 0) - Date.now(), 0),
      });
    }

    const deleted = await db.query<{ image_key: string }>(
      `DELETE FROM promotions
       WHERE id = $1
       RETURNING image_key`,
      [id],
    );

    if (!deleted.rows.length) {
      return res.status(404).json({ error: "Promotion not found" });
    }

    const imageKey = deleted.rows[0].image_key;
    if (imageKey) {
      const { s3, bucket } = createPromotionStorageClient();
      await deletePromotionImage(s3, bucket, imageKey).catch(() => {});
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Promotions delete error:", error);
    return res.status(500).json({ error: "Database error" });
  } finally {
    await db.end().catch(() => {});
  }
}
