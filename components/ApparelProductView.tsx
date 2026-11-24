"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { APPAREL_SIZES, ApparelProduct } from "@/lib/data";
import { useCart, CartItem } from "@/lib/cart";
import { formatRs } from "@/lib/format";

interface ApparelProductViewProps {
  product: ApparelProduct;
  images: string[];
}

export default function ApparelProductView({ product, images }: ApparelProductViewProps) {
  const router = useRouter();
  const { addItem } = useCart();

  const gallery = images.length > 0 ? images : [product.featureImage];
  const [activeImg, setActiveImg] = useState<string>(gallery[0]);
  const [selectedSize, setSelectedSize] = useState<string>("M");
  const [qty, setQty] = useState<number>(1);

  const handleAddToCart = () => {
    const item: CartItem = {
      id: `${product.slug}-${selectedSize}-${Date.now()}`,
      itemType: "apparel",
      productSlug: product.slug,
      productName: product.name,
      name: "Shiva Italy 2027",
      style: "Apparel",
      size: selectedSize,
      position: "",
      club: "UMSC",
      country: "Canada",
      attributes: { PAC: 0, SHO: 0, PAS: 0, DRI: 0, DEF: 0, PHY: 0 },
      overall: 0,
      addons: [],
      unitPrice: product.price,
      addonsPrice: 0,
      qty: Math.max(1, qty),
      gradient: ["#111111", "#2a2a2a"],
      photo: gallery[0],
    };

    addItem(item);
    router.push("/cart");
  };

  return (
    <div className="w-full min-h-screen bg-neutral-50 text-neutral-900 py-10 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Back navigation */}
        <div className="mb-8">
          <Link
            href="/shiva#clothing"
            className="inline-flex items-center gap-2 text-sm font-bold text-neutral-600 hover:text-neutral-900 transition"
          >
            ← Back to Shiva&apos;s Fundraiser
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-10 lg:gap-14 items-start">
          {/* LEFT: Photo Gallery (1.* featured first, followed by remaining folder images) */}
          <div>
            <div className="bg-white rounded-2xl border border-neutral-200/80 p-6 sm:p-10 flex items-center justify-center aspect-square mb-4 shadow-sm overflow-hidden">
              <img
                src={activeImg}
                alt={product.title}
                className="w-full h-full object-contain transition duration-300"
              />
            </div>

            {gallery.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {gallery.map((imgSrc, idx) => {
                  const isActive = activeImg === imgSrc;
                  return (
                    <button
                      key={imgSrc}
                      type="button"
                      onClick={() => setActiveImg(imgSrc)}
                      className={`aspect-square rounded-xl bg-white p-2 border transition overflow-hidden flex items-center justify-center ${
                        isActive
                          ? "border-neutral-900 ring-2 ring-neutral-900/10 shadow-sm"
                          : "border-neutral-200/80 hover:border-neutral-400 opacity-80 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={imgSrc}
                        alt={`${product.title} view ${idx + 1}`}
                        className="w-full h-full object-contain"
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* RIGHT: Title, Price, Sizes, CTA, Description */}
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full">
                {product.badge}
              </span>
              <span className="text-[11px] font-bold uppercase tracking-wider bg-neutral-200/70 text-neutral-700 px-3 py-1 rounded-full">
                March 2027 Italy Fundraiser
              </span>
            </div>

            <h1 className="font-display font-black text-3xl sm:text-4xl text-neutral-900 mb-3">
              {product.title}
            </h1>

            <div className="flex items-baseline gap-3 mb-6">
              <span className="font-display text-3xl font-bold text-neutral-900">
                {formatRs(product.price)}
              </span>
              <span className="text-xs font-semibold text-neutral-500 uppercase">CAD</span>
            </div>

            <p className="text-sm sm:text-base text-neutral-600 font-medium leading-relaxed mb-8">
              {product.shortDesc}
            </p>

            {/* 1. Size Selector */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <p className="font-display font-bold text-sm text-neutral-900">
                  1. Select Size
                </p>
                <span className="text-xs font-bold text-neutral-500">
                  Selected: <span className="text-neutral-900">{selectedSize}</span>
                </span>
              </div>
              <div className="grid grid-cols-5 gap-2.5">
                {APPAREL_SIZES.map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => setSelectedSize(sz)}
                    className={`border rounded-xl py-3 text-sm font-bold transition ${
                      selectedSize === sz
                        ? "border-neutral-900 bg-neutral-900 text-white shadow-sm"
                        : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400"
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Quantity Selector */}
            <div className="mb-8">
              <p className="font-display font-bold text-sm text-neutral-900 mb-3">
                2. Quantity
              </p>
              <div className="inline-flex items-center border border-neutral-200 rounded-xl bg-white overflow-hidden">
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="px-4 py-2.5 text-base font-bold text-neutral-700 hover:bg-neutral-100 transition"
                >
                  −
                </button>
                <span className="px-5 py-2.5 text-sm font-display font-bold text-neutral-900 min-w-[3rem] text-center">
                  {qty}
                </span>
                <button
                  type="button"
                  onClick={() => setQty((q) => q + 1)}
                  className="px-4 py-2.5 text-base font-bold text-neutral-700 hover:bg-neutral-100 transition"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              type="button"
              onClick={handleAddToCart}
              className="w-full bg-[#232323] hover:bg-black transition text-white font-display font-bold py-4 rounded-full flex items-center justify-center gap-2 text-sm tracking-wide mb-8 shadow-md"
            >
              Add to Cart — {formatRs(product.price * qty)}
            </button>

            {/* Product Description */}
            <div className="border-t border-neutral-200/80 pt-6 text-sm text-neutral-700 leading-relaxed font-medium space-y-3">
              <h3 className="font-display font-bold text-neutral-900 text-base">
                Description
              </h3>
              {product.description.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
