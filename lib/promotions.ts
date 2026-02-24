import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import Busboy from "busboy";
import crypto from "crypto";
import type { Client } from "pg";
import {
  cleanText,
  clearSessionCookie,
  deleteSessionByRawToken,
  getEnv,
  getProfileFromSession,
  getSessionTokenFromRequest,
} from "./wholesale-auth.js";

export const PROMOTION_IMAGE_MAX_SIZE = 5 * 1024 * 1024;
const PROMOTION_ALLOWED_MIME = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
]);
const ROME_TIME_ZONE = "Europe/Rome";

let promotionsSchemaEnsured = false;

type RateLimitState = {
  count: number;
  resetAt: number;
};

type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  resetAt?: number;
};

const PROMOTION_EDITOR_RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const PROMOTION_EDITOR_RATE_LIMIT_MAX = 30;
const PROMOTION_ALLOWLIST_RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const PROMOTION_ALLOWLIST_RATE_LIMIT_MAX = 20;

const promotionEditorRateLimitStore = new Map<string, RateLimitState>();
const promotionAllowlistRateLimitStore = new Map<string, RateLimitState>();

export type PromotionRow = {
  id: number;
  created_at: string;
  updated_at: string;
  title: string;
  image_key: string;
  old_price_cents: number;
  new_price_cents: number;
  discount_percent: number;
  starts_at: string | null;
  ends_at: string | null;
  is_active: boolean;
  sort_order: number;
  created_by_profile_id: number | null;
  updated_by_profile_id: number | null;
};

type ParsedMultipartFile = {
  buffer: Buffer;
  filename: string;
  mimeType: string;
};

export type ParsedPromotionMultipart = {
  fields: Record<string, string>;
  file: ParsedMultipartFile | null;
};

function consumeRateLimit(
  store: Map<string, RateLimitState>,
  key: string,
  max: number,
  windowMs: number,
): RateLimitResult {
  const now = Date.now();
  const existing = store.get(key);

  if (!existing || existing.resetAt <= now) {
    store.set(key, {
      count: 1,
      resetAt: now + windowMs,
    });
    return { allowed: true, remaining: Math.max(max - 1, 0) };
  }

  if (existing.count >= max) {
    return { allowed: false, remaining: 0, resetAt: existing.resetAt };
  }

  existing.count += 1;
  store.set(key, existing);
  return { allowed: true, remaining: Math.max(max - existing.count, 0) };
}

export function checkPromotionEditorMutationRateLimit(key: string) {
  return consumeRateLimit(
    promotionEditorRateLimitStore,
    key,
    PROMOTION_EDITOR_RATE_LIMIT_MAX,
    PROMOTION_EDITOR_RATE_LIMIT_WINDOW_MS,
  );
}

export function checkPromotionAllowlistMutationRateLimit(key: string) {
  return consumeRateLimit(
    promotionAllowlistRateLimitStore,
    key,
    PROMOTION_ALLOWLIST_RATE_LIMIT_MAX,
    PROMOTION_ALLOWLIST_RATE_LIMIT_WINDOW_MS,
  );
}

function sanitizeFilename(filename: string) {
  return filename.replace(/[^a-zA-Z0-9._-]/g, "_");
}

function getExtensionFromMime(mimeType: string, filename: string) {
  const name = filename.toLowerCase();
  if (mimeType === "image/jpeg" || mimeType === "image/jpg") return "jpg";
  if (mimeType === "image/png") return "png";
  if (mimeType === "image/webp") return "webp";
  if (name.endsWith(".jpg") || name.endsWith(".jpeg")) return "jpg";
  if (name.endsWith(".png")) return "png";
  if (name.endsWith(".webp")) return "webp";
  return "jpg";
}

export function createPromotionImageKey(filename: string, mimeType: string) {
  const ext = getExtensionFromMime(mimeType, filename);
  const safeName = sanitizeFilename(filename).replace(/\.[^.]+$/, "");
  const random = crypto.randomBytes(8).toString("hex");
  return `promotions/${Date.now()}-${random}-${safeName}.${ext}`;
}

