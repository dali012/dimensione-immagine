import type { VercelRequest, VercelResponse } from "@vercel/node";
import {
  cleanText,
  createDbClient,
  ensureWholesaleAuthSchema,
  getAccountStatus,
  parseAdminAuthorization,
} from "../lib/wholesale-auth.js";

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

function toInt(value: string | number) {
  if (typeof value === "number") return value;
  return Number.parseInt(value, 10) || 0;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Cache-Control", "no-store");

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

  const statusRaw = cleanText(req.query.status).toLowerCase();
  const statusFilter =
    statusRaw === "approved" || statusRaw === "pending" || statusRaw === "all"
      ? statusRaw
      : "pending";
  const queryText = cleanText(req.query.q);
  const limitRaw = Number.parseInt(cleanText(req.query.limit), 10);
  const limit =
    Number.isFinite(limitRaw) && limitRaw > 0
      ? Math.min(limitRaw, 250)
      : 100;

  try {
    await db.connect();
    await ensureWholesaleAuthSchema(db);

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

    params.push(limit);
    const limitIdx = params.length;
    const whereSql = whereClauses.length
      ? `WHERE ${whereClauses.join(" AND ")}`
      : "";

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
       LIMIT $${limitIdx}`,
      params,
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
    });
  } catch (error) {
    console.error("Wholesale list error:", error);
    await db.end().catch(() => {});
    return res.status(500).json({ error: "Database error" });
  } finally {
    await db.end().catch(() => {});
  }
}
