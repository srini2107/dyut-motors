"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./Hero.module.css";

const images = [
  "/images/drone1.jpg",
  "/images/drone2.jpg",
  "/images/img11.png",
  "/images/img12.png",
  "/images/img13.png",
];

export default function Hero() {
  const [current, setCurrent] = useState(0);
  const router = useRouter();

  const nextImage = () => setCurrent((prev) => (prev + 1) % images.length);
  const prevImage = () =>
    setCurrent((prev) => (prev - 1 + images.length) % images.length);

  // auto-slide effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <section className={styles.hero}>
      <div className={styles.left}>
        <h1 className={styles.subtitle1}>Welcome to Dyut Motors</h1>
        <h3 className={styles.subtitle}>Innovating Electric Mobility</h3>
        <p className={styles.subtitle2}>
          Discover high-performance motors, propellers, and avionics for your
          next project. We deliver quality, reliability, and efficiency for all
          your electric vehicle needs.
        </p>

        <h1 className={styles.subtitle1}>
          <img
            src="/images/make4.jpeg"
            alt="Make in India"
            className={styles.makeInIndiaImg}
          />
          <span>Make in India | Supporting the Atmanirbhar Bharat Mission</span>
        </h1>

        <ul className={styles.features}>
          <li>
            <i className="bi bi-check-circle"></i> Premium Quality Components
          </li>
          <li>
            <i className="bi bi-check-circle"></i> Fast Shipping
          </li>
          <li>
            <i className="bi bi-check-circle"></i> Expert Support
          </li>
          <li>
            <i className="bi bi-check-circle"></i> World-class Engineering
          </li>
        </ul>
        <p className={styles.subtitle5}>
          Join us in revolutionizing the future of electric mobility. Explore
          our range of products designed for performance and efficiency.
        </p>
        <h1 className={styles.subtitle4}>
          UNMANNED <span>TECH</span>
        </h1>
        <div className={styles.ctaGroup}>
          <button
            className={styles.cta}
            onClick={() => router.push("/products")}
          >
            Shop Now
          </button>
          <button
            className={styles.secondaryCta}
            onClick={() => router.push("/about-us")}
          >
            Learn More
          </button>
        </div>
      </div>
      <div className={styles.right}>
        <button
          className={styles.sliderBtn}
          onClick={prevImage}
          aria-label="Previous"
        >
          &#8592;
        </button>
        <div className={styles.sliderWindow}>
          <div
            className={styles.sliderTrack}
            style={{ transform: `translateX(-${current * 100}%)` }}
          >
            {images.map((src, idx) => (
              <img
                key={src}
                src={src}
                alt={`Hero ${idx + 1}`}
                className={styles.heroImage}
              />
            ))}
          </div>
        </div>
        <button
          className={styles.sliderBtn}
          onClick={nextImage}
          aria-label="Next"
        >
          &#8594;
        </button>
      </div>
    </section>
  );
}
