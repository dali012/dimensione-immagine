import type { VercelRequest, VercelResponse } from "@vercel/node";
import {
  cleanText,
  createDbClient,
  createSession,
  ensureWholesaleAuthSchema,
  isEmailValid,
  normalizeEmail,
  toPublicUser,
  verifyPassword,
} from "../lib/wholesale-auth.js";

type LoginPayload = {
  email?: string;
  password?: string;
};

type ProfileRow = {
  id: number;
  name: string;
  surname: string;
  phone: string;
  email: string;
  is_approved: boolean;
  password_hash: string | null;
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const body = (req.body || {}) as LoginPayload;
  const email = normalizeEmail(cleanText(body.email));
  const password = String(body.password || "");

  if (!email || !isEmailValid(email)) {
    return res.status(400).json({ error: "Invalid email" });
  }
  if (!password) {
    return res.status(400).json({ error: "Password required" });
  }

  const db = createDbClient();
  if (!db) {
    return res.status(500).json({ error: "Invalid or missing database connection env (DATABASE_URL/POSTGRES_URL)" });
  }

  try {
    await db.connect();
    await ensureWholesaleAuthSchema(db);

    const { rows } = await db.query<ProfileRow>(
      `SELECT id, name, surname, phone, email, is_approved, password_hash
       FROM wholesale_profiles
       WHERE email = $1
       LIMIT 1`,
      [email],
    );

    if (!rows.length) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const profile = rows[0];
    if (!profile.is_approved) {
      return res.status(403).json({
        error: "Profile not approved yet",
        code: "pending_approval",
      });
    }

    if (!profile.password_hash) {
      return res.status(403).json({
        error: "Password setup required",
        code: "setup_required",
      });
    }

    const validPassword = verifyPassword(password, profile.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    await createSession(db, req, res, profile.id);

    return res.status(200).json({
      success: true,
      user: toPublicUser(profile),
    });
  } catch (error) {
    console.error("Wholesale login error:", error);
    await db.end().catch(() => {});
    return res.status(500).json({ error: "Database error" });
  } finally {
    await db.end().catch(() => {});
  }
}
