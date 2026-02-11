import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import Busboy from "busboy";
import crypto from "crypto";
import { Client } from "pg";

export const config = {
  api: { bodyParser: false },
};

type FormFields = {
  name?: string;
  surname?: string;
  age?: string;
  city?: string;
  email?: string;
  phone?: string;
  position?: string;
  message?: string;
  taskRatings?: string;
  recaptchaToken?: string;
};

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_MIME = new Set(["application/pdf"]);

const getEnv = (key: string) => process.env[key] || "";
let schemaEnsured = false;

async function verifyRecaptcha(token: string) {
  const secret = getEnv("SECRET_KEY");
  if (!secret) throw new Error("Missing reCAPTCHA secret key");

  const params = new URLSearchParams();
  params.append("secret", secret);
  params.append("response", token);

  const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
  });

  if (!res.ok) {
    throw new Error("reCAPTCHA verification failed");
  }

  return (await res.json()) as {
    success: boolean;
    "error-codes"?: string[];
  };
}

function sanitizeFilename(filename: string) {
  return filename.replace(/[^a-zA-Z0-9._-]/g, "_");
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function parseTaskRatings(raw: string | undefined) {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as Array<{ task?: string; level?: string }>;
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((item) => ({
        task: (item?.task || "").trim(),
        level: (item?.level || "").trim(),
      }))
      .filter((item) => item.task.length > 0 && item.level.length > 0);
  } catch {
    return [];
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }
  const fields: FormFields = {};
  let fileBuffer: Buffer | null = null;
  let fileName = "";
  let fileType = "";
  const deleteToken = crypto.randomBytes(24).toString("hex");

  try {
    await new Promise<void>((resolve, reject) => {
      const bb = Busboy({
        headers: req.headers,
        limits: { fileSize: MAX_FILE_SIZE },
      });

      bb.on("file", (_name, file, info) => {
        fileName = info.filename || "cv";
        fileType = info.mimeType || "";

        const chunks: Buffer[] = [];
        file.on("data", (data: Buffer) => chunks.push(data));
        file.on("limit", () => reject(new Error("File too large")));
        file.on("end", () => {
          fileBuffer = Buffer.concat(chunks);
        });
      });

      bb.on("field", (name, value) => {
        fields[name as keyof FormFields] = value;
      });

      bb.on("error", reject);
      bb.on("finish", resolve);
      req.pipe(bb);
    });
  } catch (err: any) {
    return res.status(400).json({ error: err?.message || "Invalid form data" });
  }

  if (
    !fields.name ||
    !fields.surname ||
    !fields.age ||
    !fields.city ||
    !fields.email ||
    !fields.phone ||
    !fields.position
  ) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  if (!fields.recaptchaToken) {
    return res.status(400).json({ error: "Missing reCAPTCHA token" });
  }
  if (!fileBuffer || !fileName) {
    return res.status(400).json({ error: "Missing CV file" });
  }
  if (!ALLOWED_MIME.has(fileType)) {
    return res.status(400).json({ error: "Unsupported file type" });
  }

  try {
    const verify = await verifyRecaptcha(fields.recaptchaToken);
    if (!verify.success) {
      return res.status(400).json({
        error: "reCAPTCHA verification failed",
        codes: verify["error-codes"] || [],
      });
    }
  } catch (err: any) {
    return res.status(400).json({ error: err?.message || "reCAPTCHA error" });
  }

  const bucket = getEnv("BUCKET_NAME");
  const accountId = getEnv("ACCOUNT_ID");
  const accessKeyId = getEnv("ACCESS_KEY_ID");
  const secretAccessKey = getEnv("SECRET_ACCESS_KEY");

  if (!bucket || !accountId || !accessKeyId || !secretAccessKey) {
    return res.status(500).json({ error: "R2 configuration missing" });
  }

  const key = `lavora-con-noi/${Date.now()}-${sanitizeFilename(fileName)}`;
  const s3 = new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId, secretAccessKey },
  });

  try {
    await s3.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: fileBuffer,
        ContentType: fileType,
      }),
    );
  } catch (err: any) {
    return res.status(500).json({ error: "Failed to upload CV" });
  }

  let signedCvUrl = "";
  try {
    signedCvUrl = await getSignedUrl(
      s3,
      new GetObjectCommand({
        Bucket: bucket,
        Key: key,
      }),
      { expiresIn: 60 * 60 * 24 * 7 },
    );
  } catch {
    // continue without signed URL if signing fails
  }

  const dbUrl = getEnv("DATABASE_URL");
  if (!dbUrl) {
    return res
      .status(500)
      .json({ error: "Database error: missing DATABASE_URL" });
  }

  const db = new Client({
    connectionString: dbUrl,
  });

  try {
    await db.connect();
    if (!schemaEnsured) {
      await db.query(`
        CREATE TABLE IF NOT EXISTS job_applications (
          id BIGSERIAL PRIMARY KEY,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          name TEXT NOT NULL,
          surname TEXT,
          age INTEGER,
          city TEXT,
          email TEXT NOT NULL,
          phone TEXT NOT NULL,
          position TEXT NOT NULL,
          message TEXT,
          task_ratings_json JSONB,
          cv_url TEXT,
          cv_key TEXT NOT NULL,
          delete_token TEXT NOT NULL,
          ip TEXT,
          user_agent TEXT
        )
      `);

      // Backward-compatible migrations for existing tables created with older schemas.
      await db.query(`
        ALTER TABLE job_applications
        ADD COLUMN IF NOT EXISTS surname TEXT,
        ADD COLUMN IF NOT EXISTS age INTEGER,
        ADD COLUMN IF NOT EXISTS city TEXT,
        ADD COLUMN IF NOT EXISTS position TEXT,
        ADD COLUMN IF NOT EXISTS task_ratings_json JSONB,
        ADD COLUMN IF NOT EXISTS cv_key TEXT,
        ADD COLUMN IF NOT EXISTS delete_token TEXT,
        ADD COLUMN IF NOT EXISTS ip TEXT,
        ADD COLUMN IF NOT EXISTS user_agent TEXT
      `);
      schemaEnsured = true;
    }

    const parsedTaskRatings = parseTaskRatings(fields.taskRatings);
    await db.query(
      `INSERT INTO job_applications
        (name, surname, age, city, email, phone, position, message, task_ratings_json, cv_url, cv_key, delete_token, ip, user_agent)
       VALUES
        ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)`,
      [
        fields.name,
        fields.surname,
        Number(fields.age),
        fields.city,
        fields.email,
        fields.phone,
        fields.position,
        fields.message || null,
        parsedTaskRatings.length ? JSON.stringify(parsedTaskRatings) : null,
        null,
        key,
        deleteToken,
        req.headers["x-forwarded-for"]?.toString() || req.socket.remoteAddress,
        req.headers["user-agent"] || null,
      ],
    );
  } catch (err: any) {
    console.error("LavoraConNoi DB error:", err);
    await db.end().catch(() => {});
    return res.status(500).json({
      error: "Database error",
    });
  } finally {
    await db.end().catch(() => {});
  }

  const resendKey = getEnv("RESEND_API_KEY");
  const resendTo =
    getEnv("RESEND_HR_TO_EMAIL") ||
    getEnv("RESEND_TO_EMAIL") ||
    "hr@dimensioneimmagineabbigliamento.it";
  const resendFrom = getEnv("RESEND_FROM_EMAIL");
  const applicantFrom = getEnv("RESEND_APPLICANT_FROM_EMAIL") || resendFrom;
  const appUrl = (getEnv("APP_URL") || "").replace(/\/+$/, "");
  const parsedTaskRatings = parseTaskRatings(fields.taskRatings);
  const taskRatingsHtml = parsedTaskRatings.length
    ? `<ul>${parsedTaskRatings
        .map(
          (item) =>
            `<li><strong>${escapeHtml(item.task)}:</strong> ${escapeHtml(item.level)}</li>`,
        )
        .join("")}</ul>`
    : "<p>-</p>";

  if (resendKey && resendTo && resendFrom) {
    try {
      const deleteLink =
        appUrl && fields.email
          ? `${appUrl}/lavora-con-noi?deleteToken=${encodeURIComponent(
              deleteToken,
            )}&email=${encodeURIComponent(fields.email)}`
          : "";
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: resendFrom,
          to: resendTo,
          subject: `Nuova candidatura - ${fields.position}`,
          html: `
            <h2>Nuova candidatura</h2>
            <p><strong>Nome:</strong> ${escapeHtml(fields.name)}</p>
            <p><strong>Cognome:</strong> ${escapeHtml(fields.surname)}</p>
            <p><strong>Eta:</strong> ${escapeHtml(fields.age)}</p>
            <p><strong>Citta:</strong> ${escapeHtml(fields.city)}</p>
            <p><strong>Email:</strong> ${fields.email}</p>
            <p><strong>Telefono:</strong> ${fields.phone}</p>
            <p><strong>Posizione:</strong> ${fields.position}</p>
            <p><strong>Presentazione:</strong> ${escapeHtml(fields.message || "-")}</p>
            <p><strong>Task e livello:</strong></p>
            ${taskRatingsHtml}
            ${
              signedCvUrl
                ? `<p><strong>PDF candidatura (link valido 7 giorni):</strong> <a href="${signedCvUrl}">${signedCvUrl}</a></p>`
                : "<p><strong>PDF candidatura:</strong> Link temporaneo non disponibile. Richiedere un nuovo link.</p>"
            }
            ${
              deleteLink
                ? `<p><strong>Link rimozione GDPR:</strong> <a href="${deleteLink}">${deleteLink}</a></p>`
                : ""
            }
          `,
        }),
      });
      if (fields.email) {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${resendKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: applicantFrom,
            to: fields.email,
            subject: "Conferma candidatura - Dimensione Immagine",
            html: `
              <p>Grazie per la tua candidatura.</p>
              ${
                deleteLink
                  ? `<p>Se vuoi richiedere la cancellazione dei dati (GDPR), usa questo link:</p><p><a href="${deleteLink}">${deleteLink}</a></p><p>Il link non ha scadenza.</p>`
                  : "<p>Per richiedere la cancellazione dei dati (GDPR), contattaci via email.</p>"
              }
            `,
          }),
        });
      }
    } catch {
      // Email failure shouldn't block the submission
    }
  }

  return res.status(200).json({
    success: true,
    message: "Candidatura inviata con successo",
  });
}
