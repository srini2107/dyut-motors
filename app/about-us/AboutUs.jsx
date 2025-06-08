'use client';
import React from 'react';
import styles from './AboutUs.module.css';

export default function AboutUs() {
  return (
    <main className={styles.container}>
      <div className={styles.row}>
        <div className={styles.imageWrapper}>
          <img
            src="/123.jpeg" // Change to your about image path
            alt="About Dyut Motors"
            className={styles.image}
          />
        </div>
        <div className={styles.content}>
          <h1 className={styles.title}>About Dyut Motors</h1>
          <p className={styles.paragraph}>
            Dyut Motors is dedicated to providing high-performance motors, propellers, and avionics for electric vehicles and drones.
            Our mission is to deliver quality, reliability, and innovation to empower your next project.
          </p>
          <h2 className={styles.subtitle}>Our Values</h2>
          <ul className={styles.list}>
            <li className={styles.listItem}>Premium Quality Components</li>
            <li className={styles.listItem}>Expert Technical Support</li>
            <li className={styles.listItem}>Fast and Reliable Shipping</li>
            <li className={styles.listItem}>Customer Satisfaction</li>
          </ul>
          <h2 className={styles.subtitle}>Our Story</h2>

          <p className={styles.paragraph}>Dyut Motors is always investigating new techniques and technologies.
            We ensure high-quality design and precise manufacture for items that are
            unique in the world by utilizing cutting-edge technologies. Your drone's or
            aircraft's performance and safety will be maximized at every stage of flight
            with a Dyut motors propeller.</p>

          <p className={styles.paragraph}>Only the best composite materials are chosen by Dyut Motors to be used in
            their propellers. Every blade is made entirely of composite material—not wood—and
            Dyut Motors has confirmed that it is appropriate for the purpose for which it was
            designed. Comprehensive answers for the future world.</p>

          <p className={styles.paragraph}>With over years of experience in the design, manufacturing, and testing of hobby
            and commercial propellers, Dyut motors combines our expertise and cutting-edge
            technology with tireless operation and quality control to create one of the best
            performing propellers in the market. Our mission is simple - “propulsion”!</p>
        </div>
      </div>
    </main>
  );
}