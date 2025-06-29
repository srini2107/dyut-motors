"use client";
import React, { useState } from "react";
import styles from "./LoginForm.module.css";
import { useAuth } from "../context/AuthContext";
import Image from "next/image";
import { useRouter } from "next/navigation"; // Added router
import { toast } from "react-toastify";

export default function LoginForm({
  loginFormRef,
  onSignupSuccess,
  onLoginSuccess,
  children,
}) {
  const { login, redirectPathAfterLogin, setRedirectPathAfterLogin } =
    useAuth();
  const [step, setStep] = useState("login"); // 'signup' or 'login'
  const [forgotEmail, setForgotEmail] = useState("");
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [isSendingReset, setIsSendingReset] = useState(false);

  const [signupData, setSignupData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loginData, setLoginData] = useState({
    userOrEmail: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter(); // Added router

  // Handle signup field changes
  const handleSignupChange = (e) => {
    console.log(e.target.name, e.target.value); // Debugging
    setSignupData({ ...signupData, [e.target.name]: e.target.value });
  };

  // Handle login field changes
  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  // Signup submit
  const handleSignup = async (e) => {
    e.preventDefault();

    if (signupData.password !== signupData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(signupData),
      });

      let data = {};
      try {
        data = await res.json();
      } catch {
        const text = await res.text(); // useful for debugging
        console.error("Non-JSON response:", text);
      }

      setIsLoading(false);

      if (res.ok) {
        toast.success(
          "Signup successful! Please check your email to verify your account."
        );
        setStep("login");
        onSignupSuccess && onSignupSuccess();
      } else {
        toast.error(data?.error || "Signup failed.");
      }
    } catch (err) {
      console.error("Network error:", err);
      toast.error("Something went wrong. Please try again.");
      setIsLoading(false);
    }
  };

  // Login submit
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!loginData.userOrEmail || !loginData.password) {
      toast.error("Please enter both username/email and password.");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userOrEmail: loginData.userOrEmail,
          password: loginData.password,
        }),
      });

      setIsLoading(false);

      let data = {};
      try {
        data = await res.json();
      } catch {
        toast.error("Unexpected response from server.");
        return;
      }

      if (res.status === 403) {
        toast.error("Please verify your email before logging in.");
        return;
      }

      if (!res.ok) {
        toast.error(data.error || "Login failed");
        return;
      }

      const { token, name } = data;

      toast.success("Login success");
      login(token, name); // ✅ your context method
      router.push("/");

      if (redirectPathAfterLogin) {
        router.push(redirectPathAfterLogin);
        setRedirectPathAfterLogin(null);
      }

      onLoginSuccess(token, name);
    } catch (err) {
      console.error("Login error:", err);
      toast.error("Network error. Please try again.");
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!forgotEmail) return toast.error("Enter your email address");

    setIsSendingReset(true);

    try {
      const res = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail }),
      });

      let data = {};
      try {
        const text = await res.text(); // get raw text
        data = text ? JSON.parse(text) : {}; // safely parse if not empty
      } catch (err) {
        console.warn("No JSON body or invalid JSON:", err);
      }

      setIsSendingReset(false);

      if (res.ok) {
        toast.success("Reset link sent. Please check your email.");
        setShowForgotModal(false);
        setForgotEmail("");
      } else {
        toast.error(data.error || "Failed to send reset link.");
      }
    } catch (err) {
      setIsSendingReset(false);
      toast.error("Something went wrong. Please try again.");
      console.error("Forgot password error:", err);
    }
  };

  return (
    <div ref={loginFormRef} className={styles.overlay}>
      <div className={styles.popup}>
        {step === "signup" ? (
          <form className={styles.form} onSubmit={handleSignup}>
            <Image
              src="/images/img1.png"
              alt="Logo"
              className={styles.signLogo}
              style={{ cursor: "pointer" }}
              width={80}
              height={60}
            />

            <h2>Sign Up</h2>
            <input
              name="name"
              type="text"
              placeholder="Name"
              value={signupData.name}
              onChange={handleSignupChange}
              required
              className={styles.input}
            />
            <input
              name="username"
              type="text"
              placeholder="Username"
              value={signupData.username}
              onChange={handleSignupChange}
              required
              className={styles.input}
            />
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={signupData.email}
              onChange={handleSignupChange}
              required
              className={styles.input}
            />
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={signupData.password}
              onChange={handleSignupChange}
              required
              className={styles.input}
            />
            <input
              name="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              value={signupData.confirmPassword}
              onChange={handleSignupChange}
              required
              className={styles.input}
            />
            <button type="submit" className={styles.btn} disabled={isLoading}>
              {isLoading ? "Creating..." : "Continue"}
            </button>
          </form>
        ) : (
          <form className={styles.form} onSubmit={handleLogin}>
            <h2>Login</h2>
            <input
              name="userOrEmail"
              type="text"
              placeholder="Enter username or email"
              value={loginData.userOrEmail}
              onChange={(e) =>
                setLoginData({ ...loginData, userOrEmail: e.target.value })
              }
              required
              className={styles.input}
            />
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={loginData.password}
              onChange={(e) =>
                setLoginData({ ...loginData, password: e.target.value })
              }
              required
              className={styles.input}
            />
            <button type="submit" className={styles.btn} disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </button>
            <p className={styles.toggle}>
              Don't have an account?{" "}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setStep("signup");
                }}
              >
                Sign Up
              </a>
            </p>
            <div className={styles.forgot}>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setShowForgotModal(true);
                }}
              >
                Forgot password?
              </a>
            </div>
          </form>
        )}
        {children} {/* Render the close button or any additional content */}
      </div>
      {showForgotModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>Reset Password</h3>
            <input
              type="email"
              placeholder="Enter your registered email"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              className={styles.input}
            />
            <button
              onClick={handleForgotPassword}
              disabled={isSendingReset}
              className={styles.btn}
            >
              {isSendingReset ? "Sending..." : "Click to Reset Password"}
            </button>
            <button
              onClick={() => setShowForgotModal(false)}
              className={styles.cancelButton}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
