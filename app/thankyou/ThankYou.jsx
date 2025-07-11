"use client";
import { useSearchParams } from "next/navigation";
import styles from "./thankyou.module.css";
import { useRouter } from "next/navigation";

export default function ThankYou() {
  const router = useRouter();

  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const total = searchParams.get("total");

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <h1 className={styles.title}>🎉 Thank You for Your Order!</h1>
        <p className={styles.subtitle}>
          Your order has been placed successfully.
        </p>
        <div className={styles.orderInfo}>
          <p>
            Order ID: <span className={styles.highlight}>{orderId}</span>
          </p>
          <p>
            Total Amount: ₹<span className={styles.highlight}>{total}</span>
          </p>
        </div>
        <button className={styles.button} onClick={() => router.push("/")}>
          Continue Shopping
        </button>
      </div>
    </div>
  );
}
