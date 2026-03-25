import type { VercelRequest, VercelResponse } from "@vercel/node";
import crypto from "crypto";
import { Client } from "pg";

export type WholesaleAccountStatus =
  | "not_found"
  | "pending_approval"
  | "approved_password_required"
  | "approved_setup_required";

export type WholesaleProfileRow = {
  id: number;
  name: string;
  surname: string;
  phone: string;
  email: string;
  is_approved: boolean;
  password_hash: string | null;
};

const DEFAULT_COOKIE_NAME = "wholesale_session";
const DEFAULT_SESSION_DAYS = 30;
const DEFAULT_SETUP_TOKEN_MINUTES = 30;
const DEFAULT_ADMIN_MAGIC_LINK_MINUTES = 20;
const PASSWORD_KEYLEN = 64;

let schemaEnsured = false;

export const getEnv = (key: string) => process.env[key] || "";

export type AdminMagicLinkPurpose = "wholesale_admin" | "hr_admin";

type AdminMagicPayload = {
  v: 1;
  purpose: AdminMagicLinkPurpose;
  iat: number;
  exp: number;
  nonce: string;
};

function normalizeConnectionString(value: string) {
  const trimmed = value.trim();
  return trimmed.replace(/^['"]|['"]$/g, "");
}

export function getDatabaseConnectionString() {
  const candidates = [
    "DATABASE_URL",
    "POSTGRES_URL_NON_POOLING",
    "POSTGRES_URL",
    "POSTGRES_PRISMA_URL",
  ];

  for (const key of candidates) {
    const value = normalizeConnectionString(cleanText(getEnv(key)));
    if (value) return value;
  }

  return "";
}

export function cleanText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

export function normalizePhone(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

export function isEmailValid(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function isPasswordValid(value: string) {
  return value.length >= 8 && value.length <= 128;
}

export function getAccountStatus(
  profile: { is_approved: boolean; password_hash: string | null } | null,
): WholesaleAccountStatus {
  if (!profile) return "not_found";
  if (!profile.is_approved) return "pending_approval";
  if (!profile.password_hash) return "approved_setup_required";
  return "approved_password_required";
}

export function createDbClient() {
  const connectionString = getDatabaseConnectionString();
  if (!connectionString) {
    return null;
  }

  try {
    return new Client({ connectionString });
  } catch (error) {
    console.error("Wholesale auth DB client init error:", error);
    return null;
  }
}

export async function ensureWholesaleAuthSchema(db: Client) {
  if (schemaEnsured) return;

  await db.query(`
    CREATE TABLE IF NOT EXISTS wholesale_profiles (
      id BIGSERIAL PRIMARY KEY,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      name TEXT NOT NULL,
      surname TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT,
      is_approved BOOLEAN NOT NULL DEFAULT FALSE,
      approved_at TIMESTAMPTZ,
      verified_at TIMESTAMPTZ,
      ip TEXT,
      user_agent TEXT
    )
  `);

  await db.query(`
    ALTER TABLE wholesale_profiles
    ADD COLUMN IF NOT EXISTS surname TEXT,
    ADD COLUMN IF NOT EXISTS phone TEXT,
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ADD COLUMN IF NOT EXISTS password_hash TEXT,
    ADD COLUMN IF NOT EXISTS is_approved BOOLEAN NOT NULL DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS approved_at TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS verified_at TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS ip TEXT,
    ADD COLUMN IF NOT EXISTS user_agent TEXT
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS wholesale_sessions (
      id BIGSERIAL PRIMARY KEY,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      profile_id BIGINT NOT NULL REFERENCES wholesale_profiles(id) ON DELETE CASCADE,
      session_hash TEXT NOT NULL UNIQUE,
      expires_at TIMESTAMPTZ NOT NULL,
      ip TEXT,
      user_agent TEXT
    )
  `);

  await db.query(`
    CREATE INDEX IF NOT EXISTS wholesale_sessions_expires_idx
    ON wholesale_sessions (expires_at)
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS wholesale_password_setup_tokens (
      id BIGSERIAL PRIMARY KEY,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      profile_id BIGINT NOT NULL REFERENCES wholesale_profiles(id) ON DELETE CASCADE,
      token_hash TEXT NOT NULL UNIQUE,
      expires_at TIMESTAMPTZ NOT NULL,
      consumed_at TIMESTAMPTZ
    )
  `);

  await db.query(`
    CREATE INDEX IF NOT EXISTS wholesale_password_setup_profile_idx
    ON wholesale_password_setup_tokens (profile_id)
  `);

  schemaEnsured = true;
}

export function hashPassword(password: string) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, PASSWORD_KEYLEN).toString(
    "hex",
  );
  return `scrypt$${salt}$${hash}`;
}

export function verifyPassword(password: string, storedHash: string) {
  try {
    const [algorithm, salt, expectedHash] = storedHash.split("$");
    if (algorithm !== "scrypt" || !salt || !expectedHash) return false;

    const calculated = crypto.scryptSync(password, salt, PASSWORD_KEYLEN);
    const expected = Buffer.from(expectedHash, "hex");
    if (calculated.length !== expected.length) return false;
    return crypto.timingSafeEqual(calculated, expected);
  } catch {
    return false;
  }
}

export function createRawToken(size = 32) {
  return crypto.randomBytes(size).toString("hex");
}

export function hashToken(rawToken: string) {
  return crypto.createHash("sha256").update(rawToken).digest("hex");
}

function signAdminMagicPayload(encodedPayload: string, secret: string) {
  return crypto
    .createHmac("sha256", secret)
    .update(encodedPayload)
    .digest("base64url");
}

function timingSafeEqualString(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  if (left.length !== right.length) return false;
  return crypto.timingSafeEqual(left, right);
}

export function createAdminMagicCode(
  purpose: AdminMagicLinkPurpose,
  expiresInSeconds?: number,
) {
  const secret = getAdminMagicLinkSecret();
  if (!secret) return "";

  const lifetimeMs =
    (Number.isFinite(expiresInSeconds) && (expiresInSeconds as number) > 0
      ? Math.floor((expiresInSeconds as number) * 1000)
      : getAdminMagicLinkMinutes() * 60 * 1000) || 0;
  if (lifetimeMs <= 0) return "";

  const now = Date.now();
  const payload: AdminMagicPayload = {
    v: 1,
    purpose,
    iat: now,
    exp: now + lifetimeMs,
    nonce: crypto.randomBytes(12).toString("base64url"),
  };

  const encodedPayload = Buffer.from(JSON.stringify(payload), "utf8").toString(
    "base64url",
  );
  const signature = signAdminMagicPayload(encodedPayload, secret);
  return `${encodedPayload}.${signature}`;
}

export function verifyAdminMagicCode(
  code: string,
  expectedPurpose: AdminMagicLinkPurpose,
) {
  const secret = getAdminMagicLinkSecret();
  if (!secret) {
    return {
      valid: false as const,
      error: "Magic link secret is not configured",
    };
  }

  const rawCode = cleanText(code);
  if (!rawCode) {
    return { valid: false as const, error: "Missing code" };
  }

  const [encodedPayload, signature] = rawCode.split(".");
  if (!encodedPayload || !signature) {
    return { valid: false as const, error: "Invalid code format" };
  }

  const expectedSignature = signAdminMagicPayload(encodedPayload, secret);
  if (!timingSafeEqualString(signature, expectedSignature)) {
    return { valid: false as const, error: "Invalid code signature" };
  }

  let payload: AdminMagicPayload;
  try {
    payload = JSON.parse(
      Buffer.from(encodedPayload, "base64url").toString("utf8"),
    ) as AdminMagicPayload;
  } catch {
    return { valid: false as const, error: "Invalid code payload" };
  }

  if (payload?.v !== 1) {
    return { valid: false as const, error: "Unsupported code version" };
  }
  if (payload.purpose !== expectedPurpose) {
    return { valid: false as const, error: "Code purpose mismatch" };
  }
  if (!Number.isFinite(payload.exp) || payload.exp < Date.now()) {
    return { valid: false as const, error: "Code expired" };
  }

  return { valid: true as const, payload };
}

function getCookieName() {
  return cleanText(getEnv("WHOLESALE_AUTH_COOKIE_NAME")) || DEFAULT_COOKIE_NAME;
}

function getSessionDays() {
  const parsed = Number.parseInt(getEnv("WHOLESALE_AUTH_SESSION_DAYS"), 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_SESSION_DAYS;
}

function getSetupTokenMinutes() {
  const parsed = Number.parseInt(
    getEnv("WHOLESALE_AUTH_SETUP_TOKEN_MINUTES"),
    10,
  );
  return Number.isFinite(parsed) && parsed > 0
    ? parsed
    : DEFAULT_SETUP_TOKEN_MINUTES;
}

function getAdminMagicLinkMinutes() {
  const parsed = Number.parseInt(getEnv("ADMIN_MAGIC_LINK_MINUTES"), 10);
  return Number.isFinite(parsed) && parsed > 0
    ? parsed
    : DEFAULT_ADMIN_MAGIC_LINK_MINUTES;
}

function getAdminMagicLinkSecret() {
  const explicit = cleanText(getEnv("ADMIN_MAGIC_LINK_SECRET"));
  if (explicit) return explicit;

  // Fallback to existing private secrets to avoid breaking existing deployments.
  const fallback = [
    cleanText(getEnv("WHOLESALE_AUTH_ADMIN_TOKEN")),
    cleanText(getEnv("HR_API_TOKEN")),
  ]
    .filter(Boolean)
    .join("|");

  return fallback;
}

function shouldUseSecureCookie() {
  return process.env.NODE_ENV === "production";
}

function appendSetCookie(res: VercelResponse, value: string) {
  const previous = res.getHeader("Set-Cookie");
  if (!previous) {
    res.setHeader("Set-Cookie", value);
    return;
  }

  if (Array.isArray(previous)) {
    res.setHeader("Set-Cookie", [...previous, value]);
    return;
  }

  res.setHeader("Set-Cookie", [String(previous), value]);
}

function serializeCookie(
  name: string,
  value: string,
  options: {
    expires?: Date;
    maxAge?: number;
    httpOnly?: boolean;
    sameSite?: "Lax" | "Strict" | "None";
    secure?: boolean;
    path?: string;
  },
) {
  const parts = [`${name}=${encodeURIComponent(value)}`];
  parts.push(`Path=${options.path || "/"}`);
  if (options.httpOnly) parts.push("HttpOnly");
  if (options.expires) parts.push(`Expires=${options.expires.toUTCString()}`);
  if (typeof options.maxAge === "number") parts.push(`Max-Age=${options.maxAge}`);
  parts.push(`SameSite=${options.sameSite || "Lax"}`);
  if (options.secure) parts.push("Secure");
  return parts.join("; ");
}

export function getSessionTokenFromRequest(req: VercelRequest) {
  const cookieHeader = req.headers.cookie || "";
  const target = `${getCookieName()}=`;
  for (const segment of cookieHeader.split(";")) {
    const value = segment.trim();
    if (!value.startsWith(target)) continue;
    return decodeURIComponent(value.slice(target.length));
  }
  return "";
}

export function clearSessionCookie(res: VercelResponse) {
  const cookie = serializeCookie(getCookieName(), "", {
    httpOnly: true,
    sameSite: "Lax",
    secure: shouldUseSecureCookie(),
    path: "/",
    maxAge: 0,
    expires: new Date(0),
  });
  appendSetCookie(res, cookie);
}

export function getRequestIp(req: VercelRequest) {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded.length > 0) {
    return forwarded.split(",")[0].trim();
  }
  return req.socket.remoteAddress || "unknown";
}

export async function createSession(
  db: Client,
  req: VercelRequest,
  res: VercelResponse,
  profileId: number,
) {
  const rawToken = createRawToken();
  const sessionHash = hashToken(rawToken);
  const sessionDays = getSessionDays();
  const expiresAt = new Date(Date.now() + sessionDays * 24 * 60 * 60 * 1000);

  await db.query(
    `INSERT INTO wholesale_sessions
      (profile_id, session_hash, expires_at, ip, user_agent)
     VALUES
      ($1,$2,$3,$4,$5)`,
    [
      profileId,
      sessionHash,
      expiresAt.toISOString(),
      getRequestIp(req),
      req.headers["user-agent"] || null,
    ],
  );

  await db.query(`DELETE FROM wholesale_sessions WHERE expires_at <= NOW()`);

  const cookie = serializeCookie(getCookieName(), rawToken, {
    httpOnly: true,
    sameSite: "Lax",
    secure: shouldUseSecureCookie(),
    path: "/",
    maxAge: sessionDays * 24 * 60 * 60,
    expires: expiresAt,
  });
  appendSetCookie(res, cookie);
}

export async function deleteSessionByRawToken(db: Client, rawToken: string) {
  if (!rawToken) return;
  await db.query(`DELETE FROM wholesale_sessions WHERE session_hash = $1`, [
    hashToken(rawToken),
  ]);
}

export async function getProfileFromSession(
  db: Client,
  rawToken: string,
): Promise<WholesaleProfileRow | null> {
  if (!rawToken) return null;

  const { rows } = await db.query<WholesaleProfileRow>(
    `SELECT
      p.id,
      p.name,
      p.surname,
      p.phone,
      p.email,
      p.is_approved,
      p.password_hash
     FROM wholesale_sessions s
     JOIN wholesale_profiles p ON p.id = s.profile_id
     WHERE s.session_hash = $1
       AND s.expires_at > NOW()
     LIMIT 1`,
    [hashToken(rawToken)],
  );

  if (!rows.length) return null;
  return rows[0];
}

export async function issuePasswordSetupToken(db: Client, profileId: number) {
  const rawToken = createRawToken();
  const expiresAt = new Date(
    Date.now() + getSetupTokenMinutes() * 60 * 1000,
  ).toISOString();

  await db.query(
    `DELETE FROM wholesale_password_setup_tokens
     WHERE profile_id = $1 OR expires_at <= NOW() OR consumed_at IS NOT NULL`,
    [profileId],
  );

  await db.query(
    `INSERT INTO wholesale_password_setup_tokens
      (profile_id, token_hash, expires_at)
     VALUES
      ($1,$2,$3)`,
    [profileId, hashToken(rawToken), expiresAt],
  );

  return { rawToken, expiresAt };
}

export async function consumePasswordSetupToken(
  db: Client,
  profileId: number,
  rawToken: string,
) {
  const tokenHash = hashToken(rawToken);
  const { rowCount } = await db.query(
    `UPDATE wholesale_password_setup_tokens
     SET consumed_at = NOW()
     WHERE profile_id = $1
       AND token_hash = $2
       AND consumed_at IS NULL
       AND expires_at > NOW()`,
    [profileId, tokenHash],
  );

  return rowCount > 0;
}

export function getAppUrlFromRequest(req: VercelRequest) {
  const fromEnv = cleanText(getEnv("APP_URL")).replace(/\/+$/, "");
  if (fromEnv) return fromEnv;

  const hostHeader = req.headers["x-forwarded-host"] || req.headers.host || "";
  const host = Array.isArray(hostHeader) ? hostHeader[0] : hostHeader;
  if (!host) return "";

  const protoHeader = req.headers["x-forwarded-proto"] || "https";
  const proto = Array.isArray(protoHeader) ? protoHeader[0] : protoHeader;
  return `${proto}://${host}`;
}

export function createAdminMagicLink(
  req: VercelRequest,
  purpose: AdminMagicLinkPurpose,
) {
  const appUrl = getAppUrlFromRequest(req);
  const code = createAdminMagicCode(purpose);
  if (!appUrl || !code) return "";

  const path =
    purpose === "wholesale_admin" ? "/admin-wholesale" : "/hr-cv-link";
  return `${appUrl}${path}?code=${encodeURIComponent(code)}`;
}

function getResendConfig() {
  const apiKey = cleanText(getEnv("RESEND_API_KEY"));
  const from = cleanText(getEnv("RESEND_FROM_EMAIL"));
  return { apiKey, from };
}

function escapeHtml(input: string) {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function sendPasswordSetupEmail(
  req: VercelRequest,
  payload: {
    email: string;
    fullName: string;
    rawToken: string;
    expiresAt: string;
  },
) {
  const resend = getResendConfig();
  if (!resend.apiKey || !resend.from) {
    return { sent: false as const, reason: "missing_resend_config" };
  }

  const appUrl = getAppUrlFromRequest(req);
  if (!appUrl) {
    return { sent: false as const, reason: "missing_app_url" };
  }

  const setupLink =
    `${appUrl}/login?email=${encodeURIComponent(payload.email)}` +
    `&setupToken=${encodeURIComponent(payload.rawToken)}`;

  const expiryDate = new Date(payload.expiresAt);

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resend.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: resend.from,
      to: payload.email,
      subject: "Imposta la password - Distribuzione Ingrosso",
      html: `
        <p>Ciao ${escapeHtml(payload.fullName)},</p>
        <p>Il tuo profilo B2B e stato verificato. Usa questo link per impostare la password:</p>
        <p><a href="${setupLink}">${setupLink}</a></p>
        <p>Scadenza link: ${escapeHtml(expiryDate.toISOString())}</p>
      `,
    }),
  });

  if (!response.ok) {
    return { sent: false as const, reason: `resend_error_${response.status}` };
  }

  return {
    sent: true as const,
    setupLink,
  };
}

