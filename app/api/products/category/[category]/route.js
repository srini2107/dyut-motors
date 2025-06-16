//import pool from "../../../../lib/db"; // Adjust the path as necessary
import db from "../../../../lib/db"; // Adjust the path as necessary


import { NextResponse } from "next/server";

export async function GET(req, {params}) {
  const {category} = await params;

  try {
    const [rows] = await db.query(
      "SELECT * FROM products WHERE category = ?",
      [category]
    );

    return NextResponse.json(rows || []);
  } catch (error) {
    console.error("DB error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
