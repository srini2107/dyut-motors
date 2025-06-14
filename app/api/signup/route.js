import db from "../../lib/db"; // Adjust the path as necessary
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function POST(req) {
  console.log("API route hit"); // Debugging
  const { name, username, email, password, confirmPassword } = await req.json();
  console.log("Request body:", {
    name,
    username,
    email,
    password,
    confirmPassword,
  }); // Debugging

  if (!name || !username || !email || !password || !confirmPassword) {
    console.log("Validation failed: Missing fields"); // Debugging
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

  // Check if username or email already exists
  const [existing] = await db.query(
    "SELECT * FROM users WHERE username = ? OR email = ?",
    [username, email]
  );
  if (existing && existing.length > 0) {
    return NextResponse.json(
      { error: "Username or email already exists." },
      { status: 409 }
    );
  }

  // Hash password before saving
  const hashedPassword = await bcrypt.hash(password, 10);
  await db.execute(
    "INSERT INTO users (name, username, email, password) VALUES (?, ?, ?, ?)",
    [name, username, email, hashedPassword]
  );

  return NextResponse.json({
    success: true,
    message: "Signup successful!",
    userName: name, // Return the user's name
  });
}
