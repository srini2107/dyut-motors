"use client";
import React from "react";
import styles from "./AboutUs.module.css";
import Image from "next/image";

export default function AboutUs() {
  return (
    <div className={styles.wrapper}>
      <main className={styles.container}>
        <section className={styles.contentSection}>
          <h1 className={styles.title}>About Us</h1>
          <p className={styles.paragraph}>
            Dyut Motors is dedicated to providing high-performance motors,
            propellers, and avionics for electric vehicles and drones. Our
            mission is to deliver quality, reliability, and innovation to
            empower your next project.
          </p>
          <hr className={styles.divider} />
          <h2 className={styles.subtitle}>Our Values</h2>
          <ul className={styles.list}>
            <li className={styles.listItem}>🌟 Premium Quality Components</li>
            <li className={styles.listItem}>🛠️ Expert Technical Support</li>
            <li className={styles.listItem}>🚚 Fast and Reliable Shipping</li>
            <li className={styles.listItem}>🤝 Customer Satisfaction</li>
          </ul>
          <hr className={styles.divider} />
          <h2 className={styles.subtitle}>Our Story</h2>
          <p className={styles.paragraph}>
            Dyut Motors is always investigating new techniques and technologies.
            We ensure high-quality design and precise manufacture for items that
            are unique in the world by utilizing cutting-edge technologies. Your
            drone's or aircraft's performance and safety will be maximized at
            every stage of flight with a Dyut motors propeller.
          </p>
          <p className={styles.paragraph}>
            Only the best composite materials are chosen by Dyut Motors to be
            used in their propellers. Every blade is made entirely of composite
            material—not wood—and Dyut Motors has confirmed that it is
            appropriate for the purpose for which it was designed. Comprehensive
            answers for the future world.
          </p>
          <p className={styles.paragraph}>
            With over years of experience in the design, manufacturing, and
            testing of hobby and commercial propellers, Dyut motors combines our
            expertise and cutting-edge technology with tireless operation and
            quality control to create one of the best performing propellers in
            the market. Our mission is simple - “propulsion”!
          </p>
        </section>
        <section className={styles.gallerySection}>
          <h2 className={styles.galleryTitle}>Gallery</h2>
          <div className={styles.imageGallery}>
            <Image
              src="/images/123.jpeg"
              alt="About Dyut Motors"
              className={styles.image}
              width={700}
              height={475}
            />
            <Image
              src="/images/prope1.jpg"
              alt="Propeller 1"
              className={styles.image}
              width={700}
              height={475}
            />
            <Image
              src="/images/prop2.jpg"
              alt="Propeller 2"
              className={styles.image}
              width={700}
              height={475}
            />
            <Image
              src="/images/prop3.jpg"
              alt="Propeller 3"
              className={styles.image}
              width={700}
              height={475}
            />
          </div>
        </section>
      </main>
    </div>
  );
}
