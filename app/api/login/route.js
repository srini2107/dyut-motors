import pool from "../../lib/db";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function POST(req) {
  const body = await req.json();
  console.log("Received login payload:", body);
  const { userOrEmail, password } = body;

  // Validate input
  if (!userOrEmail || !password) {
    return NextResponse.json(
      { error: "Username/email and password are required." },
      { status: 400 }
    );
  }

  try {
    // PostgreSQL-style query using $1, $2
    const result = await pool.query(
      "SELECT * FROM users WHERE username = $1 OR email = $2",
      [userOrEmail, userOrEmail]
    );

    const user = result.rows[0];
    console.log("Queried user:", user);

    if (!user) {
      return NextResponse.json(
        { error: "Invalid username/email or password." },
        { status: 401 }
      );
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return NextResponse.json(
        { error: "Invalid username/email or password." },
        { status: 401 }
      );
    }

    // Success response
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
