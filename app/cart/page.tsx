"use client";
import Link from "next/link";
import { useCart } from "@/lib/cart";
import { formatRs } from "@/lib/format";
import FutCard from "@/components/FutCard";
import { getProduct } from "@/lib/data";

const CART_MINI_SHIFTS = {
  meta: 0,
  name: 0,
  stats: 0,
};

export default function CartPage() {
  const { items, removeItem, updateQty, subtotal } = useCart();

  if (items.length === 0) {
    return (
      <div className="w-full min-h-screen bg-neutral-50 text-neutral-900 flex items-center justify-center py-24 px-6 text-center">
        <div className="max-w-md mx-auto">
          <h1 className="font-display font-black text-3xl text-neutral-900 mb-4">Your cart is empty</h1>
          <p className="text-neutral-500 mb-8 font-medium">Looks like you haven't designed a card yet.</p>
          <Link href="/cards" className="bg-[#232323] hover:bg-black text-white font-display font-bold px-8 py-3.5 rounded-full text-sm shadow-md transition">
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
              const baseProduct = getProduct(item.productSlug);

              return (
                <div key={item.id} className="flex gap-5 border border-neutral-200/80 rounded-2xl p-5 bg-white items-center shadow-sm">
                  <div className="shrink-0">
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
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-display font-bold text-base text-neutral-900">{item.productName}</h3>
                    <p className="text-xs text-neutral-500 mb-2 font-medium">
                      {item.style} · {item.size} · {item.position} · {item.club} · {item.country}
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

                  <div className="font-display font-bold text-lg text-neutral-900 shrink-0">
                    {formatRs((item.unitPrice + (item.addonsPrice || 0)) * item.qty)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Order Summary Box */}
        <div className="bg-white border border-neutral-200/80 rounded-2xl p-6 h-fit sticky top-28 shadow-sm">
          <h2 className="font-display font-bold text-lg text-neutral-900 mb-4">Order summary</h2>
          <div className="flex justify-between text-sm text-neutral-600 mb-2 font-medium">
            <span>Subtotal</span>
            <span className="font-bold text-neutral-900">{formatRs(subtotal)}</span>
          </div>
          <p className="text-xs text-neutral-400 mb-6 font-medium">Shipping & taxes calculated at checkout</p>
          
          {/* High-visibility checkout button */}
          <Link
            href="/checkout"
            className="block text-center bg-[#232323] hover:bg-black text-white font-display font-bold py-3.5 px-6 rounded-full text-sm shadow-md transition duration-200"
          >
            Proceed to checkout
          </Link>
          
          <Link href="/cards" className="block text-center text-sm text-neutral-500 hover:text-neutral-900 mt-4 underline underline-offset-4 font-medium">
            Continue shopping
          </Link>
        </div>
      </div>
    </div>
  );
}