import type { VercelRequest, VercelResponse } from "@vercel/node";
import {
  cleanText,
  createDbClient,
  ensureWholesaleAuthSchema,
  getRequestIp,
  isEmailValid,
  normalizeEmail,
  parseAdminAuthorization,
} from "../lib/wholesale-auth.js";
import { checkPromotionAllowlistMutationRateLimit } from "../lib/promotions.js";

type RevokePayload = {
  email?: string;
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!parseAdminAuthorization(req)) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const body = (req.body || {}) as RevokePayload;
  const email = normalizeEmail(cleanText(body.email));
  if (!email || !isEmailValid(email)) {
    return res.status(400).json({ error: "Invalid email" });
  }

  const rateLimit = checkPromotionAllowlistMutationRateLimit(
    `${getRequestIp(req)}:${email}`,
  );
  if (!rateLimit.allowed) {
    return res.status(429).json({
      error: "Too many requests",
      retryAfterMs: Math.max((rateLimit.resetAt || 0) - Date.now(), 0),
    });
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

    const result = await db.query(
      `UPDATE wholesale_profiles
       SET can_manage_promotions = FALSE,
           updated_at = NOW()
       WHERE email = $1`,
      [email],
    );

    if (!result.rowCount) {
      return res.status(404).json({ error: "Account not found" });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Promotions editors revoke error:", error);
    return res.status(500).json({ error: "Database error" });
  } finally {
    await db.end().catch(() => {});
  }
}
