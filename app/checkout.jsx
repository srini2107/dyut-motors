"use client";
import { useCart } from "../../context/CartContext";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const router = useRouter();

  const handlePlaceOrder = async () => {
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: cart }),
    });

    if (res.ok) {
      clearCart();
      router.push("/thank-you");
    } else {
      alert("Order failed.");
    }
  };

  return (
    <div>
      <h1>Checkout</h1>
      <p>Total: ₹{cart.reduce((sum, item) => sum + item.price, 0)}</p>
      <button onClick={handlePlaceOrder}>Place Order</button>
    </div>
  );
}
