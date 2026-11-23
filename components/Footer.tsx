import Link from "next/link";
import { ShieldCheck, Truck, Lock } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white text-slate-700 border-t border-slate-100 py-12">
      <div className="max-w-7xl mx-auto px-6">
        {/* Top Bar: Brand Logo + Trust Badges */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8">
          <Link href="/" className="inline-block -my-2">
            <img
              src="/images/logo.png"
              alt="SAS Sports Logo"
              className="h-14 md:h-16 w-auto object-contain"
            />
          </Link>

          <ul className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-sm font-medium text-slate-700">
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
