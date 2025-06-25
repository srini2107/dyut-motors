"use client";
import React from "react";
import styles from "./privacyPolicyPage.module.css";

const PrivacyPolicyPage = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <h1 className={styles.title}>Privacy Policy</h1>
        <p className={styles.date}>Last updated: June 24, 2025</p>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>1. Introduction</h2>
          <p>
            Welcome to Dyut Motors. This Privacy Policy explains how we collect,
            use, disclose, and safeguard your information when you visit our
            website and use our services to purchase propellers, avionics, and
            motors.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>2. Information We Collect</h2>
          <p>We collect the following types of personal information:</p>
          <ul>
            <li>
              Contact details such as name, email address, phone number, and
              shipping address
            </li>
            <li>
              Payment details (processed securely via third-party services)
            </li>
            <li>Order history and purchase preferences</li>
            <li>Cookies and usage data for improving user experience</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            3. How We Use Your Information
          </h2>
          <p>Your information is used to:</p>
          <ul>
            <li>Fulfill and manage your orders</li>
            <li>Send you order updates and confirmations</li>
            <li>Improve our website and product offerings</li>
            <li>Provide customer support</li>
            <li>Send promotional communications (only with your consent)</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>4. Sharing of Information</h2>
          <p>
            We do not sell your personal data. We may share information with
            third parties such as:
          </p>
          <ul>
            <li>Payment processors for transaction handling</li>
            <li>Shipping partners to deliver your orders</li>
            <li>Service providers who assist with website operations</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>5. Security</h2>
          <p>
            We implement appropriate technical and organizational security
            measures to protect your data. However, no system can be 100%
            secure, and we cannot guarantee absolute security.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>6. Your Rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Access or update your personal information</li>
            <li>Request deletion of your data</li>
            <li>Withdraw consent for marketing emails</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>7. Cookies</h2>
          <p>
            We use cookies and similar tracking technologies to improve your
            experience. You may choose to disable cookies through your browser
            settings.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>8. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact
            us:
          </p>
          <ul className={styles.contactList}>
            <li>Email: support@dyutmotors.com</li>
            <li>Phone: +91-9876543210</li>
            <li>
              Address: #23B, GKVK Layout, Sri Rama Arcade Rd, Jakkur,
              Bangalore-560064, Karnataka, India
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
