import pool from "../../lib/db";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { SignJWT } from "jose"; // Instead of jsonwebtoken
import { cookies } from "next/headers";

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

    // Create token using jose
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);

    const token = await new SignJWT({
      id: user.id,
      name: user.name,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("1d")
      .sign(secret);

    // Set cookie using NextResponse
    const response = NextResponse.json({
      success: true,
      name: user.name,
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
