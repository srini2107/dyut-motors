//import pool from "../../../../lib/db"; // Adjust the path as necessary
import pool from "../../../../lib/db";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  const { category } = params;

  console.log("Requested category:", category); // Debug log

  if (!category) {
    return NextResponse.json({ error: "Category is required" }, { status: 400 });
  }

  try {
    const result = await pool.query(
      "SELECT * FROM products WHERE category = $1",
      [category]
    );

    return NextResponse.json(result.rows || []);
  } catch (error) {
    console.error("DB error:", error); // Check logs for details!
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
