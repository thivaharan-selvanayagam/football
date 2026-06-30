"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export interface CartItem {
  id: string;
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
}

interface CartContextValue {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clear: () => void;
  subtotal: number;
  count: number;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem("cardsplug-cart");
    if (raw) {
      try {
        setItems(JSON.parse(raw));
      } catch {}
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem("cardsplug-cart", JSON.stringify(items));
  }, [items, hydrated]);

  const addItem = (item: CartItem) => setItems((prev) => [...prev, item]);
  const removeItem = (id: string) => setItems((prev) => prev.filter((i) => i.id !== id));
  const updateQty = (id: string, qty: number) =>
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, qty: Math.max(1, qty) } : i)));
  const clear = () => setItems([]);

  const subtotal = items.reduce((sum, i) => sum + (i.unitPrice + i.addonsPrice) * i.qty, 0);
  const count = items.reduce((sum, i) => sum + i.qty, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQty, clear, subtotal, count }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
