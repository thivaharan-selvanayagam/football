"use client";

import { useRouter } from "next/navigation";
import { useCart, CartItem } from "@/lib/cart";
import { STRIPE_TEST_PRODUCT } from "@/lib/data";
import { formatRs } from "@/lib/format";

export default function TestStripePage() {
  const router = useRouter();
  const { addItem, clear } = useCart();

  const createTestCartItem = (): CartItem => ({
    id: `stripe-test-${Date.now()}`,
    itemType: "test",
    productSlug: STRIPE_TEST_PRODUCT.slug,
    productName: STRIPE_TEST_PRODUCT.name,
    name: "Test",
    style: "Test",
    size: "Test",
    position: "",
    club: "",
    country: "Canada",
    attributes: { PAC: 0, SHO: 0, PAS: 0, DRI: 0, DEF: 0, PHY: 0 },
    overall: 0,
    addons: [],
    unitPrice: STRIPE_TEST_PRODUCT.price,
    addonsPrice: 0,
    qty: 1,
    gradient: ["#111111", "#2a2a2a"],
  });

  const handleBuyNow = () => {
    clear();
    addItem(createTestCartItem());
    router.push("/checkout");
  };

  const handleAddToCart = () => {
    addItem(createTestCartItem());
    router.push("/cart");
  };

  return (
    <section className="w-full min-h-[75vh] bg-neutral-50 text-neutral-900 flex items-center justify-center py-16 px-6">
      <div className="w-full max-w-md bg-white border border-neutral-200/80 rounded-2xl p-8 shadow-sm text-center">
        <div className="w-14 h-14 rounded-2xl bg-neutral-100 border border-neutral-200 flex items-center justify-center mx-auto mb-5 text-2xl">
          🧪
        </div>

        <span className="inline-block text-[10px] font-bold uppercase tracking-widest bg-amber-100 text-amber-800 px-3 py-1 rounded-full mb-3">
          Private Unlisted Test Product
        </span>

        <h1 className="font-display text-2xl sm:text-3xl font-black text-neutral-900 mb-2">
          {STRIPE_TEST_PRODUCT.name}
        </h1>

        <p className="text-sm text-neutral-600 font-medium mb-6 leading-relaxed">
          Use this hidden page to verify live or test Stripe Checkout, session verification, and order confirmation emails end-to-end.
        </p>

        <div className="bg-neutral-50 border border-neutral-200/80 rounded-xl p-4 mb-6">
          <p className="text-xs font-bold uppercase text-neutral-400 mb-1">Test Charge Amount</p>
          <p className="font-display text-3xl font-black text-neutral-900">
            {formatRs(STRIPE_TEST_PRODUCT.price)}{" "}
            <span className="text-sm font-bold text-neutral-500">CAD</span>
          </p>
          <p className="text-[11px] text-neutral-500 mt-1.5">
            Minimum charge allowed by Stripe in CAD (with Free GTA Shipping = {formatRs(STRIPE_TEST_PRODUCT.price)} total).
          </p>
        </div>

        <div className="space-y-3">
          <button
            type="button"
            onClick={handleBuyNow}
            className="w-full bg-[#232323] hover:bg-black text-white font-display font-bold py-3.5 rounded-full text-sm transition shadow-md"
          >
            Test Checkout Now — {formatRs(STRIPE_TEST_PRODUCT.price)} CAD
          </button>

          <button
            type="button"
            onClick={handleAddToCart}
            className="w-full bg-white border border-neutral-300 hover:bg-neutral-100 text-neutral-900 font-display font-bold py-3 rounded-full text-xs sm:text-sm transition"
          >
            Add to Cart Instead
          </button>
        </div>
      </div>
    </section>
  );
}
