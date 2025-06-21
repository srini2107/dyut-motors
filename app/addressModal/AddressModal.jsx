"use client";
import React from "react";
import styles from "./addressModal.module.css";

export default function AddressModal({
  isOpen,
  onClose,
  onSubmit,
  formData,
  setFormData,
  isEditing,
}) {
  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2 className={styles.heading}>
          {isEditing ? "Edit Address" : "Add New Address"}
        </h2>
        <form onSubmit={onSubmit} className={styles.form}>
          <input
            name="full_name"
            placeholder="Full Name"
            value={formData.full_name}
            onChange={handleChange}
            required
          />
          <input
            name="phone"
            placeholder="Phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
          <input
            name="address_line1"
            placeholder="Address Line 1"
            value={formData.address_line1}
            onChange={handleChange}
            required
          />
          <input
            name="address_line2"
            placeholder="Address Line 2"
            value={formData.address_line2}
            onChange={handleChange}
          />
          <input
            name="city"
            placeholder="City"
            value={formData.city}
            onChange={handleChange}
            required
          />
          <input
            name="state"
            placeholder="State"
            value={formData.state}
            onChange={handleChange}
            required
          />
          <input
            name="postal_code"
            placeholder="Postal Code"
            value={formData.postal_code}
            onChange={handleChange}
            required
          />
          <input
            name="country"
            placeholder="Country"
            value={formData.country}
            onChange={handleChange}
            required
          />

          <div className={styles.actions}>
            <button type="submit">{isEditing ? "Update" : "Save"}</button>
            <button type="button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
