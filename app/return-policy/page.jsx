// app/return-policy/page.jsx
"use client";

import styles from "./ReturnPolicyPage.module.css";

export default function ReturnPolicyPage() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <h1 className={styles.title}>Return & Refund Policy</h1>

        <p>Effective Date: June 24, 2025</p>

        <p>
          At Dyut Motors, we are committed to providing high-quality products.
          If you're not completely satisfied with your purchase, we're here to
          help.
        </p>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>1. Return Eligibility</h2>
          <ul>
            <li>Items must be returned within 7 days of delivery.</li>
            <li>
              Items must be unused, in original packaging, and in resellable
              condition.
            </li>
            <li>
              Products such as avionics or motors must not have been installed
              or tampered with.
            </li>
            <li>
              Proof of purchase (invoice or order confirmation) is required.
            </li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>2. Non-Returnable Items</h2>
          <ul>
            <li>Custom-built or made-to-order products.</li>
            <li>Items damaged due to misuse or improper installation.</li>
            <li>Clearance or discounted items marked as "Final Sale."</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>3. Return Process</h2>
          <p>
            To initiate a return, please contact our support team at{" "}
            <strong>support@dyutmotors.com</strong> with your order details and
            reason for return.
          </p>
          <p>
            Once approved, you’ll receive instructions and a return shipping
            address. You will be responsible for return shipping costs unless
            the item was defective or incorrect.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>4. Refunds</h2>
          <p>
            After receiving and inspecting the returned item, we will notify you
            about the status of your refund.
          </p>
          <ul>
            <li>
              Approved refunds will be issued to your original payment method
              within 7–10 business days.
            </li>
            <li>
              Shipping charges are non-refundable unless the return is due to
              our error.
            </li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>5. Exchanges</h2>
          <p>
            We only replace items if they are defective or damaged. To request
            an exchange, please reach out to our support team.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>6. Contact Us</h2>
          <p>
            If you have questions or need help with your return, contact us at:
            <br />
            <strong>Email:</strong> support@dyutmotors.com
          </p>
        </section>
      </div>
    </div>
  );
}
