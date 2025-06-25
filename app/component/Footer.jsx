"use client";
import React from "react";
import styles from "./Footer.module.css";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.newFooterRow}>
        <div className={styles.left}>
          <div>
            <i className="bi bi-telephone-fill" style={{ marginRight: 8 }}></i>
            +91-99018 20757
          </div>
          <div>
            <i className="bi bi-envelope-fill" style={{ marginRight: 8 }}></i>
            support@dyutmotors.com
          </div>
        </div>

        <div className={styles.center}>
          <span>
            © {new Date().getFullYear()} Dyut Motors. All rights reserved.
          </span>
          <div className={styles.links}>
            <Link href="/privacy-policy">Privacy Policy</Link>
            <span> | </span>
            <Link href="/terms-and-conditions">Terms & Conditions</Link>
            <span> | </span>
            <Link href="/return-policy">Return Policy</Link>
            <span> | </span>
            <Link href="/shipping-policy">Shipping Policy</Link>
          </div>
        </div>

        <div className={styles.right}>
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener"
            aria-label="Facebook"
          >
            <i className="bi bi-facebook"></i>
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener"
            aria-label="Twitter"
          >
            <i className="bi bi-twitter"></i>
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener"
            aria-label="Instagram"
          >
            <i className="bi bi-instagram"></i>
          </a>
        </div>
      </div>
    </footer>
  );
}
