"use client";

import React from "react";

export default function ProductFeature() {
  return (
    <section className="w-full min-h-screen bg-white text-neutral-900 flex items-center justify-center py-16 px-6 sm:px-12 md:px-24">
      <div className="w-full max-w-7xl mx-auto grid md:grid-cols-2 gap-12 md:gap-16 items-center">
        
        {/* LEFT COLUMN: PRODUCT INFORMATIVE CONTENT TEXTS */}
        <div className="space-y-6 max-w-xl animate-fadeIn">
          
          {/* Subtle Top Accent Tags */}
          <div className="space-y-3">
            <span className="inline-block bg-neutral-100 text-neutral-700 text-[11px] font-medium px-2.5 py-1 rounded-md tracking-wide border border-neutral-200/60">
              2026 Design
            </span>
            <p className="text-[11px] font-bold tracking-[0.2em] text-neutral-400 uppercase">
              Designed with Quality
            </p>
          </div>

          {/* Core Feature Title */}
          <h2 className="text-4xl sm:text-5xl font-black text-neutral-900 tracking-tight leading-none">
            Soccer Player Cards
          </h2>

          {/* Ratings Panel Line Wrapper */}
          <div className="flex items-center gap-2 text-sm font-medium text-neutral-600">
            <div className="flex text-amber-400 text-base">★★★★☆</div>
            <span><strong className="text-neutral-900">4.9</strong> (47 reviews)</span>
          </div>

          {/* Pricing Row Layer Block */}
          <div className="flex items-center gap-3 pt-1">
            <span className="text-3xl font-black text-neutral-900">From $41</span>
            <span className="text-neutral-400 line-through text-lg font-medium">From $60</span>
            <span className="bg-neutral-100 text-neutral-800 font-bold text-[10px] px-2 py-1 rounded-md border border-neutral-200/80">
              Save 32%
            </span>
          </div>

          {/* Explanatory Product Copy Description */}
          <p className="text-neutral-600 text-sm sm:text-base leading-relaxed font-medium">
            A statement piece for your living room. Each table is individually crafted from sustainably sourced walnut, featuring organic curves and a hand-rubbed oil finish that highlights the natural grain.
          </p>

          {/* Detailed Bullet Points Grid Callout list wrapper */}
          <ul className="space-y-2.5 text-xs font-bold tracking-wide text-neutral-700 pt-2">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-neutral-900 rounded-full shrink-0" />
              Sustainably sourced American walnut
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-neutral-900 rounded-full shrink-0" />
              Hand-rubbed natural oil finish
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-neutral-900 rounded-full shrink-0" />
              Unique grain patterns on every piece
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-neutral-900 rounded-full shrink-0" />
              10-year craftsmanship warranty
            </li>
          </ul>

          {/* Core Action Call To Action Shopping Link Button element */}
          <div className="pt-4">
            <button
              type="button"
              onClick={() => {
                document.getElementById("customizer-root")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="bg-[#232323] hover:bg-black text-white px-6 py-3.5 rounded-xl text-sm font-bold tracking-wide transition shadow-md flex items-center gap-2.5"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" />
              </svg>
              Shop Now
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: REPLACED WITH STATIC LOGO / IMAGE VIEW CONTAINER */}
        <div className="relative flex items-center justify-center p-4">
          
          {/* Discount Percentage Float Drop Badge */}
          <div className="absolute top-4 right-4 sm:right-12 bg-black text-white font-black text-xs px-2.5 py-1 rounded-full shadow tracking-wider z-20">
            -32%
          </div>

          {/* Clean Static Image Frame Display */}
          <div className="relative max-w-[380px] w-full transform hover:scale-[1.01] transition duration-500 filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.08)] z-10">
            <img
              src="/images/seyon.png" // 👈 Change this to match your actual image file name inside public/images
              alt="Soccer Card Presentation Showcase"
              className="w-full h-auto object-contain rounded-2xl"
            />
          </div>
        </div>

      </div>
    </section>
  );
}