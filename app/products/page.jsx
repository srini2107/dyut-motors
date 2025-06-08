'use client';
import Link from 'next/link';
import styles from './ProductsPage.module.css';

const categories = [
  { name: 'Propellers', slug: 'propellers', desc: 'High-performance propellers for drones and EVs.' },
  { name: 'Motors', slug: 'motors', desc: 'Efficient, powerful motors for every application.' },
  { name: 'Avionics', slug: 'avionics', desc: 'Smart avionics for control and safety.' },
];

export default function ProductsPage() {
  return (
    <main className={styles.main}>
      <section className={styles.heroSection}>
        <h1 className={styles.heading}>Explore Our Product Range</h1>
        <p className={styles.subheading}>
          At <span className={styles.brand}>Dyut Motors</span>, we deliver innovation and reliability.<br />
          Browse our premium selection and power your next project with confidence!
        </p>
        <div className={styles.highlights}>
          <div className={styles.highlightItem}>
            <i className="bi bi-lightning-charge"></i>
            <span>Cutting-edge Technology</span>
          </div>
          <div className={styles.highlightItem}>
            <i className="bi bi-truck"></i>
            <span>Fast & Secure Delivery</span>
          </div>
          <div className={styles.highlightItem}>
            <i className="bi bi-award"></i>
            <span>Trusted by Professionals</span>
          </div>
        </div>
      </section>
      <section className={styles.categoriesSection}>
        <h2 className={styles.categoriesHeading}>Categories</h2>
        <div className={styles.categories}>
          {categories.map(cat => (
            <Link key={cat.slug} href={`/products/${cat.slug}`}>
              <div className={styles.categoryCard}>
                <div className={styles.categoryName}>{cat.name}</div>
                <div className={styles.categoryDesc}>{cat.desc}</div>
                <span className={styles.shopNow}>Shop {cat.name} &rarr;</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}