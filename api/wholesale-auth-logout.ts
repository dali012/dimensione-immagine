import type { VercelRequest, VercelResponse } from "@vercel/node";
import {
  clearSessionCookie,
  createDbClient,
  deleteSessionByRawToken,
  ensureWholesaleAuthSchema,
  getSessionTokenFromRequest,
} from "./_wholesale-auth";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const rawToken = getSessionTokenFromRequest(req);
  if (!rawToken) {
    clearSessionCookie(res);
    return res.status(200).json({ success: true });
  }

  const db = createDbClient();
  if (!db) {
    clearSessionCookie(res);
    return res.status(200).json({ success: true });
  }

  try {
    await db.connect();
    await ensureWholesaleAuthSchema(db);
    await deleteSessionByRawToken(db, rawToken);
  } catch (error) {
    console.error("Wholesale logout error:", error);
    await db.end().catch(() => {});
  } finally {
    await db.end().catch(() => {});
  }

  clearSessionCookie(res);
  return res.status(200).json({ success: true });
}
