//import pool from "../../../lib/db"; // Adjust path if needed
import db from "../../../lib/db"; // Make sure this exports a MySQL pool/connection
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  const { id } = await params;

  try {
    const [rows] = await db.query(
      `
      SELECT 
        p.*,
        s.thrust_limitation,
        s.optimum_rpm,
        s.dimension,
        s.surface_treatment,
        s.temperature,
        s.material
      FROM products p
      LEFT JOIN specifications s ON p.id = s.product_id
      WHERE p.id = ?
      `,
      [id]
    );

    if (rows.length === 0) {
      return Response.json({ message: "Product not found" }, { status: 404 });
    }

    return Response.json(rows[0]);
  } catch (error) {
    console.error("Error fetching product with specifications:", error);
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}
