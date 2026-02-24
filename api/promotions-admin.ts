import type { VercelRequest, VercelResponse } from "@vercel/node";
import {
  cleanText,
  createDbClient,
  ensureWholesaleAuthSchema,
  getAccountStatus,
  getRequestIp,
  isEmailValid,
  issuePasswordSetupToken,
  normalizeEmail,
  parseAdminAuthorization,
  sendPasswordSetupEmail,
} from "../lib/wholesale-auth.js";
import {
  checkPromotionAllowlistMutationRateLimit,
  checkPromotionEditorMutationRateLimit,
  computeDiscountPercent,
  createPromotionImageKey,
  createPromotionStorageClient,
  deletePromotionImage,
  ensurePromotionsSchema,
  parsePriceToCents,
  parsePromotionMultipart,
  requirePromotionEditorProfile,
  signPromotionImageUrl,
  toUtcIsoFromRomeInput,
  type PromotionRow,
  uploadPromotionImage,
} from "../lib/promotions.js";

export const config = {
  api: { bodyParser: false },
};

type ExistingPromotionRow = {
  id: number;
  image_key: string;
  old_price_cents: number;
  new_price_cents: number;
  sort_order: number;
  is_active: boolean;
};

type DeletePayload = {
  id?: number;
};

type ReorderPayload = {
  id?: number;
  sortOrder?: number;
};

type InvitePayload = {
  email?: string;
};

type RevokePayload = {
  email?: string;
};

type EditorRow = {
  id: number;
  name: string;
  surname: string;
  phone: string;
  email: string;
  is_approved: boolean;
  can_manage_promotions: boolean;
  password_hash: string | null;
  created_at: string;
  approved_at: string | null;
  verified_at: string | null;
};

type ProfileRow = {
  id: number;
  name: string;
  surname: string;
  email: string;
  password_hash: string | null;
  is_approved: boolean;
  can_manage_promotions: boolean;
};

function getAction(req: VercelRequest) {
  const raw = req.query.action;
  if (Array.isArray(raw)) return cleanText(raw[0]).toLowerCase();
  return cleanText(raw).toLowerCase();
}

async function parseJsonBody<T>(req: VercelRequest) {
  if (req.body && typeof req.body === "object") {
    return req.body as T;
  }

  const chunks: Buffer[] = [];
  await new Promise<void>((resolve, reject) => {
    req.on("data", (chunk: Buffer | string) => {
      if (Buffer.isBuffer(chunk)) {
        chunks.push(chunk);
      } else {
        chunks.push(Buffer.from(chunk));
      }
    });
    req.on("end", () => resolve());
    req.on("error", reject);
  });

  const raw = Buffer.concat(chunks).toString("utf8").trim();
  if (!raw) {
    return {} as T;
  }

  try {
    return JSON.parse(raw) as T;
  } catch {
    throw new Error("Invalid JSON body");
  }
}

async function handleList(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const db = createDbClient();
  if (!db) {
    return res.status(500).json({
      error:
        "Invalid or missing database connection env (DATABASE_URL/POSTGRES_URL)",
    });
  }

  try {
    await db.connect();
    await ensureWholesaleAuthSchema(db);
    await ensurePromotionsSchema(db);

    const profile = await requirePromotionEditorProfile(req, res, db);
    if (!profile) return;

    const { rows } = await db.query<PromotionRow>(
      `SELECT
        id,
        created_at,
        updated_at,
        title,
        image_key,
        old_price_cents,
        new_price_cents,
        discount_percent,
        starts_at,
        ends_at,
        is_active,
        sort_order,
        created_by_profile_id,
        updated_by_profile_id
       FROM promotions
       ORDER BY sort_order ASC, created_at DESC`,
    );

    const { s3, bucket } = createPromotionStorageClient();
    const items = await Promise.all(
      rows.map(async (row) => {
        const imageUrl = await signPromotionImageUrl(s3, bucket, row.image_key);
        return {
          id: row.id,
          title: row.title,
          imageUrl,
          oldPriceCents: row.old_price_cents,
          newPriceCents: row.new_price_cents,
          discountPercent: row.discount_percent,
          startsAt: row.starts_at,
          endsAt: row.ends_at,
          isActive: row.is_active,
          sortOrder: row.sort_order,
          createdAt: row.created_at,
          updatedAt: row.updated_at,
        };
      }),
    );

    return res.status(200).json({ items });
  } catch (error) {
    console.error("Promotions admin list error:", error);
    return res.status(500).json({ error: "Database error" });
  } finally {
    await db.end().catch(() => {});
  }
}

