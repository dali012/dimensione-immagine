import type { VercelRequest, VercelResponse } from "@vercel/node";
import {
  cleanText,
  createDbClient,
  ensureWholesaleAuthSchema,
  getRequestIp,
  isEmailValid,
  issuePasswordSetupToken,
  normalizeEmail,
  parseAdminAuthorization,
  sendPasswordSetupEmail,
} from "../lib/wholesale-auth.js";
import { checkPromotionAllowlistMutationRateLimit } from "../lib/promotions.js";

type InvitePayload = {
  email?: string;
};

type ProfileRow = {
  id: number;
  name: string;
  surname: string;
  email: string;
  password_hash: string | null;
  is_approved: boolean;
  can_manage_promotions: boolean;
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

  const body = (req.body || {}) as InvitePayload;
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

    let profile: ProfileRow | null = null;

    await db.query("BEGIN");
    const existing = await db.query<ProfileRow>(
      `SELECT id, name, surname, email, password_hash, is_approved, can_manage_promotions
       FROM wholesale_profiles
       WHERE email = $1
       LIMIT 1
       FOR UPDATE`,
      [email],
    );

    if (existing.rows.length > 0) {
      const updated = await db.query<ProfileRow>(
        `UPDATE wholesale_profiles
         SET is_approved = TRUE,
             can_manage_promotions = TRUE,
             approved_at = COALESCE(approved_at, NOW()),
             updated_at = NOW()
         WHERE id = $1
         RETURNING id, name, surname, email, password_hash, is_approved, can_manage_promotions`,
        [existing.rows[0].id],
      );
      profile = updated.rows[0];
    } else {
      const inserted = await db.query<ProfileRow>(
        `INSERT INTO wholesale_profiles
          (name, surname, phone, email, is_approved, can_manage_promotions, approved_at, user_agent)
         VALUES
          ($1,$2,$3,$4,TRUE,TRUE,NOW(),$5)
         RETURNING id, name, surname, email, password_hash, is_approved, can_manage_promotions`,
        ["Promo", "Editor", "N/D", email, req.headers["user-agent"] || null],
      );
      profile = inserted.rows[0];
    }

    await db.query("COMMIT");

    let setupEmailSent = false;
    let setupToken: string | null = null;
    let expiresAt: string | null = null;

    if (profile && !profile.password_hash) {
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
      if (!delivery.sent && process.env.NODE_ENV === "production") {
        return res.status(500).json({
          error:
            "Unable to send setup email. Configure RESEND_API_KEY and RESEND_FROM_EMAIL.",
        });
      }
    } else {
      setupEmailSent = true;
    }

    return res.status(200).json({
      success: true,
      email,
      setupEmailSent,
      setupToken,
      expiresAt,
    });
  } catch (error) {
    console.error("Promotions editors invite error:", error);
    await db.query("ROLLBACK").catch(() => {});
    return res.status(500).json({ error: "Database error" });
  } finally {
    await db.end().catch(() => {});
  }
}
