'use client';
import React, { useState, useEffect } from 'react';
import styles from './TopProducts.module.css';

const products = [
  {
    name: 'Carbon Fiber Propeller',
    category: 'Propeller',
    description: 'Lightweight, high-strength propeller for maximum efficiency.',
    price: '₹2,500',
    image: '/img2.jpg',
  },
  {
    name: 'High Torque Motor',
    category: 'Motor',
    description: 'Powerful brushless motor for electric vehicles and drones.',
    price: '₹7,800',
    image: '/img3.jpg',
  },
  {
    name: 'Precision Propeller',
    category: 'Propeller',
    description: 'Balanced for smooth, quiet operation and long life.',
    price: '₹2,200',
    image: '/img4.jpg',
  },
  {
    name: 'Compact Motor',
    category: 'Motor',
    description: 'Compact, efficient motor for lightweight applications.',
    price: '₹6,500',
    image: '/img5.jpg',
  },
  {
    name: 'Precision Propeller',
    category: 'Propeller',
    description: 'Balanced for smooth, quiet operation and long life.',
    price: '₹2,200',
    image: '/img6.jpg',
  },
  {
    name: 'Compact Motor',
    category: 'Motor',
    description: 'Compact, efficient motor for lightweight applications.',
    price: '₹6,500',
    image: '/img7.jpg',
  },
];

const VISIBLE_COUNT = 3; // Number of products visible at once

export default function TopProducts() {
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((prev) => (prev + 1) % products.length);
  const prev = () => setCurrent((prev) => (prev - 1 + products.length) % products.length);

  // Auto-slide effect
  // useEffect(() => {
  //   const interval = setInterval(next, 3500);
  //   return () => clearInterval(interval);
  // }, []);

  // Calculate the products to show
  const getVisibleProducts = () => {
    let visible = [];
    for (let i = 0; i < VISIBLE_COUNT; i++) {
      visible.push(products[(current + i) % products.length]);
    }
    return visible;
  };

  return (
    <section className={styles.topProducts}>
      <h2 className={styles.heading}>Top Products</h2>
      <div className={styles.galleryWrapper}>
        <button className={styles.arrowBtn} onClick={prev} aria-label="Previous">&#8592;</button>
        <div className={styles.galleryWindow}>
          <div
            className={styles.galleryTrack}
            style={{
              transform: `translateX(-${current * (100 / VISIBLE_COUNT)}%)`,
              width: `${(products.length * 100) / VISIBLE_COUNT}%`,
            }}
          >
            {products.map((product, idx) => (
              <div className={styles.productCard} key={idx}>
                <img src={product.image} alt={product.name} className={styles.productImage} />
                <div className={styles.productInfo}>
                  <h3 className={styles.productName}>{product.name}</h3>
                  <span className={styles.productCategory}>{product.category}</span>
                  <p className={styles.productDesc}>{product.description}</p>
                  <div className={styles.productPrice}>{product.price}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <button className={styles.arrowBtn} onClick={next} aria-label="Next">&#8594;</button>
      </div>
    </section>
  );
}