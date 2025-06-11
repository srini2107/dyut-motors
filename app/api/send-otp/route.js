import db from "./../../lib/db";

export async function POST(req) {
  const { mobile } = await req.json();

  if (!mobile || !/^\d{10}$/.test(mobile)) {
    return Response.json({ error: "Invalid mobile number" }, { status: 400 });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 min expiry

  try {
    await db.execute(
      `INSERT INTO otps (mobile, otp, created_at)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE otp = VALUES(otp), created_at = VALUES(created_at)`,
      [mobile, otp, expiresAt]
    );

    console.log(`OTP for ${mobile} is: ${otp}`);
    return Response.json({ message: "OTP sent successfully" });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
