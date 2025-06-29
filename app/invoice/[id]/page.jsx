"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import styles from "./invoice.module.css"; // Assuming you have a CSS module for styling

const InvoicePage = () => {
  const params = useParams();
  const orderId = params?.id;
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [items, setItems] = useState([]); // <-- Add this line

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const res = await fetch(`/api/invoice/${orderId}`);
        if (!res.ok) {
          throw new Error("Failed to fetch invoice data");
        }

        const data = await res.json();
        console.log("Fetched invoice:", data); // 👈 Add this
        
        if (!data || !data.order) throw new Error("Order not found");
        
        setOrder(data.order);
        setItems(data.items || []);
      } catch (err) {
        console.error("Invoice fetch error:", err);
        setError(err.message || "Error loading invoice");
      } finally {
        setIsLoading(false);
      }
    };

    if (orderId) {
      setIsLoading(true); // start loading only when fetch begins
      fetchInvoice();
    }
  }, [orderId]);

  if (isLoading)
    return <div className={styles.loading}>Loading invoice...</div>;
  if (error) return <div className={styles.error}>Error: {error}</div>;
  if (!order) return <div>No invoice found.</div>;

  return (
    <div className={styles.container}>
      <div className={styles.invoiceWrapper}>
        <h2>Invoice #{order.id}</h2>
        <p className={styles.meta}>
          <strong>Date:</strong> {new Date(order.created_at).toLocaleString()}
        </p>
        <p className={styles.meta}>
          <strong>Status:</strong> {order.status}
        </p>

        <h3>Items</h3>
        <ul className={styles.itemsList}>
          {items && Array.isArray(items) && items.length > 0 ? (
            items.map((item) => (
              <li key={item.product_id} className={styles.itemRow}>
                <div className={styles.itemDetails}>
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      className={styles.productImage}
                    />
                  )}
                  <div>
                    <div className={styles.productName}>{item.name}</div>
                    <div className={styles.productQty}>
                      Qty: {item.quantity}
                    </div>
                  </div>
                </div>
                <div className={styles.price}>
                  ₹{(item.price * item.quantity).toFixed(2)}
                </div>
              </li>
            ))
          ) : (
            <li className={styles.emptyState}>
              No items found for this invoice.
            </li>
          )}
        </ul>

        <div className={styles.total}>
          <strong>Total:</strong> ₹{Number(order.total_amount).toFixed(2)}
        </div>

        <button className={styles.downloadBtn} onClick={() => window.print()}>
          Download / Print PDF
        </button>
        <div className={styles.fixedBottomRight}>
          <button
            className={styles.backBtn}
            onClick={() => router.push(`/user-dashboard?tab=orders`)}
          >
            ← Back to Order History
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvoicePage;
