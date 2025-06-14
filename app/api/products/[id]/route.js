import db from "../../../lib/db"; // Adjusted path based on project structure

export async function GET(req, context) {
  const { params } = await context; // Await params before accessing
  const { id } = params;

  try {
    const [rows] = await db.query(
      'SELECT * FROM products WHERE id = ?',
      [id]
    );

    if (rows.length === 0) {
      return new Response(JSON.stringify({ error: 'Product not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const product = rows[0];
    product.image = product.image.startsWith("/images/")
      ? product.image
      : "/images/default.png"; // Sanitize image path

    console.log("Fetched product:", product); // Debugging log

    return new Response(JSON.stringify(product), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Failed to fetch product' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
