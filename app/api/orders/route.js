// File: app/api/orders/route.js

import { cookies } from "next/headers";
import { verify } from "jsonwebtoken";
import { NextResponse } from "next/server";
import pool from "../../lib/db"; // Adjust path to your db.js

export async function GET(req) {
  try {
    const cookieStore = await cookies(); // ✅ Await this
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const result = await pool.query(
      `SELECT id, status, total_amount, created_at FROM orders WHERE user_id = $1 ORDER BY created_at DESC`,
      [userId]
    );

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
