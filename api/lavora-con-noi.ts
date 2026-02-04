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
  email?: string;
  phone?: string;
  position?: string;
  message?: string;
};

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_MIME = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

const getEnv = (key: string) => process.env[key] || "";

function sanitizeFilename(filename: string) {
  return filename.replace(/[^a-zA-Z0-9._-]/g, "_");
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
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

  if (!fields.name || !fields.email || !fields.phone || !fields.position) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  if (!fileBuffer || !fileName) {
    return res.status(400).json({ error: "Missing CV file" });
  }
  if (!ALLOWED_MIME.has(fileType)) {
    return res.status(400).json({ error: "Unsupported file type" });
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
    await db.query(`
      CREATE TABLE IF NOT EXISTS job_applications (
        id BIGSERIAL PRIMARY KEY,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT NOT NULL,
        position TEXT NOT NULL,
        message TEXT,
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
      ADD COLUMN IF NOT EXISTS position TEXT,
      ADD COLUMN IF NOT EXISTS cv_key TEXT,
      ADD COLUMN IF NOT EXISTS delete_token TEXT,
      ADD COLUMN IF NOT EXISTS ip TEXT,
      ADD COLUMN IF NOT EXISTS user_agent TEXT
    `);

    await db.query(
      `INSERT INTO job_applications
        (name, email, phone, position, message, cv_url, cv_key, delete_token, ip, user_agent)
       VALUES
        ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
      [
        fields.name,
        fields.email,
        fields.phone,
        fields.position,
        fields.message || null,
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
  const resendTo = getEnv("RESEND_TO_EMAIL");
  const resendFrom = getEnv("RESEND_FROM_EMAIL");
  const applicantFrom = getEnv("RESEND_APPLICANT_FROM_EMAIL") || resendFrom;
  const appUrl = (getEnv("APP_URL") || "").replace(/\/+$/, "");

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
            <p><strong>Nome:</strong> ${fields.name}</p>
            <p><strong>Email:</strong> ${fields.email}</p>
            <p><strong>Telefono:</strong> ${fields.phone}</p>
            <p><strong>Posizione:</strong> ${fields.position}</p>
            <p><strong>Messaggio:</strong> ${fields.message || "-"}</p>
            ${
              signedCvUrl
                ? `<p><strong>CV (link valido 7 giorni):</strong> <a href="${signedCvUrl}">${signedCvUrl}</a></p>`
                : "<p><strong>CV:</strong> Link temporaneo non disponibile. Richiedere un nuovo link.</p>"
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
