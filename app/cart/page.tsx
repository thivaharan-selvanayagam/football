"use client";
import Link from "next/link";
import { useCart } from "@/lib/cart";
import { formatRs } from "@/lib/format";
import FutCard from "@/components/FutCard";
import { getProduct } from "@/lib/data"; // ✨ Import getProduct to lookup the frameImage path dynamically

// ✨ Offsets calibrated specifically for the mini 90px card view in the cart panel
const CART_MINI_SHIFTS = {
  meta: 45,   
  name: 30,   
  stats: 5,   
};

export default function CartPage() {
  const { items, removeItem, updateQty, subtotal } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-24 text-center">
        <h1 className="font-display text-3xl text-ink mb-4">Your cart is empty</h1>
        <p className="text-ink/60 mb-8">Looks like you haven't designed a card yet.</p>
        <Link href="/cards" className="bg-gold text-ink font-display px-6 py-3 rounded-full text-sm">
          Shop Cards
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 grid lg:grid-cols-[1fr_360px] gap-12">
      <div>
        <h1 className="font-display text-3xl text-ink mb-8">Your Cart</h1>
        <div className="space-y-6">
          {items.map((item) => {
            // ✨ Look up the matching base product schema to grab its custom .webp path
            const baseProduct = getProduct(item.productSlug);

            return (
              <div key={item.id} className="flex gap-5 border border-black/5 rounded-xl p-5 bg-white items-center">
                <FutCard
                  name={item.name}
                  position={item.position}
                  overall={item.overall}
                  attrs={item.attributes}
                  gradient={item.gradient}
                  frameImage={baseProduct?.frameImage} // ✨ PASS YOUR WEBPCARD PATH DIRECTLY HERE
                  textShiftY={CART_MINI_SHIFTS}       // ✨ SECURE DYNAMIC TYPE SPACING ALIGNMENTS
                  photo={item.photo}                   // Passes customer uploaded face file if stored
                  size={90}
                />
                <div className="flex-1">
                  <h3 className="font-display text-ink">{item.productName}</h3>
                  <p className="text-xs text-ink/50 mb-2">
                    {item.style} · {item.size} · {item.position} · {item.club} · {item.country}
                  </p>
                  {item.addons.length > 0 && (
                    <p className="text-xs text-ink/50 mb-2">Add-ons: {item.addons.length}</p>
                  )}
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      min={1}
                      value={item.qty}
                      onChange={(e) => updateQty(item.id, Number(e.target.value))}
                      className="w-16 border border-black/10 rounded-lg px-2 py-1 text-sm"
                    />
                    <button onClick={() => removeItem(item.id)} className="text-xs text-red-600 underline">
                      Remove
                    </button>
                  </div>
                </div>
                <div className="font-display text-ink">{formatRs((item.unitPrice + item.addonsPrice) * item.qty)}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-cream rounded-xl p-6 h-fit sticky top-24">
        <h2 className="font-display text-lg text-ink mb-4">Order summary</h2>
        <div className="flex justify-between text-sm text-ink/70 mb-2">
          <span>Subtotal</span>
          <span>{formatRs(subtotal)}</span>
        </div>
        <p className="text-xs text-ink/50 mb-4">Shipping & taxes calculated at checkout</p>
        <Link
          href="/checkout"
          className="block text-center bg-emerald hover:bg-emerald/90 transition text-chalk font-display py-3.5 rounded-full text-sm"
        >
          Proceed to checkout
        </Link>
        <Link href="/cards" className="block text-center text-sm text-ink/60 mt-4 underline underline-offset-4">
          Continue shopping
        </Link>
      </div>
    </div>
  );
}