export async function sendWholesaleRegistrationNotification(
  req: VercelRequest,
  payload: {
    name: string;
    surname: string;
    phone: string;
    email: string;
  },
) {
  const resend = getResendConfig();
  const notifyTo =
    cleanText(getEnv("RESEND_WHOLESALE_REVIEW_TO_EMAIL")) ||
    cleanText(getEnv("RESEND_HR_TO_EMAIL")) ||
    cleanText(getEnv("RESEND_TO_EMAIL"));

  if (!resend.apiKey || !resend.from || !notifyTo) {
    return { sent: false as const, reason: "missing_resend_config" };
  }

  const adminDirectLink = createAdminMagicLink(req, "wholesale_admin");

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resend.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: resend.from,
      to: notifyTo,
      subject: "Nuova registrazione B2B da approvare",
      html: `
        <h2>Nuova registrazione B2B</h2>
        <p><strong>Nome:</strong> ${escapeHtml(payload.name)}</p>
        <p><strong>Cognome:</strong> ${escapeHtml(payload.surname)}</p>
        <p><strong>Telefono:</strong> ${escapeHtml(payload.phone)}</p>
        <p><strong>Email:</strong> ${escapeHtml(payload.email)}</p>
        ${
          adminDirectLink
            ? `<p><strong>Accesso rapido admin (link temporaneo):</strong> <a href="${adminDirectLink}">${adminDirectLink}</a></p>`
            : ""
        }
      `,
    }),
  });

  if (!response.ok) {
    return { sent: false as const, reason: `resend_error_${response.status}` };
  }

  return { sent: true as const };
}

export type WholesalePublicUser = {
  id: number;
  name: string;
  surname: string;
  phone: string;
  email: string;
};

export function toPublicUser(profile: WholesaleProfileRow): WholesalePublicUser {
  return {
    id: profile.id,
    name: profile.name,
    surname: profile.surname,
    phone: profile.phone,
    email: profile.email,
  };
}

export function parseAdminAuthorization(req: VercelRequest) {
  const configuredToken = cleanText(getEnv("WHOLESALE_AUTH_ADMIN_TOKEN"));
  if (!configuredToken) return false;

  const header = req.headers.authorization || req.headers["x-admin-token"];
  if (!header) return false;
  const value = Array.isArray(header) ? header[0] : header;
  if (value.startsWith("Bearer ")) {
    return value.slice(7) === configuredToken;
  }
  return value === configuredToken;
}
