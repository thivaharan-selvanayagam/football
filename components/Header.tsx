"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/lib/cart";

const links = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/cards" },
  { label: "About", href: "/faq" },
  { label: "Contact Us", href: "/support" },
];

export default function Header() {
  const { count } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="fixed top-5 left-1/2 z-50 w-[92%] max-w-5xl -translate-x-1/2">
      {/* Floating White Capsule Navbar Container */}
      <nav className="flex items-center justify-between rounded-full bg-white px-6 py-2 shadow-xl border border-slate-100">
        
        {/* Left Group: Bigger Logo & Left-Aligned Navigation Links */}
        <div className="flex items-center gap-8 md:gap-10">
          {/* Bigger Brand Logo */}
          <Link href="/" className="flex items-center -my-1">
            <img
              src="/images/logo.png"
              alt="SAS Sports Logo"
              className="h-12 sm:h-14 w-auto object-contain"
            />
          </Link>

          {/* Desktop Links (Aligned Left Next to Logo) */}
          <div className="hidden items-center gap-6 md:flex">
            {links.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                className={`text-sm font-medium transition-colors hover:text-black ${
                  pathname === l.href
                    ? "text-black font-semibold"
                    : "text-slate-700"
                }`}
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Right Section: Cart + Buy Now Button */}
        <div className="hidden md:flex items-center gap-4">
          {/* Cart Icon */}
          <Link href="/cart" className="relative p-1 text-slate-800 hover:text-black">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            {count > 0 && (
              <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                {count}
              </span>
            )}
          </Link>

          {/* Dark Capsule CTA Button */}
          <Link
            href="/cards"
            className="rounded-full bg-[#2a2a2a] px-6 py-2 text-sm font-semibold text-white transition hover:bg-black"
          >
            Buy Now
          </Link>
        </div>

        {/* Mobile Right Controls */}
        <div className="flex items-center gap-3 md:hidden">
          <Link href="/cart" className="relative p-1 text-slate-800">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            {count > 0 && (
              <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                {count}
              </span>
            )}
          </Link>

          {/* Mobile Toggle Button */}
          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
            className="p-1 text-slate-800 focus:outline-none"
          >
            {isMenuOpen ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

      </nav>

      {/* Mobile Menu Drawer */}
      {isMenuOpen && (
        <div className="mt-2 flex flex-col gap-4 rounded-3xl bg-white p-6 shadow-xl border border-slate-100 md:hidden">
          {links.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              onClick={() => setIsMenuOpen(false)}
              className={`text-base font-medium ${
                pathname === l.href ? "text-black font-bold" : "text-slate-600"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/cards"
            onClick={() => setIsMenuOpen(false)}
            className="rounded-full bg-[#2a2a2a] px-5 py-2.5 text-center text-sm font-semibold text-white hover:bg-black"
          >
            Buy Now
          </Link>
        </div>
      )}
    </header>
  );
}