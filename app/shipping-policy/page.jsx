// app/shipping-policy/page.jsx
"use client";

import styles from "./ShippingPolicyPage.module.css";

export default function ShippingPolicyPage() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <h1 className={styles.title}>Shipping Policy</h1>

        <p>Effective Date: June 24, 2025</p>

        <p>
          At Dyut Motors, we are dedicated to delivering your products safely,
          securely, and on time. Please read our shipping policy carefully to
          understand how we process and ship your orders.
        </p>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>1. Order Processing Time</h2>
          <ul>
            <li>
              All orders are processed within 1–3 business days (excluding
              weekends and holidays).
            </li>
            <li>
              Custom or made-to-order items may take longer, and we will notify
              you accordingly.
            </li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>2. Shipping Rates & Delivery Estimates</h2>
          <p>
            Shipping charges for your order will be calculated and displayed at
            checkout.
          </p>
          <ul>
            <li>
              Domestic delivery typically takes 3–7 business days depending on
              location.
            </li>
            <li>
              International shipping may take 7–21 business days and may vary by
              destination and customs.
            </li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>3. Shipment Tracking</h2>
          <p>
            Once your order has shipped, you will receive a confirmation email
            with tracking information.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>4. Shipping Carriers</h2>
          <p>
            We use reputable logistics providers such as DTDC, Blue Dart, FedEx,
            and others based on the delivery location and item type.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>5. Damages</h2>
          <p>
            If your order arrives damaged, please contact us immediately at{" "}
            <strong>support@dyutmotors.com</strong> with photos of the packaging
            and product. We will investigate and resolve the issue promptly.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>6. International Shipping</h2>
          <p>
            We ship worldwide. Please note that international orders may be
            subject to import duties and taxes, which are the responsibility of
            the recipient.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>7. Contact</h2>
          <p>
            For shipping inquiries or issues, feel free to contact us:
            <br />
            <strong>Email:</strong> support@dyutmotors.com
          </p>
        </section>
      </div>
    </div>
  );
}
