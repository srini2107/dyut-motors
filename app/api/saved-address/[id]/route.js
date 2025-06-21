import pool from "../../../lib/db";
import { cookies } from "next/headers";
import { verify } from "jsonwebtoken";
import { NextResponse } from "next/server";

// DELETE /api/saved-address/:id
export async function DELETE(req, context) {
  const params = await context.params;
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded = verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const addressId = params.id;

    const result = await pool.query(
      "DELETE FROM addresses WHERE id = $1 AND user_id = $2 RETURNING id",
      [addressId, userId]
    );

    if (result.rowCount === 0) {
      return NextResponse.json({ error: "Address not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting address:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT /api/saved-address/:id
export async function PUT(req, context) {
  const { id } = await context.params;

  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const {
      type,
      full_name,
      phone,
      address_line1,
      address_line2,
      city,
      state,
      postal_code,
      country,
    } = await req.json();

    const result = await pool.query(
      `UPDATE addresses 
       SET full_name = $1,
           phone = $2,
           address_line1 = $3,
           address_line2 = $4,
           city = $5,
           state = $6,
           postal_code = $7,
           country = $8
       WHERE id = $9 AND user_id = $10 RETURNING *`,
      [
        full_name,
        phone,
        address_line1,
        address_line2,
        city,
        state,
        postal_code,
        country,
        id, // ✅ ID from URL
        userId, // ✅ Authenticated user
      ]
    );

    if (result.rowCount === 0) {
      return NextResponse.json(
        { error: "Address not found or unauthorized" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error("Error updating address:", error);
    return NextResponse.json(
      { error: "Failed to update address" },
      { status: 500 }
    );
  }
}
