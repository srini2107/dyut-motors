"use client";
import React, { useState, useEffect } from "react";
import styles from "./payment.module.css";
import { useCart } from "../context/CartContext";
import { useSearchParams } from "next/navigation";
import AddressForm from "../address/addressForm"; // 👈 Import it
import { useRouter } from "next/navigation";

const Payment = () => {
  const { cartItems } = useCart();
  const searchParams = useSearchParams();
  const [orderItem, setOrderItem] = useState(null);
  const [addressSaved, setAddressSaved] = useState(false);
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

  const handlePaymentSelect = (method) => {
    setSelectedMethod(method);
    // You can also send the selected method to your backend or proceed to payment gateway
  };

  const handlePlaceOrder = async () => {
    if (!savedAddressId) {
      alert("Please select a shipping address.");
      return;
    }

    const totalAmount = cartItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    const res = await fetch("/api/place-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        addressId: savedAddressId,
        items: cartItems,
        totalAmount,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      alert("Order placed successfully!");
      clearCart();
      router.push("/user-dashboard");
    } else {
      alert(data.error || "Failed to place order");
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.paymentContainer}>
        <div className={styles.paymentLeft}>
          {!addressSaved ? (
            <AddressForm onAddressSaved={() => setAddressSaved(true)} />
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
                  onClick={() => alert(`Proceeding with ${selectedMethod}`)}
                >
                  Proceed to Pay
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
          <button
            className="placeOrderButton"
            onClick={handlePlaceOrder}
            disabled={isPlacingOrder || cartItems.length === 0}
          >
            {isPlacingOrder ? "Placing..." : "Place Order"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Payment;