async function handleCreate(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const db = createDbClient();
  if (!db) {
    return res.status(500).json({
      error:
        "Invalid or missing database connection env (DATABASE_URL/POSTGRES_URL)",
    });
  }

  let uploadedKey = "";

  try {
    await db.connect();
    await ensureWholesaleAuthSchema(db);
    await ensurePromotionsSchema(db);

    const profile = await requirePromotionEditorProfile(req, res, db);
    if (!profile) return;

    const rateLimit = checkPromotionEditorMutationRateLimit(
      `${getRequestIp(req)}:${profile.id}`,
    );
    if (!rateLimit.allowed) {
      return res.status(429).json({
        error: "Too many requests",
        retryAfterMs: Math.max((rateLimit.resetAt || 0) - Date.now(), 0),
      });
    }

    const { fields, file } = await parsePromotionMultipart(req, {
      requireImage: true,
    });

    const title = (fields.title || "").trim();
    if (!title || title.length > 160) {
      return res
        .status(400)
        .json({ error: "Title is required (max 160 characters)" });
    }

    const oldPriceCents = parsePriceToCents(fields.oldPrice || "");
    const newPriceCents = parsePriceToCents(fields.newPrice || "");
    if (!oldPriceCents || !newPriceCents) {
      return res.status(400).json({ error: "Invalid price values" });
    }
    if (newPriceCents > oldPriceCents) {
      return res
        .status(400)
        .json({ error: "New price must be lower than or equal to old price" });
    }

    let startsAt: string | null = null;
    let endsAt: string | null = null;

    try {
      startsAt = toUtcIsoFromRomeInput(fields.startsAt || "");
      endsAt = toUtcIsoFromRomeInput(fields.endsAt || "");
    } catch {
      return res.status(400).json({ error: "Invalid date format" });
    }

    if (startsAt && endsAt && new Date(startsAt) > new Date(endsAt)) {
      return res
        .status(400)
        .json({ error: "Start date must be before end date" });
    }

    const isActive =
      fields.isActive === undefined ? true : fields.isActive === "true";
    const sortOrder = Number.parseInt((fields.sortOrder || "").trim(), 10);
    const safeSortOrder = Number.isFinite(sortOrder) ? sortOrder : 1000;
    const discountPercent = computeDiscountPercent(oldPriceCents, newPriceCents);

    const { s3, bucket } = createPromotionStorageClient();
    const promotionFile = file!;
    const imageKey = createPromotionImageKey(
      promotionFile.filename,
      promotionFile.mimeType,
    );
    uploadedKey = imageKey;
    await uploadPromotionImage(s3, bucket, imageKey, promotionFile);

    const inserted = await db.query<{
      id: number;
      title: string;
      image_key: string;
      old_price_cents: number;
      new_price_cents: number;
      discount_percent: number;
      starts_at: string | null;
      ends_at: string | null;
      is_active: boolean;
      sort_order: number;
      created_at: string;
      updated_at: string;
    }>(
      `INSERT INTO promotions
        (title, image_key, old_price_cents, new_price_cents, discount_percent, starts_at, ends_at, is_active, sort_order, created_by_profile_id, updated_by_profile_id)
       VALUES
        ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
       RETURNING
        id, title, image_key, old_price_cents, new_price_cents, discount_percent, starts_at, ends_at, is_active, sort_order, created_at, updated_at`,
      [
        title,
        imageKey,
        oldPriceCents,
        newPriceCents,
        discountPercent,
        startsAt,
        endsAt,
        isActive,
        safeSortOrder,
        profile.id,
        profile.id,
      ],
    );

    const row = inserted.rows[0];
    const imageUrl = await signPromotionImageUrl(s3, bucket, row.image_key);

    return res.status(200).json({
      success: true,
      item: {
        id: row.id,
        title: row.title,
        imageUrl,
        oldPriceCents: row.old_price_cents,
        newPriceCents: row.new_price_cents,
        discountPercent: row.discount_percent,
        startsAt: row.starts_at,
        endsAt: row.ends_at,
        isActive: row.is_active,
        sortOrder: row.sort_order,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      },
    });
  } catch (error: any) {
    console.error("Promotions create error:", error);
    if (uploadedKey) {
      try {
        const { s3, bucket } = createPromotionStorageClient();
        await deletePromotionImage(s3, bucket, uploadedKey);
      } catch {
        // ignore rollback cleanup failures
      }
    }

    const errorMessage = String(error?.message || "");
    const isValidation =
      errorMessage.includes("Image") ||
      errorMessage.includes("Unsupported image type");
    return res
      .status(isValidation ? 400 : 500)
      .json({ error: isValidation ? errorMessage : "Database error" });
  } finally {
    await db.end().catch(() => {});
  }
}

