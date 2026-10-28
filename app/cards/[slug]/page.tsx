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

// Default preview shield assets
const DEFAULT_PREVIEW_BADGE = "/images/presets/umsc.png";
const DEFAULT_PREVIEW_FLAG = "/images/flags/canada.png";

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = getProduct(params.slug);
  const router = useRouter();
  const { addItem } = useCart();

  const [style, setStyle] = useState<CardStyle>("Standard");
  const [size, setSize] = useState<CardSize>("Medium");

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
    clubName: "UMSC",
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

  const handleBadgeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setUploadedClubBadge(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

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

    const item: CartItem = {
      id: `${Date.now()}`,
      productSlug: product.slug,
      productName: product.name,
      name: formData.playerName || "Player",
      style,
      size,
      position: formData.position || "CAM",
      club: formData.clubName || "UMSC",
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
      photo: uploadedPhoto,
      rawOriginalPhoto: uploadedPhoto,
      fullCardPreview: uploadedPhoto,
      clubBadge: uploadedClubBadge || DEFAULT_PREVIEW_BADGE,
      countryFlag: DEFAULT_PREVIEW_FLAG,
      customerInfo: {
        name: formData.customerName,
        phone: formData.customerPhone,
        email: formData.customerEmail,
        address: formData.customerAddress,
      },
    } as any;

    addItem(item);
    setIsFormOpen(false);
    router.push("/cart");
  };

  return (
    <div className="w-full min-h-screen bg-neutral-50 text-neutral-900 py-10">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12">
        {/* Gallery */}
        <div>
          <div className="bg-neutral-100 rounded-2xl p-10 flex justify-center mb-4 border border-neutral-200/80">
            <FutCard 
              name="Player" 
              position="CAM" 
              overall={95} 
              attrs={sampleAttrs} 
              gradient={product.gradient} 
              frameImage={product.frameImage} 
              clubBadge={DEFAULT_PREVIEW_BADGE}
              countryFlag={DEFAULT_PREVIEW_FLAG}
              size={280} 
              textShiftY={CARD_LAYOUT_SHIFTS} 
            />
          </div>
          <div className="grid grid-cols-4 gap-3">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="bg-neutral-100 rounded-lg p-3 flex justify-center border border-neutral-200/80">
                <FutCard 
                  name="Player" 
                  position="CAM" 
                  overall={88} 
                  attrs={sampleAttrs} 
                  gradient={product.gradient} 
                  frameImage={product.frameImage} 
                  clubBadge={DEFAULT_PREVIEW_BADGE}
                  countryFlag={DEFAULT_PREVIEW_FLAG}
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
            ★★★★★ <span className="text-neutral-600">{product.rating} out of 5</span>
            {product.bestSeller && <span className="ml-2 bg-emerald-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">Best Seller</span>}
          </div>
          <h1 className="font-display font-black text-3xl text-neutral-900 mb-3">{product.name}</h1>
          <div className="flex items-baseline gap-3 mb-1">
            <span className="font-display text-2xl font-bold text-neutral-900">{formatRs(price)}</span>
            <span className="line-through text-neutral-400 font-medium">{formatRs(compareAt)}</span>
          </div>
          <p className="text-emerald-600 text-sm font-bold mb-6">You save {formatRs(compareAt - price)}</p>

          <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs font-medium text-neutral-600 mb-8">
            <span>💎 Incredible print quality</span>
            <span>🛡 Ultra-strong materials</span>
            <span>🖼 All photo edits done for you</span>
          </div>

          {/* Style */}
          <div className="mb-6">
            <p className="font-display font-bold text-sm text-neutral-900 mb-3">1. Style</p>
            <div className="grid grid-cols-1">
              <div className="border border-neutral-300 bg-neutral-100 text-neutral-900 rounded-lg py-3 text-sm font-medium text-center shadow-sm">
                Standard Premium Print
              </div>
            </div>
          </div>

          {/* Size */}
          <div className="mb-8">
            <p className="font-display font-bold text-sm text-neutral-900 mb-3">2. Select Size</p>
            <div className="grid grid-cols-3 gap-3">
              {SIZES.map((s) => {
                const isSmall = s.id === "Small";

                return (
                  <button
                    key={s.id}
                    disabled={isSmall}
                    onClick={() => setSize(s.id)}
                    className={`border rounded-lg py-3 text-sm font-medium transition relative ${
                      isSmall
                        ? "opacity-50 cursor-not-allowed bg-neutral-200/50 border-neutral-300 text-neutral-400"
                        : size === s.id
                        ? "border-neutral-900 bg-neutral-100 text-neutral-900 font-bold"
                        : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300"
                    }`}
                  >
                    {isSmall && (
                      <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-red-600 text-[9px] text-white px-2 py-0.5 rounded-full whitespace-nowrap font-bold">
                        Sold Out
                      </span>
                    )}
                    {s.id === "Medium" && (
                      <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-amber-500 text-[9px] text-white px-2 py-0.5 rounded-full whitespace-nowrap font-bold">
                        Most Popular
                      </span>
                    )}
                    {s.label}
                    <div className="text-[11px] text-neutral-500">{s.dim}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* MAIN CUSTOMIZER BUTTON */}
          <button
            onClick={() => router.push(`/cards/${product.slug}/customize?style=${style}&size=${size}`)}
            className="w-full bg-[#232323] hover:bg-black transition text-white font-display font-bold py-4 rounded-full flex items-center justify-center gap-2 text-sm tracking-wide mb-3 shadow-md"
          >
            ✎ Customise my card &nbsp; {formatRs(price)}
          </button>

          {/* SIMPLE MANUAL ORDER BUTTON */}
          <button
            onClick={() => setIsFormOpen(true)}
            className="w-full bg-white border border-neutral-300 hover:bg-neutral-100 transition text-neutral-900 font-display font-bold py-3.5 rounded-full flex items-center justify-center gap-2 text-xs sm:text-sm tracking-wide mb-8 shadow-sm"
          >
            📋 Need help? Order via Simple Form
          </button>

          <div className="grid grid-cols-3 gap-4 text-center text-xs font-medium text-neutral-600 border-t border-neutral-200/80 pt-6">
            <div>📋 Design preview before shipping</div>
            <div>↻ Free replacements</div>
            <div>🚚 Fast Canadawide shipping</div>
          </div>

          <div className="mt-10 border-t border-neutral-200/80 pt-6 text-sm text-neutral-700 leading-relaxed font-medium">
            <h3 className="font-display font-bold text-neutral-900 mb-2">Description</h3>
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
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto shadow-2xl relative animate-fadeIn border border-neutral-200">
            <button
              onClick={() => setIsFormOpen(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-900 text-xl font-bold"
            >
              ✕
            </button>

            <h2 className="font-display font-bold text-2xl text-neutral-900 mb-1">Assisted Order Form</h2>
            <p className="text-xs text-neutral-600 mb-6 font-medium">
              Enter your card details below and upload your photos. You will proceed to checkout to complete your order.
            </p>

            <form onSubmit={handleManualOrderSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1">Your Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. John Doe"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  className="w-full border border-neutral-200 rounded-xl px-3.5 py-2.5 text-sm focus-ring text-neutral-900 placeholder:text-neutral-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-neutral-800 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="e.g. +1 234 567 890"
                    value={formData.customerPhone}
                    onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                    className="w-full border border-neutral-200 rounded-xl px-3.5 py-2.5 text-sm focus-ring text-neutral-900 placeholder:text-neutral-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-800 mb-1">Email Address</label>
                  <input
                    type="email"
                    placeholder="e.g. john@gmail.com"
                    value={formData.customerEmail}
                    onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                    className="w-full border border-neutral-200 rounded-xl px-3.5 py-2.5 text-sm focus-ring text-neutral-900 placeholder:text-neutral-400"
                  />
                </div>
              </div>

              <hr className="my-4 border-neutral-100" />

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-neutral-800 mb-1">Player Name on Card</label>
                  <input
                    type="text"
                    placeholder="e.g. Thiva"
                    value={formData.playerName}
                    onChange={(e) => setFormData({ ...formData, playerName: e.target.value })}
                    className="w-full border border-neutral-200 rounded-xl px-3.5 py-2.5 text-sm focus-ring text-neutral-900 placeholder:text-neutral-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-800 mb-1">Overall Rating</label>
                  <input
                    type="number"
                    min={1}
                    max={99}
                    value={formData.overall}
                    onChange={(e) => setFormData({ ...formData, overall: Number(e.target.value) })}
                    className="w-full border border-neutral-200 rounded-xl px-3.5 py-2.5 text-sm font-bold text-center outline-none text-neutral-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-neutral-800 mb-1">Position</label>
                  <input
                    type="text"
                    placeholder="e.g. CAM, ST, CB"
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    className="w-full border border-neutral-200 rounded-xl px-3.5 py-2.5 text-sm focus-ring text-neutral-900 placeholder:text-neutral-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-800 mb-1">Country / Flag Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Canada"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full border border-neutral-200 rounded-xl px-3.5 py-2.5 text-sm focus-ring text-neutral-900 placeholder:text-neutral-400"
                  />
                </div>
              </div>

              {/* ATTRIBUTES INPUT MATRIX */}
              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-2">Attributes Matrix (PAC, SHO, PAS, DRI, DEF, PHY)</label>
                <div className="grid grid-cols-3 gap-2">
                  {(["PAC", "SHO", "PAS", "DRI", "DEF", "PHY"] as const).map((attr) => (
                    <div key={attr} className="flex items-center justify-between border border-neutral-200 rounded-xl px-3 py-1.5 bg-neutral-50">
                      <span className="text-xs font-bold text-neutral-500">{attr}</span>
                      <input
                        type="number"
                        min={0}
                        max={99}
                        value={formData[attr]}
                        onChange={(e) => setFormData({ ...formData, [attr]: Number(e.target.value) })}
                        className="w-10 text-right font-display font-bold text-sm text-neutral-900 outline-none bg-transparent"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* UPLOAD PORTRAIT PHOTO */}
              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1">Upload Player Portrait Photo *</label>
                <div className="flex items-center gap-3">
                  {uploadedPhoto ? (
                    <img src={uploadedPhoto} alt="Player portrait" className="w-10 h-10 rounded-lg object-cover border border-neutral-200 p-0.5 bg-white shrink-0" />
                  ) : null}
                  <button
                    type="button"
                    onClick={() => filePhotoRef.current?.click()}
                    className="flex-1 border border-dashed border-neutral-300 rounded-xl px-4 py-2.5 text-xs text-neutral-600 bg-neutral-50 hover:bg-neutral-100 transition text-left font-medium"
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

              {/* UPLOAD CLUB BADGE */}
              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1">Upload Club Badge / Logo *</label>
                <div className="flex items-center gap-3">
                  {uploadedClubBadge ? (
                    <img src={uploadedClubBadge} alt="Club emblem" className="w-10 h-10 rounded-full object-cover border border-neutral-200 p-0.5 bg-white shrink-0" />
                  ) : null}
                  <button
                    type="button"
                    onClick={() => fileBadgeRef.current?.click()}
                    className="flex-1 border border-dashed border-neutral-300 rounded-xl px-4 py-2.5 text-xs text-neutral-600 bg-neutral-50 hover:bg-neutral-100 transition text-left font-medium"
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
                className="w-full bg-[#232323] hover:bg-black text-white font-display font-bold py-3.5 rounded-full text-sm transition mt-6 shadow-md"
              >
                Proceed to Checkout →
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="text-center mt-16">
        <Link href="/cards" className="text-sm font-medium text-neutral-600 underline underline-offset-4 hover:text-neutral-900">
          ← Back to all cards
        </Link>
      </div>
    </div>
  );
}