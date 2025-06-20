"use client";
import React, { useEffect, useState } from "react";
import styles from "./user-dashboard.module.css";
import { FaHome, FaList, FaGift, FaLock, FaSignOutAlt } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

export default function UserDashboard() {
  const [selectedTab, setSelectedTab] = useState("addresses");
  const { isLoggedIn, userName } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [orders, setOrders] = useState([]);

  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  }
  console.log("isLoggedIn:", isLoggedIn, "userName:", userName);

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

        console.log("Address Data:", addrData);
        console.log("Order Data:", orderData);

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
    <div className={styles.wrapper}>
      <div className={styles.dashboardContainer}>
        <div className={styles.sidebar}>
          <div className={styles.sidebarHeader}>
            <h2>{userName}'s Dashboard</h2>
          </div>
          <div className={styles.sidebarNav}>
            <div
              className={`${styles.navItem} ${
                selectedTab === "addresses" ? styles.navItemActive : ""
              }`}
              onClick={() => setSelectedTab("addresses")}
            >
              <FaHome className={styles.navIcon} />
              My Addresses
            </div>
            <div
              className={`${styles.navItem} ${
                selectedTab === "orders" ? styles.navItemActive : ""
              }`}
              onClick={() => setSelectedTab("orders")}
            >
              <FaList className={styles.navIcon} />
              My Orders
            </div>
            <div className={styles.navItem}>
              <FaGift className={styles.navIcon} />
              E-Gift Cards
            </div>
            <div className={styles.navItem}>
              <FaLock className={styles.navIcon} />
              Account privacy
            </div>
            <div className={styles.navItem}>
              <FaSignOutAlt className={styles.navIcon} />
              Logout
            </div>
          </div>
        </div>

        <div className={styles.content}>
          {selectedTab === "addresses" && (
            <>
              <div className={styles.section}>
                <h2>Saved Addresses</h2>
                {addresses.map((addr) => (
                  <div key={addr.id} className={styles.card}>
                    <div className={styles.row}>
                      <label>Name:</label>
                      <span>{addr.full_name}</span>
                    </div>
                    <div className={styles.row}>
                      <label>Address: </label>
                      <span>
                        {addr.address_line1}, {addr.address_line2}
                        <br />
                        {addr.city}, {addr.state} - {addr.postal_code}
                        <br />
                        {addr.country}
                      </span>
                    </div>
                    <div className={styles.row}>
                      <label>Phone:</label>
                      <span>📞 {addr.phone}</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
          {selectedTab === "orders" && (
            <>
              <div className={styles.section}>
                <h2>Order History</h2>
                {orders.map((order) => (
                  <div key={order.id} className={styles.card}>
                    <div className={styles.row}>
                      <label>Order ID:</label>
                      <span>{order.id}</span>
                    </div>
                    <div className={styles.row}>
                      <label>Date:</label>
                      <span>{formatDate(order.created_at)}</span>
                    </div>
                    <div className={styles.row}>
                      <label>Status:</label>
                      <span>{order.status}</span>
                    </div>
                    <div className={styles.row}>
                      <label>Total:</label>
                      <span>₹{Number(order.total_amount).toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
