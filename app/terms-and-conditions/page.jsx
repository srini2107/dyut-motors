// app/terms-and-conditions/page.jsx
"use client";

import styles from "./termsAndConditions.module.css";

export default function TermsAndConditionsPage() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <h1 className={styles.title}>Terms & Conditions</h1>

        <p>Effective Date: June 24, 2025</p>

        <p>
          These Terms & Conditions govern your use of Dyut Motors’ website and
          services. By accessing or placing an order on our site, you agree to
          these terms.
        </p>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}> 1. Use of the Website</h2>
          <p>
            You must be at least 18 years old to use this website. You agree not
            to misuse the site or engage in any illegal or unauthorized
            activity.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>2. Products & Orders</h2>
          <ul>
            <li>All products are subject to availability.</li>
            <li>
              We reserve the right to cancel or refuse orders at our sole
              discretion.
            </li>
            <li>
              Product images are for illustration; actual items may differ
              slightly.
            </li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>3. Pricing & Payments</h2>
          <p>
            Prices are listed in INR and are subject to change. Payments are
            processed securely. We are not responsible for third-party payment
            processor errors.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>4. Shipping & Delivery</h2>
          <p>
            Delivery times are estimates and not guaranteed. We aim to dispatch
            products as quickly as possible but delays may occur due to external
            factors.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>5. Returns & Refunds</h2>
          <p>
            Please refer to our <strong>Return Policy</strong> for details.
            Returns are accepted within 7 days of delivery, subject to condition
            and eligibility.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>6. Limitation of Liability</h2>
          <p>
            Dyut Motors is not liable for any indirect, incidental, or
            consequential damages resulting from the use of our site or
            products.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}> 7. Intellectual Property</h2>
          <p>
            All content, trademarks, and logos are the property of Dyut Motors
            or its licensors and may not be used without permission.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>8. Changes to Terms</h2>
          <p>
            We reserve the right to update these Terms & Conditions at any time.
            Changes will be posted on this page.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>9. Contact Us</h2>
          <p>
            For any questions, contact us at:
            <br />
            <strong>Email:</strong> support@dyutmotors.com
          </p>
        </section>
      </div>
    </div>
  );
}