async function handleUpdate(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const db = createDbClient();
  if (!db) {
    return res.status(500).json({
      error:
        "Invalid or missing database connection env (DATABASE_URL/POSTGRES_URL)",
    });
  }

  let uploadedKey = "";
  let oldImageKeyForCleanup = "";

  try {
    await db.connect();
    await ensureWholesaleAuthSchema(db);
    await ensurePromotionsSchema(db);

    const profile = await requirePromotionEditorProfile(req, res, db);
    if (!profile) return;

    const rateLimit = checkPromotionEditorMutationRateLimit(
      `${getRequestIp(req)}:${profile.id}`,
    );
    if (!rateLimit.allowed) {
      return res.status(429).json({
        error: "Too many requests",
        retryAfterMs: Math.max((rateLimit.resetAt || 0) - Date.now(), 0),
      });
    }

    const { fields, file } = await parsePromotionMultipart(req);
    const id = Number.parseInt((fields.id || "").trim(), 10);
    if (!Number.isFinite(id) || id <= 0) {
      return res.status(400).json({ error: "Invalid promotion id" });
    }

    const currentResult = await db.query<ExistingPromotionRow>(
      `SELECT id, image_key, old_price_cents, new_price_cents, sort_order, is_active
       FROM promotions
       WHERE id = $1
       LIMIT 1`,
      [id],
    );
    if (!currentResult.rows.length) {
      return res.status(404).json({ error: "Promotion not found" });
    }
    const current = currentResult.rows[0];

    const title = (fields.title || "").trim();
    if (!title || title.length > 160) {
      return res
        .status(400)
        .json({ error: "Title is required (max 160 characters)" });
    }

    const oldPriceCents = parsePriceToCents(fields.oldPrice || "");
    const newPriceCents = parsePriceToCents(fields.newPrice || "");
    if (!oldPriceCents || !newPriceCents) {
      return res.status(400).json({ error: "Invalid price values" });
    }
    if (newPriceCents > oldPriceCents) {
      return res
        .status(400)
        .json({ error: "New price must be lower than or equal to old price" });
    }

    let startsAt: string | null = null;
    let endsAt: string | null = null;

    try {
      startsAt = toUtcIsoFromRomeInput(fields.startsAt || "");
      endsAt = toUtcIsoFromRomeInput(fields.endsAt || "");
    } catch {
      return res.status(400).json({ error: "Invalid date format" });
    }

    if (startsAt && endsAt && new Date(startsAt) > new Date(endsAt)) {
      return res
        .status(400)
        .json({ error: "Start date must be before end date" });
    }

    const isActive =
      fields.isActive === undefined
        ? current.is_active
        : fields.isActive === "true";
    const sortOrderRaw = Number.parseInt((fields.sortOrder || "").trim(), 10);
    const sortOrder = Number.isFinite(sortOrderRaw)
      ? sortOrderRaw
      : current.sort_order;
    const discountPercent = computeDiscountPercent(oldPriceCents, newPriceCents);

    const { s3, bucket } = createPromotionStorageClient();

    let imageKey = current.image_key;
    if (file) {
      imageKey = createPromotionImageKey(file.filename, file.mimeType);
      uploadedKey = imageKey;
      oldImageKeyForCleanup = current.image_key;
      await uploadPromotionImage(s3, bucket, imageKey, file);
    }

    const updated = await db.query<{
      id: number;
      title: string;
      image_key: string;
      old_price_cents: number;
      new_price_cents: number;
      discount_percent: number;
      starts_at: string | null;
      ends_at: string | null;
      is_active: boolean;
      sort_order: number;
      created_at: string;
      updated_at: string;
    }>(
      `UPDATE promotions
       SET title = $1,
           image_key = $2,
           old_price_cents = $3,
           new_price_cents = $4,
           discount_percent = $5,
           starts_at = $6,
           ends_at = $7,
           is_active = $8,
           sort_order = $9,
           updated_at = NOW(),
           updated_by_profile_id = $10
       WHERE id = $11
       RETURNING
         id, title, image_key, old_price_cents, new_price_cents, discount_percent, starts_at, ends_at, is_active, sort_order, created_at, updated_at`,
      [
        title,
        imageKey,
        oldPriceCents,
        newPriceCents,
        discountPercent,
        startsAt,
        endsAt,
        isActive,
        sortOrder,
        profile.id,
        id,
      ],
    );

    if (oldImageKeyForCleanup) {
      await deletePromotionImage(s3, bucket, oldImageKeyForCleanup).catch(
        () => {},
      );
    }

    const row = updated.rows[0];
    const imageUrl = await signPromotionImageUrl(s3, bucket, row.image_key);

    return res.status(200).json({
      success: true,
      item: {
        id: row.id,
        title: row.title,
        imageUrl,
        oldPriceCents: row.old_price_cents,
        newPriceCents: row.new_price_cents,
        discountPercent: row.discount_percent,
        startsAt: row.starts_at,
        endsAt: row.ends_at,
        isActive: row.is_active,
        sortOrder: row.sort_order,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      },
    });
  } catch (error: any) {
    console.error("Promotions update error:", error);
    if (uploadedKey) {
      try {
        const { s3, bucket } = createPromotionStorageClient();
        await deletePromotionImage(s3, bucket, uploadedKey);
      } catch {
        // ignore rollback cleanup failures
      }
    }

    const errorMessage = String(error?.message || "");
    const isValidation =
      errorMessage.includes("Image") ||
      errorMessage.includes("Unsupported image type");
    return res
      .status(isValidation ? 400 : 500)
      .json({ error: isValidation ? errorMessage : "Database error" });
  } finally {
    await db.end().catch(() => {});
  }
}

