"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./ConfirmPage.module.css"; // Create a CSS module for styling

export default function ConfirmPage() {
  const router = useRouter();
  const [address, setAddress] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const selected = localStorage.getItem("selectedAddress");
    if (!selected) {
      toast.error("No address selected. Redirecting...");
      router.push("/checkout/select-address");
      return;
    }
    setAddress(JSON.parse(selected));
  }, []);

  const handleConfirmOrder = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ addressId: address.id }),
      });

      if (res.ok) {
        toast.success("Order placed successfully!");
        localStorage.removeItem("selectedAddress");
        router.push("/user-dashboard?tab=orders");
      } else {
        toast.error("Failed to place order.");
      }
    } catch (err) {
      console.error("Order error:", err);
      toast.error("Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!address) return null;

  return (
    <div className={styles.container}>
      <h2>Confirm Your Order</h2>

      <div className={styles.addressCard}>
        <p><strong>{address.full_name}</strong> ({address.type})</p>
        <p>{address.address_line1}</p>
        {address.address_line2 && <p>{address.address_line2}</p>}
        <p>
          {address.city}, {address.state} - {address.postal_code}
        </p>
        <p>{address.country}</p>
        <p>Phone: {address.phone}</p>
      </div>

      <button
        className={styles.confirmButton}
        onClick={handleConfirmOrder}
        disabled={isSubmitting}
      >
        {isSubmitting ? "Placing Order..." : "Confirm Order"}
      </button>
    </div>
  );
}
