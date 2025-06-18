"use client";
import { useCart } from "../context/CartContext";
import { useRouter } from "next/navigation";
import styles from "./cart.module.css"; // Assuming you have a CSS module for styling

export default function CartPage() {
  const { cartItems, removeFromCart } = useCart();
  const router = useRouter();

  //   // Optional fallback
  //   if (!cart) {
  //     return <div>Loading cart...</div>;
  //   }

  const handleCheckout = () => {
    router.push("/checkout");
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.cartContainer}>
        <h1 className={styles.cartHeading}>Your Cart</h1>
        {cartItems.length === 0 ? (
          <p className={styles.main}>No items in cart.</p>
        ) : (
          <ul className={styles.cartItems}>
            {cartItems.map((item) => (
              <li className={styles.cartItem} key={item.id}>
                {item.name} - ₹{item.price}
                <button
                  className={styles.cartButtons}
                  onClick={() => removeFromCart(item.id)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
        {cartItems.length > 0 && (
          <button className={styles.cartButtons} onClick={handleCheckout}>
            Proceed to Checkout
          </button>
        )}
      </div>
    </div>
  );
}
