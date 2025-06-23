"use client";

import React, { useState } from "react";
import styles from "./cardFormModal.module.css";

const CardFormModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    cardholder_name: "",
    card_number: "",
    expiry_month: "",
    expiry_year: "",
    cvv: "",
    bank_name: "",
    brand: "Unknown",
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;

    let updatedValue = value;

    if (name === "card_number") {
      // remove non-digits and format in groups of 4
      const raw = value.replace(/\D/g, "");
      updatedValue = raw.replace(/(.{4})/g, "$1 ").trim();
    }

    setFormData((prev) => ({
      ...prev,
      [name]: updatedValue,
    }));
  };

  const handleExpiryChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const renderMonthOptions = () =>
    [...Array(12)].map((_, i) => {
      const val = String(i + 1).padStart(2, "0");
      return <option key={val} value={val}>{val}</option>;
    });

  const renderYearOptions = () => {
    const currentYear = new Date().getFullYear();
    return [...Array(15)].map((_, i) => {
      const year = currentYear + i;
      return <option key={year} value={year}>{year}</option>;
    });
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2 className={styles.h2}>Add a New Card</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            name="cardholder_name"
            placeholder="name"
            value={formData.cardholder_name}
            onChange={handleChange}
            className={styles.input}
            required
          />
          <input
            name="card_number"
            placeholder="Card Number"
            value={formData.card_number}
            onChange={handleChange}
            className={styles.input}
            required
            maxLength={19} // "#### #### #### ####"
          />
          <div style={{ display: "flex", gap: "10px" }}>
            <select
              name="expiry_month"
              value={formData.expiry_month}
              onChange={handleExpiryChange}
              className={styles.input}
              required
            >
              <option value="">MM</option>
              {renderMonthOptions()}
            </select>
            <select
              name="expiry_year"
              value={formData.expiry_year}
              onChange={handleExpiryChange}
              className={styles.input}
              required
            >
              <option value="">YYYY</option>
              {renderYearOptions()}
            </select>
          </div>
          <input
            name="cvv"
            placeholder="CVV"
            value={formData.cvv}
            onChange={handleChange}
            className={styles.input}
            required
            maxLength={4}
          />
          <input
            name="bank_name"
            placeholder="Bank Name"
            value={formData.bank_name}
            onChange={handleChange}
            className={styles.input}
            required
          />
          <div className={styles.actions}>
            <button type="submit" className={`${styles.button} ${styles.submit}`}>
              Save
            </button>
            <button type="button" onClick={onClose} className={`${styles.button} ${styles.cancel}`}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CardFormModal;
