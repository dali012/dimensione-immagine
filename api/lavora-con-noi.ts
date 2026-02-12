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
  fullName?: string;
  surname?: string;
  age?: string;
  city?: string;
  email?: string;
  phone?: string;
  experience?: string;
  position?: string;
  message?: string;
  professionalSummary?: string;
  linkedin?: string;
  interestAreas?: string;
  experienceLevel?: string;
  salaryExpectation?: string;
  noticePeriod?: string;
  educationLevel?: string;
  languages?: string;
  hardSkills?: string;
  experiences?: string;
  firstExperience?: string;
  taskRatings?: string;
  recaptchaToken?: string;
};

type TaskRating = {
  task: string;
  level: string;
};

type LanguageItem = {
  language: string;
  level: string;
};

type ExperienceItem = {
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  responsibilities: string;
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

function parseTaskRatings(raw: string | undefined): TaskRating[] {
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

function parseStringArray(raw: string | undefined): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((item) => (typeof item === "string" ? item.trim() : ""))
      .filter(Boolean);
  } catch {
    return [];
  }
}

function parseLanguages(raw: string | undefined): LanguageItem[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as Array<{
      language?: string;
      level?: string;
    }>;
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((item) => ({
        language: (item?.language || "").trim(),
        level: (item?.level || "").trim(),
      }))
      .filter((item) => item.language.length > 0);
  } catch {
    return [];
  }
}

