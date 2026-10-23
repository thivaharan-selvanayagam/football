"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
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
    <div className="w-full min-h-screen bg-neutral-50 text-neutral-900">
      {/* Banner */}
      <div className="bg-neutral-100/80 border-b border-neutral-200/80">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <h1 className="font-display text-4xl sm:text-5xl font-black text-neutral-900 tracking-tight leading-none mb-6">
            Standard
          </h1>
          <div className="flex flex-wrap gap-x-10 gap-y-3 text-sm font-medium text-neutral-600">
            <span>🖨 Preview before printing</span>
            <span>🌍 Canadawide shipping</span>
            <span>💎 High quality print</span>
            {/* <span>↻ Free replacements</span> */}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10 grid md:grid-cols-[220px_1fr] gap-10">
        {/* Sidebar */}
        <aside className="space-y-8">
          <div>
            <h3 className="font-display font-bold text-sm text-neutral-900 mb-3 uppercase tracking-wider">
              Styles
            </h3>
            {(["Standard"] as const).map((s) => (
              <label key={s} className="flex items-center gap-2 text-sm font-medium text-neutral-700 mb-2 cursor-pointer hover:text-neutral-900">
                <input type="checkbox" checked={styleFilter === s} onChange={() => setStyleFilter(s)} className="accent-neutral-900" />
                {s}
              </label>
            ))}
          </div>
          <div>
            <h3 className="font-display font-bold text-sm text-neutral-900 mb-3 uppercase tracking-wider">
              Collections
            </h3>
            {collections.map((c) => (
              <label key={c} className="flex items-center gap-2 text-sm font-medium text-neutral-700 mb-2 cursor-pointer hover:text-neutral-900">
                <input type="checkbox" checked={activeCollections.includes(c)} onChange={() => toggleCollection(c)} className="accent-neutral-900" />
                {c}
              </label>
            ))}
          </div>
        </aside>

        {/* Grid */}
        <div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
            {pageItems.map((p) => (
              <Link 
                key={p.slug} 
                href={`/cards/${p.slug}`} 
                className="group relative block bg-white rounded-2xl border border-neutral-200/80 hover:border-neutral-300 hover:shadow-md transition duration-300 p-5 text-center"
              >
                <span className="absolute top-3 left-3 text-[10px] bg-red-600 text-white font-bold px-2 py-0.5 rounded-md z-10">
                  Sale
                </span>
                {p.bestSeller && (
                  <span className="absolute top-3 right-3 text-[10px] bg-emerald-600 text-white font-bold px-2 py-0.5 rounded-full flex items-center gap-1 z-10">
                    ★ Best Seller
                  </span>
                )}
                
                {/* Image Container */}
                <div className="relative flex justify-center mb-4 mt-2 aspect-[2/3] w-full max-w-[150px] mx-auto group-hover:-translate-y-1 transition duration-300">
                  <Image
                    src={p.frameImage}
                    alt={p.name}
                    fill
                    sizes="(max-width: 640px) 50vw, 33vw"
                    priority={true}
                    className="object-contain"
                  />
                </div>

                <h3 className="font-display font-bold text-base text-neutral-900 leading-snug mb-1 mt-4">
                  {p.name}
                </h3>
                <p className="text-sm font-bold text-neutral-900">
                  From {formatRs(p.basePrice)}{" "}
                  <span className="line-through text-xs text-neutral-400 font-medium ml-1">
                    {formatRs(p.compareAtPrice)}
                  </span>
                </p>
                <p className="text-[11px] font-bold text-emerald-600 mt-0.5">
                  You save {formatRs(p.compareAtPrice - p.basePrice)}
                </p>
              </Link>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-12">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`w-8 h-8 rounded-full text-sm font-bold transition ${
                    page === i + 1 
                      ? "bg-[#232323] text-white shadow-md" 
                      : "bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-100"
                  }`}
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