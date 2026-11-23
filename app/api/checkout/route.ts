import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { ADDONS, calculateCardPrice, CardSize, CardStyle, getProduct } from "@/lib/data";

const SHIPPING_COST_CAD = 10; // $10.00 CAD flat rate

export async function POST(req: NextRequest) {
  try {
    const stripeKey = process.env.STRIPE_SECRET_KEY?.trim();

    if (!stripeKey || stripeKey === "sk_test_xxx" || stripeKey.startsWith("your_")) {
      return NextResponse.json(
        {
          error:
            "Stripe is not configured yet. Please add your STRIPE_SECRET_KEY to .env.local and restart the server.",
        },
        { status: 500 }
      );
    }

    const body = await req.json();
    const { items, customer } = body;

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Your cart is empty." }, { status: 400 });
    }

    const stripe = new Stripe(stripeKey);
    const origin =
      process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
      req.headers.get("origin") ||
      new URL(req.url).origin;

    const orderRef = `SAS-${Math.floor(100000 + Math.random() * 900000)}`;

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map((i: any) => {
      const product = getProduct(i.productSlug);
      const size = (i.size as CardSize) || "Medium";
      const style = (i.style as CardStyle) || "Standard";

      const serverUnitPrice = product
        ? calculateCardPrice(product, size, style).price
        : Number(i.unitPrice) || 0;

      const selectedAddonIds: string[] = Array.isArray(i.addons) ? i.addons : [];
      const serverAddonsPrice = selectedAddonIds.length
        ? selectedAddonIds.reduce((sum, id) => {
            const addon = ADDONS.find((a) => a.id === id);
            return sum + (addon ? addon.price : 0);
          }, 0)
        : Number(i.addonsPrice) || 0;

      const addonNames = selectedAddonIds
        .map((id) => ADDONS.find((a) => a.id === id)?.name)
        .filter(Boolean)
        .join(", ");

      const details = [
        `${style} · ${size}`,
        `${i.position || "CAM"} (${i.overall ?? 99} OVR)`,
        [i.club, i.country].filter(Boolean).join(" / "),
        addonNames ? `Add-ons: ${addonNames}` : null,
      ]
        .filter(Boolean)
        .join(" · ");

      const unitTotalCents = Math.round((serverUnitPrice + serverAddonsPrice) * 100);

      return {
        price_data: {
          currency: "cad",
          product_data: {
            name: `${product?.name || i.productName || "Custom Football Card"} — ${i.name || "Player"}`,
            description: details || undefined,
          },
          unit_amount: unitTotalCents,
        },
        quantity: Math.max(1, Number(i.qty) || 1),
      };
    });

    const formattedAddress = [
      customer?.address,
      customer?.city,
      customer?.postcode,
      customer?.country,
    ]
      .filter(Boolean)
      .join(", ");

    const itemsSummary = items
      .map((i: any) => `${i.productName || i.productSlug} (${i.name} x${i.qty || 1})`)
      .join("; ")
      .slice(0, 490);

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: customer?.email?.trim() || undefined,
      line_items: lineItems,
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: {
              amount: Math.round(SHIPPING_COST_CAD * 100),
              currency: "cad",
            },
            display_name: "Standard Shipping (5–9 working days)",
          },
        },
      ],
      metadata: {
        order_ref: orderRef,
        customer_name: (customer?.name || "").slice(0, 490),
        customer_email: (customer?.email || "").slice(0, 490),
        customer_phone: (customer?.phone || "").slice(0, 490),
        shipping_address: formattedAddress.slice(0, 490),
        items_summary: itemsSummary,
      },
      payment_intent_data: {
        metadata: {
          order_ref: orderRef,
          customer_name: (customer?.name || "").slice(0, 490),
          shipping_address: formattedAddress.slice(0, 490),
        },
      },
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout`,
    });

    return NextResponse.json({ url: session.url, sessionId: session.id, orderRef });
  } catch (err: any) {
    console.error("Stripe checkout session error:", err);
    return NextResponse.json(
      { error: err?.message || "Unable to start Stripe Checkout." },
      { status: 500 }
    );
  }
}
