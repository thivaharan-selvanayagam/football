import Link from "next/link";
import { ShieldCheck, Truck, Lock } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white text-slate-700 border-t border-slate-100 py-12">
      <div className="max-w-7xl mx-auto px-6">
        {/* Top Bar: Brand Logo + Trust Badges + Social Media */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8">
          <div className="flex items-center gap-5">
            <Link href="/" className="inline-block -my-2">
              <img
                src="/images/logo.png"
                alt="SAS Sports Logo"
                className="h-14 md:h-16 w-auto object-contain"
              />
            </Link>

            <div className="h-7 w-px bg-slate-200" />

            {/* Social Media Links */}
            <div className="flex items-center gap-2.5">
              <a
                href="https://www.instagram.com/hisassports/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="SAS Sports on Instagram"
                className="w-9 h-9 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-neutral-900 hover:text-white hover:border-neutral-900 transition"
              >
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </a>

              <a
                href="https://www.facebook.com/people/SAS-Sports/61596275404128/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="SAS Sports on Facebook"
                className="w-9 h-9 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-neutral-900 hover:text-white hover:border-neutral-900 transition"
              >
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M15.12 5.32H17V2.14A26.11 26.11 0 0 0 14.26 2c-2.72 0-4.58 1.66-4.58 4.7v2.62H6.61v3.56h3.07V22h3.68v-9.12h3.06l.46-3.56h-3.52V6.65c0-1.05.29-1.73 1.76-1.73Z" />
                </svg>
              </a>
            </div>
          </div>

          <ul className="flex flex-wrap items-center justify-center gap-3 sm:gap-5 text-sm font-medium text-slate-700">
            <li className="flex items-center gap-2.5 bg-slate-50 border border-slate-100 rounded-full px-4 py-2">
              <ShieldCheck size={17} className="text-slate-900 shrink-0" />
              <span>Secure Checkout</span>
            </li>
            <li className="flex items-center gap-2.5 bg-slate-50 border border-slate-100 rounded-full px-4 py-2">
              <Truck size={17} className="text-slate-900 shrink-0" />
              <span>Free Shipping (GTA)</span>
            </li>
            <li className="flex items-center gap-2.5 bg-slate-50 border border-slate-100 rounded-full px-4 py-2">
              <Lock size={17} className="text-slate-900 shrink-0" />
              <span>Privacy Protected</span>
            </li>
          </ul>
        </div>

        {/* Bottom Sub-Footer Bar: Copyright + Accepted Cards */}
        <div className="border-t border-slate-100 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 SAS Sports. All rights reserved.</p>

          <div className="flex flex-wrap items-center justify-center gap-3">
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
