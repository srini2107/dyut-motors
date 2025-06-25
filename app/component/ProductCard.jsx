"use client";
import styles from "./ProductCard.module.css";
import Link from "next/link";
import Image from "next/image";
import React, { useState } from "react";
import { useRouter } from "next/navigation"; // Added router

export default function ProductCard({ product, category }) {
  const router = useRouter(); // Added router
  const [pendingDetails, setPendingDetails] = useState(false);
  // Sanitize image path to avoid repeated /images/
  const imageSrc =
    product.image && product.image.startsWith("/images/")
      ? product.image
      : "/images/default.png";

  console.log("Product image:", imageSrc); // Debugging log

  const truncateDescription = (description, maxLength = 100) => {
    return description.length > maxLength
      ? description.substring(0, maxLength) + "..."
      : description;
  };

  const handleViewDetails = () => {
    setPendingDetails(true);
    router.push(`/products/${category}/${product.id}`);
  };

  return (
    <div className={styles.card}>
      <Image
        src={imageSrc}
        alt={product.name || "Product image"}
        className={styles.image}
        width={700}
        height={475}
      />
      <h3 className={styles.name}>{product.name || "Unnamed Product"}</h3>
      <p className={styles.description}>
        {truncateDescription(
          product.description || "No description available."
        )}
      </p>
      <div className={styles.price}>₹{product.price || "N/A"}</div>
      <Link href={`/products/${category}/${product.id}`}>
        <button
          className={styles.button}
          onClick={handleViewDetails}
          disabled={pendingDetails}
        >
          {pendingDetails ? "Processing..." : "View Details"}
        </button>
      </Link>
    </div>
  );
}
