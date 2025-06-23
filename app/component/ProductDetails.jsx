"use client";
import { useRouter } from "next/navigation";
import styles from "./ProductDetails.module.css";
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Image from "next/image";
import { useCart } from "../context/CartContext";
import { toast } from "react-toastify";

export default function ProductDetails({ product }) {
  const { isLoggedIn, setShowLoginForm, setRedirectPathAfterLogin } = useAuth();
  const [pendingBuy, setPendingBuy] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  const router = useRouter();

  if (!product) {
    return <div style={{ color: "#fff", padding: 32 }}>Product not found.</div>;
  }

  const handleBuyNow = (product) => {
    if (!isLoggedIn) {
      setRedirectPathAfterLogin("/payment");
      setShowLoginForm(true); // open login form
      return;
    }
    if (
      !product ||
      !product.id ||
      !product.name ||
      product.price === undefined
    ) {
      console.error("Invalid product data:", product);
      return;
    }

    const productToBuy = {
      id: product.id,
      name: product.name,
      quantity: 1,
      price: product.price,
    };

    localStorage.setItem("selectedProduct", JSON.stringify(productToBuy));

    const params = new URLSearchParams({
      id: product.id.toString(),
      name: product.name,
      price: product.price.toString(),
      quantity: "1",
    });
    //alert("Proceeding to buy!");
    toast.info("Proceeding to buy!");
    router.push(`/payment?${params.toString()}`);
  };

  // const handleBuy = () => {
  //   alert("Proceeding to buy!");
  //   router.push("/payment");
  // };

  const toggleZoom = () => {
    setIsZoomed(!isZoomed);
  };

  const { addToCart } = useCart();

  const handleAddToCart = () => {
    if (!isLoggedIn) {
      setShowLoginForm(true); // open login form
      return;
    }
    addToCart(product);
    //alert("Product added to cart!");
    toast.success("Product added to cart...Redirecting to cart page.", {
      autoClose: 1500,
    });

    setTimeout(() => {
      router.push("/cart");
    }, 1500);
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
            <button className={styles.addButton} onClick={handleAddToCart}>
              🛒Add to Cart
            </button>
            <button
              className={styles.addButton}
              onClick={() => handleBuyNow(product)}
            >
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
