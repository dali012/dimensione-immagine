import type { VercelRequest, VercelResponse } from "@vercel/node";

type NewsletterSubscribePayload = {
  email?: string;
  sourcePage?: string;
};

type ResendEmailPayload = {
  from: string;
  to: string | string[];
  subject: string;
  html: string;
  reply_to?: string;
};

const DEFAULT_SUBSCRIBE_ENDPOINT =
  "https://newsletter.dimensioneimmagineabbigliamento.it/subscribe";

const getEnv = (key: string) => process.env[key] || "";

function cleanText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function isEmailValid(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function escapeHtml(input: string) {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

async function sendResendEmail(apiKey: string, payload: ResendEmailPayload) {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const details = await response.text().catch(() => "");
    throw new Error(
      `Resend request failed with ${response.status}${details ? `: ${details}` : ""}`,
    );
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const body = (req.body || {}) as NewsletterSubscribePayload;
  const email = cleanText(body.email).toLowerCase();
  const sourcePage = cleanText(body.sourcePage) || "/";

  if (!email || !isEmailValid(email) || email.length > 160) {
    return res.status(400).json({ error: "Invalid email" });
  }

  const subscribeEndpoint =
    getEnv("NEWSLETTER_SUBSCRIBE_ENDPOINT") || DEFAULT_SUBSCRIBE_ENDPOINT;

  try {
    const subscribeResponse = await fetch(subscribeEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const subscribeData = await subscribeResponse.json().catch(() => ({}));

    if (!subscribeResponse.ok || !subscribeData?.success) {
      return res.status(subscribeResponse.status || 502).json({
        error: subscribeData?.error || "Newsletter subscription failed",
      });
    }
  } catch (error) {
    console.error("Newsletter subscribe upstream error:", error);
    return res.status(502).json({ error: "Newsletter service unavailable" });
  }

  const resendKey = getEnv("RESEND_API_KEY");
  const confirmationFrom =
    getEnv("RESEND_NEWSLETTER_CONFIRMATION_FROM_EMAIL") ||
    getEnv("RESEND_APPLICANT_FROM_EMAIL") ||
    getEnv("RESEND_FROM_EMAIL");
  const confirmationReplyTo =
    getEnv("RESEND_NEWSLETTER_CONFIRMATION_REPLY_TO_EMAIL") ||
    getEnv("RESEND_TO_EMAIL");
  let confirmationEmailSent = false;

  if (resendKey && confirmationFrom) {
    try {
      await sendResendEmail(resendKey, {
        from: confirmationFrom,
        to: email,
        reply_to: confirmationReplyTo || undefined,
        subject: "Conferma iscrizione newsletter - Dimensione Immagine",
        html: `
          <p>Ciao,</p>
          <p>grazie per esserti iscritto alla newsletter di Dimensione Immagine.</p>
          <p>Riceverai aggiornamenti su nuove collezioni, novita e comunicazioni dedicate.</p>
          <p><strong>Email iscritta:</strong> ${escapeHtml(email)}</p>
          <p><strong>Pagina di iscrizione:</strong> ${escapeHtml(sourcePage)}</p>
          <p>A presto,<br/>Dimensione Immagine</p>
        `,
      });
      confirmationEmailSent = true;
    } catch (error) {
      console.error("Newsletter confirmation email error:", error);
    }
  }

  return res.status(200).json({ success: true, confirmationEmailSent });
}
