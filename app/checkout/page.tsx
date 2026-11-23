"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart";
import {
  calculateCardPrice,
  CardSize,
  CardStyle,
  getApparelProduct,
  getProduct,
  isStripeTestProduct,
  SHIPPING_METHODS,
  ShippingMethodId,
  STRIPE_TEST_PRODUCT,
} from "@/lib/data";
import { formatRs } from "@/lib/format";

export default function CheckoutPage() {
  const {
    items,
    hydrated,
    subtotal,
    promoCode,
    applyPromoCode,
    removePromoCode,
    discountTotal,
    discountedSubtotal,
  } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [codeInput, setCodeInput] = useState("");
  const [promoError, setPromoError] = useState<string | null>(null);
  const [shippingMethod, setShippingMethod] = useState<ShippingMethodId>("gta-free");
  const [form, setForm] = useState({
    email: "",
    phone: "",
    name: "",
    address: "",
    city: "",
    country: "Canada",
    postcode: "",
  });

  const selectedShipping =
    SHIPPING_METHODS.find((m) => m.id === shippingMethod) || SHIPPING_METHODS[0];
  const shipping = items.length ? selectedShipping.price : 0;
  const total = discountedSubtotal + shipping;

  const isFormComplete =
    form.email.trim() !== "" &&
    form.name.trim() !== "" &&
    form.address.trim() !== "" &&
    form.city.trim() !== "" &&
    form.postcode.trim() !== "" &&
    form.country.trim() !== "";

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!codeInput.trim()) return;
    if (applyPromoCode(codeInput)) {
      setCodeInput("");
      setPromoError(null);
    } else {
      setPromoError("Invalid promo code.");
    }
  };

  const handlePay = async () => {
    if (!isFormComplete) {
      setError("Please fill in your contact email and full shipping address before proceeding.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const fullAddress = [form.address, form.city, form.postcode, form.country]
        .map((s) => s.trim())
        .filter(Boolean)
        .join(", ");

      localStorage.setItem(
        "cardsplug-pending-customer",
        JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim() || "N/A",
          address: fullAddress,
          promoCode: promoCode || null,
          shippingMethod: `${selectedShipping.label} (${selectedShipping.price === 0 ? "Free" : formatRs(selectedShipping.price)})`,
        })
      );

      // Strip large base64 images from the Stripe session request payload
      const checkoutItems = items.map((i) => ({
        id: i.id,
        itemType: i.itemType,
        productSlug: i.productSlug,
        productName: i.productName,
        name: i.name,
        style: i.style,
        size: i.size,
        position: i.position,
        club: i.club,
        country: i.country,
        overall: i.overall,
        addons: i.addons,
        unitPrice: i.unitPrice,
        addonsPrice: i.addonsPrice,
        qty: i.qty,
      }));

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: checkoutItems,
          customer: form,
          promoCode: promoCode || undefined,
          shippingMethod,
        }),
      });
      const data = await res.json();

      if (res.ok && data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error || "Unable to start Stripe Checkout. Please try again.");
        setLoading(false);
      }
    } catch {
      setError("Payment request failed. Please check your connection and try again.");
      setLoading(false);
    }
  };

  if (!hydrated) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-24 text-center text-ink/60 text-sm">
        Loading checkout…
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-24 text-center">
        <h1 className="font-display text-2xl text-ink mb-4">Nothing to check out</h1>
        <button
          onClick={() => router.push("/cards")}
          className="bg-gold text-ink font-display px-6 py-3 rounded-full text-sm"
        >
          Shop Cards
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 grid lg:grid-cols-[1fr_360px] gap-12">
      <div>
        <h1 className="font-display text-3xl text-ink mb-8">Checkout</h1>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="bg-white border border-black/5 rounded-xl p-6 mb-6">
          <h2 className="font-display text-sm text-ink mb-4">Contact</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <input
              type="email"
              required
              placeholder="Email address *"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full border border-black/10 rounded-lg px-4 py-3 text-sm focus-ring"
            />
            <input
              type="tel"
              placeholder="Phone number (optional)"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full border border-black/10 rounded-lg px-4 py-3 text-sm focus-ring"
            />
          </div>
        </div>

        <div className="bg-white border border-black/5 rounded-xl p-6 mb-6">
          <h2 className="font-display text-sm text-ink mb-4">Shipping address</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <input
              required
              placeholder="Full name *"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="border border-black/10 rounded-lg px-4 py-3 text-sm sm:col-span-2 focus-ring"
            />
            <input
              required
              placeholder="Street address *"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="border border-black/10 rounded-lg px-4 py-3 text-sm sm:col-span-2 focus-ring"
            />
            <input
              required
              placeholder="City *"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              className="border border-black/10 rounded-lg px-4 py-3 text-sm focus-ring"
            />
            <input
              required
              placeholder="Postal code *"
              value={form.postcode}
              onChange={(e) => setForm({ ...form, postcode: e.target.value })}
              className="border border-black/10 rounded-lg px-4 py-3 text-sm focus-ring"
            />
            <input
              required
              placeholder="Country *"
              value={form.country}
              onChange={(e) => setForm({ ...form, country: e.target.value })}
              className="border border-black/10 rounded-lg px-4 py-3 text-sm sm:col-span-2 focus-ring"
            />
          </div>
        </div>

        <div className="bg-white border border-black/5 rounded-xl p-6 mb-6">
          <h2 className="font-display text-sm text-ink mb-4">Shipping method</h2>
          <div className="space-y-3">
            {SHIPPING_METHODS.map((method) => {
              const isSelected = shippingMethod === method.id;
              return (
                <label
                  key={method.id}
                  onClick={() => setShippingMethod(method.id)}
                  className={`flex items-center justify-between gap-4 border rounded-xl px-4 py-3.5 cursor-pointer transition ${
                    isSelected
                      ? "border-ink bg-neutral-50"
                      : "border-black/10 hover:border-black/25 bg-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="shippingMethod"
                      checked={isSelected}
                      onChange={() => setShippingMethod(method.id)}
                      className="accent-neutral-900"
                    />
                    <div>
                      <p className="text-sm font-semibold text-ink">{method.label}</p>
                      <p className="text-xs text-ink/50">{method.sublabel}</p>
                    </div>
                  </div>
                  <span
                    className={`font-display text-sm ${
                      method.price === 0 ? "text-emerald font-bold" : "text-ink"
                    }`}
                  >
                    {method.price === 0 ? "Free" : formatRs(method.price)}
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        <div className="bg-white border border-black/5 rounded-xl p-6">
          <h2 className="font-display text-sm text-ink mb-3">Payment</h2>
          <p className="text-xs text-ink/50 mb-4">
            You&apos;ll be redirected to Stripe&apos;s secure hosted checkout to complete your purchase in CAD.
          </p>
          <div className="flex flex-wrap gap-2 text-xs text-ink/50">
            <span className="border border-black/10 rounded px-2 py-1">VISA</span>
            <span className="border border-black/10 rounded px-2 py-1">Mastercard</span>
            <span className="border border-black/10 rounded px-2 py-1">Amex</span>
            <span className="border border-black/10 rounded px-2 py-1">Apple Pay / Google Pay</span>
          </div>
        </div>
      </div>

      <div className="bg-cream rounded-xl p-6 h-fit sticky top-24 border border-black/5">
        <h2 className="font-display text-lg text-ink mb-4">Order summary</h2>
        <div className="space-y-2 mb-4 max-h-64 overflow-auto pr-1">
          {items.map((i) => {
            const isTest = isStripeTestProduct(i.productSlug);
            const apparel = getApparelProduct(i.productSlug);
            const product = getProduct(i.productSlug);
            const tier = product
              ? calculateCardPrice(
                  product,
                  (i.size as CardSize) || "Medium",
                  (i.style as CardStyle) || "Standard"
                )
              : null;
            const unit = isTest
              ? STRIPE_TEST_PRODUCT.price
              : apparel
              ? apparel.price
              : tier
              ? promoCode
                ? tier.promoPrice
                : tier.price
              : i.unitPrice;
            return (
              <div key={i.id} className="flex justify-between text-sm text-ink/70">
                <span className="truncate pr-2">
                  {isTest
                    ? `${i.productName} × ${i.qty}`
                    : apparel
                    ? `${i.productName} (Size ${i.size}) × ${i.qty}`
                    : `${i.productName} (${i.name} · ${i.size}) × ${i.qty}`}
                </span>
                <span>{formatRs((unit + (i.addonsPrice || 0)) * i.qty)}</span>
              </div>
            );
          })}
        </div>

        {/* Promo Code Input */}
        <div className="mb-4 pt-2 border-t border-black/10">
          {promoCode ? (
            <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2 text-xs">
              <span className="font-bold text-emerald-700">
                ✓ Promo <span className="underline">{promoCode}</span> applied
              </span>
              <button
                type="button"
                onClick={removePromoCode}
                className="text-ink/60 hover:text-red-600 font-bold"
              >
                Remove
              </button>
            </div>
          ) : (
            <form onSubmit={handleApplyPromo} className="flex gap-2">
              <input
                type="text"
                placeholder="Promo code"
                value={codeInput}
                onChange={(e) => {
                  setCodeInput(e.target.value);
                  if (promoError) setPromoError(null);
                }}
                className="flex-1 border border-black/10 rounded-lg px-3 py-2 text-xs uppercase placeholder:normal-case bg-white focus-ring"
              />
              <button
                type="submit"
                className="bg-ink text-chalk font-display px-4 py-2 rounded-lg text-xs"
              >
                Apply
              </button>
            </form>
          )}
          {promoError && <p className="text-xs text-red-600 mt-1">{promoError}</p>}
        </div>

        <div className="flex justify-between text-sm text-ink/70 mb-2">
          <span>Subtotal</span>
          <span>{formatRs(subtotal)}</span>
        </div>
        {promoCode && discountTotal > 0 && (
          <div className="flex justify-between text-sm text-emerald-700 font-semibold mb-2">
            <span>Promo ({promoCode})</span>
            <span>-{formatRs(discountTotal)}</span>
          </div>
        )}
        <div className="flex justify-between text-sm text-ink/70 mb-4">
          <span>{selectedShipping.label}</span>
          <span className={shipping === 0 ? "text-emerald font-bold" : ""}>
            {shipping === 0 ? "Free" : formatRs(shipping)}
          </span>
        </div>
        <div className="flex justify-between font-display text-ink text-lg mb-6 border-t border-black/10 pt-4">
          <span>Total (CAD)</span>
          <span>{formatRs(total)}</span>
        </div>
        <button
          onClick={handlePay}
          disabled={loading || !isFormComplete}
          className="w-full bg-emerald hover:bg-emerald/90 disabled:opacity-40 transition text-chalk font-display py-3.5 rounded-full text-sm"
        >
          {loading ? "Redirecting to Stripe…" : `Pay ${formatRs(total)}`}
        </button>
      </div>
    </div>
  );
}
