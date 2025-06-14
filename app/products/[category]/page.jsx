
import ProductCard from '../../component/ProductCard';
import cardStyles from '../../component/ProductCard.module.css';
import pageStyles from './CategoryPage.module.css';

export default async function CategoryPage({ params }) {
  const { category } = params;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/products/category/${category}`,
    { cache: "no-store" } // optional: disable caching
  );

  if (!res.ok) {
    return <div>Error loading products</div>;
  }

  const products = await res.json();

  return (
    <main className={pageStyles.main}>
      <div className={pageStyles.wrapper}>
        <h1 className={pageStyles.heading}>
          {category.charAt(0).toUpperCase() + category.slice(1)}
        </h1>
        <div className={cardStyles.container}>
          {products.map(product => (
            <ProductCard key={product.id} product={product} category={category} />
          ))}
        </div>
      </div>
    </main>
  );
}
