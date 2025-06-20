"use client";
import React, { useState } from "react";
import styles from "./addressForm.module.css";
import { useRouter } from "next/navigation";

export default function AddressForm({ onAddressSaved }) {
  const router = useRouter();

  const [address, setAddress] = useState({
    type: "shipping",
    full_name: "",
    phone: "",
    address_line1: "",
    address_line2: "",
    city: "",
    state: "",
    postal_code: "",
    country: "India",
  });

  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to proceed");
      return;
    }

    const res = await fetch("/api/saved-address", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // currently not used in route, but OK to include
      },
      body: JSON.stringify(address),
    });

    const data = await res.json();
    if (res.ok) {
      alert("Address saved successfully.");
      if (onAddressSaved) onAddressSaved();
      else router.push("/payment-options");
    } else {
      alert(data.error || "Failed to save address");
    }
  };

  return (
    <form className={styles.formWrapper} onSubmit={handleSubmit}>
      <h3 className={styles.sectionTitle}>Shipping Address</h3>

      <select
        name="type"
        value={address.type}
        onChange={handleChange}
        className={styles.inputField}
        required
      >
        <option value="shipping">Shipping</option>
        <option value="billing">Billing</option>
      </select>

      <input
        name="full_name"
        placeholder="Full Name"
        value={address.full_name}
        onChange={handleChange}
        className={styles.inputField}
        required
      />
      <input
        name="phone"
        placeholder="Phone Number"
        value={address.phone}
        onChange={handleChange}
        className={styles.inputField}
        required
      />
      <input
        name="address_line1"
        placeholder="Address Line 1"
        value={address.address_line1}
        onChange={handleChange}
        className={styles.inputField}
        required
      />
      <input
        name="address_line2"
        placeholder="Address Line 2"
        value={address.address_line2}
        onChange={handleChange}
        className={styles.inputField}
      />
      <input
        name="city"
        placeholder="City"
        value={address.city}
        onChange={handleChange}
        className={styles.inputField}
        required
      />
      <input
        name="state"
        placeholder="State"
        value={address.state}
        onChange={handleChange}
        className={styles.inputField}
        required
      />
      <input
        name="postal_code"
        placeholder="Postal Code"
        value={address.postal_code}
        onChange={handleChange}
        className={styles.inputField}
        required
      />
      <input
        name="country"
        placeholder="Country"
        value={address.country}
        onChange={handleChange}
        className={styles.inputField}
        required
      />

      <button className={styles.button} type="submit">
        Save and Continue
      </button>
    </form>
  );
}
