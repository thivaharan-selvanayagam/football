"use client";
import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/lib/cart";
import { formatRs } from "@/lib/format";

export default function SuccessPage() {
  return (
    <Suspense fallback={null}>
      <SuccessContent />
    </Suspense>
  );
}

function SuccessContent() {
  const search = useSearchParams();
  const { clear } = useCart();
  const order = search.get("order") || search.get("session_id") || "—";
  const total = search.get("total");

  useEffect(() => {
    clear();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="max-w-xl mx-auto px-6 py-28 text-center">
      <div className="w-16 h-16 rounded-full bg-emerald/10 text-emerald flex items-center justify-center mx-auto mb-6 text-2xl">✓</div>
      <h1 className="font-display text-3xl text-ink mb-3">Order confirmed</h1>
      <p className="text-ink/60 mb-2">
        Thanks — your card is headed into production. We'll email you a design preview before printing.
      </p>
      <p className="text-sm text-ink/50 mb-8">
        Order reference: <span className="font-display text-ink">{order}</span>
        {total && <> · Total: <span className="font-display text-ink">{formatRs(Number(total))}</span></>}
      </p>
      <Link href="/cards" className="inline-block bg-gold text-ink font-display px-6 py-3 rounded-full text-sm">
        Continue shopping
      </Link>
    </div>
  );
}
