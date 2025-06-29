"use client";
import React, { useState } from "react";
import styles from "./resetPassword.module.css";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function ResetPassword() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) {
      alert("Passwords do not match");
      return;
    }
  
    setLoading(true);
  
    try {
      const res = await fetch("/api/db-reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
  
      let data = {};
  
      try {
        // Safely attempt to parse response JSON
        data = await res.json();
      } catch (parseErr) {
        console.warn("Response body is not valid JSON");
      }
  
      if (res.ok) {
        toast.success("New Password updated successfully... Please login with your new password.");
        router.push("/");
      } else {
        alert(data.error || "Failed to reset password");
      }
    } catch (err) {
      console.error("Network or server error:", err);
      alert("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.resetBox}>
        <h2>Reset Your Password</h2>
        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className={styles.input}
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
          className={styles.input}
        />
        <button type="submit" className={styles.button} disabled={loading}>
          {loading ? "Updating..." : "Update Password"}
        </button>
      </form>
    </div>
  );
}
