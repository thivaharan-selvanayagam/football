"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import FutCard from "@/components/FutCard";
import { getProduct, SIZES, calculateCardPrice, CardStyle, CardSize } from "@/lib/data";
import { formatRs } from "@/lib/format";
import { useCart, CartItem } from "@/lib/cart";

const sampleAttrs = { PAC: 94, SHO: 96, PAS: 92, DRI: 88, DEF: 90, PHY: 92 };

const CARD_LAYOUT_SHIFTS = {
  meta: 0,
  name: 0,
  stats: 0,
};

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = getProduct(params.slug);
  const router = useRouter();
  const { addItem } = useCart();

  const [style, setStyle] = useState<CardStyle>("Standard");
  const [size, setSize] = useState<CardSize>("Medium");

  // Modal State for Simple Assisted Order Form
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    customerAddress: "",
    playerName: "",
    position: "CAM",
    overall: 97,
    country: "Canada",
    clubName: "",
    PAC: 96,
    SHO: 97,
    PAS: 98,
    DRI: 99,
    DEF: 95,
    PHY: 96,
  });

  const [uploadedPhoto, setUploadedPhoto] = useState<string | null>(null);
  const [uploadedClubBadge, setUploadedClubBadge] = useState<string | null>(null);

  const filePhotoRef = useRef<HTMLInputElement>(null);
  const fileBadgeRef = useRef<HTMLInputElement>(null);

  if (!product) return notFound();

  const { price, compareAt } = calculateCardPrice(product, size, style);

  // Compress & read uploaded portrait photo
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const maxDim = 800;
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > maxDim) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        }
      } else {
        if (height > maxDim) {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
        setUploadedPhoto(canvas.toDataURL("image/jpeg", 0.7));
      }
      URL.revokeObjectURL(objectUrl);
    };
    img.src = objectUrl;
  };

  // Compress & read uploaded club badge logo
  const handleBadgeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setUploadedClubBadge(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // ✨ Modified: Adds filled details directly to cart and routes to cart/checkout
  const handleManualOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!uploadedPhoto) {
      alert("Please upload a Player Portrait Photo.");
      return;
    }

    if (!uploadedClubBadge) {
      alert("Please upload a Club Badge image.");
      return;
    }

    // Construct Cart item with filled form details
    const item: CartItem = {
      id: `${Date.now()}`,
      productSlug: product.slug,
      productName: product.name,
      name: formData.playerName || "Player",
      style,
      size,
      position: formData.position || "CAM",
      club: formData.clubName || "Custom Club",
      country: formData.country || "Canada",
      attributes: {
        PAC: formData.PAC,
        SHO: formData.SHO,
        PAS: formData.PAS,
        DRI: formData.DRI,
        DEF: formData.DEF,
        PHY: formData.PHY,
      },
      overall: formData.overall,
      addons: [],
      unitPrice: price,
      addonsPrice: 0,
      qty: 1,
      gradient: product.gradient,
      textColor: "#3c3f25",
      rawOriginalPhoto: uploadedPhoto,
      fullCardPreview: uploadedPhoto,
      clubBadge: uploadedClubBadge,
      // Pre-fill customer details if collected
      customerInfo: {
        name: formData.customerName,
        phone: formData.customerPhone,
        email: formData.customerEmail,
        address: formData.customerAddress,
      },
    } as any;

    addItem(item);
    setIsFormOpen(false);
    
    // Direct navigation to cart / checkout page
    router.push("/cart");
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="grid md:grid-cols-2 gap-12">
        {/* Gallery */}
        <div>
          <div className="bg-cream rounded-2xl p-10 flex justify-center mb-4">
            <FutCard 
              name="Player" 
              position="CAM" 
              overall={95} 
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
            <p className="font-display text-sm text-ink mb-3">1. Style</p>
            <div className="grid grid-cols-1">
              <div className="border border-emerald bg-emerald/5 text-ink rounded-lg py-3 text-sm font-body text-center shadow-sm">
                Standard Premium Print
              </div>
            </div>
          </div>

          {/* Size */}
          <div className="mb-8">
            <p className="font-display text-sm text-ink mb-3">2. Select Size</p>
            <div className="grid grid-cols-3 gap-3">
              {SIZES.map((s) => {
                const isSmall = s.id === "Small";

                return (
                  <button
                    key={s.id}
                    disabled={isSmall}
                    onClick={() => setSize(s.id)}
                    className={`border rounded-lg py-3 text-sm font-body transition relative ${
                      isSmall
                        ? "opacity-50 cursor-not-allowed bg-black/5 border-black/10 text-ink/40"
                        : size === s.id
                        ? "border-emerald bg-emerald/5 text-ink"
                        : "border-black/10 text-ink/70"
                    }`}
                  >
                    {isSmall && (
                      <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-red-500 text-[9px] text-chalk px-2 py-0.5 rounded-full whitespace-nowrap font-medium">
                        Sold Out
                      </span>
                    )}
                    {s.id === "Medium" && (
                      <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-gold text-[9px] text-chalk px-2 py-0.5 rounded-full whitespace-nowrap">
                        Most Popular
                      </span>
                    )}
                    {s.label}
                    <div className="text-[11px] text-ink/50">{s.dim}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* MAIN CUSTOMIZER BUTTON */}
          <button
            onClick={() => router.push(`/cards/${product.slug}/customize?style=${style}&size=${size}`)}
            className="w-full bg-gold hover:bg-goldlight transition text-ink font-display py-4 rounded-full flex items-center justify-center gap-2 text-sm tracking-wide mb-3 shadow-sm"
          >
            ✎ Customise my card &nbsp; {formatRs(price)}
          </button>

          {/* SIMPLE MANUAL ORDER BUTTON */}
          <button
            onClick={() => setIsFormOpen(true)}
            className="w-full bg-white border border-black/20 hover:bg-cream/50 transition text-ink font-display py-3.5 rounded-full flex items-center justify-center gap-2 text-xs sm:text-sm tracking-wide mb-8"
          >
            📋 Need help? Order via Simple Form
          </button>

          <div className="grid grid-cols-3 gap-4 text-center text-xs text-ink/60 border-t border-black/5 pt-6">
            <div>📋 Design preview before shipping</div>
            <div>↻ Free replacements</div>
            <div>🚚 Fast Canadawide shipping</div>
          </div>

          <div className="mt-10 border-t border-black/5 pt-6 text-sm text-ink/70 leading-relaxed">
            <h3 className="font-display text-ink mb-2">Description</h3>
            <p className="mb-3">
              Celebrate greatness with our {product.name} card — a tribute to football's most legendary names. Built for leaders,
              game-changers, and those who've earned their place in history. Classic, clean, and powerful.
            </p>
            <p>
              Sas Sports football cards are perfect for football fanatics, birthday gifts or those special achievements. Easy to use card
              builder — design preview before printing, every order backed by our Gold Standard Guarantee.
            </p>
          </div>
        </div>
      </div>

      {/* SIMPLE ASSISTED ORDER FORM MODAL */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto shadow-2xl relative animate-fadeIn">
            <button
              onClick={() => setIsFormOpen(false)}
              className="absolute top-4 right-4 text-ink/40 hover:text-ink text-xl font-bold"
            >
              ✕
            </button>

            <h2 className="font-display text-2xl text-ink mb-1">Assisted Order Form</h2>
            <p className="text-xs text-ink/60 mb-6">
              Enter your card details below and upload your photos. You will proceed to checkout to complete your order.
            </p>

            <form onSubmit={handleManualOrderSubmit} className="space-y-4">
              {/* CUSTOMER CONTACT DETAILS */}
              <div>
                <label className="block text-xs font-bold text-ink/70 mb-1">Your Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. John Doe"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  className="w-full border border-black/10 rounded-lg px-3.5 py-2.5 text-sm focus-ring"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-ink/70 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="e.g. +1 234 567 890"
                    value={formData.customerPhone}
                    onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                    className="w-full border border-black/10 rounded-lg px-3.5 py-2.5 text-sm focus-ring"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-ink/70 mb-1">Email Address</label>
                  <input
                    type="email"
                    placeholder="e.g. john@gmail.com"
                    value={formData.customerEmail}
                    onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                    className="w-full border border-black/10 rounded-lg px-3.5 py-2.5 text-sm focus-ring"
                  />
                </div>
              </div>

              <hr className="my-4 border-black/5" />

              {/* CARD DETAILS */}
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-ink/70 mb-1">Player Name on Card</label>
                  <input
                    type="text"
                    placeholder="e.g. Thiva"
                    value={formData.playerName}
                    onChange={(e) => setFormData({ ...formData, playerName: e.target.value })}
                    className="w-full border border-black/10 rounded-lg px-3.5 py-2.5 text-sm focus-ring"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-ink/70 mb-1">Overall Rating</label>
                  <input
                    type="number"
                    min={1}
                    max={99}
                    value={formData.overall}
                    onChange={(e) => setFormData({ ...formData, overall: Number(e.target.value) })}
                    className="w-full border border-black/10 rounded-lg px-3.5 py-2.5 text-sm font-bold text-center outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-ink/70 mb-1">Position</label>
                  <input
                    type="text"
                    placeholder="e.g. CAM, ST, CB"
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    className="w-full border border-black/10 rounded-lg px-3.5 py-2.5 text-sm focus-ring"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-ink/70 mb-1">Country / Flag Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Canada"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full border border-black/10 rounded-lg px-3.5 py-2.5 text-sm focus-ring"
                  />
                </div>
              </div>

              {/* ATTRIBUTES INPUT MATRIX */}
              <div>
                <label className="block text-xs font-bold text-ink/70 mb-2">Attributes Matrix (PAC, SHO, PAS, DRI, DEF, PHY)</label>
                <div className="grid grid-cols-3 gap-2">
                  {(["PAC", "SHO", "PAS", "DRI", "DEF", "PHY"] as const).map((attr) => (
                    <div key={attr} className="flex items-center justify-between border border-black/10 rounded-lg px-3 py-1.5 bg-cream/30">
                      <span className="text-xs font-bold text-ink/50">{attr}</span>
                      <input
                        type="number"
                        min={0}
                        max={99}
                        value={formData[attr]}
                        onChange={(e) => setFormData({ ...formData, [attr]: Number(e.target.value) })}
                        className="w-10 text-right font-display text-sm text-ink outline-none bg-transparent"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* UPLOAD MANDATORY PORTRAIT PHOTO */}
              <div>
                <label className="block text-xs font-bold text-ink/70 mb-1">Upload Player Portrait Photo *</label>
                <div className="flex items-center gap-3">
                  {uploadedPhoto ? (
                    <img src={uploadedPhoto} alt="Player portrait" className="w-10 h-10 rounded-lg object-cover border p-0.5 bg-white shrink-0" />
                  ) : null}
                  <button
                    type="button"
                    onClick={() => filePhotoRef.current?.click()}
                    className="flex-1 border border-dashed border-black/20 rounded-lg px-4 py-2.5 text-xs text-ink/60 bg-cream/30 hover:bg-cream transition text-left font-medium"
                  >
                    {uploadedPhoto ? "✓ Portrait Photo Attached" : "Click to select player photo (JPG/PNG) *"}
                  </button>
                  <input
                    ref={filePhotoRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoUpload}
                  />
                </div>
              </div>

              {/* UPLOAD MANDATORY CLUB BADGE */}
              <div>
                <label className="block text-xs font-bold text-ink/70 mb-1">Upload Club Badge / Logo *</label>
                <div className="flex items-center gap-3">
                  {uploadedClubBadge ? (
                    <img src={uploadedClubBadge} alt="Club emblem" className="w-10 h-10 rounded-full object-cover border p-0.5 bg-white shrink-0" />
                  ) : null}
                  <button
                    type="button"
                    onClick={() => fileBadgeRef.current?.click()}
                    className="flex-1 border border-dashed border-black/20 rounded-lg px-4 py-2.5 text-xs text-ink/60 bg-cream/30 hover:bg-cream transition text-left font-medium"
                  >
                    {uploadedClubBadge ? "✓ Club Badge Attached" : "Click to select club logo (PNG/JPG) *"}
                  </button>
                  <input
                    ref={fileBadgeRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleBadgeUpload}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-ink hover:bg-black text-white font-display py-3.5 rounded-full text-sm transition mt-6"
              >
                Proceed to Checkout →
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="text-center mt-16">
        <Link href="/cards" className="text-sm text-ink/60 underline underline-offset-4">
          ← Back to all cards
        </Link>
      </div>
    </div>
  );
}