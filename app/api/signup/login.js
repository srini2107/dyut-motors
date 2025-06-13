import db from "@/app/lib/db"; // Adjust path to your db connection
import { NextResponse } from "next/server";

export async function POST(req) {
  const { name, username, email, password, confirmPassword } = await req.json();

  if (!name || !username || !email || !password || !confirmPassword) {
    return NextResponse.json({ error: "All fields are required." }, { status: 400 });
  }
  if (password !== confirmPassword) {
    return NextResponse.json({ error: "Passwords do not match." }, { status: 400 });
  }

  // Check if username or email already exists
  const [existing] = await db.query(
    "SELECT * FROM users WHERE username = ? OR email = ?",
    [username, email]
  );
  if (existing && existing.length > 0) {
    return NextResponse.json({ error: "Username or email already exists." }, { status: 409 });
  }

  // For production: hash the password before storing!
  await db.execute(
    "INSERT INTO users (name, username, email, password) VALUES (?, ?, ?, ?)",
    [name, username, email, password]
  );

  return NextResponse.json({ success: true, message: "Signup successful!" });
}