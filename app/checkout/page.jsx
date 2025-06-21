"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function Checkout() {
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const res = await fetch("/api/saved-address");
        if (res.ok) {
          const data = await res.json();
          setAddresses(data);

          if (data.length === 1) {
            setSelectedAddressId(data[0].id);
          }
        } else if (res.status === 401) {
          router.push("/login?redirect=/checkout");
        }
      } catch (err) {
        toast.error("Failed to load addresses");
      } finally {
        setLoading(false);
      }
    };

    fetchAddresses();
  }, [router]);

  const handleProceed = () => {
    if (!selectedAddressId) {
      toast.warning("Please select an address to continue");
      return;
    }
    // Store selected address temporarily (localStorage or context)
    localStorage.setItem("selectedAddressId", selectedAddressId);
    router.push("/checkout/confirm");
  };

  if (loading) return <p className="text-center p-4">Loading addresses...</p>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-xl font-semibold mb-4">Choose a Delivery Address</h1>
      {addresses.length === 0 && (
        <p className="text-gray-500">No saved addresses found.</p>
      )}

      <div className="space-y-4">
        {addresses.map((addr) => (
          <label
            key={addr.id}
            className={`block p-4 border rounded-xl cursor-pointer shadow-sm transition-all ${
              selectedAddressId === addr.id
                ? "border-blue-500 bg-blue-50"
                : "hover:border-gray-400"
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <input
                  type="radio"
                  name="address"
                  checked={selectedAddressId === addr.id}
                  onChange={() => setSelectedAddressId(addr.id)}
                />
                <div>
                  <p className="font-medium">{addr.full_name}</p>
                  <p>{addr.address_line1}, {addr.address_line2}</p>
                  <p>{addr.city}, {addr.state} - {addr.postal_code}</p>
                  <p>{addr.country}</p>
                  <p className="text-sm text-gray-600">Phone: {addr.phone}</p>
                </div>
              </div>
            </div>
          </label>
        ))}
      </div>

      {addresses.length > 0 && (
        <button
          className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          onClick={handleProceed}
        >
          Proceed to Order Summary
        </button>
      )}
    </div>
  );
}
