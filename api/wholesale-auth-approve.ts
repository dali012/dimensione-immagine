import type { VercelRequest, VercelResponse } from "@vercel/node";
import {
  cleanText,
  createDbClient,
  ensureWholesaleAuthSchema,
  getAccountStatus,
  isEmailValid,
  issuePasswordSetupToken,
  normalizeEmail,
  parseAdminAuthorization,
  sendPasswordSetupEmail,
} from "../lib/wholesale-auth.js";

type ApprovePayload = {
  email?: string;
  approved?: boolean;
  sendSetupLink?: boolean;
};

type ProfileRow = {
  id: number;
  name: string;
  surname: string;
  email: string;
  is_approved: boolean;
  password_hash: string | null;
};

type ListItemRow = {
  id: number;
  name: string;
  surname: string;
  phone: string;
  email: string;
  is_approved: boolean;
  password_hash: string | null;
  created_at: string;
  approved_at: string | null;
  verified_at: string | null;
};

type CountRow = {
  pending_count: string | number;
  approved_count: string | number;
  setup_required_count: string | number;
};

type TotalRow = {
  total_count: string | number;
};

function toInt(value: string | number) {
  if (typeof value === "number") return value;
  return Number.parseInt(value, 10) || 0;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "GET" && req.method !== "POST") {
    res.setHeader("Allow", "GET, POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!parseAdminAuthorization(req)) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const db = createDbClient();
  if (!db) {
    return res.status(500).json({
      error: "Invalid or missing database connection env (DATABASE_URL/POSTGRES_URL)",
    });
  }

  try {
    await db.connect();
    await ensureWholesaleAuthSchema(db);

    if (req.method === "GET") {
      const statusRaw = cleanText(req.query.status).toLowerCase();
      const statusFilter =
        statusRaw === "approved" ||
        statusRaw === "pending" ||
        statusRaw === "all"
          ? statusRaw
          : "pending";
      const queryText = cleanText(req.query.q);
      const pageRaw = Number.parseInt(cleanText(req.query.page), 10);
      const page = Number.isFinite(pageRaw) && pageRaw > 0 ? pageRaw : 1;
      const pageSizeRaw = Number.parseInt(
        cleanText(req.query.pageSize || req.query.limit),
        10,
      );
      const pageSize =
        Number.isFinite(pageSizeRaw) && pageSizeRaw > 0
          ? Math.min(pageSizeRaw, 100)
          : 20;

      const whereClauses: string[] = [];
      const params: Array<string | number> = [];

      if (statusFilter === "pending") {
        whereClauses.push("is_approved = FALSE");
      } else if (statusFilter === "approved") {
        whereClauses.push("is_approved = TRUE");
      }

      if (queryText) {
        params.push(`%${queryText}%`);
        const idx = params.length;
        whereClauses.push(
          `(email ILIKE $${idx} OR name ILIKE $${idx} OR surname ILIKE $${idx} OR phone ILIKE $${idx})`,
        );
      }

      const whereSql = whereClauses.length
        ? `WHERE ${whereClauses.join(" AND ")}`
        : "";

      const totalResult = await db.query<TotalRow>(
        `SELECT COUNT(*) AS total_count
         FROM wholesale_profiles
         ${whereSql}`,
        params,
      );

      const totalItems = toInt(totalResult.rows[0]?.total_count || 0);
      const totalPages = totalItems > 0 ? Math.ceil(totalItems / pageSize) : 0;
      const safePage = totalPages > 0 ? Math.min(page, totalPages) : 1;
      const offset = (safePage - 1) * pageSize;

      const listParams = [...params, pageSize, offset];
      const limitIdx = params.length + 1;
      const offsetIdx = params.length + 2;

      const { rows } = await db.query<ListItemRow>(
        `SELECT
          id,
          name,
          surname,
          phone,
          email,
          is_approved,
          password_hash,
          created_at,
          approved_at,
          verified_at
         FROM wholesale_profiles
         ${whereSql}
         ORDER BY
           CASE WHEN is_approved THEN 1 ELSE 0 END ASC,
           created_at DESC
         LIMIT $${limitIdx}
         OFFSET $${offsetIdx}`,
        listParams,
      );

      const countResult = await db.query<CountRow>(
        `SELECT
          COUNT(*) FILTER (WHERE is_approved = FALSE) AS pending_count,
          COUNT(*) FILTER (WHERE is_approved = TRUE) AS approved_count,
          COUNT(*) FILTER (WHERE is_approved = TRUE AND password_hash IS NULL) AS setup_required_count
         FROM wholesale_profiles`,
      );

      const counts = countResult.rows[0];

      return res.status(200).json({
        items: rows.map((row) => ({
          id: row.id,
          name: row.name,
          surname: row.surname,
          phone: row.phone,
          email: row.email,
          createdAt: row.created_at,
          approvedAt: row.approved_at,
          verifiedAt: row.verified_at,
          isApproved: row.is_approved,
          hasPassword: Boolean(row.password_hash),
          status: getAccountStatus({
            is_approved: row.is_approved,
            password_hash: row.password_hash,
          }),
        })),
        counts: {
          pending: toInt(counts?.pending_count || 0),
          approved: toInt(counts?.approved_count || 0),
          setupRequired: toInt(counts?.setup_required_count || 0),
        },
        pagination: {
          page: safePage,
          pageSize,
          totalItems,
          totalPages,
          hasNextPage: totalPages > 0 && safePage < totalPages,
          hasPrevPage: totalPages > 0 && safePage > 1,
        },
      });
    }

    const body = (req.body || {}) as ApprovePayload;
    const email = normalizeEmail(cleanText(body.email));
    const approved = body.approved !== false;
    const sendSetupLink = Boolean(body.sendSetupLink);

    if (!email || !isEmailValid(email)) {
      return res.status(400).json({ error: "Invalid email" });
    }

    const updated = await db.query<ProfileRow>(
      `UPDATE wholesale_profiles
       SET is_approved = $1,
           approved_at = CASE WHEN $1 THEN COALESCE(approved_at, NOW()) ELSE NULL END,
           updated_at = NOW()
       WHERE email = $2
       RETURNING id, name, surname, email, is_approved, password_hash`,
      [approved, email],
    );

    if (!updated.rows.length) {
      return res.status(404).json({ error: "Account not found" });
    }

    const profile = updated.rows[0];
    let setupEmailSent = false;
    let setupToken: string | null = null;
    let expiresAt: string | null = null;

    if (approved && sendSetupLink && !profile.password_hash) {
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
    }

    return res.status(200).json({
      success: true,
      status: getAccountStatus(profile),
      approved: profile.is_approved,
      setupEmailSent,
      setupToken,
      expiresAt,
    });
  } catch (error) {
    console.error("Wholesale admin error:", error);
    await db.end().catch(() => {});
    return res.status(500).json({ error: "Database error" });
  } finally {
    await db.end().catch(() => {});
  }
}
