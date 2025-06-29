import pool from "../../lib/db";
import bcrypt from "bcrypt";

export async function POST(req) {
  try {
    const body = await req.json();
    const { token, password } = body;

    if (!token || !password) {
      return Response.json({ error: "Token and password are required" }, { status: 400 });
    }

    // 1. Fetch token details
    const { rows: tokenRows } = await pool.query(
      "SELECT user_id, expires_at FROM password_reset_tokens WHERE token = $1",
      [token]
    );

    if (tokenRows.length === 0) {
      return Response.json({ error: "Invalid or expired token." }, { status: 400 });
    }

    const { user_id, expires_at } = tokenRows[0];

    if (new Date() > new Date(expires_at)) {
      return Response.json({ error: "Token has expired." }, { status: 400 });
    }

    // 2. Check user exists
    const { rows: userRows } = await pool.query("SELECT id FROM users WHERE id = $1", [user_id]);
    if (userRows.length === 0) {
      return Response.json({ error: "User not found." }, { status: 404 });
    }

    // 3. Hash and update password
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query("UPDATE users SET password = $1 WHERE id = $2", [hashedPassword, user_id]);

    // 4. Delete token
    await pool.query("DELETE FROM password_reset_tokens WHERE user_id = $1", [user_id]);

    return Response.json({ message: "Password updated successfully." }, { status: 200 });
  } catch (error) {
    console.error("Reset password error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
