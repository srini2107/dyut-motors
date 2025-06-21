"use client";

import React, { useState, useEffect } from "react";
import styles from "./payment.module.css";
import { useCart } from "../context/CartContext";
import { useSearchParams, useRouter } from "next/navigation";
import AddressModal from "../addressModal/AddressModal";
import { toast } from "react-toastify";

const Payment = () => {
  const { cartItems, clearCart } = useCart();
  const router = useRouter();

  const [orderItem, setOrderItem] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [savedAddressId, setSavedAddressId] = useState("");
  const [selectedMethod, setSelectedMethod] = useState("");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);

  const [formData, setFormData] = useState({
    type: "shipping",
    full_name: "",
    phone: "",
    address_line1: "",
    address_line2: "",
    city: "",
    state: "",
    postal_code: "",
    country: "",
  });

  useEffect(() => {
    const item = localStorage.getItem("selectedProduct");
    if (item) setOrderItem(JSON.parse(item));

    const fetchAddresses = async () => {
      try {
        const res = await fetch("/api/saved-address");
        if (res.ok) {
          const data = await res.json();
          setAddresses(data);
          if (data.length === 0) setShowAddressModal(true);
        }
      } catch (error) {
        console.error("Failed to fetch addresses:", error);
      }
    };

    fetchAddresses();
  }, []);

  const itemsToDisplay =
    cartItems?.length > 0 ? cartItems : orderItem ? [{ ...orderItem }] : [];

  const totalAmount = itemsToDisplay.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const handlePaymentSelect = async (method) => {
    setSelectedMethod(method);
  };

  const handlePlaceOrder = async () => {
    if (!savedAddressId) return toast.warning("Please select or add address.");
    if (!selectedMethod) return toast.warning("Please select a payment method.");
    setIsPlacingOrder(true);

    try {
      const res = await fetch("/api/place-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address_id: savedAddressId,
          paymentMethod: selectedMethod,
          items: itemsToDisplay,
          total_amount: totalAmount,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Order placed successfully!");
        clearCart();
        router.push(`/thankyou?orderId=${data.orderId}&total=${totalAmount}`);
      } else {
        toast.error(data.error || "Failed to place order");
      }
    } catch (error) {
      console.error("Order placement failed:", error);
      toast.error("Something went wrong.");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/saved-address", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const newAddress = await res.json();
        setAddresses((prev) => [...prev, newAddress]);
        setSavedAddressId(newAddress.id);
        setShowAddressModal(false);
        setFormData({
          type: "shipping",
          full_name: "",
          phone: "",
          address_line1: "",
          address_line2: "",
          city: "",
          state: "",
          postal_code: "",
          country: "",
        });
        toast.success("Address added successfully!");
      } else {
        toast.error("Failed to save address");
      }
    } catch (err) {
      console.error("Error adding address:", err);
      toast.error("Error adding address");
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.paymentContainer}>
        <div className={styles.paymentLeft}>
          {!savedAddressId && addresses.length > 0 && (
            <>
              <h3 className={styles.sectionTitle}>Choose a Delivery Address</h3>
              <div className={styles.addressList}>
                {addresses.map((addr) => (
                  <label key={addr.id} className={styles.addressCard}>
                    <input
                      type="radio"
                      name="address"
                      value={addr.id}
                      onChange={() => setSavedAddressId(addr.id)}
                    />
                    <div>
                      <strong>{addr.full_name}</strong>
                      <p>{addr.address_line1}, {addr.address_line2}</p>
                      <p>{addr.city}, {addr.state}, {addr.postal_code}</p>
                      <p>{addr.country}</p>
                      <p>Phone: {addr.phone}</p>
                    </div>
                  </label>
                ))}
              </div>
              <button
                className={styles.addAddressButton}
                onClick={() => setShowAddressModal(true)}
              >
                + Add New Address
              </button>
            </>
          )}

          {addresses.length === 0 && !showAddressModal && (
            <div className={styles.fallbackAdd}>
              <p>No address found. Please add one to continue.</p>
              <button
                className={styles.addAddressButton}
                onClick={() => setShowAddressModal(true)}
              >
                + Add Address
              </button>
            </div>
          )}

          {savedAddressId && (
            <>
              <h3 className={styles.sectionTitle}>Select Payment Method</h3>
              <div className={styles.section}>
                {["card", "netbanking", "upi"].map((method) => (
                  <label key={method}>
                    <input
                      type="radio"
                      name="method"
                      value={method}
                      onChange={() => handlePaymentSelect(method)}
                    />
                    {method === "card"
                      ? "Credit/Debit Card"
                      : method === "netbanking"
                      ? "Net Banking"
                      : "UPI"}
                  </label>
                ))}
              </div>

              {selectedMethod && (
                <button
                  className={styles.confirmButton}
                  onClick={handlePlaceOrder}
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
          <button
            className={styles.placeOrderButton}
            onClick={handlePlaceOrder}
            disabled={isPlacingOrder || itemsToDisplay.length === 0}
          >
            {isPlacingOrder ? "Placing..." : "Place Order"}
          </button>
        </div>
      </div>

      {/* ✅ Address Modal for New or Empty Address */}
      <AddressModal
        isOpen={showAddressModal}
        onClose={() => setShowAddressModal(false)}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleAddAddress}
        isEditing={false}
      />
    </div>
  );
};

export default Payment;
