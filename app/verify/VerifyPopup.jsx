'use client';
import React from 'react';
import styles from '../login/LoginForm.module.css';

export default function VerifyPopup() {
  return (
    <div className={styles.verifyPopupContainer}>
      <h2>Verify</h2>
      <form>
        <input
          type="text"
          placeholder="Enter verification code"
          maxLength="100" /* Limit input to 100 characters */
          required
        />
        <button type="submit">Verify</button>
      </form>
    </div>
  );
}
