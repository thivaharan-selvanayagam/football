"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart";
import { formatRs } from "@/lib/format";

export default function CheckoutPage() {
  const { items, subtotal } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: "", name: "", address: "", city: "", country: "", postcode: "" });

  const shipping = items.length ? 1500 : 0;
  const total = subtotal + shipping;

  const handlePay = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, customer: form }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "Something went wrong");
        setLoading(false);
      }
    } catch (e) {
      alert("Payment failed. Please try again.");
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-24 text-center">
        <h1 className="font-display text-2xl text-ink mb-4">Nothing to check out</h1>
        <button onClick={() => router.push("/cards")} className="bg-gold text-ink font-display px-6 py-3 rounded-full text-sm">
          Shop Cards
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 grid lg:grid-cols-[1fr_360px] gap-12">
      <div>
        <h1 className="font-display text-3xl text-ink mb-8">Checkout</h1>

        <div className="bg-white border border-black/5 rounded-xl p-6 mb-6">
          <h2 className="font-display text-sm text-ink mb-4">Contact</h2>
          <input
            placeholder="Email address"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full border border-black/10 rounded-lg px-4 py-3 text-sm focus-ring"
          />
        </div>

        <div className="bg-white border border-black/5 rounded-xl p-6 mb-6">
          <h2 className="font-display text-sm text-ink mb-4">Shipping address</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <input
              placeholder="Full name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="border border-black/10 rounded-lg px-4 py-3 text-sm sm:col-span-2 focus-ring"
            />
            <input
              placeholder="Address"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="border border-black/10 rounded-lg px-4 py-3 text-sm sm:col-span-2 focus-ring"
            />
            <input
              placeholder="City"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              className="border border-black/10 rounded-lg px-4 py-3 text-sm focus-ring"
            />
            <input
              placeholder="Postcode"
              value={form.postcode}
              onChange={(e) => setForm({ ...form, postcode: e.target.value })}
              className="border border-black/10 rounded-lg px-4 py-3 text-sm focus-ring"
            />
            <input
              placeholder="Country"
              value={form.country}
              onChange={(e) => setForm({ ...form, country: e.target.value })}
              className="border border-black/10 rounded-lg px-4 py-3 text-sm sm:col-span-2 focus-ring"
            />
          </div>
        </div>

        <div className="bg-white border border-black/5 rounded-xl p-6">
          <h2 className="font-display text-sm text-ink mb-3">Payment</h2>
          <p className="text-xs text-ink/50 mb-4">
            You'll be redirected to our secure payment provider (Stripe) to complete your purchase.
          </p>
          <div className="flex gap-2 text-xs text-ink/50">
            <span className="border border-black/10 rounded px-2 py-1">VISA</span>
            <span className="border border-black/10 rounded px-2 py-1">Mastercard</span>
            <span className="border border-black/10 rounded px-2 py-1">Amex</span>
            <span className="border border-black/10 rounded px-2 py-1">Klarna</span>
          </div>
        </div>
      </div>

      <div className="bg-cream rounded-xl p-6 h-fit sticky top-24">
        <h2 className="font-display text-lg text-ink mb-4">Order summary</h2>
        <div className="space-y-2 mb-4 max-h-64 overflow-auto pr-1">
          {items.map((i) => (
            <div key={i.id} className="flex justify-between text-sm text-ink/70">
              <span className="truncate pr-2">
                {i.productName} ({i.name}) × {i.qty}
              </span>
              <span>{formatRs((i.unitPrice + i.addonsPrice) * i.qty)}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-between text-sm text-ink/70 mb-2">
          <span>Subtotal</span>
          <span>{formatRs(subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm text-ink/70 mb-4">
          <span>Shipping</span>
          <span>{formatRs(shipping)}</span>
        </div>
        <div className="flex justify-between font-display text-ink text-lg mb-6 border-t border-black/10 pt-4">
          <span>Total</span>
          <span>{formatRs(total)}</span>
        </div>
        <button
          onClick={handlePay}
          disabled={loading || !form.email}
          className="w-full bg-emerald hover:bg-emerald/90 disabled:opacity-40 transition text-chalk font-display py-3.5 rounded-full text-sm"
        >
          {loading ? "Redirecting…" : `Pay ${formatRs(total)}`}
        </button>
      </div>
    </div>
  );
}