async function handleDelete(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const body = await parseJsonBody<DeletePayload>(req);
  const id = Number(body.id);
  if (!Number.isFinite(id) || id <= 0) {
    return res.status(400).json({ error: "Invalid promotion id" });
  }

  const db = createDbClient();
  if (!db) {
    return res.status(500).json({
      error:
        "Invalid or missing database connection env (DATABASE_URL/POSTGRES_URL)",
    });
  }

  try {
    await db.connect();
    await ensureWholesaleAuthSchema(db);
    await ensurePromotionsSchema(db);

    const profile = await requirePromotionEditorProfile(req, res, db);
    if (!profile) return;

    const rateLimit = checkPromotionEditorMutationRateLimit(
      `${getRequestIp(req)}:${profile.id}`,
    );
    if (!rateLimit.allowed) {
      return res.status(429).json({
        error: "Too many requests",
        retryAfterMs: Math.max((rateLimit.resetAt || 0) - Date.now(), 0),
      });
    }

    const deleted = await db.query<{ image_key: string }>(
      `DELETE FROM promotions
       WHERE id = $1
       RETURNING image_key`,
      [id],
    );

    if (!deleted.rows.length) {
      return res.status(404).json({ error: "Promotion not found" });
    }

    const imageKey = deleted.rows[0].image_key;
    if (imageKey) {
      const { s3, bucket } = createPromotionStorageClient();
      await deletePromotionImage(s3, bucket, imageKey).catch(() => {});
    }

    return res.status(200).json({ success: true });
  } catch (error: any) {
    const message = String(error?.message || "");
    if (message === "Invalid JSON body") {
      return res.status(400).json({ error: message });
    }
    console.error("Promotions delete error:", error);
    return res.status(500).json({ error: "Database error" });
  } finally {
    await db.end().catch(() => {});
  }
}

