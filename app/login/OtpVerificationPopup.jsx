"use client";
import styles from "./OtpVerificationPopup.module.css";

export default function OtpVerificationPopup({ otp, setOtp, onVerify }) {
  return (
    <div className={styles.popupContainer}>
      <h5>Enter OTP</h5>
      <input
        type="text"
        value={otp}
        onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ""))}
        maxLength={6}
        className={styles.otpInput}
        placeholder="Enter OTP"
      />
      <button onClick={onVerify} className={styles.verifyButton}>
        Verify OTP
      </button>
    </div>
  );
}
