import styles from './ProductCard.module.css';
import Link from 'next/link';

export default function ProductCard({ product, category }) {
  // Sanitize image path to avoid repeated /images/
  const imageSrc = product.image && product.image.startsWith("/images/")
    ? product.image
    : "/images/default.png";

  console.log("Product image:", imageSrc); // Debugging log

  const truncateDescription = (description, maxLength = 100) => {
    return description.length > maxLength
      ? description.substring(0, maxLength) + "..."
      : description;
  };

  return (
    <div className={styles.card}>
      <img src={imageSrc} alt={product.name || "Product image"} className={styles.image} />
      <h3 className={styles.name}>{product.name || "Unnamed Product"}</h3>
      <p className={styles.description}>{truncateDescription(product.description || "No description available.")}</p>
      <div className={styles.price}>₹{product.price || "N/A"}</div>
      <Link href={`/products/${category}/${product.id}`}>
        <button className={styles.button}>
          View Details
        </button>
      </Link>
    </div>
  );
}