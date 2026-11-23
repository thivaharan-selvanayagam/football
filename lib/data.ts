// lib/data.ts

export type CardStyle = "Standard" | "Metal";
export type CardSize = "Small" | "Medium" | "Large";

export interface CardProduct {
  slug: string;
  name: string;
  collection: string;
  bestSeller?: boolean;
  basePrice: number; // starting offer price (Small)
  compareAtPrice: number; // starting original price (Small)
  promoPrice: number; // starting promo price (Small)
  gradient: [string, string];
  frameImage: string;
  rating: number;
  reviews: number;
}

export const PROMO_CODE = "SAS2027";

export function isValidPromoCode(code?: string | null): boolean {
  return Boolean(code && code.trim().toUpperCase() === PROMO_CODE);
}

export const collections = [
  "FC27",
  "FC26",
];

export const products: CardProduct[] = [
  // --- FC27 PRODUCTS ---
  { slug: "fc27-footballs-greatest", name: "FC27 Football's Greatest", collection: "FC27", bestSeller: true, basePrice: 45, compareAtPrice: 79, promoPrice: 39, gradient: ["#cfcfcf", "#8c8c8c"], frameImage: "/images/cards/27-1.webp", rating: 4.8, reviews: 1240 },
  { slug: "fc27-gold", name: "FC27 Gold", collection: "FC27", bestSeller: true, basePrice: 45, compareAtPrice: 79, promoPrice: 39, gradient: ["#caa84a", "#f3da8d"], frameImage: "/images/cards/27-2.webp", rating: 4.9, reviews: 2150 },
  { slug: "fc27-team-of-the-week", name: "FC27 Team of the Week", collection: "FC27", bestSeller: true, basePrice: 45, compareAtPrice: 79, promoPrice: 39, gradient: ["#111111", "#3a3a3a"], frameImage: "/images/cards/27-3.webp", rating: 4.7, reviews: 980 },
  { slug: "fc27-future-star", name: "FC27 Future Star", collection: "FC27", bestSeller: true, basePrice: 45, compareAtPrice: 79, promoPrice: 39, gradient: ["#d83a8a", "#f080c0"], frameImage: "/images/cards/27-4.webp", rating: 4.8, reviews: 1420 },
  { slug: "fc27-hall-of-fame", name: "FC27 Hall of Fame", collection: "FC27", bestSeller: true, basePrice: 45, compareAtPrice: 79, promoPrice: 39, gradient: ["#caa84a", "#1a1a1a"], frameImage: "/images/cards/27-5.webp", rating: 4.9, reviews: 3100 },
  { slug: "fc27-hero", name: "FC27 Hero", collection: "FC27", bestSeller: true, basePrice: 45, compareAtPrice: 79, promoPrice: 39, gradient: ["#5b2c8a", "#b35bd8"], frameImage: "/images/cards/27-6.webp", rating: 4.8, reviews: 1890 },
  // --- FC26 PRODUCTS ---
  { slug: "fc26-team-of-the-year", name: "FC26 Team of the Year", collection: "FC26", basePrice: 45, compareAtPrice: 79, promoPrice: 39, gradient: ["#0a1b3d", "#3a6fd8"], frameImage: "/images/cards/fc5.webp", rating: 4.8, reviews: 4520 },
  { slug: "fc26-footballs-greatest", name: "FC26 Football's Greatest", collection: "FC26", bestSeller: true, basePrice: 45, compareAtPrice: 79, promoPrice: 39, gradient: ["#cfcfcf", "#8c8c8c"], frameImage: "/images/cards/fc3.webp", rating: 4.8, reviews: 8160 },
  { slug: "fc26-champions-league-rttk", name: "FC26 Champions League RTTK", collection: "FC26", bestSeller: true, basePrice: 45, compareAtPrice: 79, promoPrice: 39, gradient: ["#0b2a6e", "#1f6fd8"], frameImage: "/images/cards/fc6.webp", rating: 4.7, reviews: 3420 },
  { slug: "fc26-shiny-gold", name: "FC26 Shiny Gold", collection: "FC26", basePrice: 45, compareAtPrice: 79, promoPrice: 39, gradient: ["#caa84a", "#f3da8d"], frameImage: "/images/cards/fc2.webp", rating: 4.9, reviews: 5120 },
  { slug: "fc26-team-of-the-week", name: "FC26 Team of the Week", collection: "FC26", basePrice: 45, compareAtPrice: 79, promoPrice: 39, gradient: ["#111111", "#3a3a3a"], frameImage: "/images/cards/fc4.webp", rating: 4.7, reviews: 2900 },
  { slug: "fc26-hero", name: "FC26 Hero", collection: "FC26", basePrice: 45, compareAtPrice: 79, promoPrice: 39, gradient: ["#5b2c8a", "#b35bd8"], frameImage: "/images/cards/fc1.webp", rating: 4.6, reviews: 1800 },
];

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug);
}

export const SIZE_PRICING: Record<
  CardSize,
  { compareAt: number; price: number; promoPrice: number; soldOut: boolean }
> = {
  Small: { compareAt: 79, price: 45, promoPrice: 39, soldOut: false },
  Medium: { compareAt: 99, price: 64, promoPrice: 49, soldOut: false },
  Large: { compareAt: 500, price: 400, promoPrice: 300, soldOut: false },
};

