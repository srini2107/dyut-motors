import pool from "../../lib/db"; // Adjust path if needed
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function POST(req) {
  console.log("API route hit");

  const { name, username, email, password, confirmPassword } = await req.json();
  console.log("Request body:", {
    name,
    username,
    email,
    password,
    confirmPassword,
  });

  // Validation
  if (!name || !username || !email || !password || !confirmPassword) {
    return NextResponse.json(
      { error: "All fields are required." },
      { status: 400 }
    );
  }

  if (password !== confirmPassword) {
    return NextResponse.json(
      { error: "Passwords do not match." },
      { status: 400 }
    );
  }

  try {
    // Check if user already exists (PostgreSQL syntax)
    const result = await pool.query(
      "SELECT * FROM users WHERE username = $1 OR email = $2",
      [username, email]
    );

    if (result.rows.length > 0) {
      return NextResponse.json(
        { error: "Username or email already exists." },
        { status: 409 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    await pool.query(
      "INSERT INTO users (name, username, email, password) VALUES ($1, $2, $3, $4)",
      [name, username, email, hashedPassword]
    );

    return NextResponse.json({
      success: true,
      message: "Signup successful!",
      userName: name,
    });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
