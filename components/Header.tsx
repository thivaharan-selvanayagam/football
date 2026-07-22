"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart";

export default function Header() {
  const { count } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="sticky top-0 z-40">
      {/* Top Notification Banner */}
      <div className="bg-emerald text-chalk text-xs py-2 px-4 flex justify-center gap-8 font-body tracking-wide">
        <span>World Cup 40% off sitewide</span>
        <span className="hidden sm:inline">350,000+ Happy Customers</span>
        <span className="hidden md:inline">The #1 Football Card Brand</span>
      </div>

      <header className="bg-chalk border-b border-black/5 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-display text-xl tracking-wide text-ink">
            <span className="w-8 h-8 rounded-full bg-gold flex items-center justify-center text-chalk font-bold">C</span>
            CardsPlug
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 font-body text-sm text-ink/80">
            <Link href="/cards" className="hover:text-ink">Football Cards</Link>
            <Link href="/faq" className="hover:text-ink">FAQ</Link>
            <Link href="/support" className="hover:text-ink">Support</Link>
          </nav>

          {/* Right Action Items */}
          <div className="flex items-center gap-4">
            {/* Cart Icon */}
            <Link href="/cart" className="relative p-1">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              {count > 0 && (
                <span className="absolute -top-1 -right-1 bg-gold text-chalk text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                  {count}
                </span>
              )}
            </Link>

            {/* Shop Button */}
            <Link
              href="/cards"
              className="hidden sm:inline-block bg-gold hover:bg-goldlight transition text-chalk font-display text-sm px-5 py-2.5 rounded-full"
            >
              Shop Cards
            </Link>

            {/* Mobile Hamburger Toggle Button */}
            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-ink hover:text-ink/70 transition focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {isMenuOpen ? (
                /* Close (X) Icon */
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              ) : (
                /* Hamburger Menu Icon */
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu Drawer */}
        {isMenuOpen && (
          <div className="md:hidden bg-chalk border-b border-black/10 px-6 py-4 flex flex-col gap-4 font-body text-base text-ink shadow-lg animate-fadeIn">
            <Link 
              href="/cards" 
              onClick={() => setIsMenuOpen(false)}
              className="py-2 border-b border-black/5 hover:text-gold transition"
            >
              Football Cards
            </Link>
            <Link 
              href="/faq" 
              onClick={() => setIsMenuOpen(false)}
              className="py-2 border-b border-black/5 hover:text-gold transition"
            >
              FAQ
            </Link>
            <Link 
              href="/support" 
              onClick={() => setIsMenuOpen(false)}
              className="py-2 border-b border-black/5 hover:text-gold transition"
            >
              Support
            </Link>
            <Link
              href="/cards"
              onClick={() => setIsMenuOpen(false)}
              className="sm:hidden text-center bg-gold hover:bg-goldlight transition text-chalk font-display text-sm py-3 rounded-full mt-2"
            >
              Shop Cards
            </Link>
          </div>
        )}
      </header>
    </div>
  );
}