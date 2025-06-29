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
  const [isLoading, setIsLoading] = useState(true);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingOrder, setPendingOrder] = useState(null);

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
        }
      } catch (error) {
        console.error("Failed to fetch addresses:", error);
      }
    };

    const fetchCards = async () => {
      try {
        const res = await fetch("/api/cards");

        if (!res.ok) {
          throw new Error("Failed to fetch cards");
        }

        const data = await res.json();
        setCards(data);

        if (data.length === 1) {
          // ✅ Auto-select the single card
          setSelectedMethod("CARD");
          setSelectedCardId(data[0].id);
        } else if (data.length > 1) {
          const prompted = localStorage.getItem("defaultCardPrompted");

          if (!prompted) {
            // ✅ Prompt user once to select a default card
            toast.info("Please select your default card");
            localStorage.setItem("defaultCardPrompted", "true");
          }
        }
      } catch (err) {
        console.error("Failed to fetch cards:", err);
        toast.error("Could not load saved cards");
      } finally {
        setIsLoading(false);
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

  // const handlePlaceOrder = async () => {
  //   if (!savedAddressId) {
  //     toast.warning("Please select or add an address.");
  //     return;
  //   }

  //   if (!selectedMethod) {
  //     toast.warning("Please select a payment method.");
  //     return;
  //   }

  //   setIsPlacingOrder(true);

  //   try {
  //     const res = await fetch("/api/place-order", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         address_id: savedAddressId,
  //         payment_method: selectedMethod, // ✅ corrected key
  //         items: itemsToDisplay,
  //         total_amount: totalAmount,
  //       }),
  //     });

  //     let data = {};
  //     try {
  //       data = await res.json(); // ✅ fail-safe JSON parsing
  //     } catch (err) {
  //       console.warn("Failed to parse response JSON:", err);
  //     }

  //     if (res.ok) {
  //       toast.success("Order placed successfully!");
  //       clearCart();
  //       router.push(`/thankyou?orderId=${data.orderId}&total=${totalAmount}`);
  //     } else {
  //       toast.error(data.error || "Failed to place order.");
  //     }
  //   } catch (error) {
  //     console.error("Order placement failed:", error);
  //     toast.error("Something went wrong. Please try again.");
  //   } finally {
  //     setIsPlacingOrder(false);
  //   }
  // };

  const handlePlaceOrder = () => {
    if (!savedAddressId) return toast.warning("Please select or add an address.");
    if (!selectedMethod) return toast.warning("Please select a payment method.");
  
    const selectedCard = cards.find((c) => c.id === selectedCardId);
  
    const enrichedItems = itemsToDisplay.map((item) => ({
      product_id: item.product_id || item.id, // Fallback to item.id if product_id is missing
      name: item.name,
      quantity: item.quantity,
      price: item.price,
    }));
  
    setPendingOrder({
      address_id: savedAddressId,
      payment_method: selectedMethod,
      card_last4: selectedCard?.last4 || null,
      items: enrichedItems,
      total_amount: totalAmount,
    });
  
    setShowConfirmModal(true);
  };

  const submitConfirmedOrder = async () => {
    if (!pendingOrder) return;
    setIsPlacingOrder(true);

    try {
      const res = await fetch("/api/place-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pendingOrder),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Order placed successfully!");
        clearCart();
        router.push(`/thankyou?orderId=${data.orderId}&total=${totalAmount}`);
      } else {
        toast.error(data.error || "Failed to place order");
      }
    } catch (err) {
      console.error("Order placement failed:", err);
      toast.error("Something went wrong.");
    } finally {
      setIsPlacingOrder(false);
      setShowConfirmModal(false);
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
                {["CARD", "NET_BANKING", "UPI"].map((method) => (
                  <label key={method}>
                    <input
                      type="radio"
                      name="method"
                      value={method}
                      onChange={() => handlePaymentSelect(method)}
                    />
                    {method === "CARD"
                      ? "Credit/Debit Card"
                      : method === "NET_BANKING"
                      ? "Net Banking"
                      : "UPI"}
                  </label>
                ))}

                {selectedMethod === "CARD" && (
                  <div className={styles.cardMethodBox}>
                    {cards.length > 0 && (
                      <div className={styles.cardList}>
                        {cards.map((card) => (
                          <label key={card.id} className={styles.cardItemBox}>
                            <input
                              type="radio"
                              name="savedCard"
                              value={`card-${card.id}`}
                              checked={selectedCardId === card.id} // ✅ keep it checked if selected
                              onChange={() => setSelectedCardId(card.id)} // ✅ update state
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
      {showConfirmModal && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalBox}>
            <h3>Confirm Your Order</h3>
            <p>
              <strong>Item(s):</strong>{" "}
              {itemsToDisplay.map((i) => i.name).join(", ")}
            </p>
            <p>
              <strong>Total Amount:</strong> ₹{totalAmount}
            </p>
            <p>
              <strong>Payment via:</strong> {selectedMethod}{" "}
              {selectedMethod === "CARD" &&
                `ending in ${pendingOrder?.card_last4}`}
            </p>

            <div className={styles.modalActions}>
              <button
                className={styles.confirmBtn}
                onClick={submitConfirmedOrder}
              >
                Confirm & Place Order
              </button>
              <button
                className={styles.cancelBtn}
                onClick={() => setShowConfirmModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
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
