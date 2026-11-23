"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart, CartItem } from "@/lib/cart";
import { APPAREL_SIZES } from "@/lib/data";
import { formatRs } from "@/lib/format";

export default function ShivaPage() {
  const router = useRouter();
  const { addItem } = useCart();

  const [tshirtSize, setTshirtSize] = useState<string>("M");
  const [hoodieSize, setHoodieSize] = useState<string>("L");

  const handleBuyApparel = (
    slug: "shiva-tshirt" | "shiva-hoodie",
    productName: string,
    price: number,
    selectedSize: string
  ) => {
    const item: CartItem = {
      id: `${slug}-${selectedSize}-${Date.now()}`,
      itemType: "apparel",
      productSlug: slug,
      productName,
      name: "Shiva Italy 2027",
      style: "Apparel",
      size: selectedSize,
      position: "",
      club: "UMSC",
      country: "Canada",
      attributes: { PAC: 0, SHO: 0, PAS: 0, DRI: 0, DEF: 0, PHY: 0 },
      overall: 0,
      addons: [],
      unitPrice: price,
      addonsPrice: 0,
      qty: 1,
      gradient: ["#111111", "#2a2a2a"],
    };

    addItem(item);
    router.push("/cart");
  };

  return (
    <div className="w-full flex flex-col">
      {/* 1. HERO SECTION — Same video background & layout as Home Hero */}
      <div className="relative w-full min-h-screen -mt-28 md:-mt-32 bg-[#060606] text-white flex flex-col overflow-hidden select-none">
        <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          >
            <source src="/hero.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="absolute inset-0 bg-black/55 backdrop-blur-[2px]" />
        </div>

        <main className="flex-1 w-full max-w-7xl mx-auto px-6 sm:px-12 flex flex-col justify-center relative z-20 pb-16 pt-36 md:pt-44">
          <div className="max-w-2xl text-left space-y-6 md:space-y-8 animate-fadeIn">
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md border border-white/20 rounded-full px-4 py-1.5 text-xs font-bold tracking-wider uppercase text-white">
              <span>🇮🇹</span> March 2027 Team Fundraiser
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-7xl font-black font-sans tracking-tight text-white leading-[1.05] drop-shadow-md">
              Help Shiva <br />
              <span className="italic font-serif font-light text-neutral-100">Go to Italy</span>
            </h1>

            <p className="text-neutral-200 text-base sm:text-lg md:text-xl font-medium max-w-lg leading-relaxed drop-shadow">
              We are fundraising to help Shiva go to Italy
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/cards"
                className="bg-white hover:bg-neutral-200 text-black font-bold px-8 py-4 rounded-xl text-sm transition shadow-lg tracking-wide"
              >
                Buy Card
              </Link>
              <a
                href="#clothing"
                className="bg-transparent hover:bg-white/10 text-white font-bold px-8 py-4 rounded-xl text-sm border border-white/30 transition tracking-wide"
              >
                Buy Clothing
              </a>
            </div>
          </div>
        </main>

        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,#060606_95%)] pointer-events-none z-10 opacity-70" />
      </div>

      {/* 2. STORY / MISSION SECTION */}
      <section className="w-full bg-white text-neutral-900 py-20 px-6 sm:px-12 md:px-24 border-b border-neutral-200/80">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          {/* Subtle Italian flag accent bar */}
          <div className="flex items-center justify-center gap-1.5">
            <span className="h-1.5 w-8 rounded-full bg-emerald-600" />
            <span className="h-1.5 w-8 rounded-full bg-neutral-200" />
            <span className="h-1.5 w-8 rounded-full bg-red-600" />
          </div>

          <h2 className="font-display text-3xl sm:text-4xl font-black text-neutral-900 tracking-tight leading-tight">
            Support Shiva&apos;s Journey to Italy
          </h2>

          <div className="bg-neutral-50 border border-neutral-200/80 rounded-2xl p-8 sm:p-10 shadow-sm space-y-4 text-neutral-700 text-base sm:text-lg leading-relaxed font-medium">
            <p>
              Shiva has been chosen to go to Italy with his Team in March 2027, please support him in his journey.
            </p>
            <p className="text-neutral-900 font-semibold">
              You have the option of purchasing a FC Card for your child or a T-Shirt or Hoodie for yourself.
            </p>
          </div>
        </div>
      </section>

      {/* 3. PURCHASE OPTIONS SECTION */}
      <section id="clothing" className="w-full bg-neutral-50 text-neutral-900 py-20 px-6 sm:px-12 md:px-24 scroll-mt-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 space-y-2">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-400">
              Ways to Support
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-black text-neutral-900 tracking-tight">
              Choose Your Support Option
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {/* Option 1: Buy Card */}
            <div className="bg-white rounded-2xl border border-neutral-200/80 p-6 sm:p-8 shadow-sm flex flex-col justify-between">
              <div>
                <div className="aspect-[4/4] rounded-2xl bg-neutral-100 border border-neutral-200/60 flex items-center justify-center p-6 mb-6 overflow-hidden">
                  <img
                    src="/images/seyon.png"
                    alt="Custom FC Card"
                    className="h-full w-auto object-contain drop-shadow-md"
                  />
                </div>
                <span className="inline-block text-[11px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full mb-3">
                  For Your Player
                </span>
                <h3 className="font-display text-2xl font-black text-neutral-900 mb-2">
                  Custom FC Card
                </h3>
                <p className="text-sm text-neutral-600 font-medium mb-6 leading-relaxed">
                  Design a personalized real-life soccer shield with your child&apos;s photo, club badge, and custom stats.
                </p>
              </div>

              <div className="pt-4 border-t border-neutral-100">
                <div className="flex items-baseline justify-between mb-4">
                  <span className="text-xs font-bold uppercase text-neutral-400">Starting at</span>
                  <span className="font-display text-2xl font-black text-neutral-900">{formatRs(45)}</span>
                </div>
                <Link
                  href="/cards"
                  className="block w-full text-center bg-[#232323] hover:bg-black text-white font-display font-bold py-3.5 rounded-full text-sm transition shadow-md"
                >
                  Buy Card
                </Link>
              </div>
            </div>

            {/* Option 2: Buy T-Shirt - $35 */}
            <div className="bg-white rounded-2xl border border-neutral-200/80 p-6 sm:p-8 shadow-sm flex flex-col justify-between">
              <div>
                <div className="aspect-[4/4] rounded-2xl bg-neutral-100 border border-neutral-200/60 flex flex-col items-center justify-center p-6 mb-6">
                  <svg
                    className="w-28 h-28 text-neutral-800 mb-3"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20.38 3.46L16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z" />
                  </svg>
                  <span className="text-xs font-bold tracking-widest uppercase text-neutral-500">
                    SAS Sports · Italy 2027
                  </span>
                </div>

                <span className="inline-block text-[11px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full mb-3">
                  Supporter Apparel
                </span>
                <h3 className="font-display text-2xl font-black text-neutral-900 mb-2">
                  Supporter T-Shirt
                </h3>
                <p className="text-sm text-neutral-600 font-medium mb-5 leading-relaxed">
                  Comfortable everyday supporter tee — 100% of proceeds help fund Shiva&apos;s March 2027 trip to Italy.
                </p>

                {/* Size Selector */}
                <div className="mb-6">
                  <label className="block text-xs font-bold text-neutral-700 mb-2">
                    Select Size: <span className="text-neutral-900">{tshirtSize}</span>
                  </label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {APPAREL_SIZES.map((sz) => (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => setTshirtSize(sz)}
                        className={`py-1.5 rounded-lg text-xs font-bold border transition ${
                          tshirtSize === sz
                            ? "bg-neutral-900 text-white border-neutral-900"
                            : "bg-neutral-50 text-neutral-700 border-neutral-200 hover:border-neutral-400"
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-100">
                <div className="flex items-baseline justify-between mb-4">
                  <span className="text-xs font-bold uppercase text-neutral-400">Price</span>
                  <span className="font-display text-2xl font-black text-neutral-900">{formatRs(35)}</span>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    handleBuyApparel("shiva-tshirt", "Support Shiva — T-Shirt", 35, tshirtSize)
                  }
                  className="w-full bg-[#232323] hover:bg-black text-white font-display font-bold py-3.5 rounded-full text-sm transition shadow-md"
                >
                  Buy T-Shirt — $35
                </button>
              </div>
            </div>

            {/* Option 3: Buy Hoodie - $60 */}
            <div className="bg-white rounded-2xl border border-neutral-200/80 p-6 sm:p-8 shadow-sm flex flex-col justify-between">
              <div>
                <div className="aspect-[4/4] rounded-2xl bg-neutral-100 border border-neutral-200/60 flex flex-col items-center justify-center p-6 mb-6">
                  <svg
                    className="w-28 h-28 text-neutral-800 mb-3"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M16 3c-1.2 1.2-2.5 2-4 2s-2.8-.8-4-2L3 6l-1 8h4v7h12v-7h4l-1-8-5-3z" />
                    <path d="M9 5v4M15 5v4" />
                  </svg>
                  <span className="text-xs font-bold tracking-widest uppercase text-neutral-500">
                    SAS Sports · Italy 2027
                  </span>
                </div>

                <span className="inline-block text-[11px] font-bold uppercase tracking-wider bg-neutral-900 text-white px-2.5 py-1 rounded-full mb-3">
                  Premium Fleece
                </span>
                <h3 className="font-display text-2xl font-black text-neutral-900 mb-2">
                  Supporter Hoodie
                </h3>
                <p className="text-sm text-neutral-600 font-medium mb-5 leading-relaxed">
                  Warm, heavyweight sideline hoodie — support Shiva&apos;s journey to Italy in style on and off the pitch.
                </p>

                {/* Size Selector */}
                <div className="mb-6">
                  <label className="block text-xs font-bold text-neutral-700 mb-2">
                    Select Size: <span className="text-neutral-900">{hoodieSize}</span>
                  </label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {APPAREL_SIZES.map((sz) => (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => setHoodieSize(sz)}
                        className={`py-1.5 rounded-lg text-xs font-bold border transition ${
                          hoodieSize === sz
                            ? "bg-neutral-900 text-white border-neutral-900"
                            : "bg-neutral-50 text-neutral-700 border-neutral-200 hover:border-neutral-400"
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-100">
                <div className="flex items-baseline justify-between mb-4">
                  <span className="text-xs font-bold uppercase text-neutral-400">Price</span>
                  <span className="font-display text-2xl font-black text-neutral-900">{formatRs(60)}</span>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    handleBuyApparel("shiva-hoodie", "Support Shiva — Hoodie", 60, hoodieSize)
                  }
                  className="w-full bg-[#232323] hover:bg-black text-white font-display font-bold py-3.5 rounded-full text-sm transition shadow-md"
                >
                  Buy Hoodie — $60
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. THANK YOU SECTION */}
      <section className="w-full bg-[#181818] text-white py-20 px-6 sm:px-12 md:px-24">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <span className="inline-block text-2xl">⚽🇮🇹</span>
          <h2 className="font-display text-2xl sm:text-4xl font-black tracking-tight text-white leading-snug">
            Thank you for helping Shiva on his trip to Italy.
          </h2>
        </div>
      </section>
    </div>
  );
}
