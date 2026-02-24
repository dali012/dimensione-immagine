import type { VercelRequest, VercelResponse } from "@vercel/node";
import {
  cleanText,
  consumePasswordSetupToken,
  createDbClient,
  createSession,
  ensureWholesaleAuthSchema,
  hashPassword,
  isEmailValid,
  isPasswordValid,
  normalizeEmail,
  toPublicUser,
} from "../lib/wholesale-auth.js";

type CompletePasswordSetupPayload = {
  email?: string;
  setupToken?: string;
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
  can_manage_promotions: boolean;
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const body = (req.body || {}) as CompletePasswordSetupPayload;
  const email = normalizeEmail(cleanText(body.email));
  const setupToken = cleanText(body.setupToken);
  const password = String(body.password || "");

  if (!email || !isEmailValid(email)) {
    return res.status(400).json({ error: "Invalid email" });
  }
  if (!setupToken || setupToken.length < 12) {
    return res.status(400).json({ error: "Invalid setup token" });
  }
  if (!isPasswordValid(password)) {
    return res.status(400).json({
      error: "Password must be between 8 and 128 characters",
    });
  }

  const db = createDbClient();
  if (!db) {
    return res.status(500).json({ error: "Invalid or missing database connection env (DATABASE_URL/POSTGRES_URL)" });
  }

  let publicProfile: ProfileRow | null = null;

  try {
    await db.connect();
    await ensureWholesaleAuthSchema(db);

    await db.query("BEGIN");

    const profileResult = await db.query<ProfileRow>(
      `SELECT id, name, surname, phone, email, is_approved, password_hash, can_manage_promotions
       FROM wholesale_profiles
       WHERE email = $1
       LIMIT 1
       FOR UPDATE`,
      [email],
    );

    if (!profileResult.rows.length) {
      await db.query("ROLLBACK");
      return res.status(404).json({ error: "Account not found" });
    }

    const profile = profileResult.rows[0];
    if (!profile.is_approved) {
      await db.query("ROLLBACK");
      return res.status(403).json({ error: "Profile not approved yet" });
    }

    if (profile.password_hash) {
      await db.query("ROLLBACK");
      return res.status(409).json({ error: "Password already configured" });
    }

    const setupTokenValid = await consumePasswordSetupToken(
      db,
      profile.id,
      setupToken,
    );
    if (!setupTokenValid) {
      await db.query("ROLLBACK");
      return res.status(400).json({ error: "Invalid or expired setup token" });
    }

    const newHash = hashPassword(password);
    await db.query(
      `UPDATE wholesale_profiles
       SET password_hash = $1,
           verified_at = NOW(),
           updated_at = NOW()
       WHERE id = $2`,
      [newHash, profile.id],
    );

    await db.query(
      `UPDATE wholesale_password_setup_tokens
       SET consumed_at = NOW()
       WHERE profile_id = $1 AND consumed_at IS NULL`,
      [profile.id],
    );

    await db.query("COMMIT");
    publicProfile = profile;

    await createSession(db, req, res, profile.id);
  } catch (error) {
    console.error("Wholesale complete password setup error:", error);
    await db.query("ROLLBACK").catch(() => {});
    await db.end().catch(() => {});
    return res.status(500).json({ error: "Database error" });
  } finally {
    await db.end().catch(() => {});
  }

  if (!publicProfile) {
    return res.status(500).json({ error: "Unexpected state" });
  }

  return res.status(200).json({
    success: true,
    user: toPublicUser(publicProfile),
  });
}
