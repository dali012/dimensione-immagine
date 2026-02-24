import type { VercelRequest, VercelResponse } from "@vercel/node";
import {
  createDbClient,
  ensureWholesaleAuthSchema,
  getAccountStatus,
  parseAdminAuthorization,
} from "../lib/wholesale-auth.js";

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

