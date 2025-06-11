import db from "./../../lib/db";

export async function POST(req) {
  const { mobile, otp } = await req.json();

  if (!mobile || !otp) {
    return Response.json({ error: "Missing input" }, { status: 400 });
  }

  try {
    const [rows] = await db.execute(
      `SELECT * FROM otps WHERE mobile = ? AND otp = ? AND created_at > NOW()`,
      [mobile, otp]
    );

    if (rows.length === 0) {
      return Response.json(
        { error: "Invalid or expired OTP" },
        { status: 401 }
      );
    }

    // Successful login
    return Response.json({ message: "Login successful" });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
