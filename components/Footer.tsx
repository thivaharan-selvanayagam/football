import Link from "next/link";
import { ShieldCheck, Truck, Lock } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white text-slate-700 border-t border-slate-100 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Main Grid Content */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-16">
          
          {/* Left Column: Larger Brand Logo & Trust Badges */}
          <div className="md:col-span-5 space-y-6">
            {/* Larger Logo */}
            <Link href="/" className="inline-block -my-2">
              <img
                src="/images/logo.png"
                alt="SAS Sports Logo"
                className="h-16 md:h-20 w-auto object-contain"
              />
            </Link>

            {/* Feature List */}
            <ul className="space-y-3.5 text-sm font-medium text-slate-600 pt-1">
              <li className="flex items-center gap-3">
                <ShieldCheck size={18} className="text-slate-800" />
                <span>Secure Checkout</span>
              </li>
              <li className="flex items-center gap-3">
                <Truck size={18} className="text-slate-800" />
                <span>Free Shipping</span>
              </li>
              <li className="flex items-center gap-3">
                <Lock size={18} className="text-slate-800" />
                <span>Privacy Protected</span>
              </li>
            </ul>
          </div>

          {/* Right Columns: Links */}
          <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8 text-sm">
            
            {/* Column 1: Shop */}
            <div>
              <h4 className="font-bold text-slate-900 mb-4">Shop</h4>
              <ul className="space-y-3 text-slate-600">
                <li>
                  <Link href="/cards" className="hover:text-black transition">
                    All Products
                  </Link>
                </li>
                <li>
                  <Link href="/cards" className="hover:text-black transition">
                    New Arrivals
                  </Link>
                </li>
                <li>
                  <Link href="/cards" className="hover:text-black transition">
                    Best Sellers
                  </Link>
                </li>
                <li>
                  <Link href="/cards" className="hover:text-black transition">
                    Sale
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 2: Customer Service */}
            <div>
              <h4 className="font-bold text-slate-900 mb-4">Customer Service</h4>
              <ul className="space-y-3 text-slate-600">
                <li>
                  <Link href="/support" className="hover:text-black transition">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/support" className="hover:text-black transition">
                    Shipping Info
                  </Link>
                </li>
                <li>
                  <Link href="/support" className="hover:text-black transition">
                    Returns
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="hover:text-black transition">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Company */}
            <div>
              <h4 className="font-bold text-slate-900 mb-4">Company</h4>
              <ul className="space-y-3 text-slate-600">
                <li>
                  <Link href="/faq" className="hover:text-black transition">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="hover:text-black transition">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="hover:text-black transition">
                    Press
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="hover:text-black transition">
                    Affiliates
                  </Link>
                </li>
              </ul>
            </div>

          </div>
        </div>

        {/* Bottom Sub-Footer Bar */}
        <div className="border-t border-slate-100 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 SAS Sports. All rights reserved.</p>

          {/* Payment Badges Container */}
          <div className="flex items-center gap-3">
            <span className="text-slate-600">We accept all major credit cards</span>
            <div className="flex items-center gap-1.5">
              <span className="rounded border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-bold text-blue-700">
                VISA
              </span>
              <span className="rounded border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-bold text-red-600">
                MasterCard
              </span>
              <span className="rounded border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-bold text-orange-500">
                DISCOVER
              </span>
              <span className="rounded border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-bold text-blue-500">
                AMEX
              </span>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}