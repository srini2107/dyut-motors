import ProductDetails from "../../../component/ProductDetails";

export default async function ProductPage({ params }) {
  const { productId } = await params;

  console.log("Requested product ID:", productId);

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/products/${productId}`
  );
  if (!res.ok) {
    console.error("Failed to fetch product:", res.statusText);
    return <div>Error loading product details</div>;
  }

  const product = await res.json();

  return <ProductDetails product={product} />;
}
