// import db from "./../../lib/db";
// import { NextResponse } from "next/server";
// import nodemailer from "nodemailer"; // npm install nodemailer
// import sgMail from "@sendgrid/mail";

// export async function POST(req) {
//   const body = await req.json();
//   const otp = Math.floor(100000 + Math.random() * 900000);
//   const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 min expiry

//   if (body.mobile) {
//     // --- Mobile OTP logic (MSG91) ---
//     const authKey = "YOUR_MSG91_AUTH_KEY";
//     const url = `https://api.msg91.com/api/v5/otp?template_id=YOUR_TEMPLATE_ID&mobile=91${body.mobile}&authkey=${authKey}&otp=${otp}`;
//     try {
//       const res = await fetch(url, { method: "POST" });
//       const data = await res.json();
//       await db.execute(
//         `INSERT INTO otps (mobile, otp, created_at) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE otp = VALUES(otp), created_at = VALUES(created_at)`,
//         [body.mobile, otp, expiresAt]
//       );
//       if (data.type === "success") {
//         return NextResponse.json({ success: true, message: "OTP sent!" });
//       } else {
//         return NextResponse.json({ success: false, error: data.message || "Failed to send OTP." }, { status: 500 });
//       }
//     } catch (error) {
//       return NextResponse.json({ success: false, error: "Network error." }, { status: 500 });
//     }
//   } else if (body.email) {
//     // --- Email OTP logic ---
//     sgMail.setApiKey(process.env.SENDGRID_API_KEY);
//     const msg = {
//       to: body.email,
//       from: "your_verified_sender@example.com", // must be a verified sender in SendGrid
//       subject: "Your OTP Code",
//       text: `Your OTP code is ${otp}`,
//       html: `<strong>Your OTP code is ${otp}</strong>`,
//     };

//     try {
//       await sgMail.send(msg);
//       await db.execute(
//         `INSERT INTO otps (email, otp, created_at) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE otp = VALUES(otp), created_at = VALUES(created_at)`,
//         [body.email, otp, expiresAt]
//       );
//       return NextResponse.json({ success: true, message: "OTP sent to email!" });
//     } catch (error) {
//       console.error(error);
//       return NextResponse.json({ success: false, error: "Failed to send email OTP." }, { status: 500 });
//     }
//   } else {
//     return NextResponse.json({ success: false, error: "Mobile or email required." }, { status: 400 });
//   }
// }