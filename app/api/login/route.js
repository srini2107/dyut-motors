import db from "../../lib/db";
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

  // Query the database for the user by username or email
  const [user] = await db.query(
    "SELECT * FROM users WHERE username = ? OR email = ?",
    [userOrEmail, userOrEmail]
  );
  console.log("Queried user:", user);

  // Check if the user exists
  if (!user || user.length === 0) {
    return NextResponse.json(
      { error: "Invalid username/email or password." },
      { status: 401 }
    );
  }

  // Compare the provided password with the hashed password in the database
  console.log("Stored password:", user[0].password);
  console.log("Entered password:", password);
  const isMatch = await bcrypt.compare(password, user[0].password);

  if (!isMatch) {
    return NextResponse.json(
      { error: "Invalid username/email or password." },
      { status: 401 }
    );
  }

  // Return success response with user details
  return NextResponse.json({
    success: true,
    user: {
      id: user[0].id,
      username: user[0].username,
      email: user[0].email,
    },
  });
}
