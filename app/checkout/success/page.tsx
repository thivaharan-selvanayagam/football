"use client";
import { Suspense, useEffect, useRef, useState } from "react";
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
  const sessionId = search.get("session_id");
  const fallbackOrder = search.get("order");
  const fallbackTotal = search.get("total");

  const [status, setStatus] = useState<"verifying" | "confirmed" | "error">(
    sessionId ? "verifying" : "confirmed"
  );
  const [orderRef, setOrderRef] = useState<string>(fallbackOrder || sessionId || "—");
  const [paidTotal, setPaidTotal] = useState<number | null>(
    fallbackTotal ? Number(fallbackTotal) : null
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const processedRef = useRef(false);

  useEffect(() => {
    if (processedRef.current) return;
    processedRef.current = true;

    async function finalizeOrder() {
      if (!sessionId) {
        clear();
        return;
      }

      try {
        const verifyRes = await fetch(
          `/api/checkout/verify?session_id=${encodeURIComponent(sessionId)}`
        );
        const verifyData = await verifyRes.json();

        if (!verifyRes.ok || !verifyData.verified) {
          setStatus("error");
          setErrorMsg(
            verifyData.error ||
              `Payment has not completed yet (status: ${verifyData.paymentStatus || "unknown"}).`
          );
          return;
        }

        setOrderRef(verifyData.orderRef || sessionId);
        if (typeof verifyData.amountTotal === "number") {
          setPaidTotal(verifyData.amountTotal);
        }

        // Guard against sending duplicate order emails if the customer refreshes this page
        const sentKey = `cardsplug-order-sent-${sessionId}`;
        const alreadySent = localStorage.getItem(sentKey);

        if (!alreadySent) {
          let storedItems: any[] = [];
          let storedCustomer: any = null;

          try {
            const rawCart = localStorage.getItem("cardsplug-cart");
            if (rawCart) storedItems = JSON.parse(rawCart);
          } catch {}

          try {
            const rawCustomer = localStorage.getItem("cardsplug-pending-customer");
            if (rawCustomer) storedCustomer = JSON.parse(rawCustomer);
          } catch {}

          const customerDetails = {
            name: storedCustomer?.name || verifyData.customer?.name || "Customer",
            email: storedCustomer?.email || verifyData.customer?.email || "N/A",
            phone: storedCustomer?.phone || verifyData.customer?.phone || "N/A",
            address: storedCustomer?.address || verifyData.customer?.address || "N/A",
            promoCode: storedCustomer?.promoCode || null,
            shippingMethod: storedCustomer?.shippingMethod || null,
            mediaConsent: Boolean(storedCustomer?.mediaConsent),
          };

          if (storedItems.length > 0) {
            const emailRes = await fetch("/api/send-order", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                customerDetails,
                cartItems: storedItems,
                orderRef: verifyData.orderRef || sessionId,
                stripeSessionId: sessionId,
                totalPaid: verifyData.amountTotal,
                currency: verifyData.currency || "CAD",
              }),
            });

            if (emailRes.ok) {
              localStorage.setItem(sentKey, "true");
            }
          } else {
            localStorage.setItem(sentKey, "true");
          }
        }

        localStorage.removeItem("cardsplug-pending-customer");
        localStorage.removeItem("cardsplug-cart");
        localStorage.removeItem("cardsplug-promo");
        clear();
        setStatus("confirmed");
      } catch {
        setStatus("error");
        setErrorMsg("Unable to verify your payment right now. Please contact support if you were charged.");
      }
    }

    finalizeOrder();
  }, [sessionId, clear]);

  if (status === "verifying") {
    return (
      <div className="max-w-xl mx-auto px-6 py-28 text-center">
        <div className="w-12 h-12 border-2 border-emerald/30 border-t-emerald rounded-full animate-spin mx-auto mb-6" />
        <h1 className="font-display text-2xl text-ink mb-2">Confirming your payment…</h1>
        <p className="text-sm text-ink/60">
          Please hold on a moment while we verify your Stripe payment and submit your card design.
        </p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="max-w-xl mx-auto px-6 py-28 text-center">
        <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-6 text-2xl">
          !
        </div>
        <h1 className="font-display text-3xl text-ink mb-3">Payment verification issue</h1>
        <p className="text-ink/60 mb-6 text-sm">{errorMsg}</p>
        <div className="flex items-center justify-center gap-4">
          <Link
            href="/checkout"
            className="inline-block bg-ink text-chalk font-display px-6 py-3 rounded-full text-sm"
          >
            Return to checkout
          </Link>
          <Link
            href="/support"
            className="inline-block border border-black/15 text-ink font-display px-6 py-3 rounded-full text-sm"
          >
            Contact support
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-6 py-28 text-center">
      <div className="w-16 h-16 rounded-full bg-emerald/10 text-emerald flex items-center justify-center mx-auto mb-6 text-2xl">
        ✓
      </div>
      <h1 className="font-display text-3xl text-ink mb-3">Order confirmed</h1>
      <p className="text-ink/60 mb-2">
        Thanks — your payment succeeded and your custom card is headed into production.
      </p>
      <p className="text-sm text-ink/50 mb-8">
        Order reference: <span className="font-display text-ink">{orderRef}</span>
        {paidTotal != null && (
          <>
            {" "}
            · Total paid: <span className="font-display text-ink">{formatRs(paidTotal)} CAD</span>
          </>
        )}
      </p>
      <Link
        href="/cards"
        className="inline-block bg-gold text-ink font-display px-6 py-3 rounded-full text-sm"
      >
        Continue shopping
      </Link>
    </div>
  );
}
