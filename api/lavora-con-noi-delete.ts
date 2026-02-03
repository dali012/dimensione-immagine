import type { VercelRequest, VercelResponse } from "@vercel/node";
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { Client } from "pg";

const getEnv = (key: string) => process.env[key] || "";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

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
    const { rows } = await db.query(
      `SELECT cv_key FROM job_applications WHERE email = $1 AND delete_token = $2 LIMIT 1`,
      [email, deleteToken],
    );
    if (!rows.length) {
      await db.end().catch(() => {});
      return res.status(404).json({ error: "Not found" });
    }
    cvKey = rows[0].cv_key;

    await db.query(
      `DELETE FROM job_applications WHERE email = $1 AND delete_token = $2`,
      [email, deleteToken],
    );
  } catch (err: any) {
    await db.end().catch(() => {});
    return res.status(500).json({ error: "Database error" });
  } finally {
    await db.end().catch(() => {});
  }

  if (cvKey) {
    const bucket = getEnv("BUCKET_NAME");
    const accountId = getEnv("ACCOUNT_ID");
    const accessKeyId = getEnv("ACCESS_KEY_ID");
    const secretAccessKey = getEnv("SECRET_ACCESS_KEY");

    if (bucket && accountId && accessKeyId && secretAccessKey) {
      const s3 = new S3Client({
        region: "auto",
        endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
        credentials: { accessKeyId, secretAccessKey },
      });
      try {
        await s3.send(
          new DeleteObjectCommand({
            Bucket: bucket,
            Key: cvKey,
          }),
        );
      } catch {
        // ignore delete errors
      }
    }
  }

  return res.status(200).json({ success: true });
}
