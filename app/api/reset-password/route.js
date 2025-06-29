import nodemailer from "nodemailer";
import crypto from "crypto";
import pool from "../../lib/db";

export async function POST(req) {
  try {
    const { email } = await req.json();

    if (!email) {
      return Response.json({ error: "Email is required" }, { status: 400 });
    }

    // 1. Find the user
    const { rows: users } = await pool.query("SELECT id FROM users WHERE email = $1", [email]);
    if (users.length === 0) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    const userId = users[0].id;

    // 2. Generate token + expiry
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 1000 * 60 * 30); // 30 minutes

    // 3. Remove any existing tokens for this user (optional but recommended)
    await pool.query("DELETE FROM password_reset_tokens WHERE user_id = $1", [userId]);

    // 4. Insert the new token
    await pool.query(
      "INSERT INTO password_reset_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)",
      [userId, token, expiresAt]
    );

    // 5. Create reset link
    const resetLink = `http://localhost:3000/reset-password?token=${token}`; // or use env var

    // 6. Set up mailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    // 7. Send email
    const mailOptions = {
      from: `"Dyut Motors Support" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "Reset your password",
      html: `
        <p>You requested a password reset.</p>
        <p><a href="${resetLink}">Click here to reset your password</a></p>
        <p>This link will expire in 30 minutes.</p>
        <p>If you didn’t request this, ignore this email.</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    return Response.json({ message: "Reset email sent successfully." }, { status: 200 });
  } catch (error) {
    console.error("Reset email error:", error);
    return Response.json({ error: "Failed to process request" }, { status: 500 });
  }
}