function parseExperiences(raw: string | undefined): ExperienceItem[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as Array<{
      company?: string;
      role?: string;
      startDate?: string;
      endDate?: string;
      isCurrent?: boolean;
      responsibilities?: string;
    }>;
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((item) => ({
        company: (item?.company || "").trim(),
        role: (item?.role || "").trim(),
        startDate: (item?.startDate || "").trim(),
        endDate: (item?.endDate || "").trim(),
        isCurrent: Boolean(item?.isCurrent),
        responsibilities: (item?.responsibilities || "").trim(),
      }))
      .filter(
        (item) =>
          item.company ||
          item.role ||
          item.startDate ||
          item.endDate ||
          item.responsibilities,
      );
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

  const candidateName = (fields.fullName || fields.name || "").trim();
  const city = (fields.city || "").trim();
  const email = (fields.email || "").trim();
  const phone = (fields.phone || "").trim();
  const position = (fields.position || "").trim();

  if (!candidateName || !city || !phone || !position) {
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
  } catch {
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

  const taskRatings = parseTaskRatings(fields.taskRatings);
  const interestAreas = parseStringArray(fields.interestAreas);
  const languages = parseLanguages(fields.languages);
  const experiences = parseExperiences(fields.experiences);
  const firstExperience = fields.firstExperience === "true";
  const professionalSummary = (
    fields.professionalSummary ||
    fields.message ||
    ""
  ).trim();
  const linkedin = (fields.linkedin || "").trim();
  const hardSkills = (fields.hardSkills || "").trim();

  const ageNumber = Number(fields.age);
  const age = Number.isFinite(ageNumber) ? ageNumber : null;
  const experienceSummary =
    (fields.experience || "").trim() ||
    [
      (fields.experienceLevel || "").trim(),
      (fields.noticePeriod || "").trim(),
    ]
      .filter(Boolean)
      .join(" | ");

  const metadata = {
    fullName: candidateName,
    linkedin,
    interestAreas,
    experienceLevel: (fields.experienceLevel || "").trim(),
    salaryExpectation: (fields.salaryExpectation || "").trim(),
    noticePeriod: (fields.noticePeriod || "").trim(),
    educationLevel: (fields.educationLevel || "").trim(),
    languages,
    hardSkills,
    firstExperience,
    experiences,
    professionalSummary,
    taskRatings,
  };

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
          email TEXT,
          phone TEXT NOT NULL,
          experience TEXT,
          position TEXT NOT NULL,
          message TEXT,
          task_ratings_json JSONB,
          metadata_json JSONB,
          cv_url TEXT,
          cv_key TEXT NOT NULL,
          delete_token TEXT NOT NULL,
          ip TEXT,
          user_agent TEXT
        )
      `);

      await db.query(`
        ALTER TABLE job_applications
        ADD COLUMN IF NOT EXISTS email TEXT,
        ADD COLUMN IF NOT EXISTS surname TEXT,
        ADD COLUMN IF NOT EXISTS age INTEGER,
        ADD COLUMN IF NOT EXISTS city TEXT,
        ADD COLUMN IF NOT EXISTS experience TEXT,
        ADD COLUMN IF NOT EXISTS position TEXT,
        ADD COLUMN IF NOT EXISTS task_ratings_json JSONB,
        ADD COLUMN IF NOT EXISTS metadata_json JSONB,
        ADD COLUMN IF NOT EXISTS cv_key TEXT,
        ADD COLUMN IF NOT EXISTS delete_token TEXT,
        ADD COLUMN IF NOT EXISTS ip TEXT,
        ADD COLUMN IF NOT EXISTS user_agent TEXT
      `);

      await db.query(`
        ALTER TABLE job_applications
        ALTER COLUMN email DROP NOT NULL
      `);
      schemaEnsured = true;
    }

    await db.query(
      `INSERT INTO job_applications
        (name, surname, age, city, email, phone, experience, position, message, task_ratings_json, metadata_json, cv_url, cv_key, delete_token, ip, user_agent)
       VALUES
        ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)`,
      [
        candidateName,
        (fields.surname || "").trim() || null,
        age,
        city,
        email || null,
        phone,
        experienceSummary || null,
        position,
        professionalSummary || null,
        taskRatings.length ? JSON.stringify(taskRatings) : null,
        JSON.stringify(metadata),
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

  const taskRatingsHtml = taskRatings.length
    ? `<ul>${taskRatings
        .map(
          (item) =>
            `<li><strong>${escapeHtml(item.task)}:</strong> ${escapeHtml(item.level)}</li>`,
        )
        .join("")}</ul>`
    : "<p>-</p>";

  const interestAreasHtml = interestAreas.length
    ? `<ul>${interestAreas
        .map((item) => `<li>${escapeHtml(item)}</li>`)
        .join("")}</ul>`
    : "<p>-</p>";

  const languagesHtml = languages.length
    ? `<ul>${languages
        .map(
          (item) =>
            `<li>${escapeHtml(item.language)}${item.level ? ` - ${escapeHtml(item.level)}` : ""}</li>`,
        )
        .join("")}</ul>`
    : "<p>-</p>";

  const experiencesHtml = firstExperience
    ? "<p>Candidato alla prima esperienza lavorativa.</p>"
    : experiences.length
      ? `<ol>${experiences
          .map(
            (item) => `
              <li>
                <strong>${escapeHtml(item.company || "-")}</strong> - ${escapeHtml(item.role || "-")}<br/>
                ${escapeHtml(item.startDate || "-")} / ${escapeHtml(
                  item.isCurrent ? "Attualmente occupato" : item.endDate || "-",
                )}<br/>
                ${escapeHtml(item.responsibilities || "-")}
              </li>
            `,
          )
          .join("")}</ol>`
      : "<p>-</p>";

  if (resendKey && resendTo && resendFrom) {
    try {
      const deleteLink =
        appUrl && email
          ? `${appUrl}/lavora-con-noi?deleteToken=${encodeURIComponent(
              deleteToken,
            )}&email=${encodeURIComponent(email)}`
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
          subject: `Nuova candidatura - ${position}`,
          html: `
            <h2>Nuova candidatura</h2>
            <p><strong>Nome:</strong> ${escapeHtml(candidateName)}</p>
            <p><strong>Citta:</strong> ${escapeHtml(city)}</p>
            <p><strong>Email:</strong> ${escapeHtml(email || "-")}</p>
            <p><strong>Telefono:</strong> ${escapeHtml(phone)}</p>
            <p><strong>Posizione:</strong> ${escapeHtml(position)}</p>
            <p><strong>LinkedIn/Portfolio:</strong> ${escapeHtml(linkedin || "-")}</p>
            <p><strong>Livello esperienza:</strong> ${escapeHtml(fields.experienceLevel || "-")}</p>
            <p><strong>Aspettativa salariale:</strong> ${escapeHtml(fields.salaryExpectation || "-")}</p>
            <p><strong>Disponibilita preavviso:</strong> ${escapeHtml(fields.noticePeriod || "-")}</p>
            <p><strong>Titolo di studio:</strong> ${escapeHtml(fields.educationLevel || "-")}</p>
            <p><strong>Hard skills:</strong> ${escapeHtml(hardSkills || "-")}</p>
            <p><strong>Prima esperienza lavorativa:</strong> ${firstExperience ? "Si" : "No"}</p>
            <p><strong>Aree di interesse:</strong></p>
            ${interestAreasHtml}
            <p><strong>Lingue:</strong></p>
            ${languagesHtml}
            <p><strong>Competenze posizione:</strong></p>
            ${taskRatingsHtml}
            <p><strong>Esperienze professionali:</strong></p>
            ${experiencesHtml}
            <p><strong>Riepilogo professionale:</strong> ${escapeHtml(professionalSummary || "-")}</p>
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

      if (email) {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${resendKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: applicantFrom,
            to: email,
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
