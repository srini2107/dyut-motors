import db from "../../../../lib/db"; // Adjust the path as necessary

export async function GET(req, { params }) {
  const { category } = params; // Access params directly

  try {
    const [rows] = await db.query(
      'SELECT * FROM products WHERE category = ?',
      [category]
    );

    // Sanitize image paths in the response
    const products = rows.map(product => ({
      ...product,
      image: product.image.startsWith("/images/")
        ? product.image
        : "/images/default.png"
    }));

    console.log("Fetched products:", products); // Debugging log

    return new Response(JSON.stringify(products), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Failed to fetch products' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

