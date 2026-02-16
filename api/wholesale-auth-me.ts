import type { VercelRequest, VercelResponse } from "@vercel/node";
import {
  clearSessionCookie,
  createDbClient,
  deleteSessionByRawToken,
  ensureWholesaleAuthSchema,
  getProfileFromSession,
  getSessionTokenFromRequest,
  toPublicUser,
} from "../lib/wholesale-auth.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const rawToken = getSessionTokenFromRequest(req);
  if (!rawToken) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const db = createDbClient();
  if (!db) {
    clearSessionCookie(res);
    return res.status(500).json({ error: "Invalid or missing database connection env (DATABASE_URL/POSTGRES_URL)" });
  }

  try {
    await db.connect();
    await ensureWholesaleAuthSchema(db);

    const profile = await getProfileFromSession(db, rawToken);
    if (!profile || !profile.is_approved || !profile.password_hash) {
      await deleteSessionByRawToken(db, rawToken);
      clearSessionCookie(res);
      return res.status(401).json({ error: "Unauthorized" });
    }

    return res.status(200).json({
      user: toPublicUser(profile),
    });
  } catch (error) {
    console.error("Wholesale me error:", error);
    await db.end().catch(() => {});
    clearSessionCookie(res);
    return res.status(500).json({ error: "Database error" });
  } finally {
    await db.end().catch(() => {});
  }
}
