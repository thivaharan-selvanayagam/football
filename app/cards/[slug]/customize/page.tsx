"use client";

import { Suspense, useState, useRef, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { notFound } from "next/navigation";
import FutCard from "@/components/FutCard";
import {
  getProduct, SIZES, STYLE_DELTA, CardStyle, CardSize,
  POSITIONS, CLUBS, COUNTRIES, ADDONS,
} from "@/lib/data";
import { formatRs } from "@/lib/format";
import { useCart, CartItem } from "@/lib/cart";
import ImageCropper from "@/components/ImageCropper";
import { getCroppedImg } from "@/lib/cropImage"; // ✨ Import our new processing helper
import EditImageModal from "@/components/EditImageModal"; // ✨ Import the new modal overlay

type Attrs = { PAC: number; SHO: number; PAS: number; DRI: number; DEF: number; PHY: number };

const STEP_PCT = [20, 40, 60, 80, 90];

// ✨ Centralized alignment offsets engineered specifically for your webp frame images
const CARD_LAYOUT_SHIFTS = {
  meta: 0,
  name: 0,
  stats: 0,
};

export default function CustomizePage({ params }: { params: { slug: string } }) {
  return (
    <Suspense fallback={null}>
      <CustomizeInner params={params} />
    </Suspense>
  );
}

function CustomizeInner({ params }: { params: { slug: string } }) {
  const product = getProduct(params.slug);
  const router = useRouter();
  const search = useSearchParams();
  const { addItem } = useCart();
  const fileRef = useRef<HTMLInputElement>(null);

  const style = (search.get("style") as CardStyle) || "Standard";
  const size = (search.get("size") as CardSize) || "Medium";

  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);
  const [posGroup, setPosGroup] = useState<keyof typeof POSITIONS>("Midfield");
  const [position, setPosition] = useState("CAM");
  const [club, setClub] = useState("Barcelona");
  const [country, setCountry] = useState("Canada");
  const [attrs, setAttrs] = useState<Attrs>({ PAC: 50, SHO: 70, PAS: 30, DRI: 47, DEF: 58, PHY: 46 });
  const [overall, setOverall] = useState(51);
  const [confirmed, setConfirmed] = useState(false);
  const [selectedAddons, setSelectedAddons] = useState<string[]>(
    ADDONS.filter((a) => a.defaultOn).map((a) => a.id)
  );

  const [isCustomClub, setIsCustomClub] = useState(false);
const [customClubName, setCustomClubName] = useState("");
const [clubBadge, setClubBadge] = useState<string | null>(null);
const customBadgeRef = useRef<HTMLInputElement>(null);

  if (!product) return notFound();

  const sizeInfo = SIZES.find((s) => s.id === size)!;
  const basePrice = product.basePrice + STYLE_DELTA[style] + sizeInfo.priceDelta;
  const addonsPrice = selectedAddons.reduce((sum, id) => {
    const a = ADDONS.find((x) => x.id === id);
    return sum + (a ? a.price : 0);
  }, 0);

  const randomiseAttrs = () => {
    const a: Attrs = {
      PAC: Math.floor(Math.random() * 60) + 30,
      SHO: Math.floor(Math.random() * 60) + 30,
      PAS: Math.floor(Math.random() * 60) + 30,
      DRI: Math.floor(Math.random() * 60) + 30,
      DEF: Math.floor(Math.random() * 60) + 30,
      PHY: Math.floor(Math.random() * 60) + 30,
    };
    setAttrs(a);
    const avg = Math.round((a.PAC + a.SHO + a.PAS + a.DRI + a.DEF + a.PHY) / 6);
    setOverall(avg);
  };

 const onPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      setRawUpload(reader.result as string);
      setIsModalOpen(true); // Open the popup instantly when the file finishes loading!
    };
    reader.readAsDataURL(file);
  }
}

  const toggleAddon = (id: string) => {
    setSelectedAddons((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const canNext = () => {
    if (step === 1) return name.trim().length > 0;
    if (step === 4) return confirmed;
    return true;
  };

  const handleNext = () => {
    if (step < 5) setStep(step + 1);
    else {
      const item: CartItem = {
        id: `${Date.now()}`,
        productSlug: product.slug,
        productName: product.name,
        name,
        style,
        size,
        position,
        club,
        country,
        attributes: attrs,
        overall,
        addons: selectedAddons,
        unitPrice: basePrice,
        addonsPrice,
        qty: 1,
        gradient: product.gradient,
      };
      addItem(item);
      router.push("/cart");
    }
  };

  const clubInitial = club.slice(0, 2).toUpperCase();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rawUpload, setRawUpload] = useState<string | null>(null); // Keeps track of uncropped original upload

  return (
    <div className="min-h-screen bg-cream grid md:grid-cols-2">
      {/* Left: form */}
      <div className="px-6 sm:px-12 py-12 max-w-xl mx-auto md:mx-0 md:ml-auto w-full">
        <p className="font-display text-7xl text-ink/10 mb-2 leading-none">{step}</p>

       {step === 1 && (
        <StepWrap title="Basic information" subtitle="Enter name, upload an image and choose a position.">
          <Card>
            <SectionLabel letter="A" title="Name & image upload" />
            <label className="block text-xs text-ink/60 mb-1">Enter name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Thivaharan"
              className="w-full border border-black/10 rounded-lg px-4 py-3 mb-4 font-display text-lg text-ink focus-ring"
            />
            
            <div className="flex items-center gap-4">
              {photo ? (
                <img src={photo} alt="upload" className="w-16 h-16 rounded-lg object-cover border border-black/5" />
              ) : (
                <div className="w-16 h-16 rounded-lg bg-cream border border-dashed border-black/20" />
              )}
              
              {/* Trigger Button handles both regular file picking or invoking your side-by-side modal popup */}
              <button
                type="button"
                onClick={() => {
                  if (photo) {
                    setIsModalOpen(true); // Re-opens your gorgeous side-by-side editing tool modal!
                  } else {
                    fileRef.current?.click();
                  }
                }}
                className="flex-1 border border-dashed border-black/20 rounded-lg py-4 text-sm text-ink/60 hover:border-ink/40 transition font-medium"
              >
                {photo ? "Edit Photo Framing" : "Click to upload a photo"}
              </button>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onPhotoChange} />
            </div>

            {/* ✨ RENDER FULL SIDE-BY-SIDE MODAL OVERLAY SEPARATELY OUTSIDE INLINE MARGINS ✨ */}
            {rawUpload && (
              <EditImageModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                imageSrc={rawUpload}
                onSave={(croppedRes) => setPhoto(croppedRes)} // Commits canvas string into the app state core variables
                cardData={{
                  name: name || "Player",
                  position: position,
                  overall: overall,
                  attrs: attrs,
                  gradient: product.gradient,
                  frameImage: product.frameImage,
                }}
              />
            )}
          </Card>

          <Card>
            <SectionLabel letter="B" title="Choose a position" />
            <div className="flex gap-6 text-sm font-display mb-4 border-b border-black/5">
              {(Object.keys(POSITIONS) as (keyof typeof POSITIONS)[]).map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => { setPosGroup(g); setPosition(POSITIONS[g][0]); }}
                  className={`pb-3 -mb-px border-b-2 transition ${posGroup === g ? "border-ink text-ink" : "border-transparent text-ink/40"}`}
                >
                  {g}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
              {POSITIONS[posGroup].map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPosition(p)}
                  className={`border rounded-lg py-2 text-sm flex items-center justify-center gap-1 transition ${
                    position === p ? "border-ink bg-ink text-chalk" : "border-black/10 text-ink/70"
                  }`}
                >
                  {position === p && "✓"} {p}
                </button>
              ))}
            </div>
          </Card>
        </StepWrap>
      )}

        {step === 2 && (
  <StepWrap title="Club badge customisation" subtitle="Choose a club badge or upload a custom one.">
    <Card>
      <SectionLabel letter="C" title="Choose a club" />
      
      {/* Dynamic Toggle Options */}
      <div className="grid grid-cols-2 gap-2 mb-6 bg-cream/50 p-1 rounded-xl border border-black/5">
        <button
          type="button"
          onClick={() => setIsCustomClub(false)}
          className={`py-2 text-xs font-display rounded-lg transition ${
            !isCustomClub ? "bg-white text-ink shadow-sm" : "text-ink/60 hover:text-ink"
          }`}
        >
          Search Preset Clubs
        </button>
        <button
          type="button"
          onClick={() => setIsCustomClub(true)}
          className={`py-2 text-xs font-display rounded-lg transition ${
            isCustomClub ? "bg-white text-ink shadow-sm" : "text-ink/60 hover:text-ink"
          }`}
        >
          + Custom Badge
        </button>
      </div>

      {!isCustomClub ? (
        /* STANDARD CLUB SEARCH LOGIC PANEL */
        <div className="animate-fadeIn">
          <input 
            placeholder="Search clubs name" 
            className="w-full border border-black/10 rounded-lg px-4 py-3 mb-4 text-sm focus-ring" 
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {CLUBS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => {
                  setClub(c);
                  // Assuming your CLUBS object array map has placeholder images matching the asset title strings,
                  // pass a static URL here, or default back to initials if using simple text values:
                  setClubBadge(`/images/presets/${c.toLowerCase().replace(/\s+/g, "-")}.png`);
                }}
                className={`border rounded-full py-2 px-3 text-sm flex items-center gap-2 ${
                  club === c ? "border-ink bg-ink text-chalk" : "border-black/10 text-ink/70"
                }`}
              >
                {club === c && "✓"} {c}
              </button>
            ))}
          </div>
        </div>
      ) : (
        /* CUSTOM CREATOR FLOW INTERFACE PANEL */
        <div className="space-y-4 animate-fadeIn">
          {/* Custom Club Name Text Field Input */}
          <div>
            <label className="block text-xs text-ink/60 mb-1 font-medium">Custom Club Name</label>
            <input
              type="text"
              value={customClubName}
              onChange={(e) => {
                setCustomClubName(e.target.value);
                setClub(e.target.value); // Syncs standard state naming key variables
              }}
              placeholder="e.g. Tangalle FC"
              className="w-full border border-black/10 rounded-lg px-4 py-2.5 text-sm text-ink focus-ring font-medium"
            />
          </div>

          {/* Custom Badge Logo File Upload Section */}
          <div>
            <label className="block text-xs text-ink/60 mb-1.5 font-medium">Upload Badge Photo</label>
            <div className="flex items-center gap-4">
              {clubBadge ? (
                <img 
                  src={clubBadge} 
                  alt="badge upload thumbnail" 
                  className="w-12 h-12 rounded-full object-cover border border-black/10 p-0.5 bg-white shadow-sm" 
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-cream border border-dashed border-black/20 flex items-center justify-center text-ink/30 text-xs font-bold">
                  LOGO
                </div>
              )}
              
              <button
                type="button"
                onClick={() => customBadgeRef.current?.click()}
                className="flex-1 text-left border border-dashed border-black/20 rounded-lg px-4 py-3 text-xs text-ink/60 bg-white hover:border-ink/40 transition font-medium"
              >
                {clubBadge ? "Change emblem image" : "Click to select logo file (PNG/JPG)"}
              </button>
              
              <input
                ref={customBadgeRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = () => {
                      setClubBadge(reader.result as string); // Feeds base64 file string data right to the card template mask!
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
            </div>
          </div>
        </div>
      )}
    </Card>
  </StepWrap>
)}

        {step === 3 && (
          <StepWrap title="Country flag customisation" subtitle="Choose a country or upload a custom one.">
            <Card>
              <SectionLabel letter="D" title="Choose a country flag" />
              <input placeholder="Search country name" className="w-full border border-black/10 rounded-lg px-4 py-3 mb-4 text-sm focus-ring" />
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {COUNTRIES.map((c) => (
                  <button
                    key={c}
                    onClick={() => setCountry(c)}
                    className={`border rounded-full py-2 px-3 text-sm flex items-center gap-2 ${
                      country === c ? "border-ink bg-ink text-chalk" : "border-black/10 text-ink/70"
                    }`}
                  >
                    {country === c && "✓"} {c}
                  </button>
                ))}
              </div>
            </Card>
          </StepWrap>
        )}

        {step === 4 && (
          <StepWrap title="Attributes customisation" subtitle="Customise attributes and ratings or randomise them all.">
            <Card>
              <div className="flex items-center justify-between mb-4">
                <SectionLabel letter="E" title="Choose attributes" />
                <button onClick={randomiseAttrs} className="text-xs font-display border border-black/10 rounded-full px-3 py-1.5 text-ink/70">
                  ↻ Randomise
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {(Object.keys(attrs) as (keyof Attrs)[]).map((k) => (
                  <div key={k} className="flex items-center justify-between border border-black/10 rounded-lg px-4 py-2.5">
                    <input
                      type="number"
                      min={0}
                      max={99}
                      value={attrs[k]}
                      onChange={(e) =>
                        setAttrs({ ...attrs, [k]: Math.max(0, Math.min(99, Number(e.target.value))) })
                      }
                      className="w-12 font-display text-lg text-ink outline-none"
                    />
                    <span className="text-xs text-ink/50">{k}</span>
                  </div>
                ))}
              </div>
            </Card>
            <Card>
              <SectionLabel letter="F" title="Overall rating" />
              <div className="flex items-center gap-4 mb-4">
                <input
                  type="number"
                  value={overall}
                  onChange={(e) => setOverall(Number(e.target.value))}
                  className="w-20 border border-black/10 rounded-lg px-3 py-2 font-display text-lg text-center"
                />
                <span className="text-xs text-ink/50">Suggested ratings:</span>
                {[overall, overall + 1, overall + 2].map((v) => (
                  <button key={v} onClick={() => setOverall(v)} className="w-9 h-9 rounded-full bg-cream border border-black/10 text-sm">
                    {v}
                  </button>
                ))}
              </div>
              <label className="flex gap-3 text-xs text-ink/60 leading-relaxed cursor-pointer">
                <input type="checkbox" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} className="mt-0.5 accent-ink" />
                I have reviewed my card customisation and can confirm all information is correct. I acknowledge that upon purchase changes
                are limited and no refunds can be issued.
              </label>
            </Card>
          </StepWrap>
        )}

        {step === 5 && (
          <StepWrap title="Recommended for you" subtitle="Add these to complete the ultimate football gift">
            <Card>
              <div className="divide-y divide-black/5">
                {ADDONS.map((a) => (
                  <div key={a.id} className="py-4 flex items-start justify-between gap-4">
                    <div className={a.outOfStock ? "opacity-40" : ""}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-display text-sm text-ink">{a.name}</span>
                        {a.badge && (
                          <span className="text-[10px] bg-emerald/10 text-emerald px-2 py-0.5 rounded-full">{a.badge}</span>
                        )}
                        {a.outOfStock && <span className="text-[10px] bg-black/5 text-ink/50 px-2 py-0.5 rounded-full">Out Of Stock</span>}
                      </div>
                      <p className="text-xs text-ink/60 mb-1 max-w-sm">{a.desc}</p>
                      <p className="text-sm">
                        <span className="text-emerald font-display">{formatRs(a.price)}</span>{" "}
                        {a.compareAt && <span className="line-through text-ink/30 text-xs">{formatRs(a.compareAt)}</span>}
                      </p>
                    </div>
                    <button
                      disabled={a.outOfStock}
                      onClick={() => toggleAddon(a.id)}
                      className={`w-6 h-6 rounded-md border flex items-center justify-center shrink-0 mt-1 ${
                        selectedAddons.includes(a.id) ? "bg-ink border-ink text-chalk" : "border-black/20"
                      } ${a.outOfStock ? "cursor-not-allowed" : ""}`}
                    >
                      {selectedAddons.includes(a.id) && "✓"}
                    </button>
                  </div>
                ))}
              </div>
            </Card>
          </StepWrap>
        )}

        {/* Nav */}
        <div className="flex items-center gap-4 mt-8 sticky bottom-4">
          <button
            onClick={() => (step === 1 ? router.push(`/cards/${product.slug}`) : setStep(step - 1))}
            className="bg-white border border-black/10 rounded-full px-5 py-3 text-sm font-display text-ink/70 shrink-0"
          >
            ← {step === 1 ? "Return to product" : "Back"}
          </button>
          <div className="flex-1 h-2 bg-black/5 rounded-full relative">
            <div
              className="h-full bg-ink rounded-full transition-all"
              style={{ width: `${STEP_PCT[step - 1]}%` }}
            />
          </div>
          <button
            onClick={handleNext}
            disabled={!canNext()}
            className="bg-emerald hover:bg-emerald/90 disabled:opacity-40 transition text-chalk rounded-full px-5 py-3 text-sm font-display shrink-0"
          >
            {formatRs(basePrice + addonsPrice)} | {step === 5 ? "Add to cart" : "Next"} →
          </button>
        </div>
      </div>

      {/* Right: live preview */}
      <div className="hidden md:flex flex-col items-center justify-center bg-white border-l border-black/5 py-12 px-8 relative">
        <p className="font-display text-lg text-ink mb-1 flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-gold inline-block" /> CardsPlug
        </p>
        <span className="text-[11px] bg-cream text-ink/60 px-3 py-1 rounded-full mb-6">Preview Only</span>
        
        {/* ✨ UPDATED PROP ROUTE FOR YOUR FRAME IMAGE AND OFFSET LOCKS BELOW ✨ */}
        <FutCard
          name={name || "Player"}
          position={position}
          overall={overall}
          attrs={attrs}
          gradient={product.gradient}
          frameImage={product.frameImage} // ✨ PASS THE CUSTOM WEBPCARD ASSET LAYER HERE
          textShiftY={CARD_LAYOUT_SHIFTS} // ✨ ATTACH TEXT SHIFT ALIGNMENT
          photo={photo}
          clubInitial={clubInitial}
          size={260}
        />
        
        <button className="mt-4 text-xs border border-black/10 rounded-full px-4 py-2 text-ink/70">✎ Edit Image</button>
        <h3 className="font-display text-xl text-ink mt-6 text-center">{product.name}</h3>
        <p className="text-xs text-ink/50 mt-1">
          {style} / {size} {sizeInfo.dim}
        </p>
        <p className="text-xs text-gold mt-2">★★★★★ {product.rating} out of 5</p>
      </div>
    </div>
  );
}

function StepWrap({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div>
      <h1 className="font-display text-2xl text-ink mb-1">{title}</h1>
      <p className="text-sm text-ink/60 mb-6">{subtitle}</p>
      <div className="space-y-5">{children}</div>
    </div>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return <div className="bg-white rounded-xl border border-black/5 p-6">{children}</div>;
}

function SectionLabel({ letter, title }: { letter: string; title: string }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <span className="w-6 h-6 rounded-full bg-cream text-ink text-xs font-display flex items-center justify-center">{letter}</span>
      <span className="font-display text-sm text-ink">{title}</span>
    </div>
  );
}