async function handleReorder(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const body = await parseJsonBody<ReorderPayload>(req);
  const id = Number(body.id);
  const sortOrder = Number(body.sortOrder);

  if (!Number.isFinite(id) || id <= 0) {
    return res.status(400).json({ error: "Invalid promotion id" });
  }
  if (!Number.isFinite(sortOrder)) {
    return res.status(400).json({ error: "Invalid sort order" });
  }

  const db = createDbClient();
  if (!db) {
    return res.status(500).json({
      error:
        "Invalid or missing database connection env (DATABASE_URL/POSTGRES_URL)",
    });
  }

  try {
    await db.connect();
    await ensureWholesaleAuthSchema(db);
    await ensurePromotionsSchema(db);

    const profile = await requirePromotionEditorProfile(req, res, db);
    if (!profile) return;

    const rateLimit = checkPromotionEditorMutationRateLimit(
      `${getRequestIp(req)}:${profile.id}`,
    );
    if (!rateLimit.allowed) {
      return res.status(429).json({
        error: "Too many requests",
        retryAfterMs: Math.max((rateLimit.resetAt || 0) - Date.now(), 0),
      });
    }

    const updated = await db.query(
      `UPDATE promotions
       SET sort_order = $1,
           updated_at = NOW(),
           updated_by_profile_id = $2
       WHERE id = $3`,
      [Math.trunc(sortOrder), profile.id, id],
    );

    if (!updated.rowCount) {
      return res.status(404).json({ error: "Promotion not found" });
    }

    return res.status(200).json({ success: true });
  } catch (error: any) {
    const message = String(error?.message || "");
    if (message === "Invalid JSON body") {
      return res.status(400).json({ error: message });
    }
    console.error("Promotions reorder error:", error);
    return res.status(500).json({ error: "Database error" });
  } finally {
    await db.end().catch(() => {});
  }
}

async function handleEditors(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!parseAdminAuthorization(req)) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const db = createDbClient();
  if (!db) {
    return res.status(500).json({
      error:
        "Invalid or missing database connection env (DATABASE_URL/POSTGRES_URL)",
    });
  }

  try {
    await db.connect();
    await ensureWholesaleAuthSchema(db);

    const { rows } = await db.query<EditorRow>(
      `SELECT
        id,
        name,
        surname,
        phone,
        email,
        is_approved,
        can_manage_promotions,
        password_hash,
        created_at,
        approved_at,
        verified_at
       FROM wholesale_profiles
       WHERE can_manage_promotions = TRUE
       ORDER BY email ASC`,
    );

    return res.status(200).json({
      items: rows.map((row) => ({
        id: row.id,
        name: row.name,
        surname: row.surname,
        phone: row.phone,
        email: row.email,
        isApproved: row.is_approved,
        canManagePromotions: row.can_manage_promotions,
        hasPassword: Boolean(row.password_hash),
        createdAt: row.created_at,
        approvedAt: row.approved_at,
        verifiedAt: row.verified_at,
        status: getAccountStatus({
          is_approved: row.is_approved,
          password_hash: row.password_hash,
        }),
      })),
    });
  } catch (error) {
    console.error("Promotions editors list error:", error);
    return res.status(500).json({ error: "Database error" });
  } finally {
    await db.end().catch(() => {});
  }
}

