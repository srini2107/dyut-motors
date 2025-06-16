import pool from "../../../../lib/db"; // Adjust the path as necessary



export async function GET(req, context) {
  const { category } = await context.params;

  try {
    const result = await pool.query(
      "SELECT * FROM products WHERE category = $1",
      [category]
    );

    return new Response(JSON.stringify(result.rows), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("DB Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
