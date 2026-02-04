import type { VercelRequest, VercelResponse } from "@vercel/node";
import crypto from "crypto";
import { Client } from "pg";

type ContactPayload = {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
  privacyAccepted?: boolean;
  marketingConsent?: boolean;
  honey?: string;
  sourcePage?: string;
};

type RateLimitState = {
  count: number;
  resetAt: number;
};

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 5;
const rateLimitStore = new Map<string, RateLimitState>();
let schemaEnsured = false;

const getEnv = (key: string) => process.env[key] || "";

function cleanText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizePhone(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function isEmailValid(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function getRequestIp(req: VercelRequest) {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded.length > 0) {
    return forwarded.split(",")[0].trim();
  }
  return req.socket.remoteAddress || "unknown";
}

function hashIp(ip: string) {
  const salt = getEnv("CONTACT_IP_SALT");
  return crypto
    .createHash("sha256")
    .update(`${salt}:${ip}`)
    .digest("hex");
}

function escapeHtml(input: string) {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function checkRateLimit(ip: string) {
  const now = Date.now();
  const existing = rateLimitStore.get(ip);

  if (!existing || existing.resetAt <= now) {
    rateLimitStore.set(ip, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW_MS,
    });
    return { allowed: true, remaining: RATE_LIMIT_MAX - 1 };
  }

  if (existing.count >= RATE_LIMIT_MAX) {
    return { allowed: false, remaining: 0, resetAt: existing.resetAt };
  }

  existing.count += 1;
  rateLimitStore.set(ip, existing);
  return { allowed: true, remaining: RATE_LIMIT_MAX - existing.count };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const ip = getRequestIp(req);
  const rateLimit = checkRateLimit(ip);
  if (!rateLimit.allowed) {
    return res.status(429).json({
      error: "Too many requests",
      retryAfterMs: Math.max((rateLimit.resetAt || 0) - Date.now(), 0),
    });
  }

  const body = (req.body || {}) as ContactPayload;
  const name = cleanText(body.name);
  const email = cleanText(body.email).toLowerCase();
  const phone = normalizePhone(cleanText(body.phone));
  const message = cleanText(body.message);
  const sourcePage = cleanText(body.sourcePage) || "/contatti";
  const privacyAccepted = Boolean(body.privacyAccepted);
  const marketingConsent = Boolean(body.marketingConsent);
  const honey = cleanText(body.honey);

  // Honeypot: silently accept to avoid helping bots adapt.
  if (honey) {
    return res.status(200).json({ success: true });
  }

  if (!name || name.length < 2 || name.length > 120) {
    return res.status(400).json({ error: "Invalid name" });
  }
  if (!email || !isEmailValid(email) || email.length > 160) {
    return res.status(400).json({ error: "Invalid email" });
  }
  if (phone.length > 40) {
    return res.status(400).json({ error: "Invalid phone" });
  }
  if (!message || message.length < 10 || message.length > 4000) {
    return res.status(400).json({ error: "Invalid message" });
  }
  if (!privacyAccepted) {
    return res.status(400).json({ error: "Privacy consent is required" });
  }

  const dbUrl = getEnv("DATABASE_URL");
  if (!dbUrl) {
    return res.status(500).json({ error: "Missing DATABASE_URL" });
  }

  const db = new Client({
    connectionString: dbUrl,
  });

  try {
    await db.connect();

    if (!schemaEnsured) {
      await db.query(`
        CREATE TABLE IF NOT EXISTS contact_messages (
          id BIGSERIAL PRIMARY KEY,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          name TEXT NOT NULL,
          email TEXT NOT NULL,
          phone TEXT,
          message TEXT NOT NULL,
          privacy_accepted BOOLEAN NOT NULL DEFAULT FALSE,
          marketing_consent BOOLEAN NOT NULL DEFAULT FALSE,
          ip_hash TEXT,
          user_agent TEXT,
          source_page TEXT
        )
      `);
      schemaEnsured = true;
    }

    await db.query(
      `INSERT INTO contact_messages
        (name, email, phone, message, privacy_accepted, marketing_consent, ip_hash, user_agent, source_page)
       VALUES
        ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
      [
        name,
        email,
        phone || null,
        message,
        privacyAccepted,
        marketingConsent,
        hashIp(ip),
        req.headers["user-agent"] || null,
        sourcePage,
      ],
    );
  } catch (error) {
    console.error("Contact API DB error:", error);
    await db.end().catch(() => {});
    return res.status(500).json({ error: "Database error" });
  } finally {
    await db.end().catch(() => {});
  }

  const resendKey = getEnv("RESEND_API_KEY");
  const resendTo = getEnv("RESEND_TO_EMAIL");
  const resendFrom = getEnv("RESEND_FROM_EMAIL");
  const resendReplyTo = getEnv("CONTACT_REPLY_TO_EMAIL") || email;

  if (resendKey && resendTo && resendFrom) {
    try {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: resendFrom,
          to: resendTo,
          reply_to: resendReplyTo,
          subject: `Nuovo contatto dal sito - ${name}`,
          html: `
            <h2>Nuova richiesta contatti</h2>
            <p><strong>Nome:</strong> ${escapeHtml(name)}</p>
            <p><strong>Email:</strong> ${escapeHtml(email)}</p>
            <p><strong>Telefono:</strong> ${escapeHtml(phone || "-")}</p>
            <p><strong>Privacy:</strong> ${privacyAccepted ? "SI" : "NO"}</p>
            <p><strong>Marketing:</strong> ${marketingConsent ? "SI" : "NO"}</p>
            <p><strong>Pagina:</strong> ${escapeHtml(sourcePage)}</p>
            <hr />
            <p>${escapeHtml(message).replace(/\n/g, "<br/>")}</p>
          `,
        }),
      });
    } catch (error) {
      console.error("Contact API email error:", error);
      // Do not fail the request if email delivery fails.
    }
  }

  return res.status(200).json({ success: true });
}
