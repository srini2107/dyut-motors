"use client";

import React, { useState, useEffect } from "react";
import styles from "./payment.module.css";
import { useCart } from "../context/CartContext";
import { useSearchParams, useRouter } from "next/navigation";
import PaymentAddressModal from "../paymentAddressModal/PaymentAddressModal";
import LoadingIndicator from "../loader/LoadingIndicator";

import CardFormModal from "../cardFormModal/CardFormModal";
import { toast } from "react-toastify";

const Payment = () => {
  const { cartItems, clearCart } = useCart();
  const router = useRouter();

  const [orderItem, setOrderItem] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [savedAddressId, setSavedAddressId] = useState("");
  const [selectedMethod, setSelectedMethod] = useState("");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [showPaymentAddressModal, setShowPaymentAddressModal] = useState(false);
  const [showCardModal, setShowCardModal] = useState(false);
  const [cards, setCards] = useState([]);
  const [selectedCardId, setSelectedCardId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

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

  const handleAddAddressClick = () => {
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
    setShowPaymentAddressModal(true);
  };

  useEffect(() => {
    const item = localStorage.getItem("selectedProduct");
    if (item) setOrderItem(JSON.parse(item));

    const fetchAddresses = async () => {
      try {
        const res = await fetch("/api/saved-address");
        if (res.ok) {
          const data = await res.json();
          setAddresses(data);
          //if (data.length === 0) setShowAddressModal(true);
        }
      } catch (error) {
        console.error("Failed to fetch addresses:", error);
      }
    };

    const fetchCards = async () => {
      try {
        const res = await fetch("/api/cards");
        if (res.ok) {
          const data = await res.json();
          setCards(data);
        }
      } catch (err) {
        console.error("Failed to fetch cards:", err);
      } finally {
        setIsLoading(false); // ✅ stop loading once data arrives (or errors)
      }
    };

    fetchAddresses();
    fetchCards();
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
    if (!selectedMethod)
      return toast.warning("Please select a payment method.");
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
        setShowPaymentAddressModal(false);
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

  const handleAddCard = async (cardData) => {
    try {
      const payload = {
        cardholder_name: cardData.cardholder_name,
        card_number: cardData.card_number,
        expiry_month: cardData.expiry_month,
        expiry_year: cardData.expiry_year,
        cvv: cardData.cvv, // if you're collecting it
        brand: cardData.brand || "Unknown",
        bank_name: cardData.bank_name,
      };

      console.log("Payload being sent:", payload);

      const res = await fetch("/api/cards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload), // ✅ send payload, not cardData
      });

      if (res.ok) {
        const newCard = await res.json();
        setCards((prev) => [newCard, ...prev]);
        setShowCardModal(false);
        toast.success("Card added successfully!");
      } else {
        const err = await res.json();
        toast.error(err.error || "Failed to add card");
      }
    } catch (error) {
      console.error("Error adding card:", error);
      toast.error("Error adding card");
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
                      <p>
                        {addr.address_line1}, {addr.address_line2}
                      </p>
                      <p>
                        {addr.city}, {addr.state}, {addr.postal_code}
                      </p>
                      <p>{addr.country}</p>
                      <p>Phone: {addr.phone}</p>
                    </div>
                  </label>
                ))}
              </div>
              <button
                className={styles.addAddressButton}
                onClick={handleAddAddressClick}
              >
                + Add New Address
              </button>
            </>
          )}

          {isLoading ? (
            <div className={styles.loading}>Loading...</div>
          ) : addresses.length === 0 && !showPaymentAddressModal ? (
            <div className={styles.fallbackAdd}>
              <p>No address found. Please add one to continue.</p>
              <button
                className={styles.addAddressButton}
                onClick={handleAddAddressClick}
              >
                + Add Address
              </button>
            </div>
          ) : null}
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

                {selectedMethod === "card" && (
                  <div className={styles.cardMethodBox}>
                    {cards.length > 0 && (
                      <div className={styles.cardList}>
                        {cards.map((card) => (
                          <label key={card.id} className={styles.cardItemBox}>
                            <input
                              type="radio"
                              name="savedCard"
                              value={card.id}
                              onChange={() => setSelectedCardId(card.id)}
                            />
                            <div className={styles.cardInfo}>
                              <div className={styles.cardText}>
                                <strong>
                                  {card.bank_name || "Saved Card"}
                                </strong>{" "}
                                ending in {card.last4}
                                {/* <img
                                  src={`/images/${(
                                    card.brand || "unknown"
                                  ).toLowerCase()}.png`}
                                  alt={card.brand}
                                  className={styles.cardLogo}
                                /> */}
                                <div className={styles.cvvHint}>
                                  CVV not needed <a href="#">Why?</a>
                                </div>
                              </div>
                              <div className={styles.nickname}>
                                {card.cardholder_name}
                              </div>
                            </div>
                          </label>
                        ))}
                      </div>
                    )}

                    <div
                      className={styles.cardAddBox}
                      onClick={() => setShowCardModal(true)}
                    >
                      <div className={styles.cardLogos}>
                        <img src="/images/visa.png" alt="Visa" />
                        <img src="/images/mastercard.png" alt="MasterCard" />
                        <img src="/images/american.png" alt="american" />
                        <img src="/images/bajaj.png" alt="bajaj" />
                        <img src="/images/rupay.png" alt="rupay" />
                      </div>
                      <span className={styles.cardAddIcon}>➕</span>
                      <span
                        className={styles.cardAddText}
                        onClick={handlePlaceOrder}
                      >
                        Add a new credit or debit card <br />
                        <small>
                          Dyut Motors accepts all major credit & debit cards
                        </small>
                      </span>
                    </div>
                  </div>
                )}
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

      <PaymentAddressModal
        isOpen={showPaymentAddressModal}
        onClose={() => setShowPaymentAddressModal(false)}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleAddAddress}
      />

      <CardFormModal
        isOpen={showCardModal}
        onClose={() => setShowCardModal(false)}
        onSave={handleAddCard}
      />
    </div>
  );
};

export default Payment;
