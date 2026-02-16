import type { VercelRequest, VercelResponse } from "@vercel/node";
import {
  cleanText,
  createDbClient,
  ensureWholesaleAuthSchema,
  getAccountStatus,
  isEmailValid,
  normalizeEmail,
} from "./_wholesale-auth";

type StatusPayload = {
  email?: string;
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const body = (req.body || {}) as StatusPayload;
  const email = normalizeEmail(cleanText(body.email));
  if (!email || !isEmailValid(email)) {
    return res.status(400).json({ error: "Invalid email" });
  }

  const db = createDbClient();
  if (!db) {
    return res.status(500).json({ error: "Missing database connection env (DATABASE_URL/POSTGRES_URL)" });
  }

  try {
    await db.connect();
    await ensureWholesaleAuthSchema(db);

    const { rows } = await db.query<{
      is_approved: boolean;
      password_hash: string | null;
    }>(
      `SELECT is_approved, password_hash
       FROM wholesale_profiles
       WHERE email = $1
       LIMIT 1`,
      [email],
    );

    const status = getAccountStatus(rows[0] || null);
    return res.status(200).json({ status });
  } catch (error) {
    console.error("Wholesale status error:", error);
    await db.end().catch(() => {});
    return res.status(500).json({ error: "Database error" });
  } finally {
    await db.end().catch(() => {});
  }
}
