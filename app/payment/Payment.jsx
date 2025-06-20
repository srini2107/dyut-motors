"use client";

import React, { useState, useEffect } from "react";
import styles from "./payment.module.css";
import { useCart } from "../context/CartContext";
import { useSearchParams, useRouter } from "next/navigation";
import AddressForm from "../address/addressForm";

const Payment = () => {
  const { cartItems, clearCart } = useCart();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [orderItem, setOrderItem] = useState(null);
  const [addressSaved, setAddressSaved] = useState(false);
  const [savedAddressId, setSavedAddressId] = useState("");
  const [selectedMethod, setSelectedMethod] = useState("");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  useEffect(() => {
    const item = localStorage.getItem("selectedProduct");
    if (item) {
      setOrderItem(JSON.parse(item));
    }
  }, []);

  const itemsToDisplay =
    cartItems?.length > 0 ? cartItems : orderItem ? [{ ...orderItem }] : [];

  const totalAmount = itemsToDisplay.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const handlePaymentSelect = async (method) => {
    setSelectedMethod(method);
    // Optionally trigger order immediately for testing:
    await handlePlaceOrder(method);
  };

  const handlePlaceOrder = async (method) => {
    if (!savedAddressId) {
      alert("Please save a shipping address first.");
      return;
    }

    setIsPlacingOrder(true);

    try {
      const res = await fetch("/api/place-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          address_id: savedAddressId,
          paymentMethod: selectedMethod,
          items: itemsToDisplay,
          total_amount: totalAmount,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Order placed successfully!");
        clearCart();
        router.push(`/thankyou?orderId=${data.orderId}&total=${totalAmount}`);
      } else {
        alert(data.error || "Failed to place order");
      }
    } catch (error) {
      console.error("Order placement failed:", error);
      alert("Something went wrong.");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.paymentContainer}>
        <div className={styles.paymentLeft}>
          {!addressSaved ? (
            <AddressForm
              onAddressSaved={(id) => {
                setSavedAddressId(id);
                setAddressSaved(true);
              }}
            />
          ) : (
            <>
              <h3 className={styles.sectionTitle}>Select Payment Method</h3>
              <div className={styles.section}>
                <label>
                  <input
                    type="radio"
                    name="method"
                    value="card"
                    onChange={() => handlePaymentSelect("card")}
                  />
                  Credit/Debit Card
                </label>
                <label>
                  <input
                    type="radio"
                    name="method"
                    value="netbanking"
                    onChange={() => handlePaymentSelect("netbanking")}
                  />
                  Net Banking
                </label>
                <label>
                  <input
                    type="radio"
                    name="method"
                    value="upi"
                    onChange={() => handlePaymentSelect("upi")}
                  />
                  UPI
                </label>
              </div>

              {selectedMethod && (
                <button
                  className={styles.confirmButton}
                  onClick={() => handlePlaceOrder()}
                >
                  Proceed with {selectedMethod}
                </button>
              )}
            </>
          )}
        </div>

        <div className={styles.paymentRight}>
          <h3>Order Summary</h3>
          <ul>
            {itemsToDisplay.map((item, idx) => (
              <li key={idx}>
                <span>
                  {item.name} × {item.quantity}
                </span>
                <span>₹{item.price * item.quantity}</span>
              </li>
            ))}
          </ul>
          <div className={styles.total}>Total: ₹{totalAmount.toFixed(2)}</div>
          {
            <button
              className="placeOrderButton"
              onClick={() => handlePlaceOrder()}
              disabled={isPlacingOrder || itemsToDisplay.length === 0}
            >
              {isPlacingOrder ? "Placing..." : "Place Order"}
            </button>
          }
        </div>
      </div>
    </div>
  );
};

export default Payment;
