import pool from "../../lib/db";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"; // Make sure to import like this

export async function POST(req) {
  const body = await req.json();
  const { userOrEmail, password } = body;

  if (!userOrEmail || !password) {
    return NextResponse.json(
      { error: "Username/email and password are required." },
      { status: 400 }
    );
  }

  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE username = $1 OR email = $2",
      [userOrEmail, userOrEmail]
    );

    const user = result.rows[0];

    if (!user) {
      return NextResponse.json(
        { error: "Invalid username/email or password." },
        { status: 401 }
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return NextResponse.json(
        { error: "Invalid username/email or password." },
        { status: 401 }
      );
    }

    const token = jwt.sign(
      { id: user.id, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // ✅ Return user.name and set cookie
    const response = NextResponse.json({
      success: true,
      name: user.name, // 👈 return this for UI
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24, // 1 day
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
