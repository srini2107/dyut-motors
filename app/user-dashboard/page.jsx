"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import styles from "./user-dashboard.module.css"; // reuse this or create `dashboard.module.css`

export default function UserDashboard() {
  const { isLoggedIn, userName } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!isLoggedIn) return;

    const fetchUserData = async () => {
      try {
        const [addrRes, orderRes] = await Promise.all([
          fetch("/api/saved-address"),
          fetch("/api/orders"),
        ]);

        const addrData = await addrRes.json();
        const orderData = await orderRes.json();

        if (addrRes.ok) setAddresses(addrData);
        if (orderRes.ok) setOrders(orderData);
      } catch (err) {
        console.error("Error loading user data", err);
      }
    };

    fetchUserData();
  }, [isLoggedIn]);

  if (!isLoggedIn) return <p>Please log in to view your dashboard.</p>;

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <h2 className={styles.title}>{userName}'s Dashboard</h2>

        {/* Saved Addresses */}
        <section>
          <h3 className={styles.title}>Saved Addresses</h3>
          {addresses.length === 0 ? (
            <p className={styles.noAddresses}>No saved addresses found.</p>
          ) : (
            <div className={styles.addressList}>
              {addresses.map((addr, idx) => (
                <div key={idx} className={styles.addressCard}>
                  <p className={styles.addressLine}>
                    <span>{addr.full_name}</span>
                  </p>
                  <p className={styles.addressLine}>{addr.address_line1}</p>
                  {addr.address_line2 && (
                    <p className={styles.addressLine}>{addr.address_line2}</p>
                  )}
                  <p className={styles.addressLine}>
                    {addr.city}, {addr.state} - {addr.postal_code}
                  </p>
                  <p className={styles.addressLine}>{addr.country}</p>
                  <p className={styles.addressLine}>📞 {addr.phone}</p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Orders */}
        <section style={{ marginTop: "2rem" }}>
          <h3 className={styles.title}>Order History</h3>
          {orders.length === 0 ? (
            <p className={styles.noAddresses}>No orders found.</p>
          ) : (
            <ul className={styles.addressList}>
              {orders.map((order, idx) => (
                <li key={idx} className={styles.addressCard}>
                  <p className={styles.addressLine}>
                    <strong>Order ID:</strong> {order.id}
                  </p>
                  <p className={styles.addressLine}>
                    <strong>Date:</strong>{" "}
                    {new Date(order.created_at).toLocaleString()}
                  </p>
                  <p className={styles.addressLine}>
                    <strong>Status:</strong> {order.status}
                  </p>
                  <p className={styles.addressLine}>
                    <strong>Total:</strong> ₹{order.total_amount}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
