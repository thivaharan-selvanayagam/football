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
  gradient: [string, string]; // Kept as a safe fallback
  frameImage: string;          // NEW: Path to your .webp card frames
  rating: number;
  reviews: number;
}

export const collections = [
  "Best Seller",
  "New In",
  "FC26",
  "FC25",
  "FC24",
  "S23",
  "S22",
];

export const products: CardProduct[] = [
  { slug: "fc26-england-world-cup-2026", name: "FC26 England World Cup 2026", collection: "FC26", basePrice: 7900, compareAtPrice: 13200, gradient: ["#9c1c23", "#e8e8e8"], frameImage: "/images/cards/fc1.webp", rating: 4.6, reviews: 8160 },
  { slug: "fc26-scotland-world-cup-2026", name: "FC26 Scotland World Cup 2026", collection: "FC26", basePrice: 7900, compareAtPrice: 13200, gradient: ["#1c2c6c", "#ffffff"], frameImage: "/images/cards/fc2.webp", rating: 4.6, reviews: 8160 },
  { slug: "fc26-team-of-the-year", name: "FC26 Team of the Year", collection: "FC26", basePrice: 7900, compareAtPrice: 13200, gradient: ["#0a1b3d", "#3a6fd8"], frameImage: "/images/cards/fc3.webp", rating: 4.6, reviews: 8160 },
  { slug: "fc26-footballs-greatest", name: "FC26 Football's Greatest", collection: "FC26", bestSeller: true, basePrice: 9800, compareAtPrice: 16400, gradient: ["#cfcfcf", "#8c8c8c"], frameImage: "/images/cards/fc4.webp", rating: 4.6, reviews: 8160 },
  { slug: "fc26-champions-league-rttk", name: "FC26 Champions League RTTK", collection: "FC26", bestSeller: true, basePrice: 7900, compareAtPrice: 13200, gradient: ["#0b2a6e", "#1f6fd8"], frameImage: "/images/cards/fc5.webp", rating: 4.6, reviews: 8160 },
  { slug: "fc26-shiny-gold", name: "FC26 Shiny Gold", collection: "FC26", bestSeller: true, basePrice: 7900, compareAtPrice: 13200, gradient: ["#caa84a", "#f3da8d"], frameImage: "/images/cards/fc1.webp", rating: 4.6, reviews: 8160 },
  { slug: "fc26-team-of-the-week", name: "FC26 Team of the Week", collection: "FC26", bestSeller: true, basePrice: 7900, compareAtPrice: 13200, gradient: ["#111111", "#3a3a3a"], frameImage: "/images/cards/fc2.webp", rating: 4.6, reviews: 8160 },
  { slug: "fc26-hero", name: "FC26 Hero", collection: "FC26", basePrice: 7900, compareAtPrice: 13200, gradient: ["#5b2c8a", "#b35bd8"], frameImage: "/images/cards/fc3.webp", rating: 4.6, reviews: 8160 },
  { slug: "fc26-team-of-the-year-heroes", name: "FC26 Team of the Year Heroes", collection: "FC26", basePrice: 7900, compareAtPrice: 13200, gradient: ["#0c1c4a", "#3457b3"], frameImage: "/images/cards/fc4.webp", rating: 4.6, reviews: 8160 },
  { slug: "fc26-cornerstones", name: "FC26 Cornerstones", collection: "FC26", basePrice: 7900, compareAtPrice: 13200, gradient: ["#6b4a1f", "#c98a3c"], frameImage: "/images/cards/fc5.webp", rating: 4.6, reviews: 8160 },
  { slug: "fc26-flashback", name: "FC26 Flashback", collection: "FC26", basePrice: 7900, compareAtPrice: 13200, gradient: ["#2a1f5e", "#9a4fc9"], frameImage: "/images/cards/fc1.webp", rating: 4.6, reviews: 8160 },
  { slug: "fc26-festival-of-football-captains", name: "FC26 Festival of Football Captains", collection: "FC26", basePrice: 7900, compareAtPrice: 13200, gradient: ["#8a1b4a", "#e8d8e0"], frameImage: "/images/cards/fc2.webp", rating: 4.6, reviews: 8160 },
  { slug: "fc26-world-tour", name: "FC26 World Tour", collection: "FC26", basePrice: 7900, compareAtPrice: 13200, gradient: ["#b85c1a", "#e8a23c"], frameImage: "/images/cards/fc3.webp", rating: 4.6, reviews: 8160 },
  { slug: "fc26-world-tour-silver-superstars", name: "FC26 World Tour Silver Superstars", collection: "FC26", basePrice: 7900, compareAtPrice: 13200, gradient: ["#c9602a", "#e8c77a"], frameImage: "/images/cards/fc4.webp", rating: 4.6, reviews: 8160 },
  { slug: "fc26-joga-bonito", name: "FC26 Joga Bonito", collection: "FC26", basePrice: 7900, compareAtPrice: 13200, gradient: ["#0a5c3a", "#3ad88a"], frameImage: "/images/cards/fc5.webp", rating: 4.6, reviews: 8160 },
  { slug: "fc26-fut-champions-gold", name: "FC26 FUT Champions Gold", collection: "FC26", basePrice: 7900, compareAtPrice: 13200, gradient: ["#3a0a0a", "#8a1a1a"], frameImage: "/images/cards/fc1.webp", rating: 4.6, reviews: 8160 },
  { slug: "fc26-winter-wildcard-sbc", name: "FC26 Winter Wildcard SBC", collection: "FC26", basePrice: 7900, compareAtPrice: 13200, gradient: ["#1a2a4a", "#c94a4a"], frameImage: "/images/cards/fc2.webp", rating: 4.6, reviews: 8160 },
  { slug: "fc26-unbreakables", name: "FC26 Unbreakables", collection: "FC26", basePrice: 7900, compareAtPrice: 13200, gradient: ["#3a1a4a", "#7a2a9a"], frameImage: "/images/cards/fc3.webp", rating: 4.6, reviews: 8160 },
];

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug);
}

