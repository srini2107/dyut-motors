import { NextResponse } from "next/server";
import pool from "../../../lib/db";

export async function GET(req, { params }) {
  const { id } = params;

  try {
    const orderRes = await pool.query(
      `SELECT o.*, a.full_name, a.address_line1, a.city, a.state, a.postal_code
       FROM orders o
       JOIN addresses a ON o.address_id = a.id
       WHERE o.id = $1`,
      [id]
    );

    const itemsRes = await pool.query(
      `SELECT oi.*, p.name, p.image
       FROM order_items oi
       LEFT JOIN products p ON oi.product_id = p.id
       WHERE oi.order_id = $1`,
      [id]
    );

    if (!orderRes.rows.length) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    console.log("Invoice fetched:", {
      order: orderRes.rows[0],
      items: itemsRes.rows,
    });

    return NextResponse.json({
      order: orderRes.rows[0],
      items: itemsRes.rows,
    });
  } catch (err) {
    console.error("Invoice API error:", err);
    return NextResponse.json(
      { error: "Failed to fetch invoice" },
      { status: 500 }
    );
  }
}
