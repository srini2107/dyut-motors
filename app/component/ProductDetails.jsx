"use client";
import { useRouter } from "next/navigation";
import styles from "./ProductDetails.module.css";
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Image from "next/image";

export default function ProductDetails({ product }) {
  const { isLoggedIn, setShowLoginForm } = useAuth();
  const [pendingBuy, setPendingBuy] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  const router = useRouter();

  if (!product) {
    return <div style={{ color: "#fff", padding: 32 }}>Product not found.</div>;
  }

  const handleBuyNow = () => {
    if (!isLoggedIn) {
      setShowLoginForm(true);
      setPendingBuy(true);
    } else {
      handleBuy();
    }
  };

  const handleBuy = () => {
    alert("Proceeding to buy!");
  };

  const toggleZoom = () => {
    setIsZoomed(!isZoomed);
  };

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div
          className={`${styles.imageWrapper} ${isZoomed ? styles.zoomed : ""}`}
          onClick={toggleZoom}
        >
          <Image
            src={product.image}
            alt={product.name}
            className={styles.image}
            width={700}
            height={475}
          />
        </div>
        <div className={styles.details}>
          <h1 className={styles.title}>{product.name}</h1>
          <h3 className={styles.category}>Category: {product.category}</h3>
          <p className={styles.description}>
            <span className={styles.desc}>Description</span>:{" "}
            {product.description || "No description available."}
          </p>
          <div className={styles.specifications}>
            <h3 className={styles.specifications1}>Specifications:</h3>
            <ul>
              <li>Thrust Limitation: {product.thrust_limitation || "N/A"}</li>
              <li>Optimum RPM: {product.optimum_rpm || "N/A"}</li>
              <li>Dimension: {product.dimension || "N/A"}</li>
              <li>Surface Treatment: {product.surface_treatment || "N/A"}</li>
              <li>Temperature: {product.temperature || "N/A"}</li>
              <li>Material: {product.material || "N/A"}</li>
            </ul>
          </div>
          <div className={styles.price}>
            Price: ₹
            {product.discount
              ? product.price - product.discount
              : product.price}
            {product.discount && (
              <span className={styles.discount}>(₹{product.discount} off)</span>
            )}
          </div>

          <div className={styles.actions}>
            <button className={styles.addButton} onClick={handleBuyNow}>
              Add to Cart
            </button>
            <button className={styles.addButton} onClick={handleBuyNow}>
              Buy Now
            </button>
            <button className={styles.addButton} onClick={handleBuyNow}>
              Add to wishlist
            </button>
            <button
              className={styles.cancelButton}
              onClick={() => router.push("/products")}
              type="button"
            >
              Cancel
            </button>
          </div>
        </div>
        <div className={styles.note}>
          <h4>CAUTIONARY NOTE</h4>
          <ul>
            <li>
              The propeller labeled with "L" is designated for use in the air
              (aerial view).
            </li>
            <li>
              Exercise caution when operating the propellers, as the rotating
              blades can lead to severe harm.
            </li>
            <li>
              The durability of the propellers has been rigorously tested.
              Ensure the propellers are not pushed beyond their capabilities and
              avoid attempting to test their strength by applying force with
              your hands. Any damage or loss incurred from misuse will be the
              responsibility of the user.
            </li>
            <li>Ensure all additional parts are securely attached.</li>
            <li>
              Conduct a thorough inspection of the propellers prior to each
              flight to verify their condition. Should any issues be identified,
              replace the propellers with new ones.
            </li>
            <li>
              For safekeeping, store the propellers in environments free from
              harmful substances such as water vapor (H₂O), sulfur dioxide
              (SO2), nitrogen dioxide (NO2), chlorine dioxide (Cl2),
              organosilicon compounds, cyanide groups, and phenols. The
              recommended temperature range for storage is between 0 and 40°C,
              with humidity levels below 80%.
            </li>
            <li>
              Use a screw locking glue of medium or higher quality when
              fastening propellers to engines.
            </li>
            <li>
              Ensure the operation of the propellers adheres to local legal and
              regulatory standards.
            </li>
          </ul>
        </div>
      </div>
    </main>
  );
}
