"use client";
import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart";
import { formatRs } from "@/lib/format";
import FutCard from "@/components/FutCard";
import {
  calculateCardPrice,
  CardSize,
  CardStyle,
  getApparelProduct,
  getProduct,
  isStripeTestProduct,
  STRIPE_TEST_PRODUCT,
} from "@/lib/data";

const CART_MINI_SHIFTS = {
  meta: 0,
  name: 0,
  stats: 0,
};

export default function CartPage() {
  const {
    items,
    removeItem,
    updateQty,
    subtotal,
    promoCode,
    applyPromoCode,
    removePromoCode,
    discountTotal,
    discountedSubtotal,
  } = useCart();

  const [codeInput, setCodeInput] = useState("");
  const [promoError, setPromoError] = useState<string | null>(null);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!codeInput.trim()) return;
    const ok = applyPromoCode(codeInput);
    if (ok) {
      setCodeInput("");
      setPromoError(null);
    } else {
      setPromoError("Invalid promo code.");
    }
  };

  if (items.length === 0) {
    return (
      <div className="w-full min-h-screen bg-neutral-50 text-neutral-900 flex items-center justify-center py-24 px-6 text-center">
        <div className="max-w-md mx-auto">
          <h1 className="font-display font-black text-3xl text-neutral-900 mb-4">Your cart is empty</h1>
          <p className="text-neutral-500 mb-8 font-medium">Looks like you haven&apos;t designed a card yet.</p>
          <Link
            href="/cards"
            className="bg-[#232323] hover:bg-black text-white font-display font-bold px-8 py-3.5 rounded-full text-sm shadow-md transition"
          >
            Shop Cards
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-neutral-50 text-neutral-900 py-12 px-6 sm:px-12">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-[1fr_360px] gap-12">
        <div>
          <h1 className="font-display font-black text-3xl sm:text-4xl text-neutral-900 tracking-tight mb-8">
            Your Cart
          </h1>
          <div className="space-y-6">
            {items.map((item: any) => {
              const isTest = isStripeTestProduct(item.productSlug);
              const apparel = getApparelProduct(item.productSlug);
              const baseProduct = getProduct(item.productSlug);
              const tier = baseProduct
                ? calculateCardPrice(
                    baseProduct,
                    (item.size as CardSize) || "Large",
                    (item.style as CardStyle) || "Standard"
                  )
                : null;
              const activeUnitPrice = isTest
                ? STRIPE_TEST_PRODUCT.price
                : apparel
                ? apparel.price
                : tier
                ? promoCode
                  ? tier.promoPrice
                  : tier.price
                : item.unitPrice;
              const regularUnitPrice = isTest
                ? STRIPE_TEST_PRODUCT.price
                : apparel
                ? apparel.price
                : tier
                ? tier.price
                : item.unitPrice;
              const lineTotal = (activeUnitPrice + (item.addonsPrice || 0)) * item.qty;
              const regularLineTotal = (regularUnitPrice + (item.addonsPrice || 0)) * item.qty;

              return (
                <div
                  key={item.id}
                  className="flex gap-5 border border-neutral-200/80 rounded-2xl p-5 bg-white items-center shadow-sm"
                >
                  <div className="shrink-0">
                    {isTest ? (
                      <div className="w-[90px] h-[110px] rounded-xl bg-neutral-100 border border-neutral-200 flex flex-col items-center justify-center p-2 text-center">
                        <span className="text-2xl mb-1">🧪</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                          Test Item
                        </span>
                      </div>
                    ) : apparel ? (
                      <div className="w-[90px] h-[110px] rounded-xl bg-neutral-100 border border-neutral-200 flex items-center justify-center p-2 overflow-hidden">
                        <img
                          src={item.photo || apparel.featureImage}
                          alt={apparel.title}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    ) : (
                      <FutCard
                        name={item.name}
                        position={item.position}
                        overall={item.overall}
                        attrs={item.attributes}
                        gradient={item.gradient}
                        frameImage={baseProduct?.frameImage}
                        photo={item.photo || item.fullCardPreview}
                        clubBadge={item.clubBadge}
                        countryFlag={item.countryFlag}
                        textColor={item.textColor || "#3c3f25"}
                        textShiftY={CART_MINI_SHIFTS}
                        size={90}
                      />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-display font-bold text-base text-neutral-900">{item.productName}</h3>
                    <p className="text-xs text-neutral-500 mb-2 font-medium">
                      {isTest
                        ? "Private Stripe Verification Item"
                        : apparel
                        ? `Fundraiser Apparel · Size: ${item.size}`
                        : `${item.style} · ${item.size} · ${item.position} · ${item.club} · ${item.country}`}
                    </p>
                    {item.addons && item.addons.length > 0 && (
                      <p className="text-xs text-neutral-500 mb-2 font-medium">Add-ons: {item.addons.length}</p>
                    )}
                    <div className="flex items-center gap-3">
                      <input
                        type="number"
                        min={1}
                        value={item.qty}
                        onChange={(e) => updateQty(item.id, Number(e.target.value))}
                        className="w-16 border border-neutral-200 rounded-lg px-2.5 py-1 text-sm font-bold text-neutral-900 bg-neutral-50"
                      />
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-xs text-red-600 hover:text-red-700 font-medium underline underline-offset-2"
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="font-display font-bold text-lg text-neutral-900">
                      {formatRs(lineTotal)}
                    </div>
                    {promoCode && lineTotal < regularLineTotal && (
                      <div className="text-xs text-neutral-400 line-through">
                        {formatRs(regularLineTotal)}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Order Summary Box */}
        <div className="bg-white border border-neutral-200/80 rounded-2xl p-6 h-fit sticky top-28 shadow-sm">
          <h2 className="font-display font-bold text-lg text-neutral-900 mb-4">Order summary</h2>

          {/* Promo Code Input */}
          <div className="mb-5">
            {promoCode ? (
              <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-xl px-3.5 py-2.5 text-xs">
                <span className="font-bold text-emerald-700">
                  ✓ Code <span className="underline">{promoCode}</span> applied
                </span>
                <button
                  type="button"
                  onClick={removePromoCode}
                  className="text-neutral-500 hover:text-red-600 font-bold"
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
                  className="flex-1 border border-neutral-200 rounded-xl px-3 py-2 text-xs font-medium uppercase placeholder:normal-case focus-ring"
                />
                <button
                  type="submit"
                  className="bg-neutral-900 hover:bg-black text-white font-display font-bold px-4 py-2 rounded-xl text-xs transition"
                >
                  Apply
                </button>
              </form>
            )}
            {promoError && <p className="text-xs text-red-600 mt-1.5 font-medium">{promoError}</p>}
          </div>

          <div className="flex justify-between text-sm text-neutral-600 mb-2 font-medium">
            <span>Subtotal</span>
            <span className="font-bold text-neutral-900">{formatRs(subtotal)}</span>
          </div>

          {promoCode && discountTotal > 0 && (
            <div className="flex justify-between text-sm text-emerald-600 mb-2 font-bold">
              <span>Promo ({promoCode})</span>
              <span>-{formatRs(discountTotal)}</span>
            </div>
          )}

          <div className="flex justify-between text-base text-neutral-900 border-t border-neutral-100 pt-3 mb-2 font-bold">
            <span>Estimated Total</span>
            <span>{formatRs(discountedSubtotal)}</span>
          </div>

          <p className="text-xs text-neutral-400 mb-6 font-medium">Shipping calculated at checkout</p>

          <Link
            href="/checkout"
            className="block text-center bg-[#232323] hover:bg-black text-white font-display font-bold py-3.5 px-6 rounded-full text-sm shadow-md transition duration-200"
          >
            Proceed to checkout
          </Link>

          <Link
            href="/cards"
            className="block text-center text-sm text-neutral-500 hover:text-neutral-900 mt-4 underline underline-offset-4 font-medium"
          >
            Continue shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
