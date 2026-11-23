"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import {
  calculateCardPrice,
  CardSize,
  CardStyle,
  getApparelProduct,
  getProduct,
  isStripeTestProduct,
  isValidPromoCode,
  PROMO_CODE,
  STRIPE_TEST_PRODUCT,
} from "@/lib/data";

export interface CartItem {
  id: string;
  itemType?: "card" | "apparel" | "test";
  productSlug: string;
  productName: string;
  name: string; // player name on card
  style: string;
  size: string;
  position: string;
  club: string;
  country: string;
  attributes: { PAC: number; SHO: number; PAS: number; DRI: number; DEF: number; PHY: number };
  overall: number;
  addons: string[];
  unitPrice: number;
  addonsPrice: number;
  qty: number;
  gradient: [string, string];
  textColor?: string;
  rawOriginalPhoto?: string | null;
  photo?: string | null;
  clubBadge?: string | null;
  countryFlag?: string | null;
  fullCardPreview?: string | null;
}

interface CartContextValue {
  items: CartItem[];
  hydrated: boolean;
  promoCode: string | null;
  applyPromoCode: (code: string) => boolean;
  removePromoCode: () => void;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clear: () => void;
  subtotal: number;
  discountTotal: number;
  discountedSubtotal: number;
  count: number;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [promoCode, setPromoCode] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem("cardsplug-cart");
    if (raw) {
      try {
        setItems(JSON.parse(raw));
      } catch {}
    }
    const savedPromo = localStorage.getItem("cardsplug-promo");
    if (savedPromo && isValidPromoCode(savedPromo)) {
      setPromoCode(PROMO_CODE);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem("cardsplug-cart", JSON.stringify(items));
  }, [items, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    if (promoCode) {
      localStorage.setItem("cardsplug-promo", promoCode);
    } else {
      localStorage.removeItem("cardsplug-promo");
    }
  }, [promoCode, hydrated]);

  const applyPromoCode = (code: string): boolean => {
    if (isValidPromoCode(code)) {
      setPromoCode(PROMO_CODE);
      return true;
    }
    return false;
  };

  const removePromoCode = () => setPromoCode(null);

  const addItem = (item: CartItem) =>
    setItems((prev) => {
      if (item.itemType === "apparel" || getApparelProduct(item.productSlug)) {
        const existingIdx = prev.findIndex(
          (p) => p.productSlug === item.productSlug && p.size === item.size
        );
        if (existingIdx !== -1) {
          return prev.map((p, idx) =>
            idx === existingIdx ? { ...p, qty: p.qty + item.qty } : p
          );
        }
      }
      return [...prev, item];
    });
  const removeItem = (id: string) => setItems((prev) => prev.filter((i) => i.id !== id));
  const updateQty = (id: string, qty: number) =>
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, qty: Math.max(1, qty) } : i)));
  const clear = () => {
    setItems([]);
    setPromoCode(null);
  };

  const subtotal = items.reduce((sum, i) => {
    if (isStripeTestProduct(i.productSlug)) {
      return sum + STRIPE_TEST_PRODUCT.price * i.qty;
    }
    const apparel = getApparelProduct(i.productSlug);
    if (apparel) {
      return sum + (apparel.price + (i.addonsPrice || 0)) * i.qty;
    }
    const product = getProduct(i.productSlug);
    if (product) {
      const tier = calculateCardPrice(
        product,
        (i.size as CardSize) || "Medium",
        (i.style as CardStyle) || "Standard"
      );
      return sum + (tier.price + (i.addonsPrice || 0)) * i.qty;
    }
    return sum + (i.unitPrice + (i.addonsPrice || 0)) * i.qty;
  }, 0);

  const discountTotal = promoCode
    ? items.reduce((sum, i) => {
        const product = getProduct(i.productSlug);
        if (!product) return sum;
        const tier = calculateCardPrice(
          product,
          (i.size as CardSize) || "Medium",
          (i.style as CardStyle) || "Standard"
        );
        const perUnitSaving = Math.max(0, tier.price - tier.promoPrice);
        return sum + perUnitSaving * i.qty;
      }, 0)
    : 0;

  const discountedSubtotal = Math.max(0, subtotal - discountTotal);
  const count = items.reduce((sum, i) => sum + i.qty, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        hydrated,
        promoCode,
        applyPromoCode,
        removePromoCode,
        addItem,
        removeItem,
        updateQty,
        clear,
        subtotal,
        discountTotal,
        discountedSubtotal,
        count,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
