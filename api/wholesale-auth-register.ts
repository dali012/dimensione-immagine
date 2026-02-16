import type { VercelRequest, VercelResponse } from "@vercel/node";
import {
  cleanText,
  createDbClient,
  ensureWholesaleAuthSchema,
  getAccountStatus,
  getRequestIp,
  isEmailValid,
  normalizeEmail,
  normalizePhone,
  sendWholesaleRegistrationNotification,
} from "../lib/wholesale-auth.js";

type RegisterPayload = {
  name?: string;
  surname?: string;
  phone?: string;
  email?: string;
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const body = (req.body || {}) as RegisterPayload;
  const name = cleanText(body.name);
  const surname = cleanText(body.surname);
  const phone = normalizePhone(cleanText(body.phone));
  const email = normalizeEmail(cleanText(body.email));

  if (!name || name.length < 2 || name.length > 80) {
    return res.status(400).json({ error: "Invalid name" });
  }
  if (!surname || surname.length < 2 || surname.length > 80) {
    return res.status(400).json({ error: "Invalid surname" });
  }
  if (!phone || phone.length < 6 || phone.length > 40) {
    return res.status(400).json({ error: "Invalid phone" });
  }
  if (!email || email.length > 160 || !isEmailValid(email)) {
    return res.status(400).json({ error: "Invalid email" });
  }

  const db = createDbClient();
  if (!db) {
    return res.status(500).json({ error: "Invalid or missing database connection env (DATABASE_URL/POSTGRES_URL)" });
  }

  try {
    await db.connect();
    await ensureWholesaleAuthSchema(db);

    const existing = await db.query<{
      is_approved: boolean;
      password_hash: string | null;
    }>(
      `SELECT is_approved, password_hash
       FROM wholesale_profiles
       WHERE email = $1
       LIMIT 1`,
      [email],
    );

    if (existing.rows.length > 0) {
      return res.status(200).json({
        success: true,
        status: getAccountStatus(existing.rows[0]),
      });
    }

    await db.query(
      `INSERT INTO wholesale_profiles
        (name, surname, phone, email, ip, user_agent)
       VALUES
        ($1,$2,$3,$4,$5,$6)`,
      [
        name,
        surname,
        phone,
        email,
        getRequestIp(req),
        req.headers["user-agent"] || null,
      ],
    );
  } catch (error) {
    console.error("Wholesale register error:", error);
    await db.end().catch(() => {});
    return res.status(500).json({ error: "Database error" });
  } finally {
    await db.end().catch(() => {});
  }

  // Optional admin notification for new B2B registrations.
  sendWholesaleRegistrationNotification({
    name,
    surname,
    phone,
    email,
  }).catch(() => {});

  return res.status(200).json({
    success: true,
    status: "pending_approval",
  });
}
