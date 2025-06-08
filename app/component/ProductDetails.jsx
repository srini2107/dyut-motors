import { useRouter } from 'next/navigation';
import styles from './ProductDetails.module.css';

export default function ProductDetails({ product }) {
    const router = useRouter(); // <-- Add this line
    if (!product) {
        return <div style={{ color: '#fff', padding: 32 }}>Product not found.</div>;
    }

    return (
        <main className={styles.main}>
            <div className={styles.container}>
                <div className={styles.imageWrapper}>
                    <img
                        src={product.image}
                        alt={product.name}
                        className={styles.image}
                    />
                </div>
                <div className={styles.details}>
                    <h1 className={styles.title}>{product.name}</h1>
                    <h3 className={styles.category}>{product.category}</h3>
                    <p className={styles.description}>{product.description}</p>
                    <div className={styles.price}>₹{product.price}</div>
                    <div className={styles.actions}>
                        <button
                            className={styles.buyButton}
                            onClick={() => alert('Redirect to payment portal')}
                        >
                            Buy Now
                        </button>
                        <button
                            className={styles.cancelButton}
                            onClick={() => router.push('/products')}
                            type="button"
                        >
                            Cancel
                        </button>
                    </div>

                </div>
            </div>
        </main>
    );
}