async function handleEditorsInvite(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!parseAdminAuthorization(req)) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const body = await parseJsonBody<InvitePayload>(req);
  const email = normalizeEmail(cleanText(body.email));
  if (!email || !isEmailValid(email)) {
    return res.status(400).json({ error: "Invalid email" });
  }

  const rateLimit = checkPromotionAllowlistMutationRateLimit(
    `${getRequestIp(req)}:${email}`,
  );
  if (!rateLimit.allowed) {
    return res.status(429).json({
      error: "Too many requests",
      retryAfterMs: Math.max((rateLimit.resetAt || 0) - Date.now(), 0),
    });
  }

  const db = createDbClient();
  if (!db) {
    return res.status(500).json({
      error:
        "Invalid or missing database connection env (DATABASE_URL/POSTGRES_URL)",
    });
  }

  try {
    await db.connect();
    await ensureWholesaleAuthSchema(db);

    let profile: ProfileRow | null = null;

    await db.query("BEGIN");
    const existing = await db.query<ProfileRow>(
      `SELECT id, name, surname, email, password_hash, is_approved, can_manage_promotions
       FROM wholesale_profiles
       WHERE email = $1
       LIMIT 1
       FOR UPDATE`,
      [email],
    );

    if (existing.rows.length > 0) {
      const updated = await db.query<ProfileRow>(
        `UPDATE wholesale_profiles
         SET is_approved = TRUE,
             can_manage_promotions = TRUE,
             approved_at = COALESCE(approved_at, NOW()),
             updated_at = NOW()
         WHERE id = $1
         RETURNING id, name, surname, email, password_hash, is_approved, can_manage_promotions`,
        [existing.rows[0].id],
      );
      profile = updated.rows[0];
    } else {
      const inserted = await db.query<ProfileRow>(
        `INSERT INTO wholesale_profiles
          (name, surname, phone, email, is_approved, can_manage_promotions, approved_at, user_agent)
         VALUES
          ($1,$2,$3,$4,TRUE,TRUE,NOW(),$5)
         RETURNING id, name, surname, email, password_hash, is_approved, can_manage_promotions`,
        ["Promo", "Editor", "N/D", email, req.headers["user-agent"] || null],
      );
      profile = inserted.rows[0];
    }

    await db.query("COMMIT");

    let setupEmailSent = false;
    let setupToken: string | null = null;
    let expiresAt: string | null = null;

    if (profile && !profile.password_hash) {
      const issued = await issuePasswordSetupToken(db, profile.id);
      expiresAt = issued.expiresAt;

      const delivery = await sendPasswordSetupEmail(req, {
        email: profile.email,
        fullName: `${profile.name} ${profile.surname}`.trim(),
        rawToken: issued.rawToken,
        expiresAt: issued.expiresAt,
      });

      setupEmailSent = delivery.sent;
      if (!delivery.sent && process.env.NODE_ENV !== "production") {
        setupToken = issued.rawToken;
      }
      if (!delivery.sent && process.env.NODE_ENV === "production") {
        return res.status(500).json({
          error:
            "Unable to send setup email. Configure RESEND_API_KEY and RESEND_FROM_EMAIL.",
        });
      }
    } else {
      setupEmailSent = true;
    }

    return res.status(200).json({
      success: true,
      email,
      setupEmailSent,
      setupToken,
      expiresAt,
    });
  } catch (error: any) {
    const message = String(error?.message || "");
    if (message === "Invalid JSON body") {
      return res.status(400).json({ error: message });
    }
    console.error("Promotions editors invite error:", error);
    await db.query("ROLLBACK").catch(() => {});
    return res.status(500).json({ error: "Database error" });
  } finally {
    await db.end().catch(() => {});
  }
}

async function handleEditorsRevoke(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!parseAdminAuthorization(req)) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const body = await parseJsonBody<RevokePayload>(req);
  const email = normalizeEmail(cleanText(body.email));
  if (!email || !isEmailValid(email)) {
    return res.status(400).json({ error: "Invalid email" });
  }

  const rateLimit = checkPromotionAllowlistMutationRateLimit(
    `${getRequestIp(req)}:${email}`,
  );
  if (!rateLimit.allowed) {
    return res.status(429).json({
      error: "Too many requests",
      retryAfterMs: Math.max((rateLimit.resetAt || 0) - Date.now(), 0),
    });
  }

  const db = createDbClient();
  if (!db) {
    return res.status(500).json({
      error:
        "Invalid or missing database connection env (DATABASE_URL/POSTGRES_URL)",
    });
  }

  try {
    await db.connect();
    await ensureWholesaleAuthSchema(db);

    const result = await db.query(
      `UPDATE wholesale_profiles
       SET can_manage_promotions = FALSE,
           updated_at = NOW()
       WHERE email = $1`,
      [email],
    );

    if (!result.rowCount) {
      return res.status(404).json({ error: "Account not found" });
    }

    return res.status(200).json({ success: true });
  } catch (error: any) {
    const message = String(error?.message || "");
    if (message === "Invalid JSON body") {
      return res.status(400).json({ error: message });
    }
    console.error("Promotions editors revoke error:", error);
    return res.status(500).json({ error: "Database error" });
  } finally {
    await db.end().catch(() => {});
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Cache-Control", "no-store");

  const action = getAction(req);
  if (!action) {
    return res.status(400).json({ error: "Missing action" });
  }

  if (action === "list") return handleList(req, res);
  if (action === "create") return handleCreate(req, res);
  if (action === "update") return handleUpdate(req, res);
  if (action === "delete") return handleDelete(req, res);
  if (action === "reorder") return handleReorder(req, res);
  if (action === "editors") return handleEditors(req, res);
  if (action === "editors-invite") return handleEditorsInvite(req, res);
  if (action === "editors-revoke") return handleEditorsRevoke(req, res);

  return res.status(404).json({ error: "Unknown action" });
}
