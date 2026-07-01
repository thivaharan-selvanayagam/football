"use client";
import { useState } from "react";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import FutCard from "@/components/FutCard";
import { getProduct, SIZES, STYLE_DELTA, CardStyle, CardSize } from "@/lib/data";
import { formatRs } from "@/lib/format";

const sampleAttrs = { PAC: 84, SHO: 86, PAS: 82, DRI: 88, DEF: 40, PHY: 72 };

// Centralized alignment offsets calculated specifically for your .webp assets
const CARD_LAYOUT_SHIFTS = {
  meta: 35,   // Drags the '88' and 'CAM' down into the open space
  name: 18,   // Lowers the 'PLAYER' name into the glowing nameplate band
  stats: -12, // Pulls the PAC/SHO matrix up perfectly inside the bottom dark gradient arch
};

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = getProduct(params.slug);
  const router = useRouter();
  const [style, setStyle] = useState<CardStyle>("Standard");
  const [size, setSize] = useState<CardSize>("Medium");

  if (!product) return notFound();

  const sizeInfo = SIZES.find((s) => s.id === size)!;
  const price = product.basePrice + STYLE_DELTA[style] + sizeInfo.priceDelta;
  const compareAt = product.compareAtPrice + STYLE_DELTA[style] + sizeInfo.priceDelta;

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="grid md:grid-cols-2 gap-12">
        {/* Gallery */}
        <div>
          <div className="bg-cream rounded-2xl p-10 flex justify-center mb-4">
            {/* Main Preview Card with alignment fixes applied */}
            <FutCard 
              name="Player" 
              position="CAM" 
              overall={88} 
              attrs={sampleAttrs} 
              gradient={product.gradient} 
              frameImage={product.frameImage} 
              size={280} 
              textShiftY={CARD_LAYOUT_SHIFTS} 
            />
          </div>
          <div className="grid grid-cols-4 gap-3">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="bg-cream rounded-lg p-3 flex justify-center">
                {/* Thumbnails with identical alignment locks applied */}
                <FutCard 
                  name="Player" 
                  position="CAM" 
                  overall={88} 
                  attrs={sampleAttrs} 
                  gradient={product.gradient} 
                  frameImage={product.frameImage} 
                  size={60} 
                  textShiftY={CARD_LAYOUT_SHIFTS} 
                />
              </div>
            ))}
          </div>
        </div>

        {/* Details */}
        <div>
          <div className="flex items-center gap-2 text-sm text-gold mb-2">
            ★★★★★ <span className="text-ink/60">{product.rating} out of 5</span>
            {product.bestSeller && <span className="ml-2 bg-emerald text-chalk text-[10px] px-2 py-0.5 rounded-full">Best Seller</span>}
          </div>
          <h1 className="font-display text-3xl text-ink mb-3">{product.name}</h1>
          <div className="flex items-baseline gap-3 mb-1">
            <span className="font-display text-2xl text-ink">{formatRs(price)}</span>
            <span className="line-through text-ink/30">{formatRs(compareAt)}</span>
          </div>
          <p className="text-emerald text-sm mb-6">You save {formatRs(compareAt - price)}</p>

          <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-ink/60 mb-8">
            <span>💎 Incredible print quality</span>
            <span>🛡 Ultra-strong materials</span>
            <span>🖼 All photo edits done for you</span>
          </div>

          {/* Style */}
          <div className="mb-6">
            <p className="font-display text-sm text-ink mb-3">1. Select Style</p>
            <div className="grid grid-cols-2 gap-3">
              {(["Standard", "Metal"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setStyle(s)}
                  className={`border rounded-lg py-3 text-sm font-body transition ${
                    style === s ? "border-emerald bg-emerald/5 text-ink" : "border-black/10 text-ink/70"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Size */}
          <div className="mb-8">
            <p className="font-display text-sm text-ink mb-3">2. Select Size</p>
            <div className="grid grid-cols-3 gap-3">
              {SIZES.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSize(s.id)}
                  className={`border rounded-lg py-3 text-sm font-body transition relative ${
                    size === s.id ? "border-emerald bg-emerald/5 text-ink" : "border-black/10 text-ink/70"
                  }`}
                >
                  {s.id === "Medium" && (
                    <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-gold text-[9px] text-chalk px-2 py-0.5 rounded-full whitespace-nowrap">
                      Most Popular
                    </span>
                  )}
                  {s.label}
                  <div className="text-[11px] text-ink/50">{s.dim}</div>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => router.push(`/cards/${product.slug}/customize?style=${style}&size=${size}`)}
            className="w-full bg-gold hover:bg-goldlight transition text-ink font-display py-4 rounded-full flex items-center justify-center gap-2 text-sm tracking-wide mb-8"
          >
            ✎ Customise my card &nbsp; {formatRs(price)}
          </button>

          <div className="grid grid-cols-3 gap-4 text-center text-xs text-ink/60 border-t border-black/5 pt-6">
            <div>📋 Design preview before shipping</div>
            <div>£ Money Back Guarantee</div>
            <div>🚚 Fast worldwide shipping</div>
          </div>

          <div className="mt-10 border-t border-black/5 pt-6 text-sm text-ink/70 leading-relaxed">
            <h3 className="font-display text-ink mb-2">Description</h3>
            <p className="mb-3">
              Celebrate greatness with our {product.name} card — a tribute to football's most legendary names. Built for leaders,
              game-changers, and those who've earned their place in history. Classic, clean, and powerful.
            </p>
            <p>
              CardsPlug football cards are perfect for football fanatics, birthday gifts or those special achievements. Easy to use card
              builder — design preview before printing, every order backed by our Gold Standard Guarantee.
            </p>
          </div>
        </div>
      </div>

      <div className="text-center mt-16">
        <Link href="/cards" className="text-sm text-ink/60 underline underline-offset-4">
          ← Back to all cards
        </Link>
      </div>
    </div>
  );
}