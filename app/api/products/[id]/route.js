import pool from "../../../lib/db";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  const { id } = params;

  try {
    const result = await pool.query(
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
      WHERE p.id = $1
      `,
      [id]
    );

    const rows = result.rows;

    if (rows.length === 0) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error("Error fetching product with specifications:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
