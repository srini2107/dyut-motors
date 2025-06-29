// File: app/api/place-order/route.js

import { NextResponse } from "next/server";
import { verify } from "jsonwebtoken";
import { cookies } from "next/headers";
import pool from "../../lib/db";

export async function POST(req) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = verify(token, process.env.JWT_SECRET);
    const user_id = decoded.id;

    const {
      address_id,
      payment_method,
      items,
      total_amount,
    } = await req.json();

    // ✅ Validation check
    if (
      !address_id ||
      !payment_method ||               // ✅ check added
      !Array.isArray(items) ||
      items.length === 0 ||
      !total_amount
    ) {
      return NextResponse.json(
        { error: "Missing order data or payment method" },
        { status: 400 }
      );
    }

    // 1. Insert into orders table
    const orderResult = await pool.query(
      `INSERT INTO orders (user_id, address_id, total_amount, payment_method)
       VALUES ($1, $2, $3, $4)
       RETURNING id`,
      [user_id, address_id, total_amount, payment_method]
    );

    const orderId = orderResult.rows[0].id;

    // 2. Insert into order_items
    const insertItems = items.map((item) =>
      pool.query(
        `INSERT INTO order_items (order_id, product_id, quantity, price)
         VALUES ($1, $2, $3, $4)`,
        [orderId, item.product_id, item.quantity, item.price]
      )
    );

    await Promise.all(insertItems);

    return NextResponse.json({ success: true, orderId });
  } catch (error) {
    console.error("Error placing order:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
