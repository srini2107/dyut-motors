// app/api/verify-email/route.js
import pool from "../../lib/db"; // Adjust path if needed

export async function POST(req) {
  const { token } = await req.json();

  if (!token) {
    return Response.json({ error: "Token is required" }, { status: 400 });
  }

  const { rows } = await pool.query(
    "SELECT user_id, expires_at FROM email_verification_tokens WHERE token = $1",
    [token]
  );

  if (rows.length === 0) {
    return Response.json({ error: "Invalid or expired token" }, { status: 400 });
  }

  const { user_id, expires_at } = rows[0];

  if (new Date() > new Date(expires_at)) {
    return Response.json({ error: "Token has expired" }, { status: 400 });
  }

  await pool.query("UPDATE users SET is_verified = true WHERE id = $1", [user_id]);
  await pool.query("DELETE FROM email_verification_tokens WHERE user_id = $1", [user_id]);

  return Response.json({ message: "Email verified successfully" }, { status: 200 });
}
