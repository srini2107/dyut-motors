"use client";

import { useSearchParams } from "next/navigation";
import React, { useContext } from "react";
import styles from "./payment.module.css";
import { useCart } from "../context/CartContext";

const Payment = () => {
  const { cartItems } = useCart();
  const searchParams = useSearchParams();

  // Extract Buy Now item from query
  const buyNowItem = searchParams.get("id")
    ? {
        id: searchParams.get("id"),
        name: searchParams.get("name"),
        price: parseFloat(searchParams.get("price")),
        quantity: parseInt(searchParams.get("quantity")) || 1,
      }
    : null;

  const itemsToDisplay = cartItems?.length ? cartItems : buyNowItem ? [buyNowItem] : [];

  const totalAmount = itemsToDisplay.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <div className={styles.wrapper}>
      <div className={styles.paymentContainer}>
        <div className={styles.paymentLeft}>
          <h2 className={styles.title}>Payment Method</h2>

          <div className={styles.section}>
            <label><input type="radio" name="card" /> ICICI Bank ending in 2000</label>
            <label><input type="radio" name="card" /> Bajaj Finserv ending in 4681</label>
            <label className={styles.disabled}><input type="radio" name="card" disabled /> SBI Credit Card ending in 7236 (Unavailable)</label>
            <label><input type="radio" name="card" /> RBL Bank ending in 7183</label>
            
          </div>

          <div className={styles.section}>
            <label><input type="radio" name="method" /> Credit or debit card</label>
            <label><input type="radio" name="method" /> Net Banking</label>
            <label><input type="radio" name="method" /> UPI</label>
            <label><input type="radio" name="method" /> EMI</label>
          </div>

          <button className={styles.confirmButton}>Use this payment method</button>
        </div>

        <div className={styles.paymentRight}>
          <h3>Order Summary</h3>
          {itemsToDisplay.length === 0 ? (
            <p>No items in cart.</p>
          ) : (
            <ul>
              {itemsToDisplay.map((item, index) => (
                <li key={index}>
                  <span>{item.name} &times; {item.quantity}</span>
                  <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                </li>
              ))}
            </ul>
          )}
          <div className={styles.total}>Total: ₹{totalAmount.toFixed(2)}</div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
