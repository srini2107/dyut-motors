import { NextResponse } from "next/server";
import { verify } from "jsonwebtoken";
import { cookies } from "next/headers"; // ✅ Correct import
import pool from "../../lib/db";

// GET: Fetch all cards for the authenticated user
export async function GET(req) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const decoded = verify(token, process.env.JWT_SECRET);
  const userId = decoded.id;

  const result = await pool.query(
    `SELECT id, cardholder_name, last4, expiry_month, expiry_year, brand, created_at 
     FROM cards 
     WHERE user_id = $1 
     ORDER BY created_at DESC`,
    [userId]
  );

  return NextResponse.json(result.rows);
}

// POST: Save a new card
export async function POST(req) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const decoded = verify(token, process.env.JWT_SECRET);
  const userId = decoded.id;

  const body = await req.json();
  const {
    cardholder_name,
    card_number,
    expiry_month,
    expiry_year,
    brand,
    bank_name
  } = body;
  
  if (!cardholder_name || !card_number || !expiry_month || !expiry_year || !bank_name) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }
  
  const last4 = card_number.slice(-4);
  
  const result = await pool.query(
    `INSERT INTO cards 
     (user_id, cardholder_name, last4, expiry_month, expiry_year, brand, bank_name) 
     VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    [userId, cardholder_name, last4, expiry_month, expiry_year, brand, bank_name]
  );
  
  return NextResponse.json(result.rows[0]);
}

// DELETE: Remove a card by ID (only if it belongs to the user)
export async function DELETE(req) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const decoded = verify(token, process.env.JWT_SECRET);
  const userId = decoded.id;

  const { searchParams } = new URL(req.url);
  const cardId = searchParams.get("id");

  if (!cardId) {
    return NextResponse.json({ error: "Missing card ID" }, { status: 400 });
  }

  const result = await pool.query(
    `DELETE FROM cards 
     WHERE id = $1 AND user_id = $2 
     RETURNING id`,
    [cardId, userId]
  );

  if (result.rowCount === 0) {
    return NextResponse.json(
      { error: "Card not found or unauthorized" },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true });
}
