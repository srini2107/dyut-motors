// /app/api/create-order/route.js
import Razorpay from "razorpay";
import { NextResponse } from "next/server";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(req) {
  const { amount, currency = "INR", receipt } = await req.json();

  const options = {
    amount: amount * 100, // in paise
    currency,
    receipt,
    payment_capture: 1,
  };

  try {
    const order = await razorpay.orders.create(options);
    return NextResponse.json(order);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
