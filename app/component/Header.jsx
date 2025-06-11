'use client';
import React, { useState, useEffect, useRef } from 'react';
import styles from './Header.module.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import LoginForm from '../login/LoginForm';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const [openDropdown, setOpenDropdown] = useState(null); // "product", "account", or null
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isLoggedIn, setShowLoginForm, showLoginForm, setIsLoggedIn } = useAuth();
  const [mobile, setMobile] = useState('');



  const productDropdownRef = useRef(null);
  const accountDropdownRef = useRef(null);
  const loginFormRef = useRef(null);

  // Close dropdowns and login form when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        (productDropdownRef.current && productDropdownRef.current.contains(event.target)) ||
        (accountDropdownRef.current && accountDropdownRef.current.contains(event.target)) ||
        (loginFormRef.current && loginFormRef.current.contains(event.target))
      ) {
        return;
      }
      setOpenDropdown(null);
      setShowLoginForm(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu and dropdowns on navigation
  const handleNav = () => {
    setMobileMenuOpen(false);
    setOpenDropdown(null);
  };

  const toggleDropdown = (dropdown) => {
    setOpenDropdown(prev => (prev === dropdown ? null : dropdown));
  };

  const toggleMobileMenu = () => setMobileMenuOpen(prev => !prev);

  const toggleLoginForm = () => setShowLoginForm(prev => !prev);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setShowLoginForm(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setOpenDropdown(null);
    setMobile('');
  };

  return (
    <>
      <header className={styles.header}>
        <div className={styles.logo}>
          <Link href="/" onClick={handleNav}>
            <img
              src="/img1.png"
              alt="Logo"
              className={styles.loginLogo}
              style={{ cursor: 'pointer' }}
            />
          </Link>
        </div>
        <div className={styles.hamburger} onClick={toggleMobileMenu} aria-label="Toggle menu">
          <i className="bi bi-list"></i>
        </div>
        <nav className={`${styles.nav} ${isMobileMenuOpen ? styles.active : ''}`}>
          <ul>
            <li>
              <Link href="/" onClick={handleNav}>Home</Link>
            </li>
            <li className={styles.dropdown} ref={productDropdownRef}>
              <button
                onClick={() => toggleDropdown('product')}
                className={styles.dropdown_toggle}
                aria-expanded={openDropdown === 'product'}
                aria-controls="product-dropdown"
              >
                Products
                <i className={`bi ${openDropdown === 'product' ? 'bi-arrow-up' : 'bi-arrow-down'}`}></i>
              </button>
              {openDropdown === 'product' && (
                <div id="product-dropdown" className={styles['dropdown-content']}>
                  <Link href="/products/propellers" onClick={handleNav}>Propellers</Link>
                  <Link href="/products/motors" onClick={handleNav}>Motors</Link>
                  <Link href="/products/avionics" onClick={handleNav}>Avionics</Link>
                </div>
              )}
            </li>
            <li>
              <Link href="/about-us" onClick={handleNav}>About Us</Link>
            </li>
            <li>
              <Link href="/contact-us" onClick={handleNav}>Contact Us</Link>
            </li>
            {!isLoggedIn ? (
              <li>
                <button className={styles.loginButton} onClick={toggleLoginForm}>
                  <i className="bi bi-box-arrow-in-right"></i> Login
                </button>
              </li>
            ) : (
              <li className={styles.dropdown} ref={accountDropdownRef}>
                <button
                  className={styles.dropdown_toggle}
                  onClick={() => toggleDropdown('account')}
                  aria-expanded={openDropdown === 'account'}
                  aria-controls="account-dropdown"
                >
                  <i className="bi bi-person-circle"></i> Account
                  <i className={`bi ${openDropdown === 'account' ? 'bi-arrow-up' : 'bi-arrow-down'}`}></i>
                </button>
                {openDropdown === 'account' && (
                  <div id="account-dropdown" className={`${styles['dropdown-content']} ${styles.accountDropdownContent}`}>
                    <div className={styles.dropdownLabel}>My Account Details</div>
                    <a href="#">My Orders</a>
                    <a href="#">My Saved Addresses</a>
                    <a href="#">Saved Items</a>
                    <button className={styles.logoutButton} onClick={handleLogout}>
                      <i className="bi bi-box-arrow-right"></i> Logout
                    </button>
                  </div>
                )}
              </li>
            )}
          </ul>
        </nav>
      </header>

      {showLoginForm && !isLoggedIn && (


        <LoginForm
          ref={loginFormRef}
          onLoginSuccess={() => {
            setIsLoggedIn(true);
            setShowLoginForm(false);
          }}
          onClose={() => setShowLoginForm(false)}
        />

      )}
    </>
  );
}