// import db from "./../../lib/db";
// import { NextResponse } from "next/server";

// export async function POST(req) {
//   const { mobile, email, otp } = await req.json();
//   let result;
//   if (mobile) {
//     [result] = await db.query(
//       "SELECT * FROM otps WHERE mobile = ? AND otp = ? AND created_at > NOW() - INTERVAL 5 MINUTE",
//       [mobile, otp]
//     );
//   } else if (email) {
//     [result] = await db.query(
//       "SELECT * FROM otps WHERE email = ? AND otp = ? AND created_at > NOW() - INTERVAL 5 MINUTE",
//       [email, otp]
//     );
//   } else {
//     return NextResponse.json({ success: false, error: "Mobile or email required." }, { status: 400 });
//   }

//   if (result && result.length > 0) {
//     return NextResponse.json({ success: true });
//   } else {
//     return NextResponse.json({ success: false, error: "Invalid or expired OTP." }, { status: 401 });
//   }
// }