"use client";
import React, { useState, useEffect, useRef } from "react";
import styles from "./Header.module.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import LoginForm from "../login/LoginForm";
import Image from "next/image";
import { useRouter } from "next/navigation"; // Added router
import { toast } from "react-toastify";

export default function Header({ user }) {
  const {
    isLoggedIn,
    setShowLoginForm,
    showLoginForm,
    setIsLoggedIn,
    userName,
    logout,
  } = useAuth(); // Retrieve userName from AuthContext

  const router = useRouter(); // ✅ Defined router here
  const [openDropdown, setOpenDropdown] = useState(null); // "product", "account", or null
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobile, setMobile] = useState("");

  const productDropdownRef = useRef(null);
  const accountDropdownRef = useRef(null);
  const loginFormRef = useRef(null);

  // Close dropdowns and login form when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        (productDropdownRef.current &&
          productDropdownRef.current.contains(event.target)) ||
        (accountDropdownRef.current &&
          accountDropdownRef.current.contains(event.target)) ||
        (loginFormRef.current && loginFormRef.current.contains(event.target))
      ) {
        return;
      }
      setOpenDropdown(null);
      setShowLoginForm(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menu and dropdowns on navigation
  const handleNav = () => {
    setMobileMenuOpen(false);
    setOpenDropdown(null);
  };

  const toggleDropdown = (dropdown) => {
    setOpenDropdown((prev) => (prev === dropdown ? null : dropdown));
  };

  const toggleMobileMenu = () => setMobileMenuOpen((prev) => !prev);

  // const toggleLoginForm = () => setShowLoginForm(prev => !prev);

  const toggleLoginForm = () => {
    setShowLoginForm((prev) => !prev);
    console.log("Login form toggled:", !showLoginForm); // Debugging
  };
  
  function handleLoginSuccess(token, name) {
    login(token, name); // ✅ correct order
    router.push("/user-dashboard");
  }

  // const handleLogout = () => {
  //   setIsLoggedIn(false);
  //   setOpenDropdown(null);
  //   setMobile("");
  // };

  const handleLogout = () => {
    // console.log("Logging out");
    // localStorage.removeItem("token");
    // setIsLoggedIn(false);
    // setUserName("");

    logout(); // now this handles everything
    toast.success("Your logged out successfully.");
    router.push("/"); // optional: redirect to home
  };

  return (
    <>
      <header className={styles.header}>
        <div className={styles.logo}>
          <Link href="/" onClick={handleNav}>
            <Image
              src="/images/img1.png"
              alt="Logo"
              width={100}
              height={60}
              className={styles.loginLogo}
              style={{ cursor: "pointer" }}
            />
          </Link>
        </div>
        <div
          className={styles.hamburger}
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          <i className="bi bi-list"></i>
        </div>
        <nav
          className={`${styles.nav} ${isMobileMenuOpen ? styles.active : ""}`}
        >
          <ul>
            <li>
              <Link href="/" onClick={handleNav}>
                Home
              </Link>
            </li>
            <li className={styles.dropdown} ref={productDropdownRef}>
              <button
                onClick={() => toggleDropdown("product")}
                className={styles.dropdown_toggle}
                aria-expanded={openDropdown === "product"}
                aria-controls="product-dropdown"
              >
                Products
                <i
                  className={`bi ${
                    openDropdown === "product" ? "bi-arrow-up" : "bi-arrow-down"
                  }`}
                ></i>
              </button>
              {openDropdown === "product" && (
                <div
                  id="product-dropdown"
                  className={styles["dropdown-content"]}
                >
                  <Link href="/products/propellers" onClick={handleNav}>
                    Propellers
                  </Link>
                  <Link href="/products/motors" onClick={handleNav}>
                    Motors
                  </Link>
                  <Link href="/products/avionics" onClick={handleNav}>
                    Avionics
                  </Link>
                </div>
              )}
            </li>
            <li>
              <Link href="/about-us" onClick={handleNav}>
                About Us
              </Link>
            </li>
            <li>
              <Link href="/contact-us" onClick={handleNav}>
                Contact Us
              </Link>
            </li>
            {!isLoggedIn ? (
              <li>
                <button
                  className={styles.loginButton}
                  onClick={toggleLoginForm}
                >
                  <i className="bi bi-box-arrow-in-right"></i> Login
                </button>
              </li>
            ) : (
              <li className={styles.dropdown} ref={accountDropdownRef}>
                <button
                  className={styles.dropdown_toggle}
                  onClick={() => toggleDropdown("account")}
                  aria-expanded={openDropdown === "account"}
                  aria-controls="account-dropdown"
                >
                  <i className="bi bi-person-circle"></i>{" "}
                  {userName ? userName : "Account"} {/* Display user's name */}
                  <i
                    className={`bi ${
                      openDropdown === "account"
                        ? "bi-arrow-up"
                        : "bi-arrow-down"
                    }`}
                  ></i>
                </button>
                {openDropdown === "account" && (
                  <div
                    id="account-dropdown"
                    className={`${styles["dropdown-content"]} ${styles.accountDropdownContent}`}
                  >
                    {/* <div className={styles.dropdownLabel}>{userName}'s Account Details</div>  */}
                    <div className={styles.dropdownLabel}>
                      My Account Details
                    </div>
                    <Link
                      href="/user-dashboard?tab=addresses"
                      onClick={handleNav}
                    >
                      My Addresses
                    </Link>
                    <Link href="/user-dashboard?tab=orders" onClick={handleNav}>
                      My Orders
                    </Link>

                    <a href="#">Saved Items</a>
                    <button
                      className={styles.logoutButton}
                      onClick={handleLogout}
                    >
                      <i className="bi bi-box-arrow-right"></i> Logout
                    </button>
                  </div>
                )}
              </li>
            )}
            {isLoggedIn && (
              <li>
                <Link
                  href="/cart"
                  onClick={handleNav}
                  className={styles.cartButton}
                >
                  <i className="bi bi-cart-fill"></i> Cart
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </header>
      {console.log("Rendering LoginForm:", showLoginForm && !isLoggedIn)}
      {showLoginForm && !isLoggedIn && (
        <LoginForm
          loginFormRef={loginFormRef}
          onLoginSuccess={() => {
            setIsLoggedIn(true);
            setShowLoginForm(false);
          }}
          onClose={() => setShowLoginForm(false)}
        >
          <button
            className={styles.closeButton}
            onClick={() => setShowLoginForm(false)}
          >
            Cancel
          </button>
        </LoginForm>
      )}
    </>
  );
}