function getStorageConfig() {
  const bucket = cleanText(getEnv("BUCKET_NAME"));
  const accountId = cleanText(getEnv("ACCOUNT_ID"));
  const accessKeyId = cleanText(getEnv("ACCESS_KEY_ID"));
  const secretAccessKey = cleanText(getEnv("SECRET_ACCESS_KEY"));
  if (!bucket || !accountId || !accessKeyId || !secretAccessKey) {
    throw new Error("R2 configuration missing");
  }
  return {
    bucket,
    accountId,
    accessKeyId,
    secretAccessKey,
  };
}

export function createPromotionStorageClient() {
  const cfg = getStorageConfig();
  const s3 = new S3Client({
    region: "auto",
    endpoint: `https://${cfg.accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: cfg.accessKeyId,
      secretAccessKey: cfg.secretAccessKey,
    },
  });
  return { s3, bucket: cfg.bucket };
}

export async function uploadPromotionImage(
  s3: S3Client,
  bucket: string,
  key: string,
  file: ParsedMultipartFile,
) {
  await s3.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimeType,
    }),
  );
}

export async function deletePromotionImage(
  s3: S3Client,
  bucket: string,
  key: string,
) {
  await s3.send(
    new DeleteObjectCommand({
      Bucket: bucket,
      Key: key,
    }),
  );
}

export async function signPromotionImageUrl(
  s3: S3Client,
  bucket: string,
  key: string,
) {
  return getSignedUrl(
    s3,
    new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    }),
    { expiresIn: 60 * 60 * 24 },
  );
}

export async function ensurePromotionsSchema(db: Client) {
  if (promotionsSchemaEnsured) return;

  await db.query(`
    CREATE TABLE IF NOT EXISTS promotions (
      id BIGSERIAL PRIMARY KEY,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      title TEXT NOT NULL,
      image_key TEXT NOT NULL,
      old_price_cents INTEGER NOT NULL,
      new_price_cents INTEGER NOT NULL,
      discount_percent INTEGER NOT NULL,
      starts_at TIMESTAMPTZ,
      ends_at TIMESTAMPTZ,
      is_active BOOLEAN NOT NULL DEFAULT TRUE,
      sort_order INTEGER NOT NULL DEFAULT 1000,
      created_by_profile_id BIGINT REFERENCES wholesale_profiles(id) ON DELETE SET NULL,
      updated_by_profile_id BIGINT REFERENCES wholesale_profiles(id) ON DELETE SET NULL
    )
  `);

  await db.query(`
    ALTER TABLE promotions
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ADD COLUMN IF NOT EXISTS title TEXT,
    ADD COLUMN IF NOT EXISTS image_key TEXT,
    ADD COLUMN IF NOT EXISTS old_price_cents INTEGER,
    ADD COLUMN IF NOT EXISTS new_price_cents INTEGER,
    ADD COLUMN IF NOT EXISTS discount_percent INTEGER,
    ADD COLUMN IF NOT EXISTS starts_at TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS ends_at TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT TRUE,
    ADD COLUMN IF NOT EXISTS sort_order INTEGER NOT NULL DEFAULT 1000,
    ADD COLUMN IF NOT EXISTS created_by_profile_id BIGINT REFERENCES wholesale_profiles(id) ON DELETE SET NULL,
    ADD COLUMN IF NOT EXISTS updated_by_profile_id BIGINT REFERENCES wholesale_profiles(id) ON DELETE SET NULL
  `);

  await db.query(`
    CREATE INDEX IF NOT EXISTS promotions_visibility_idx
    ON promotions (is_active, sort_order, starts_at, ends_at)
  `);

  await db.query(`
    CREATE INDEX IF NOT EXISTS promotions_window_idx
    ON promotions (starts_at, ends_at)
  `);

  promotionsSchemaEnsured = true;
}

function getZonedDateParts(date: Date, timeZone: string) {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  const map: Record<string, string> = {};
  for (const part of formatter.formatToParts(date)) {
    if (part.type !== "literal") {
      map[part.type] = part.value;
    }
  }

  return {
    year: Number(map.year),
    month: Number(map.month),
    day: Number(map.day),
    hour: Number(map.hour),
    minute: Number(map.minute),
    second: Number(map.second),
  };
}

export function toUtcIsoFromRomeInput(value: string) {
  const input = cleanText(value);
  if (!input) return null;
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(input)) {
    throw new Error("Invalid datetime format");
  }

  const [datePart, timePart] = input.split("T");
  const [y, m, d] = datePart.split("-").map(Number);
  const [hh, mm] = timePart.split(":").map(Number);

  const targetLocalAsUtc = Date.UTC(y, m - 1, d, hh, mm, 0, 0);
  let timestamp = targetLocalAsUtc;

  for (let i = 0; i < 4; i += 1) {
    const zoned = getZonedDateParts(new Date(timestamp), ROME_TIME_ZONE);
    const zonedAsUtc = Date.UTC(
      zoned.year,
      zoned.month - 1,
      zoned.day,
      zoned.hour,
      zoned.minute,
      zoned.second,
      0,
    );
    const diff = zonedAsUtc - targetLocalAsUtc;
    if (diff === 0) break;
    timestamp -= diff;
  }

  return new Date(timestamp).toISOString();
}

export function toRomeInputFromUtc(value: string | null) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const parts = getZonedDateParts(date, ROME_TIME_ZONE);
  const month = String(parts.month).padStart(2, "0");
  const day = String(parts.day).padStart(2, "0");
  const hour = String(parts.hour).padStart(2, "0");
  const minute = String(parts.minute).padStart(2, "0");
  return `${parts.year}-${month}-${day}T${hour}:${minute}`;
}

export function parsePriceToCents(value: string) {
  const normalized = cleanText(value).replace(",", ".");
  if (!/^\d+(\.\d{1,2})?$/.test(normalized)) return null;
  const asNumber = Number(normalized);
  if (!Number.isFinite(asNumber)) return null;
  const cents = Math.round(asNumber * 100);
  if (cents <= 0) return null;
  return cents;
}

export function computeDiscountPercent(oldPriceCents: number, newPriceCents: number) {
  const ratio = ((oldPriceCents - newPriceCents) / oldPriceCents) * 100;
  return Math.max(0, Math.min(100, Math.round(ratio)));
}

export async function parsePromotionMultipart(
  req: VercelRequest,
  options?: { requireImage?: boolean },
): Promise<ParsedPromotionMultipart> {
  const requireImage = Boolean(options?.requireImage);
  const fields: Record<string, string> = {};
  let parsedFile: ParsedMultipartFile | null = null;

  await new Promise<void>((resolve, reject) => {
    const bb = Busboy({
      headers: req.headers,
      limits: {
        fileSize: PROMOTION_IMAGE_MAX_SIZE,
        files: 1,
      },
    });

    let hasRejected = false;

    bb.on("file", (_name, file, info) => {
      const mimeType = cleanText(info.mimeType).toLowerCase();
      const filename = cleanText(info.filename) || "promotion-image";

      if (!PROMOTION_ALLOWED_MIME.has(mimeType)) {
        hasRejected = true;
        file.resume();
        return;
      }

      const chunks: Buffer[] = [];
      file.on("data", (chunk: Buffer) => chunks.push(chunk));
      file.on("limit", () => reject(new Error("Image too large")));
      file.on("end", () => {
        parsedFile = {
          buffer: Buffer.concat(chunks),
          filename,
          mimeType,
        };
      });
    });

    bb.on("field", (name, value) => {
      fields[name] = value;
    });

    bb.on("error", reject);
    bb.on("finish", () => {
      if (hasRejected) {
        reject(new Error("Unsupported image type"));
        return;
      }
      if (requireImage && !parsedFile) {
        reject(new Error("Image is required"));
        return;
      }
      resolve();
    });

    req.pipe(bb);
  });

  return { fields, file: parsedFile };
}

export async function requirePromotionEditorProfile(
  req: VercelRequest,
  res: VercelResponse,
  db: Client,
) {
  const rawToken = getSessionTokenFromRequest(req);
  if (!rawToken) {
    res.status(401).json({ error: "Unauthorized" });
    return null;
  }

  const profile = await getProfileFromSession(db, rawToken);
  if (!profile || !profile.is_approved || !profile.password_hash) {
    await deleteSessionByRawToken(db, rawToken);
    clearSessionCookie(res);
    res.status(401).json({ error: "Unauthorized" });
    return null;
  }

  if (!profile.can_manage_promotions) {
    res.status(403).json({ error: "Forbidden" });
    return null;
  }

  return profile;
}
