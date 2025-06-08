import styles from './ProductCard.module.css';
import Link from 'next/link';

export default function ProductCard({ product, category }) {
  return (
    <div className={styles.card}>
      <img src={product.image} alt={product.name} className={styles.image} />
      <h3 className={styles.name}>{product.name}</h3>
      <p className={styles.description}>{product.description}</p>
      <div className={styles.price}>₹{product.price}</div>
      <Link href={`/products/${category}/${product.id}`}>
        <button className={styles.button}>
          View Details
        </button>
      </Link>
    </div>
  );
}