

// export async function POST(req) {
//   const { mobile } = await req.json();

//   if (!mobile || !/^\d{10}$/.test(mobile)) {
//     return Response.json({ error: "Invalid mobile number" }, { status: 400 });
//   }

//   const otp = Math.floor(100000 + Math.random() * 900000).toString();
//   const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 min expiry

//   try {
//     await db.execute(
//       `INSERT INTO otps (mobile, otp, created_at)
//        VALUES (?, ?, ?)
//        ON DUPLICATE KEY UPDATE otp = VALUES(otp), created_at = VALUES(created_at)`,
//       [mobile, otp, expiresAt]
//     );

//     console.log(`OTP for ${mobile} is: ${otp}`);
//     return Response.json({ message: "OTP sent successfully" });
//   } catch (err) {
//     console.error(err);
//     return Response.json({ error: "Server error" }, { status: 500 });
//   }
// }

import db from "./../../lib/db";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { mobile } = await req.json();
  const otp = Math.floor(100000 + Math.random() * 900000);
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 min expiry

  const authKey = "455840AkOSFNdb684aae7dP1";


  const url = `https://api.msg91.com/api/v5/otp?template_id=684abd11d6fc051fb110bbc3&mobile=91${mobile}&authkey=${authKey}&otp=${otp}`;

  try {
    const res = await fetch(url, { method: "GET" });
    const data = await res.json();
    console.log("MSG91 response:", data);

    await db.execute(
      `INSERT INTO otps (mobile, otp, created_at)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE otp = VALUES(otp), created_at = VALUES(created_at)`,
      [mobile, otp, expiresAt]
    );


    console.log(`OTP for ${mobile} is: ${otp}`);

    if (data.type === "success") {
      return NextResponse.json({ success: true, message: "OTP sent!" });
    } else {
      return NextResponse.json({ success: false, error: data.message || "Failed to send OTP." }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: "Network error." }, { status: 500 });
  }
}
