import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Client } from "pg";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const getEnv = (key: string) => process.env[key] || "";

function isAuthorized(req: VercelRequest) {
  const token = getEnv("HR_API_TOKEN");
  if (!token) return false;
  const header =
    req.headers["authorization"] || req.headers["x-admin-token"];
  if (!header) return false;
  const value = Array.isArray(header) ? header[0] : header;
  if (value.startsWith("Bearer ")) {
    return value.slice(7) === token;
  }
  return value === token;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

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
    const { rows } = await db.query(
      `SELECT cv_key FROM job_applications WHERE email = $1 ORDER BY created_at DESC LIMIT 1`,
      [email],
    );
    if (!rows.length) {
      await db.end().catch(() => {});
      return res.status(404).json({ error: "Not found" });
    }
    cvKey = rows[0].cv_key;
  } catch {
    await db.end().catch(() => {});
    return res.status(500).json({ error: "Database error" });
  } finally {
    await db.end().catch(() => {});
  }

  const bucket = getEnv("BUCKET_NAME");
  const accountId = getEnv("ACCOUNT_ID");
  const accessKeyId = getEnv("ACCESS_KEY_ID");
  const secretAccessKey = getEnv("SECRET_ACCESS_KEY");

  if (!bucket || !accountId || !accessKeyId || !secretAccessKey) {
    return res.status(500).json({ error: "R2 configuration missing" });
  }

  const s3 = new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId, secretAccessKey },
  });

  try {
    const signedUrl = await getSignedUrl(
      s3,
      new GetObjectCommand({
        Bucket: bucket,
        Key: cvKey,
      }),
      { expiresIn: 60 * 60 * 24 * 7 },
    );

    return res.status(200).json({ signedUrl });
  } catch {
    return res.status(500).json({ error: "Failed to sign URL" });
  }
}
