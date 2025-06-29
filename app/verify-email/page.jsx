"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import styles from "./verifyEmail.module.css"; // style similar to resetPassword.module.css
import { toast } from "react-toastify";

export default function VerifyEmail() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();

  const [status, setStatus] = useState("verifying"); // "verifying", "success", "error"
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("No token provided");
      return;
    }

    const verifyEmail = async () => {
      try {
        const res = await fetch("/api/verify-email-route", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        const data = await res.json();

        if (res.ok) {
          setStatus("success");
          toast.success("Email verified successfully!...please login now");
          setTimeout(() => {
            router.push("/"); // or "/"
          }, 2000);
        } else {
          setStatus("error");
          setMessage(data.error || "Verification failed");
        }
      } catch (err) {
        console.error("Verification error:", err);
        setStatus("error");
        setMessage("Something went wrong.");
      }
    };

    verifyEmail();
  }, [token, router]);

  return (
    <div className={styles.container}>
      {status === "verifying" && <p>Verifying your email...</p>}
      {status === "success" && <p>Your email has been verified. Redirecting...</p>}
      {status === "error" && <p style={{ color: "red" }}>{message}</p>}
    </div>
  );
}
