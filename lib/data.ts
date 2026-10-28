// lib/data.ts

export type CardStyle = "Standard" | "Metal";
export type CardSize = "Small" | "Medium" | "Large";

export interface CardProduct {
  slug: string;
  name: string;
  collection: string;
  bestSeller?: boolean;
  basePrice: number; // standard medium price (sale)
  compareAtPrice: number;
  gradient: [string, string];
  frameImage: string;
  rating: number;
  reviews: number;
}

export const collections = [
  "FC27",
  "FC26",
];

export const products: CardProduct[] = [
  // --- FC27 PRODUCTS ---
  { slug: "fc27-footballs-greatest", name: "FC27 Football's Greatest", collection: "FC27", bestSeller: true, basePrice: 45, compareAtPrice: 70, gradient: ["#cfcfcf", "#8c8c8c"], frameImage: "/images/cards/27-1.webp", rating: 4.8, reviews: 1240 },
  { slug: "fc27-gold", name: "FC27 Gold", collection: "FC27", bestSeller: true, basePrice: 45, compareAtPrice: 70, gradient: ["#caa84a", "#f3da8d"], frameImage: "/images/cards/27-2.webp", rating: 4.9, reviews: 2150 },
  { slug: "fc27-team-of-the-week", name: "FC27 Team of the Week", collection: "FC27", bestSeller: true, basePrice: 45, compareAtPrice: 70, gradient: ["#111111", "#3a3a3a"], frameImage: "/images/cards/27-3.webp", rating: 4.7, reviews: 980 },
  { slug: "fc27-future-star", name: "FC27 Future Star", collection: "FC27", bestSeller: true, basePrice: 45, compareAtPrice: 70, gradient: ["#d83a8a", "#f080c0"], frameImage: "/images/cards/27-4.webp", rating: 4.8, reviews: 1420 },
  { slug: "fc27-hall-of-fame", name: "FC27 Hall of Fame", collection: "FC27", bestSeller: true, basePrice: 45, compareAtPrice: 70, gradient: ["#caa84a", "#1a1a1a"], frameImage: "/images/cards/27-5.webp", rating: 4.9, reviews: 3100 },
  { slug: "fc27-hero", name: "FC27 Hero", collection: "FC27", bestSeller: true, basePrice: 45, compareAtPrice: 70, gradient: ["#5b2c8a", "#b35bd8"], frameImage: "/images/cards/27-6.webp", rating: 4.8, reviews: 1890 },
  // --- FC26 PRODUCTS ---
  { slug: "fc26-team-of-the-year", name: "FC26 Team of the Year", collection: "FC26", basePrice: 45, compareAtPrice: 70, gradient: ["#0a1b3d", "#3a6fd8"], frameImage: "/images/cards/fc5.webp", rating: 4.8, reviews: 4520 },
  { slug: "fc26-footballs-greatest", name: "FC26 Football's Greatest", collection: "FC26", bestSeller: true, basePrice: 45, compareAtPrice: 70, gradient: ["#cfcfcf", "#8c8c8c"], frameImage: "/images/cards/fc3.webp", rating: 4.8, reviews: 8160 },
  { slug: "fc26-champions-league-rttk", name: "FC26 Champions League RTTK", collection: "FC26", bestSeller: true, basePrice: 45, compareAtPrice: 70, gradient: ["#0b2a6e", "#1f6fd8"], frameImage: "/images/cards/fc6.webp", rating: 4.7, reviews: 3420 },
  { slug: "fc26-shiny-gold", name: "FC26 Shiny Gold", collection: "FC26", basePrice: 45, compareAtPrice: 70, gradient: ["#caa84a", "#f3da8d"], frameImage: "/images/cards/fc2.webp", rating: 4.9, reviews: 5120 },
  { slug: "fc26-team-of-the-week", name: "FC26 Team of the Week", collection: "FC26", basePrice: 45, compareAtPrice: 70, gradient: ["#111111", "#3a3a3a"], frameImage: "/images/cards/fc4.webp", rating: 4.7, reviews: 2900 },
  { slug: "fc26-hero", name: "FC26 Hero", collection: "FC26", basePrice: 45, compareAtPrice: 70, gradient: ["#5b2c8a", "#b35bd8"], frameImage: "/images/cards/fc1.webp", rating: 4.6, reviews: 1800 },
];

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug);
}

export const SIZES: { id: CardSize; label: string; dim: string }[] = [
  { id: "Small", label: "Small", dim: "(30cm x 20cm)" },
  { id: "Medium", label: "Medium", dim: "(39cm x 25cm)" },
  { id: "Large", label: "Large", dim: "(50cm x 32cm)" },
];

export const STYLE_DELTA: Record<CardStyle, number> = {
  Standard: 0,
  Metal: 52,
};

export function calculateCardPrice(
  product: CardProduct,
  size: CardSize,
  style: CardStyle = "Standard"
): { price: number; compareAt: number } {
  const styleExtra = STYLE_DELTA[style];
  let price = product.basePrice;
  let compareAt = product.compareAtPrice;

  switch (size) {
    case "Small":
      price = Math.round(product.basePrice * 0.75) + styleExtra;
      compareAt = Math.round(product.compareAtPrice * 0.75) + styleExtra;
      break;

    case "Medium":
      price = product.basePrice + styleExtra;
      compareAt = product.compareAtPrice + styleExtra;
      break;

    case "Large":
      price = Math.round(product.basePrice * 1.4 + 5) + styleExtra;
      compareAt = Math.round(product.compareAtPrice * 1.4 + 8) + styleExtra;
      break;
  }

  return { price, compareAt };
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