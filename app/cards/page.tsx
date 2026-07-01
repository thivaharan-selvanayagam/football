"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image"; // ✨ Import Next.js optimized Image component
import { products, collections } from "@/lib/data";
import { formatRs } from "@/lib/format";

const PAGE_SIZE = 18;

export default function CardsPage() {
  const [styleFilter, setStyleFilter] = useState<"Standard" | "Metal">("Standard");
  const [activeCollections, setActiveCollections] = useState<string[]>([]);
  const [page, setPage] = useState(1);

  const toggleCollection = (c: string) => {
    setPage(1);
    setActiveCollections((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]));
  };

  const filtered = useMemo(() => {
    if (activeCollections.length === 0) return products;
    return products.filter((p) => activeCollections.includes(p.collection) || (activeCollections.includes("Best Seller") && p.bestSeller));
  }, [activeCollections]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div>
      {/* Banner */}
      <div className="bg-cream border-b border-black/5">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <h1 className="font-display text-4xl text-ink mb-6">Standard</h1>
          <div className="flex flex-wrap gap-x-10 gap-y-3 text-sm text-ink/70">
            <span>🖨 Preview before printing</span>
            <span>🌍 Worldwide shipping</span>
            <span>💎 High quality print</span>
            <span>£ Money back guarantee</span>
            <span>↻ Free replacements</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10 grid md:grid-cols-[220px_1fr] gap-10">
        {/* Sidebar */}
        <aside className="space-y-8">
          <div>
            <h3 className="font-display text-sm text-ink mb-3">Styles</h3>
            {(["Standard", "Metal"] as const).map((s) => (
              <label key={s} className="flex items-center gap-2 text-sm text-ink/80 mb-2 cursor-pointer">
                <input type="checkbox" checked={styleFilter === s} onChange={() => setStyleFilter(s)} className="accent-ink" />
                {s}
              </label>
            ))}
          </div>
          <div>
            <h3 className="font-display text-sm text-ink mb-3">Collections</h3>
            {collections.map((c) => (
              <label key={c} className="flex items-center gap-2 text-sm text-ink/80 mb-2 cursor-pointer">
                <input type="checkbox" checked={activeCollections.includes(c)} onChange={() => toggleCollection(c)} className="accent-ink" />
                {c}
              </label>
            ))}
          </div>
        </aside>

        {/* Grid */}
        <div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
            {pageItems.map((p) => (
              <Link key={p.slug} href={`/cards/${p.slug}`} className="group relative block bg-white rounded-xl border border-black/5 hover:shadow-card transition p-5 text-center">
                <span className="absolute top-3 left-3 text-[10px] bg-red-600 text-white px-2 py-0.5 rounded z-10">Sale</span>
                {p.bestSeller && (
                  <span className="absolute top-3 right-3 text-[10px] bg-emerald text-chalk px-2 py-0.5 rounded-full flex items-center gap-1 z-10">★ Best Seller</span>
                )}
                
                {/* Image Container */}
                <div className="relative flex justify-center mb-4 mt-2 aspect-[2/3] w-full max-w-[150px] mx-auto group-hover:-translate-y-1 transition duration-300">
                  {/* ✨ Clean, standard image view with no overlays ✨ */}
                  <Image
                    src={p.frameImage}
                    alt={p.name}
                    fill
                    sizes="(max-width: 640px) 50vw, 33vw"
                    priority={true}
                    className="object-contain"
                  />
                </div>

                <h3 className="font-display text-base text-ink leading-snug mb-1 mt-4">{p.name}</h3>
                <p className="text-sm font-semibold text-ink/90">
                  From {formatRs(p.basePrice)}{" "}
                  <span className="line-through text-xs text-ink/30 font-normal ml-1">{formatRs(p.compareAtPrice)}</span>
                </p>
                <p className="text-[11px] text-emerald mt-0.5">You save {formatRs(p.compareAtPrice - p.basePrice)}</p>
              </Link>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-12">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`w-8 h-8 rounded-full text-sm font-body ${page === i + 1 ? "bg-ink text-chalk" : "bg-white border border-black/10 text-ink/70"}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}