export const SIZES: {
  id: CardSize;
  label: string;
  dim: string;
  soldOut: boolean;
  badge?: string;
}[] = [
  { id: "Small", label: "Small", dim: "(18 in. x 12 in.)", soldOut: false },
  { id: "Medium", label: "Medium", dim: "(24 in. x 18 in.)", soldOut: false, badge: "Most Popular" },
  { id: "Large", label: "Large", dim: "(48 in. x 24 in.)", soldOut: false, badge: "Life Size" },
];

export type ShippingMethodId = "gta-free" | "canada-standard";

export const SHIPPING_METHODS: {
  id: ShippingMethodId;
  label: string;
  sublabel: string;
  price: number;
}[] = [
  {
    id: "gta-free",
    label: "Standard Shipping (GTA)",
    sublabel: "Greater Toronto Area · 5–9 working days",
    price: 0,
  },
  {
    id: "canada-standard",
    label: "Standard Shipping (Outside GTA)",
    sublabel: "Canadawide · 5–9 working days",
    price: 10,
  },
];

export const STYLE_DELTA: Record<CardStyle, number> = {
  Standard: 0,
  Metal: 52,
};

export function calculateCardPrice(
  _product: CardProduct | undefined,
  size: CardSize,
  style: CardStyle = "Standard"
): { price: number; compareAt: number; promoPrice: number; soldOut: boolean } {
  const styleExtra = STYLE_DELTA[style] ?? 0;
  const tier = SIZE_PRICING[size] ?? SIZE_PRICING.Medium;

  return {
    price: tier.price + styleExtra,
    compareAt: tier.compareAt + styleExtra,
    promoPrice: tier.promoPrice + styleExtra,
    soldOut: tier.soldOut,
  };
}

export const ADDONS = [
  { id: "fast-track", name: "Super Fast Track", desc: "Card designed, printed, shipped within 1-3 working days.", price: 37, compareAt: 46, badge: "Best Seller", defaultOn: true },
  { id: "gift-packaging", name: "Luxury Gift Packaging", desc: "Elevate your gift with our premium gift box. Crafted from high-quality materials.", price: 68, badge: "Exclusive", defaultOn: false },
  { id: "wall-mount", name: "Wall Mounting Kit (Easy)", desc: "The best & easiest way to hang your cards on the wall.", price: 46, badge: "Best Seller", defaultOn: false },
  { id: "acrylic-stand", name: "Premium Acrylic Stand", desc: "Small but sturdy acrylic stand - Display your cards with pride!", price: 68, outOfStock: true, defaultOn: false },
  { id: "gift-note", name: "Personalised Gift Note", desc: "Say something special with a gloss printed gift message - designed just for you.", price: 19, compareAt: 23, defaultOn: false },
  { id: "damage-protection", name: "Damage Protection", desc: "Lifetime insurance. If damaged during transit or in any other way - we'll replace, no hassle!", price: 19, compareAt: 23, badge: "Recommended", defaultOn: true },
];

export const POSITIONS = {
  Defence: ["CB", "LB", "RB", "LWB", "RWB"],
  Midfield: ["CDM", "CM", "CAM", "LM", "RM", "LW", "RW"],
  Attack: ["ST", "CF", "LF", "RF"],
  Custom: ["GK", "SUB", "RES"],
};

export const CLUBS = [
  "UMSC",
];

export const COUNTRIES = [
  "Canada",
];

// --- SHIVA FUNDRAISER APPAREL ---
export interface ApparelProduct {
  slug: "shiva-tshirt" | "shiva-hoodie";
  routeSlug: "tshirt" | "hoodie";
  name: string;
  title: string;
  badge: string;
  price: number;
  kind: "tshirt" | "hoodie";
  folder: string; // relative to /public
  featureImage: string;
  shortDesc: string;
  description: string[];
}

export const APPAREL_PRODUCTS: ApparelProduct[] = [
  {
    slug: "shiva-tshirt",
    routeSlug: "tshirt",
    name: "Support Shiva — T-Shirt",
    title: "Supporter T-Shirt",
    badge: "Supporter Apparel",
    price: 35,
    kind: "tshirt",
    folder: "images/sas-cloting/sas-tshirt",
    featureImage: "/images/sas-cloting/sas-tshirt/1.png",
    shortDesc:
      "Comfortable everyday supporter tee - 100% of proceeds help fund Shiva's March 2027 trip to Italy.",
    description: [
      "Show your support for Shiva as he prepares to travel to Italy with his soccer team in March 2027. Every T-shirt purchased directly contributes toward his tournament and travel expenses.",
      "Crafted from soft, breathable cotton with a clean athletic fit that feels great on the pitch, in the stands, or for everyday wear.",
    ],
  },
  {
    slug: "shiva-hoodie",
    routeSlug: "hoodie",
    name: "Support Shiva — Hoodie",
    title: "Supporter Hoodie",
    badge: "Premium Fleece",
    price: 60,
    kind: "hoodie",
    folder: "images/sas-cloting/sas-hoodie",
    featureImage: "/images/sas-cloting/sas-hoodie/1.png",
    shortDesc:
      "Warm, heavyweight sideline hoodie - support Shiva's journey to Italy in style on and off the pitch.",
    description: [
      "Stay warm on chilly matchdays while backing Shiva's March 2027 team trip to Italy. Every hoodie sold directly supports his soccer journey.",
      "Made with plush, durable fleece featuring a cozy lined hood, ribbed cuffs, and a relaxed everyday fit built to last season after season.",
    ],
  },
];

export const APPAREL_SIZES = ["YS", "YM", "YL", "S", "M", "L", "XL", "2XL"] as const;

export function getApparelProduct(slug: string) {
  return APPAREL_PRODUCTS.find((p) => p.slug === slug || p.routeSlug === slug);
}
