import ProductCard from "../../component/ProductCard";
import cardStyles from "../../component/ProductCard.module.css";
import pageStyles from "./CategoryPage.module.css";

export default async function CategoryPage({ params }) {
  //const category = params.category; // params is already available

  const { category } = await params;

  let products = [];

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/products/category/${category}`,
      { cache: "no-store" }
    );

    if (!res.ok) throw new Error("Failed to fetch products");

    const text = await res.text();

    if (!text || text.trim() === "") {
      console.warn("Empty response received for category:", category);
      return <div>No products available for this category.</div>;
    }

    products = JSON.parse(text);
  } catch (error) {
    console.error("Error loading or parsing products:", error);
    return <div>Something went wrong while loading the products.</div>;
  }

  return (
    <main className={pageStyles.main}>
      <div className={pageStyles.wrapper}>
        <h1 className={pageStyles.heading}>
          {category.charAt(0).toUpperCase() + category.slice(1)}
        </h1>
        <div className={cardStyles.container}>
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              category={category}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
