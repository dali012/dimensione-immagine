import type { VercelRequest, VercelResponse } from "@vercel/node";
import {
  getRequestIp,
  createDbClient,
  ensureWholesaleAuthSchema,
} from "../lib/wholesale-auth.js";
import {
  checkPromotionEditorMutationRateLimit,
  ensurePromotionsSchema,
  requirePromotionEditorProfile,
} from "../lib/promotions.js";

type ReorderPayload = {
  id?: number;
  sortOrder?: number;
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const body = (req.body || {}) as ReorderPayload;
  const id = Number(body.id);
  const sortOrder = Number(body.sortOrder);

  if (!Number.isFinite(id) || id <= 0) {
    return res.status(400).json({ error: "Invalid promotion id" });
  }
  if (!Number.isFinite(sortOrder)) {
    return res.status(400).json({ error: "Invalid sort order" });
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

    const updated = await db.query(
      `UPDATE promotions
       SET sort_order = $1,
           updated_at = NOW(),
           updated_by_profile_id = $2
       WHERE id = $3`,
      [Math.trunc(sortOrder), profile.id, id],
    );

    if (!updated.rowCount) {
      return res.status(404).json({ error: "Promotion not found" });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Promotions reorder error:", error);
    return res.status(500).json({ error: "Database error" });
  } finally {
    await db.end().catch(() => {});
  }
}
