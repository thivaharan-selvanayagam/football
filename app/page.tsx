import Link from "next/link";
import FutCard from "@/components/FutCard";
import { products } from "@/lib/data";
import { formatRs } from "@/lib/format";
import Hero from "@/components/Hero";

const sampleAttrs = { PAC: 88, SHO: 91, PAS: 84, DRI: 90, DEF: 38, PHY: 76 };

export default function HomePage() {
  const featured = products.slice(0, 4);
  return (
    <div>
      {/* Hero */}
      <Hero />
      <section className="relative overflow-hidden bg-ink text-chalk">
        <div className="absolute inset-0 opacity-[0.08] bg-grain [background-size:18px_18px]" />
        <div className="max-w-7xl mx-auto px-6 py-20 md:py-28 grid md:grid-cols-2 gap-12 items-center relative">
          <div>
            <p className="uppercase tracking-[0.3em] text-gold text-xs font-body mb-5">Your name. Your stats. Your legend.</p>
            <h1 className="font-display text-5xl md:text-6xl leading-[1.05] mb-6">
              Turn anyone into a <span className="text-gold">Football Icon</span>
            </h1>
            <p className="text-chalk/70 text-lg mb-8 max-w-md">
              Build a real, printed FUT-style football card with your own photo, name and ratings — gifted, framed, or hung on the wall.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/cards" className="bg-gold hover:bg-goldlight transition text-ink font-display px-7 py-3.5 rounded-full text-sm tracking-wide">
                Shop Cards
              </Link>
              <Link href="/faq" className="border border-chalk/30 hover:border-chalk/60 transition px-7 py-3.5 rounded-full text-sm tracking-wide">
                How it works
              </Link>
            </div>
            <div className="flex gap-8 mt-12 text-sm text-chalk/60">
              <div><div className="text-2xl font-display text-chalk">350K+</div>Happy customers</div>
              <div><div className="text-2xl font-display text-chalk">4.6/5</div>8,160+ reviews</div>
              <div><div className="text-2xl font-display text-chalk">60+</div>Card designs</div>
            </div>
          </div>
          <div className="flex justify-center md:justify-end gap-6">
            <div className="rotate-[-6deg] -mr-10 mt-8 hidden sm:block opacity-80">
              <FutCard name="Lucas" position="ST" overall={93} attrs={sampleAttrs} gradient={["#cfcfcf", "#8c8c8c"]} size={190} />
            </div>
            <div className="rotate-[4deg] shadow-card rounded-xl">
              <FutCard name="Thivaharan" position="CAM" overall={91} attrs={{ PAC: 80, SHO: 88, PAS: 90, DRI: 92, DEF: 47, PHY: 70 }} gradient={["#C99A3C", "#E8C77A"]} size={230} />
            </div>
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="bg-cream border-y border-black/5">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-wrap justify-center gap-x-12 gap-y-3 text-sm text-ink/70 font-body">
          <span>🖨 Preview before printing</span>
          <span>🌍 Worldwide shipping</span>
          <span>💎 High quality print</span>
          <span>£ Money back guarantee</span>
          <span>↻ Free replacements</span>
        </div>
      </section>

      {/* Featured products */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="uppercase tracking-[0.25em] text-gold text-xs mb-2">FC26 Collection</p>
            <h2 className="font-display text-3xl md:text-4xl text-ink">Most loved designs</h2>
          </div>
          <Link href="/cards" className="text-sm font-display text-ink underline underline-offset-4 hidden sm:block">
            View all cards
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {featured.map((p) => (
            <Link key={p.slug} href={`/cards/${p.slug}`} className="group block bg-white rounded-xl border border-black/5 hover:shadow-card transition p-5">
              {p.bestSeller && (
                <span className="inline-block text-[10px] font-body bg-emerald text-chalk px-2 py-0.5 rounded-full mb-3">Best Seller</span>
              )}
              <div className="flex justify-center mb-4 group-hover:-translate-y-1 transition">
                <FutCard name="Player" position="CAM" overall={88} attrs={sampleAttrs} gradient={p.gradient} size={140} />
              </div>
              <h3 className="font-display text-sm text-ink leading-snug mb-1">{p.name}</h3>
              <p className="text-xs text-ink/60">
                From {formatRs(p.basePrice)} <span className="line-through text-ink/30">{formatRs(p.compareAtPrice)}</span>
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-cream py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="font-display text-3xl md:text-4xl text-ink text-center mb-12">From photo to printed icon</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { t: "Upload & design", d: "Pick a design, upload a photo, choose name, club, flag and ratings." },
              { t: "We perfect it", d: "Our design team edits your photo and sends a preview before printing." },
              { t: "Printed & shipped", d: "Premium materials, packed with care, shipped worldwide." },
            ].map((s, i) => (
              <div key={s.t} className="bg-white rounded-xl p-8 border border-black/5">
                <div className="w-10 h-10 rounded-full bg-ink text-chalk flex items-center justify-center font-display mb-5">{i + 1}</div>
                <h3 className="font-display text-lg text-ink mb-2">{s.t}</h3>
                <p className="text-sm text-ink/60">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-6 py-20 text-center">
        <h2 className="font-display text-3xl md:text-4xl text-ink mb-4">Ready to build your card?</h2>
        <p className="text-ink/60 mb-8 max-w-md mx-auto">World Cup sale — 40% off sitewide, for a limited time.</p>
        <Link href="/cards" className="inline-block bg-ink hover:bg-ink/90 transition text-chalk font-display px-8 py-4 rounded-full text-sm tracking-wide">
          Start designing
        </Link>
      </section>
    </div>
  );
}
