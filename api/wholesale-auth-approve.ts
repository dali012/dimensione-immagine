import type { VercelRequest, VercelResponse } from "@vercel/node";
import {
  cleanText,
  createDbClient,
  ensureWholesaleAuthSchema,
  getAccountStatus,
  isEmailValid,
  issuePasswordSetupToken,
  normalizeEmail,
  parseAdminAuthorization,
  sendPasswordSetupEmail,
} from "./_wholesale-auth";

type ApprovePayload = {
  email?: string;
  approved?: boolean;
  sendSetupLink?: boolean;
};

type ProfileRow = {
  id: number;
  name: string;
  surname: string;
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

  if (!parseAdminAuthorization(req)) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const body = (req.body || {}) as ApprovePayload;
  const email = normalizeEmail(cleanText(body.email));
  const approved = body.approved !== false;
  const sendSetupLink = Boolean(body.sendSetupLink);

  if (!email || !isEmailValid(email)) {
    return res.status(400).json({ error: "Invalid email" });
  }

  const db = createDbClient();
  if (!db) {
    return res.status(500).json({ error: "Missing DATABASE_URL" });
  }

  try {
    await db.connect();
    await ensureWholesaleAuthSchema(db);

    const updated = await db.query<ProfileRow>(
      `UPDATE wholesale_profiles
       SET is_approved = $1,
           approved_at = CASE WHEN $1 THEN COALESCE(approved_at, NOW()) ELSE NULL END,
           updated_at = NOW()
       WHERE email = $2
       RETURNING id, name, surname, email, is_approved, password_hash`,
      [approved, email],
    );

    if (!updated.rows.length) {
      return res.status(404).json({ error: "Account not found" });
    }

    const profile = updated.rows[0];
    let setupEmailSent = false;
    let setupToken: string | null = null;
    let expiresAt: string | null = null;

    if (approved && sendSetupLink && !profile.password_hash) {
      const issued = await issuePasswordSetupToken(db, profile.id);
      expiresAt = issued.expiresAt;

      const delivery = await sendPasswordSetupEmail(req, {
        email: profile.email,
        fullName: `${profile.name} ${profile.surname}`.trim(),
        rawToken: issued.rawToken,
        expiresAt: issued.expiresAt,
      });
      setupEmailSent = delivery.sent;

      if (!delivery.sent && process.env.NODE_ENV !== "production") {
        setupToken = issued.rawToken;
      }
    }

    return res.status(200).json({
      success: true,
      status: getAccountStatus(profile),
      approved: profile.is_approved,
      setupEmailSent,
      setupToken,
      expiresAt,
    });
  } catch (error) {
    console.error("Wholesale approve error:", error);
    await db.end().catch(() => {});
    return res.status(500).json({ error: "Database error" });
  } finally {
    await db.end().catch(() => {});
  }
}
