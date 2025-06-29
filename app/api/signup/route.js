import pool from "../../lib/db";
import bcrypt from "bcrypt";
import crypto from "crypto";
import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    const { name, username, email, password } = await req.json(); // ✅ added username

    // Check if email already exists
    const emailCheck = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (emailCheck.rows.length > 0) {
      return Response.json({ error: "Email is already registered" }, { status: 400 });
    }

    // Check if username already exists
    const usernameCheck = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
    if (usernameCheck.rows.length > 0) {
      return Response.json({ error: "Username is already taken" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // 1. Create user with is_verified = false
    const { rows } = await pool.query(
      "INSERT INTO users (name, username, email, password, is_verified) VALUES ($1, $2, $3, $4, $5) RETURNING id",
      [name, username, email, hashedPassword, false]
    );

    const userId = rows[0].id;

    // 2. Generate verification token
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 1000 * 60 * 30); // 30 minutes

    await pool.query(
      "INSERT INTO email_verification_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)",
      [userId, token, expiresAt]
    );

    // 3. Send verification email
    const verificationLink = `http://localhost:3000/verify-email?token=${token}`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Dyut Motors" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "Verify your email",
      html: `
        <p>Hello ${name},</p>
        <p>Thank you for signing up!</p>
        <p><a href="${verificationLink}">Click here to verify your email</a></p>
        <p>This link will expire in 30 minutes.</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    return Response.json(
      { message: "Signup successful. Please check your email to verify your account." },
      { status: 200 }
    );
  } catch (err) {
    console.error("Signup error:", err);
    return Response.json({ error: "Something went wrong during signup" }, { status: 500 });
  }
}