export const SIZES: { id: CardSize; label: string; dim: string; priceDelta: number }[] = [
  { id: "Small", label: "Small", dim: "(30cm x 20cm)", priceDelta: -2000 },
  { id: "Medium", label: "Medium", dim: "(39cm x 25cm)", priceDelta: 0 },
  { id: "Large", label: "Large", dim: "(50cm x 32cm)", priceDelta: 3500 },
];

export const STYLE_DELTA: Record<CardStyle, number> = {
  Standard: 0,
  Metal: 5200,
};

export const ADDONS = [
  { id: "fast-track", name: "Super Fast Track", desc: "Card designed, printed, shipped within 1-3 working days.", price: 3700, compareAt: 4600, badge: "Best Seller", defaultOn: true },
  { id: "gift-packaging", name: "Luxury Gift Packaging", desc: "Elevate your gift with our premium gift box. Crafted from high-quality materials.", price: 6800, badge: "Exclusive", defaultOn: false },
  { id: "wall-mount", name: "Wall Mounting Kit (Easy)", desc: "The best & easiest way to hang your cards on the wall.", price: 4600, badge: "Best Seller", defaultOn: false },
  { id: "acrylic-stand", name: "Premium Acrylic Stand", desc: "Small but sturdy acrylic stand - Display your cards with pride!", price: 6800, outOfStock: true, defaultOn: false },
  { id: "gift-note", name: "Personalised Gift Note", desc: "Say something special with a gloss printed gift message - designed just for you.", price: 1900, compareAt: 2300, defaultOn: false },
  { id: "damage-protection", name: "Damage Protection", desc: "Lifetime insurance. If damaged during transit or in any other way - we'll replace, no hassle!", price: 1900, compareAt: 2300, badge: "Recommended", defaultOn: true },
];

export const POSITIONS = {
  Defence: ["CB", "LB", "RB", "LWB", "RWB"],
  Midfield: ["CDM", "CM", "CAM", "LM", "RM", "LW", "RW"],
  Attack: ["ST", "CF", "LF", "RF"],
  Custom: ["GK", "SUB", "RES"],
};

export const CLUBS = [
  "Barcelona", "Real Madrid", "Atletico Madrid", "Athletic Club", "Sevilla",
  "Real Betis", "Real Sociedad", "Celta Vigo", "Getafe", "Osasuna",
];

export const COUNTRIES = [
  "Canada", "United States", "England", "Scotland", "Brazil", "Argentina",
  "France", "Germany", "Spain", "Portugal", "Sri Lanka", "India",
];