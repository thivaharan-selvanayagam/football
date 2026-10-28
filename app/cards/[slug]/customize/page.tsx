"use client";

import { Suspense, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { notFound } from "next/navigation";
import FutCard from "@/components/FutCard";
import {
  getProduct, SIZES, calculateCardPrice, CardStyle, CardSize,
  POSITIONS, CLUBS, COUNTRIES, ADDONS,
} from "@/lib/data";
import { formatRs } from "@/lib/format";
import { useCart, CartItem } from "@/lib/cart";
import EditImageModal from "@/components/EditImageModal"; 

type Attrs = { PAC: number; SHO: number; PAS: number; DRI: number; DEF: number; PHY: number };

const STEP_PCT = [25, 50, 75, 100];

const CARD_LAYOUT_SHIFTS = {
  meta: 0,
  name: 0,
  stats: 0,
};

const PRESET_COLORS = [
  { name: "Original", hex: "#3c3f25" },
  { name: "Gold", hex: "#caa84a" },
  { name: "Chalk White", hex: "#ffffff" },
  { name: "Midnight Black", hex: "#111111" }
];

export default function CustomizePage({ params }: { params: { slug: string } }) {
  return (
    <Suspense fallback={null}>
      <CustomizeInner params={params} />
    </Suspense>
  );
}

function CustomizeInner({ params }: { params: { slug: string } }) {
  const slug = params?.slug || "";
  const product = getProduct(slug);
  
  const router = useRouter();
  const search = useSearchParams();
  const { addItem } = useCart();
  const fileRef = useRef<HTMLInputElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  const style = (search.get("style") as CardStyle) || "Standard";
  const size = (search.get("size") as CardSize) || "Medium";

  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);
  const [originalPhoto, setOriginalPhoto] = useState<string | null>(null);
  const [textColor, setTextColor] = useState("#3c3f25"); 
  const [posGroup, setPosGroup] = useState<keyof typeof POSITIONS>("Midfield");
  const [position, setPosition] = useState("CAM");
  
  // Set default club to UMSC and show default preset tab in Step 2
  const [club, setClub] = useState("UMSC");
  const [clubBadge, setClubBadge] = useState<string | null>("/images/presets/umsc.png");
  const [isCustomClub, setIsCustomClub] = useState(false);
  const [customClubName, setCustomClubName] = useState("");
  const customBadgeRef = useRef<HTMLInputElement>(null);

  // Set default country to Canada and show default preset tab in Step 3
  const [country, setCountry] = useState("Canada");
  const [countryFlag, setCountryFlag] = useState<string | null>("/images/flags/canada.png");
  const [isCustomCountry, setIsCustomCountry] = useState(false);
  const [customCountryName, setCustomCountryName] = useState("");
  const customFlagRef = useRef<HTMLInputElement>(null);
  
  const [attrs, setAttrs] = useState<Attrs>({ PAC: 96, SHO: 97, PAS: 98, DRI: 99, DEF: 95, PHY: 96 });
  const [overall, setOverall] = useState(97);
  
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [isRemovingBg, setIsRemovingBg] = useState(false);

  if (!product) return notFound();

  const sizeInfo = SIZES.find((s) => s.id === size)!;
  const { price: basePrice } = calculateCardPrice(product, size, style);
  
  const addonsPrice = selectedAddons.reduce((sum, id) => {
    const a = ADDONS.find((x) => x.id === id);
    return sum + (a ? a.price : 0);
  }, 0);

  const onPhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    e.target.value = "";

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
        setOriginalPhoto(canvas.toDataURL("image/jpeg", 0.7));
      }
      URL.revokeObjectURL(objectUrl);
    };
    img.src = objectUrl;

    try {
      setIsRemovingBg(true);
      const bgRemovalModule = (await import("@imgly/background-removal")) as any;
      const removeBackgroundFn = bgRemovalModule.removeBackground || bgRemovalModule.default;
      const imageBlob = await removeBackgroundFn(file);

      const reader = new FileReader();
      reader.onload = () => {
        setRawUpload(reader.result as string);
        setIsModalOpen(true);
        setIsRemovingBg(false);
      };
      reader.readAsDataURL(imageBlob);
    } catch (error) {
      console.error("Background removal failed, falling back to original image:", error);
      setIsRemovingBg(false);

      const fallbackReader = new FileReader();
      fallbackReader.onload = () => {
        setRawUpload(fallbackReader.result as string);
        setIsModalOpen(true);
      };
      fallbackReader.readAsDataURL(file);
    }
  };

  const generateFullCardSnapshot = (): Promise<string | null> => {
    return new Promise((resolve) => {
      try {
        const svgElement = previewRef.current?.querySelector("svg");
        if (!svgElement) return resolve(null);

        const timeout = setTimeout(() => {
          resolve(null);
        }, 1500);

        const svgData = new XMLSerializer().serializeToString(svgElement);
        const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
        const blobURL = URL.createObjectURL(svgBlob);

        const img = new Image();
        img.crossOrigin = "anonymous";

        img.onload = () => {
          clearTimeout(timeout);
          try {
            const canvas = document.createElement("canvas");
            canvas.width = 260;
            canvas.height = 351;
            const ctx = canvas.getContext("2d");
            if (ctx) {
              ctx.drawImage(img, 0, 0);
              const pngDataUrl = canvas.toDataURL("image/png");
              URL.revokeObjectURL(blobURL);
              resolve(pngDataUrl);
            } else {
              URL.revokeObjectURL(blobURL);
              resolve(null);
            }
          } catch (e) {
            URL.revokeObjectURL(blobURL);
            resolve(null);
          }
        };

        img.onerror = () => {
          clearTimeout(timeout);
          URL.revokeObjectURL(blobURL);
          resolve(null);
        };

        img.src = blobURL;
      } catch (e) {
        console.error("Error capturing card snapshot:", e);
        resolve(null);
      }
    });
  };

  const canNext = () => {
    if (step === 1) return name.trim().length > 0;
    return true;
  };

  const handleNext = async () => {
    if (step === 4) {
      const fullCardPreviewUrl = await generateFullCardSnapshot();

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
        textColor,
        rawOriginalPhoto: originalPhoto,
        photo,                        // ✨ Save cropped player photo
        clubBadge,                    // ✨ Save selected club badge
        countryFlag,                  // ✨ Save country flag
        fullCardPreview: fullCardPreviewUrl || photo,
      } as any;

      addItem(item);
      router.push("/cart");
    } else {
      setStep(step + 1);
    }
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rawUpload, setRawUpload] = useState<string | null>(null); 
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col md:grid md:grid-cols-2 text-neutral-900 relative">

      {/* FULL-SCREEN BLOCKING POPUP WHILE IMAGE IS PROCESSING */}
      {isRemovingBg && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 transition-opacity">
          <div className="bg-[#212121]/95 text-white border border-white/10 rounded-2xl px-8 py-6 shadow-2xl flex items-center gap-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="relative flex items-center justify-center w-10 h-10 shrink-0">
              <div className="w-10 h-10 border-2 border-amber-400/30 border-t-amber-400 rounded-full animate-spin" />
              <svg className="w-5 h-5 text-amber-400 absolute" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            
            <p className="text-sm sm:text-base font-semibold tracking-wide text-neutral-100">
              Image processing, please wait...
            </p>
          </div>
        </div>
      )}
      
      {/* 📱 MOBILE CARD PREVIEW CONTAINER */}
      <div className="flex md:hidden flex-col items-center justify-center bg-white border-b border-neutral-200/80 py-6 px-4 sticky top-16 z-30 shadow-sm">
        <FutCard
          name={name || "Player"}
          position={position}
          overall={overall}
          attrs={attrs}
          gradient={product.gradient}
          frameImage={product.frameImage} 
          textShiftY={CARD_LAYOUT_SHIFTS} 
          photo={photo}
          clubBadge={clubBadge}
          countryFlag={countryFlag}
          textColor={textColor} 
          size={190}
        />
      </div>

      {/* Left Column: Form Controls */}
      <div className="px-6 sm:px-12 py-8 md:py-12 max-w-xl mx-auto md:mx-0 md:ml-auto w-full">
        <p className="font-display font-black text-5xl sm:text-7xl text-neutral-200 mb-2 leading-none">{step}</p>

        {step === 1 && (
          <StepWrap title="Basic information" subtitle="Enter name, upload an image and choose a position.">
            <Card>
              <SectionLabel letter="A" title="Name & image upload" />
              <label className="block text-xs font-bold text-neutral-600 mb-1">Enter name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name"
                className="w-full border border-neutral-200 rounded-xl px-4 py-3 mb-4 font-display font-bold text-lg text-neutral-900 focus-ring placeholder:text-neutral-400"
              />
              
              <div className="flex items-center gap-4 mb-6">
                {photo ? (
                  <img src={photo} alt="upload" className="w-16 h-16 rounded-xl object-cover border border-neutral-200" />
                ) : (
                  <div className="w-16 h-16 rounded-xl bg-neutral-100 border border-dashed border-neutral-300 flex items-center justify-center text-xs text-neutral-400 font-medium">
                    No image
                  </div>
                )}
                
                <button
                  type="button"
                  disabled={isRemovingBg}
                  onClick={() => {
                    if (photo) {
                      setIsModalOpen(true); 
                    } else {
                      fileRef.current?.click();
                    }
                  }}
                  className="flex-1 border border-dashed border-neutral-300 rounded-xl py-4 text-sm text-neutral-600 hover:border-neutral-400 transition font-medium disabled:opacity-50 flex items-center justify-center gap-2 bg-neutral-50"
                >
                  {photo ? "Edit Photo Framing" : "Click to upload a photo"}
                </button>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onPhotoChange} />
              </div>

              {/* FONT COLOR SELECTOR */}
              <div className="border-t border-neutral-100 pt-4">
                <label className="block text-xs font-bold text-neutral-600 mb-2">Card Font Color</label>
                <div className="flex flex-wrap items-center gap-2">
                  {PRESET_COLORS.map((col) => (
                    <button
                      key={col.hex}
                      type="button"
                      onClick={() => setTextColor(col.hex)}
                      className={`px-3 py-1.5 text-xs rounded-full border transition font-medium flex items-center gap-1.5 ${
                        textColor === col.hex ? "border-neutral-900 bg-neutral-900 text-white" : "border-neutral-200 bg-white text-neutral-800 hover:border-neutral-300"
                      }`}
                    >
                      <span className="w-3 h-3 rounded-full border border-neutral-200" style={{ backgroundColor: col.hex }} />
                      {col.name}
                    </button>
                  ))}
                  
                  <div className="flex items-center gap-1.5 ml-auto border border-neutral-200 rounded-full px-2 py-1 bg-white">
                    <span className="text-[10px] text-neutral-500 font-medium">Custom:</span>
                    <input 
                      type="color" 
                      value={textColor} 
                      onChange={(e) => setTextColor(e.target.value)}
                      className="w-5 h-5 rounded cursor-pointer border-none bg-transparent"
                    />
                  </div>
                </div>
              </div>

              {rawUpload && (
                <EditImageModal
                  isOpen={isModalOpen}
                  onClose={() => setIsModalOpen(false)}
                  imageSrc={rawUpload}
                  onSave={(croppedRes) => setPhoto(croppedRes)} 
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
              <div className="flex gap-6 text-sm font-display mb-4 border-b border-neutral-100 overflow-x-auto pb-1">
                {(Object.keys(POSITIONS) as (keyof typeof POSITIONS)[]).map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => { setPosGroup(g); setPosition(POSITIONS[g][0]); }}
                    className={`pb-3 -mb-px border-b-2 font-bold transition shrink-0 ${posGroup === g ? "border-neutral-900 text-neutral-900" : "border-transparent text-neutral-400"}`}
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
                    className={`border rounded-xl py-2 text-sm font-bold flex items-center justify-center gap-1 transition ${
                      position === p ? "border-neutral-900 bg-neutral-900 text-white" : "border-neutral-200 text-neutral-700 hover:border-neutral-300"
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
              
              <div className="grid grid-cols-2 gap-2 mb-6 bg-neutral-100 p-1 rounded-xl border border-neutral-200/80">
                <button
                  type="button"
                  onClick={() => setIsCustomClub(false)}
                  className={`py-2 text-xs font-display font-bold rounded-lg transition ${
                    !isCustomClub ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500 hover:text-neutral-900"
                  }`}
                >
                  Search Preset Clubs
                </button>
                <button
                  type="button"
                  onClick={() => setIsCustomClub(true)}
                  className={`py-2 text-xs font-display font-bold rounded-lg transition ${
                    isCustomClub ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500 hover:text-neutral-900"
                  }`}
                >
                  + Custom Badge
                </button>
              </div>

              {!isCustomClub ? (
                <div className="animate-fadeIn">
                  <input 
                    placeholder="Search clubs name" 
                    className="w-full border border-neutral-200 rounded-xl px-4 py-3 mb-4 text-sm focus-ring placeholder:text-neutral-400" 
                  />
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[250px] overflow-y-auto">
                    {CLUBS.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => {
                          setClub(c);
                          const logoPath = `/images/presets/${c.toLowerCase().replace(/\s+/g, "-")}.png`;
                          setClubBadge(logoPath);
                        }}
                        className={`border rounded-full py-2 px-3 text-sm font-medium flex items-center gap-2 ${
                          club === c ? "border-neutral-900 bg-neutral-900 text-white" : "border-neutral-200 text-neutral-700 hover:border-neutral-300"
                        }`}
                      >
                        {club === c && "✓"} {c}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-4 animate-fadeIn">
                  <div>
                    <label className="block text-xs text-neutral-600 mb-1 font-bold">Custom Club Name</label>
                    <input
                      type="text"
                      value={customClubName}
                      onChange={(e) => {
                        setCustomClubName(e.target.value);
                        setClub(e.target.value); 
                      }}
                      placeholder="e.g. Tangalle FC"
                      className="w-full border border-neutral-200 rounded-xl px-4 py-2.5 text-sm text-neutral-900 focus-ring font-medium placeholder:text-neutral-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-neutral-600 mb-1.5 font-bold">Upload Badge Photo</label>
                    <div className="flex items-center gap-4">
                      {clubBadge ? (
                        <img 
                          src={clubBadge} 
                          alt="badge upload thumbnail" 
                          className="w-12 h-12 rounded-full object-cover border border-neutral-200 p-0.5 bg-white shadow-sm" 
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-neutral-100 border border-dashed border-neutral-300 flex items-center justify-center text-neutral-400 text-xs font-bold">
                          LOGO
                        </div>
                      )}
                      
                      <button
                        type="button"
                        onClick={() => customBadgeRef.current?.click()}
                        className="flex-1 text-left border border-dashed border-neutral-300 rounded-xl px-4 py-3 text-xs text-neutral-600 bg-neutral-50 hover:border-neutral-400 transition font-medium"
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
                              setClubBadge(reader.result as string); 
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
          <StepWrap title="Country flag customisation" subtitle="Choose a country flag or upload a custom one.">
            <Card>
              <SectionLabel letter="D" title="Choose a country flag" />
              
              <div className="grid grid-cols-2 gap-2 mb-6 bg-neutral-100 p-1 rounded-xl border border-neutral-200/80">
                <button
                  type="button"
                  onClick={() => setIsCustomCountry(false)}
                  className={`py-2 text-xs font-display font-bold rounded-lg transition ${
                    !isCustomCountry ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500 hover:text-neutral-900"
                  }`}
                >
                  Search Preset Flags
                </button>
                <button
                  type="button"
                  onClick={() => setIsCustomCountry(true)}
                  className={`py-2 text-xs font-display font-bold rounded-lg transition ${
                    isCustomCountry ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500 hover:text-neutral-900"
                  }`}
                >
                  + Custom Flag
                </button>
              </div>

              {!isCustomCountry ? (
                <div className="animate-fadeIn">
                  <input 
                    placeholder="Search country name" 
                    value={searchQuery || ""}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full border border-neutral-200 rounded-xl px-4 py-3 mb-4 text-sm focus-ring placeholder:text-neutral-400" 
                  />
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[250px] overflow-y-auto pr-1">
                    {COUNTRIES
                      .filter((c) => !["sri lanka", "india"].includes(c.toLowerCase().trim()))
                      .filter((c) => c.toLowerCase().includes((searchQuery || "").toLowerCase()))
                      .map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => {
                            setCountry(c);
                            const filename = c.toLowerCase().trim().replace(/\s+/g, "-");
                            const newFlagPath = `/images/flags/${filename}.png`;
                            setCountryFlag(newFlagPath);
                          }}
                          className={`border rounded-full py-2 px-3 text-sm font-medium flex items-center gap-2 transition ${
                            country === c ? "border-neutral-900 bg-neutral-900 text-white" : "border-neutral-200 text-neutral-700 hover:border-neutral-300"
                          }`}
                        >
                          {country === c && "✓"} {c}
                        </button>
                      ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-4 animate-fadeIn">
                  <div>
                    <label className="block text-xs text-neutral-600 mb-1 font-bold">Custom Country Name</label>
                    <input
                      type="text"
                      value={customCountryName}
                      onChange={(e) => {
                        setCustomCountryName(e.target.value);
                        setCountry(e.target.value);
                      }}
                      placeholder="e.g. Sri Lanka"
                      className="w-full border border-neutral-200 rounded-xl px-4 py-2.5 text-sm text-neutral-900 focus-ring font-medium placeholder:text-neutral-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-neutral-600 mb-1.5 font-bold">Upload Flag Photo</label>
                    <div className="flex items-center gap-4">
                      {countryFlag ? (
                        <img 
                          src={countryFlag} 
                          alt="flag thumbnail preview" 
                          className="w-12 h-8 rounded object-cover border border-neutral-200 shadow-sm" 
                        />
                      ) : (
                        <div className="w-12 h-8 bg-neutral-100 border border-dashed border-neutral-300 flex items-center justify-center text-neutral-400 text-[9px] font-bold">
                          FLAG
                        </div>
                      )}
                      
                      <button
                        type="button"
                        onClick={() => customFlagRef.current?.click()}
                        className="flex-1 text-left border border-dashed border-neutral-300 rounded-xl px-4 py-3 text-xs text-neutral-600 bg-neutral-50 hover:border-neutral-400 transition font-medium"
                      >
                        {countryFlag ? "Change flag image" : "Click to select logo file (PNG/JPG)"}
                      </button>
                      
                      <input
                        ref={customFlagRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = () => {
                              setCountryFlag(reader.result as string);
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

        {step === 4 && (
          <StepWrap title="Attributes customisation" subtitle="Customise attributes and ratings.">
            <Card>
              <div className="flex items-center justify-between mb-4">
                <SectionLabel letter="E" title="Choose attributes" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                {(Object.keys(attrs) as (keyof Attrs)[]).map((k) => (
                  <div key={k} className="flex items-center justify-between border border-neutral-200 rounded-xl px-4 py-2.5 bg-neutral-50">
                    <input
                      type="number"
                      min={0}
                      max={99}
                      value={attrs[k]}
                      onChange={(e) =>
                        setAttrs({ ...attrs, [k]: Math.max(0, Math.min(99, Number(e.target.value))) })
                      }
                      className="w-12 font-display font-bold text-lg text-neutral-900 outline-none bg-transparent"
                    />
                    <span className="text-xs font-bold text-neutral-400">{k}</span>
                  </div>
                ))}
              </div>
            </Card>
            <Card>
              <SectionLabel letter="F" title="Overall rating" />
              <div className="flex items-center gap-4">
                <input
                  type="number"
                  value={overall}
                  onChange={(e) => setOverall(Number(e.target.value))}
                  className="w-20 border border-neutral-200 rounded-xl px-3 py-2 font-display font-bold text-lg text-center text-neutral-900"
                />
                <span className="text-xs font-medium text-neutral-500">Suggested ratings:</span>
                {[overall, overall + 1, overall + 2].map((v) => (
                  <button key={v} onClick={() => setOverall(v)} className="w-9 h-9 rounded-full bg-neutral-100 border border-neutral-200 text-sm font-bold text-neutral-900 hover:bg-neutral-200 transition">
                    {v}
                  </button>
                ))}
              </div>
            </Card>
          </StepWrap>
        )}

        {/* Navigation Controls */}
        <div className="flex items-center gap-4 mt-8 sticky bottom-4 bg-neutral-50/90 backdrop-blur-md py-2 z-20">
          <button
            onClick={() => (step === 1 ? router.push(`/cards/${product.slug}`) : setStep(step - 1))}
            className="bg-white border border-neutral-200 rounded-full px-4 sm:px-5 py-3 text-xs sm:text-sm font-display font-bold text-neutral-700 shrink-0 hover:bg-neutral-100 transition shadow-sm"
          >
            ← {step === 1 ? "Return" : "Back"}
          </button>
          <div className="flex-1 h-2 bg-neutral-200 rounded-full relative">
            <div
              className="h-full bg-neutral-900 rounded-full transition-all"
              style={{ width: `${STEP_PCT[step - 1]}%` }}
            />
          </div>
          <button
            onClick={handleNext}
            disabled={!canNext()}
            className="bg-[#232323] hover:bg-black disabled:opacity-40 transition text-white rounded-full px-4 sm:px-5 py-3 text-xs sm:text-sm font-display font-bold shrink-0 shadow-md"
          >
            {formatRs(basePrice + addonsPrice)} | {step === 4 ? "Add to cart" : "Next"} →
          </button>
        </div>
      </div>

      {/* 💻 DESKTOP LIVE PREVIEW CONTAINER */}
      <div ref={previewRef} className="hidden md:flex flex-col items-center justify-center bg-white border-l border-neutral-200/80 py-12 px-8 relative">
        <p className="font-display font-bold text-lg text-neutral-900 mb-1 flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-amber-400 inline-block" /> SAS Sports
        </p>
        <span className="text-[11px] bg-neutral-100 text-neutral-600 font-medium px-3 py-1 rounded-full mb-6 border border-neutral-200/80">
          Preview Only
        </span>
        
        <FutCard
          name={name || "Player"}
          position={position}
          overall={overall}
          attrs={attrs}
          gradient={product.gradient}
          frameImage={product.frameImage} 
          textShiftY={CARD_LAYOUT_SHIFTS} 
          photo={photo}
          clubBadge={clubBadge}
          countryFlag={countryFlag}
          textColor={textColor} 
          size={260}
        />
        
        <h3 className="font-display font-bold text-xl text-neutral-900 mt-6 text-center">{product.name}</h3>
        <p className="text-xs font-medium text-neutral-500 mt-1">
          {style} / {size} {sizeInfo.dim}
        </p>
      </div>
    </div>
  );
}

function StepWrap({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div>
      <h1 className="font-display font-black text-2xl text-neutral-900 mb-1">{title}</h1>
      <p className="text-sm font-medium text-neutral-500 mb-6">{subtitle}</p>
      <div className="space-y-5">{children}</div>
    </div>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return <div className="bg-white rounded-2xl border border-neutral-200/80 p-6 shadow-sm">{children}</div>;
}

function SectionLabel({ letter, title }: { letter: string; title: string }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <span className="w-6 h-6 rounded-full bg-neutral-100 text-neutral-900 text-xs font-display font-bold flex items-center justify-center border border-neutral-200">{letter}</span>
      <span className="font-display font-bold text-sm text-neutral-900">{title}</span>
    </div>
  );
}