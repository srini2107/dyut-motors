'use client';
import React, { useState } from 'react';
import styles from './ContactUs.module.css';

export default function ContactUs() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = e => {
    e.preventDefault();
    alert('Thank you for contacting us!');
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <main className={styles.container}>
      <div className={styles.topContent}>
        <h1 className={styles.title}>Contact Dyut Motors</h1>
        <p className={styles.description}>
          We’re your one-stop destination for all hobby and commercial propeller needs.
          Have questions or need support? Our team is here to help—reach out for product inquiries, technical assistance, or any other support!
        </p>
        <div className={styles.addressBlock}>
          <strong>Address:</strong>
          <div>#23B, GKVK Layout, Sri Rama Arcade Rd, Jakkur, Bangalore-560064, Karnataka, India</div>
          <div><strong>Email:</strong> support@dyutmotors.com</div>
          <div><strong>Phone:</strong> +91-9876543210</div>
        </div>
      </div>
      <div className={styles.contentRow}>
        <div className={styles.mapWrapper}>
          <iframe
            className={styles.map}
            title="Dyut Motors Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3886.2802414598927!2d77.60084072507831!3d13.081417437244152!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1942d5507d65%3A0xa8c76ce1c8fccd44!2sSriRama%20Arcade!5e0!3m2!1sen!2sin!4v1749327004252!5m2!1sen!2sin"
            width="100%"
            height="320"
            style={{ border: 0, display: 'block' }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
        <form className={styles.form} onSubmit={handleSubmit}>
          <h2 className={styles.formTitle}>Get in Touch</h2>
          <input
            className={styles.input}
            type="text"
            name="name"
            placeholder="Your Name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <input
            className={styles.input}
            type="email"
            name="email"
            placeholder="Your Email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <textarea
            className={styles.textarea}
            name="message"
            placeholder="Your Message"
            value={form.message}
            onChange={handleChange}
            rows={5}
            required
          />
          <button type="submit" className={styles.submitBtn}>
            Send Message
          </button>
        </form>
      </div>
    </main>
  );
}