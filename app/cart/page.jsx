"use client";
import { useCart } from "../context/CartContext";
import { useRouter } from "next/navigation";
import styles from "./cart.module.css"; // Assuming you have a CSS module for styling

export default function CartPage() {
  const { cartItems, removeFromCart } = useCart();
  const router = useRouter();

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalAmount = cartItems.reduce(
    (acc, item) => acc + Number(item.price) * item.quantity,
    0
  );

  //   // Optional fallback
  //   if (!cart) {
  //     return <div>Loading cart...</div>;
  //   }

  const handleCheckout = () => {
    router.push("/payment");
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
                <img
                  src={item.image}
                  alt={item.name}
                  className={styles.productImage}
                />
                <div className={styles.itemDetails}>
                  <div className={styles.itemName}>{item.name}</div>
                  <div className={styles.itemPrice}>
                    ₹{Number(item.price).toFixed(2)}
                  </div>
                </div>
                <button
                  className={styles.removeButton}
                  onClick={() => removeFromCart(item.id)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
        <div className={styles.subtotalSection}>
          <hr />
          <p className={styles.subtotalText}>
            Subtotal ({totalItems} items):{" "}
            <strong>₹{totalAmount.toFixed(2)}</strong>
          </p>
        </div>
        {cartItems.length > 0 && (
          <div className={styles.pcheck}>
            <button className={styles.cartButton} onClick={handleCheckout}>
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
