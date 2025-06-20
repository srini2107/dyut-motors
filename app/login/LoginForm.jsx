"use client";
import React, { useState } from "react";
import styles from "./LoginForm.module.css";
import { useAuth } from "../context/AuthContext";
import Image from "next/image";
import { useRouter } from "next/navigation"; // Added router

export default function LoginForm({
  loginFormRef,
  onSignupSuccess,
  onLoginSuccess,
  children,
}) {
  const { login, redirectPathAfterLogin, setRedirectPathAfterLogin } =
    useAuth();
  const [step, setStep] = useState("login"); // 'signup' or 'login'
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
    console.log("Signup form submitted"); // Debugging
    if (signupData.password !== signupData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    setIsLoading(true);
    // Call your signup API here
    const res = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(signupData),
    });
    setIsLoading(false);
    if (res.ok) {
      setStep("login");
      onSignupSuccess && onSignupSuccess();
    } else {
      const data = await res.json();
      alert(data.error || "Signup failed");
    }
  };

  // Login submit
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (!loginData.userOrEmail || !loginData.password) {
      alert("Please enter both username/email and password.");
      return;
    }
    console.log("Sending login data:", {
      userOrEmail: loginData.userOrEmail,
      password: loginData.password,
    });
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userOrEmail: loginData.userOrEmail,
        password: loginData.password,
      }),
    });
    setIsLoading(false);
    const data = await res.json();
    if (res.ok) {
      alert("your login success!!");
      login(data.token, data.user.username); // ✅ update context and persist token+username
      if (redirectPathAfterLogin) {
        router.push(redirectPathAfterLogin);
        setRedirectPathAfterLogin(null); // Clear it
      }
      onLoginSuccess && onLoginSuccess(data.user);
    } else {
      alert(data.error || "Login failed");
      // Optionally show "Forgot password?" here
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
                  alert("Forgot password flow here!");
                }}
              >
                Forgot password?
              </a>
            </div>
          </form>
        )}
        {children} {/* Render the close button or any additional content */}
      </div>
    </div>
  );
}
