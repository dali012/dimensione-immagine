import type { VercelRequest, VercelResponse } from "@vercel/node";
import {
  cleanText,
  createDbClient,
  ensureWholesaleAuthSchema,
  getEnv,
  getAccountStatus,
  isEmailValid,
  issuePasswordSetupToken,
  normalizeEmail,
  sendPasswordSetupEmail,
  verifyAdminMagicCode,
} from "../lib/wholesale-auth.js";

type StatusPayload = {
  email?: string;
};

type PasswordSetupRequestPayload = {
  email?: string;
};

type ConsumeAdminLinkPayload = {
  code?: string;
};

function getAction(req: VercelRequest) {
  const raw = req.query.action;
  if (Array.isArray(raw)) return cleanText(raw[0]).toLowerCase();
  return cleanText(raw).toLowerCase();
}

async function handleStatus(req: VercelRequest, res: VercelResponse) {
  const body = (req.body || {}) as StatusPayload;
  const email = normalizeEmail(cleanText(body.email));
  if (!email || !isEmailValid(email)) {
    return res.status(400).json({ error: "Invalid email" });
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
    return res.status(500).json({ error: "Database error" });
  } finally {
    await db.end().catch(() => {});
  }
}

async function handleRequestPasswordSetup(
  req: VercelRequest,
  res: VercelResponse,
) {
  const body = (req.body || {}) as PasswordSetupRequestPayload;
  const email = normalizeEmail(cleanText(body.email));
  if (!email || !isEmailValid(email)) {
    return res.status(400).json({ error: "Invalid email" });
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

    const { rows } = await db.query<{
      id: number;
      name: string;
      surname: string;
      email: string;
      is_approved: boolean;
      password_hash: string | null;
    }>(
      `SELECT id, name, surname, email, is_approved, password_hash
       FROM wholesale_profiles
       WHERE email = $1
       LIMIT 1`,
      [email],
    );

    if (!rows.length) {
      return res.status(404).json({ error: "Account not found" });
    }

    const profile = rows[0];
    if (!profile.is_approved) {
      return res.status(403).json({ error: "Profile not approved yet" });
    }

    if (profile.password_hash) {
      return res.status(409).json({ error: "Password already configured" });
    }

    const { rawToken, expiresAt } = await issuePasswordSetupToken(
      db,
      profile.id,
    );

    const emailResult = await sendPasswordSetupEmail(req, {
      email: profile.email,
      fullName: `${profile.name} ${profile.surname}`.trim(),
      rawToken,
      expiresAt,
    });

    if (!emailResult.sent) {
      if (process.env.NODE_ENV !== "production") {
        return res.status(200).json({
          success: true,
          expiresAt,
          setupToken: rawToken,
          debugReason: emailResult.reason,
        });
      }
      return res.status(500).json({
        error:
          "Unable to send setup email. Configure RESEND_API_KEY and RESEND_FROM_EMAIL.",
      });
    }

    return res.status(200).json({
      success: true,
      expiresAt,
    });
  } catch (error) {
    console.error("Wholesale request password setup error:", error);
    return res.status(500).json({ error: "Database error" });
  } finally {
    await db.end().catch(() => {});
  }
}

async function handleConsumeAdminLink(
  req: VercelRequest,
  res: VercelResponse,
) {
  const body = (req.body || {}) as ConsumeAdminLinkPayload;
  const code = cleanText(body.code);
  if (!code) {
    return res.status(400).json({ error: "Missing code" });
  }

  const verified = verifyAdminMagicCode(code, "wholesale_admin");
  if (!verified.valid) {
    return res
      .status(401)
      .json({ error: verified.error || "Invalid or expired link" });
  }

  const adminToken = cleanText(getEnv("WHOLESALE_AUTH_ADMIN_TOKEN"));
  if (!adminToken) {
    return res.status(500).json({ error: "Missing admin token configuration" });
  }

  return res.status(200).json({
    success: true,
    token: adminToken,
  });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const action = getAction(req);
  if (action === "status") {
    return handleStatus(req, res);
  }
  if (action === "request-password-setup") {
    return handleRequestPasswordSetup(req, res);
  }
  if (action === "consume-admin-link") {
    return handleConsumeAdminLink(req, res);
  }

  return res.status(404).json({ error: "Unknown action" });
}
