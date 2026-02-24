import type { VercelRequest, VercelResponse } from "@vercel/node";
import {
  DeleteObjectCommand,
  GetObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Client } from "pg";

const getEnv = (key: string) => process.env[key] || "";

function isAuthorized(req: VercelRequest) {
  const token = getEnv("HR_API_TOKEN");
  if (!token) return false;
  const header = req.headers.authorization || req.headers["x-admin-token"];
  if (!header) return false;
  const value = Array.isArray(header) ? header[0] : header;
  if (value.startsWith("Bearer ")) {
    return value.slice(7) === token;
  }
  return value === token;
}

function getAction(req: VercelRequest) {
  const raw = req.query.action;
  if (Array.isArray(raw)) return String(raw[0] || "").trim().toLowerCase();
  return String(raw || "").trim().toLowerCase();
}

function createStorageClient() {
  const bucket = getEnv("BUCKET_NAME");
  const accountId = getEnv("ACCOUNT_ID");
  const accessKeyId = getEnv("ACCESS_KEY_ID");
  const secretAccessKey = getEnv("SECRET_ACCESS_KEY");
  if (!bucket || !accountId || !accessKeyId || !secretAccessKey) {
    return null;
  }

  const s3 = new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId, secretAccessKey },
  });

  return { s3, bucket };
}

async function handleSignedCvLink(req: VercelRequest, res: VercelResponse) {
  if (!isAuthorized(req)) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { email } = (req.body || {}) as { email?: string };
  if (!email) {
    return res.status(400).json({ error: "Missing email" });
  }

  const db = new Client({
    connectionString: getEnv("DATABASE_URL"),
  });

  let cvKey: string | null = null;
  try {
    await db.connect();
    const { rows } = await db.query<{ cv_key: string }>(
      `SELECT cv_key FROM job_applications WHERE email = $1 ORDER BY created_at DESC LIMIT 1`,
      [email],
    );
    if (!rows.length) {
      return res.status(404).json({ error: "Not found" });
    }
    cvKey = rows[0].cv_key;
  } catch {
    return res.status(500).json({ error: "Database error" });
  } finally {
    await db.end().catch(() => {});
  }

  const storage = createStorageClient();
  if (!storage) {
    return res.status(500).json({ error: "R2 configuration missing" });
  }

  try {
    const signedUrl = await getSignedUrl(
      storage.s3,
      new GetObjectCommand({
        Bucket: storage.bucket,
        Key: cvKey,
      }),
      { expiresIn: 60 * 60 * 24 * 7 },
    );

    return res.status(200).json({ signedUrl });
  } catch {
    return res.status(500).json({ error: "Failed to sign URL" });
  }
}

async function handleDeleteApplication(req: VercelRequest, res: VercelResponse) {
  const { email, deleteToken } = (req.body || {}) as {
    email?: string;
    deleteToken?: string;
  };

  if (!email || !deleteToken) {
    return res.status(400).json({ error: "Missing parameters" });
  }

  const db = new Client({
    connectionString: getEnv("DATABASE_URL"),
  });

  let cvKey: string | null = null;
  try {
    await db.connect();
    const { rows } = await db.query<{ cv_key: string }>(
      `SELECT cv_key FROM job_applications WHERE email = $1 AND delete_token = $2 LIMIT 1`,
      [email, deleteToken],
    );
    if (!rows.length) {
      return res.status(404).json({ error: "Not found" });
    }
    cvKey = rows[0].cv_key;

    await db.query(
      `DELETE FROM job_applications WHERE email = $1 AND delete_token = $2`,
      [email, deleteToken],
    );
  } catch {
    return res.status(500).json({ error: "Database error" });
  } finally {
    await db.end().catch(() => {});
  }

  if (cvKey) {
    const storage = createStorageClient();
    if (storage) {
      try {
        await storage.s3.send(
          new DeleteObjectCommand({
            Bucket: storage.bucket,
            Key: cvKey,
          }),
        );
      } catch {
        // ignore storage cleanup failures
      }
    }
  }

  return res.status(200).json({ success: true });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const action = getAction(req);
  if (action === "cv-link") {
    return handleSignedCvLink(req, res);
  }
  if (action === "delete") {
    return handleDeleteApplication(req, res);
  }

  return res.status(404).json({ error: "Unknown action" });
}
