import { useRouter } from 'next/navigation';
import styles from './ProductDetails.module.css';
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function ProductDetails({ product }) {
    const { isLoggedIn, setShowLoginForm } = useAuth();
    const [pendingBuy, setPendingBuy] = useState(false);

    const router = useRouter();
    if (!product) {
        return <div style={{ color: '#fff', padding: 32 }}>Product not found.</div>;
    }

    const handleBuyNow = () => {
        if (!isLoggedIn) {
            setShowLoginForm(true); // This will open the modal in Header.jsx
            setPendingBuy(true);    // You can use this flag if you want to trigger buy after login
        } else {
            handleBuy();
        }
    };

    const handleBuy = () => {
        // Your buy logic here (e.g., add to cart, redirect to checkout, etc.)
        alert("Proceeding to buy!");
    };

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
                            onClick={handleBuyNow}
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