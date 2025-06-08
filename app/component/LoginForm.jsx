'use client';
import React, { forwardRef } from 'react';
import styles from './LoginForm.module.css';

const LoginForm = forwardRef(({ mobile, setMobile, onLogin }, ref) => {
  return (
    <div className={styles.loginFormContainer} ref={ref}>
      <img
        src="/img1.png" // <-- update this path to your logo file
        alt="Logo"
        className={styles.loginLogo}
      />
      <h5>login or sign up</h5>
      <div className={styles.mobileInputWrapper}>
        <span className={styles.stdCode}>+91</span>
        <input
          type="text"
          placeholder="Enter Mobile Number"
          value={mobile}
          onChange={e => setMobile(e.target.value.replace(/[^0-9]/g, ''))}
          maxLength={10}
          className={styles.mobileInput}
        />
      </div>
      <button onClick={onLogin}>
        Login
      </button>
    </div>
  );
});

export default LoginForm;