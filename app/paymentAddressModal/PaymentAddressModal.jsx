"use client";
import React from "react";
import styles from "./paymentAddressModal.module.css";

export default function PaymentAddressModal({
  isOpen,
  onClose,
  onSubmit,
  formData,
  setFormData,
}) {
  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2 className={styles.heading}>Add New Address</h2>
        <form onSubmit={onSubmit} className={styles.form}>
          <input name="full_name" placeholder="Full Name" onChange={handleChange} required />
          <input name="phone" placeholder="Phone" onChange={handleChange} required />
          <input name="address_line1" placeholder="Address Line 1" onChange={handleChange} required />
          <input name="address_line2" placeholder="Address Line 2" onChange={handleChange} />
          <input name="city" placeholder="City" onChange={handleChange} required />
          <input name="state" placeholder="State" onChange={handleChange} required />
          <input name="postal_code" placeholder="Postal Code" onChange={handleChange} required />
          <input name="country" placeholder="Country" onChange={handleChange} required />

          <div className={styles.actions}>
            <button type="submit">Save</button>
            <button type="button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
