"use client";
import React, { useEffect, useState } from "react";
import styles from "./user-dashboard.module.css";
import { FaHome, FaList, FaGift, FaLock, FaSignOutAlt } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import AddressModal from "../addressModal/AddressModal";
import { toast } from "react-toastify";
import { useSearchParams, useRouter } from "next/navigation";

export default function UserDashboard() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tabParam = searchParams.get("tab");
  const [selectedTab, setSelectedTab] = useState(tabParam || "addresses");
  const { isLoggedIn, userName } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [orders, setOrders] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [editAddress, setEditAddress] = useState(null);
  const [formData, setFormData] = useState({
    full_name: "",
    address_line1: "",
    address_line2: "",
    city: "",
    state: "",
    postal_code: "",
    country: "",
    phone: "",
  });

  useEffect(() => {
    if (tabParam && tabParam !== selectedTab) {
      setSelectedTab(tabParam);
    }
  }, [tabParam]);

  const handleTabClick = (tabName) => {
    setSelectedTab(tabName);
    router.replace(`/user-dashboard?tab=${tabName}`); // Update URL without reload
  };

  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  }
  console.log("isLoggedIn:", isLoggedIn, "userName:", userName);

  useEffect(() => {
    if (!isLoggedIn) return;

    const fetchUserData = async () => {
      try {
        const [addrRes, orderRes] = await Promise.all([
          fetch("/api/saved-address"),
          fetch("/api/orders"),
        ]);

        const addrData = await addrRes.json();
        const orderData = await orderRes.json();

        console.log("Address Data:", addrData);
        console.log("Order Data:", orderData);

        if (addrRes.ok) setAddresses(addrData);
        if (orderRes.ok) setOrders(orderData);
      } catch (err) {
        console.error("Error loading user data", err);
      }
    };

    fetchUserData();
  }, [isLoggedIn]);

  if (!isLoggedIn) return <p>Please log in to view your dashboard.</p>;

  const handleAddNewAddress = () => {
    setEditAddress(null);
    setFormData({
      type: "shipping", // <-- Add this
      full_name: "",
      address_line1: "",
      address_line2: "",
      city: "",
      state: "",
      postal_code: "",
      country: "",
      phone: "",
    });
    setIsEditing(true);
  };

  const handleEditAddress = (addr) => {
    setIsEditing(true);
    setEditAddress(addr);
    setFormData({ ...addr });
  };

  const showDeleteConfirm = (onConfirm) => {
    toast(
      ({ closeToast }) => (
        <div>
          <p>Are you sure you want to delete this address?</p>
          <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
            <button
              className={styles.actionsButton}
              onClick={() => {
                onConfirm();
                closeToast();
              }}
            >
              Yes
            </button>
            <button onClick={closeToast} className={styles.actionsButton}>
              No
            </button>
          </div>
        </div>
      ),
      {
        position: "top-center",
        autoClose: false,
        closeOnClick: false,
        draggable: false,
      }
    );
  };

  const handleDeleteAddress = (id) => {
    showDeleteConfirm(async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/saved-address/${id}`, {
          method: "DELETE",
        });
        setIsLoading(false);

        if (res.ok) {
          setAddresses((prev) => prev.filter((a) => a.id !== id));
          toast.success("Address deleted successfully!");
        } else {
          toast.error("Failed to delete address.");
        }
      } catch (err) {
        console.error("Delete error:", err);
        toast.error("Error deleting address.");
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // 👈 Start loading

    const method = editAddress ? "PUT" : "POST";
    const url = editAddress
      ? `/api/saved-address/${editAddress.id}`
      : "/api/saved-address";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const updated = await fetch("/api/saved-address");
        const updatedList = await updated.json();
        setAddresses(updatedList);

        setIsEditing(false);
        setEditAddress(null);

        // ✅ Show appropriate toast
        if (editAddress) {
          toast.success("Address updated successfully!");
        } else {
          toast.success("Address added successfully!");
        }
      } else {
        const err = await res.json();
        console.error("Save failed:", err);
        toast.error("Something went wrong while saving.");
      }
    } catch (err) {
      console.error("Error saving address", err);
      toast.error("Failed to save address. Please try again.");
    } finally {
      setIsLoading(false); // 👈 End loading
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.dashboardContainer}>
        <div className={styles.sidebar}>
          <div className={styles.sidebarHeader}>
            <h2>{userName}'s Dashboard</h2>
          </div>
          <div className={styles.sidebarNav}>
            <div
              className={`${styles.navItem} ${
                selectedTab === "addresses" ? styles.navItemActive : ""
              }`}
              onClick={() => handleTabClick("addresses")}
            >
              <FaHome className={styles.navIcon} />
              My Addresses
            </div>
            <div
              className={`${styles.navItem} ${
                selectedTab === "orders" ? styles.navItemActive : ""
              }`}
              onClick={() => handleTabClick("orders")}
            >
              <FaList className={styles.navIcon} />
              My Orders
            </div>
            <div className={styles.navItem}>
              <FaGift className={styles.navIcon} />
              E-Gift Cards
            </div>
            <div className={styles.navItem}>
              <FaLock className={styles.navIcon} />
              Account privacy
            </div>
            <div className={styles.navItem}>
              <FaSignOutAlt className={styles.navIcon} />
              Logout
            </div>
          </div>
        </div>

        <div className={styles.content}>
          {selectedTab === "addresses" && (
            <>
              <div className={styles.section}>
                <h2>Saved Addresses</h2>
                <div className={styles.topActions}>
                  <button
                    className={styles.actionsBu}
                    onClick={handleAddNewAddress}
                  >
                    ➕ Add New Address
                  </button>
                </div>
                {addresses.length === 0 ? (
                  <div className={styles.emptyState}>
                    <p>No addresses found. Please add one to proceed.</p>
                  </div>
                ) : (
                  addresses.map((addr) => (
                    <div key={addr.id} className={styles.card}>
                      <div className={styles.row}>
                        <label>Name:</label>
                        <span>{addr.full_name}</span>
                      </div>
                      <div className={styles.row}>
                        <label>Address: </label>
                        <span>
                          {addr.address_line1}, {addr.address_line2}
                          <br />
                          {addr.city}, {addr.state} - {addr.postal_code}
                          <br />
                          {addr.country}
                        </span>
                      </div>
                      <div className={styles.row}>
                        <label>Phone:</label>
                        <span>📞 {addr.phone}</span>
                      </div>

                      <div className={styles.actions}>
                        <button
                          className={styles.actionButton}
                          onClick={() => handleEditAddress(addr)}
                        >
                          ✏️ Edit
                        </button>
                        <button
                          className={styles.actionButton}
                          onClick={() => handleDeleteAddress(addr.id)}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
              {isEditing && (
                <AddressModal
                  isOpen={isEditing}
                  onClose={() => setIsEditing(false)}
                  onSubmit={handleSubmit}
                  formData={formData}
                  setFormData={setFormData}
                  isEditing={!!editAddress}
                />
              )}
            </>
          )}

          {selectedTab === "orders" && (
            <>
              <div className={styles.section}>
                <h2>Order History</h2>
                {orders.length === 0 ? (
                  <div className={styles.emptyBox}>
                    <p>No orders placed yet.</p>
                    <button
                      onClick={() => router.push("/products")}
                      className={styles.actionButton}
                    >
                      Start Shopping
                    </button>
                  </div>
                ) : (
                  orders.map((order) => (
                    <div key={order.id} className={styles.card}>
                      <div className={styles.row}>
                        <label>Order ID:</label>
                        <span>{order.id}</span>
                      </div>
                      <div className={styles.row}>
                        <label>Date:</label>
                        <span>{formatDate(order.created_at)}</span>
                      </div>
                      <div className={styles.row}>
                        <label>Status:</label>
                        <span>{order.status}</span>
                      </div>
                      <div className={styles.row}>
                        <label>Total:</label>
                        <span>₹{Number(order.total_amount).toFixed(2)}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
