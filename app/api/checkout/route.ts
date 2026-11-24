import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import {
  ADDONS,
  calculateCardPrice,
  CardSize,
  CardStyle,
  getApparelProduct,
  getProduct,
  isStripeTestProduct,
  isValidPromoCode,
  PROMO_CODE,
  SHIPPING_METHODS,
  STRIPE_TEST_PRODUCT,
} from "@/lib/data";

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
    const { items, customer, promoCode, shippingMethod, mediaConsent } = body;

    if (!mediaConsent) {
      return NextResponse.json(
        { error: "Please accept the promotional & social media consent to continue." },
        { status: 400 }
      );
    }

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Your cart is empty." }, { status: 400 });
    }

    const promoApplied = isValidPromoCode(promoCode);

    // Prevent checkout of sold-out shield sizes
    for (const i of items) {
      if (getApparelProduct(i.productSlug)) continue;
      const product = getProduct(i.productSlug);
      if (!product) continue;
      const size = (i.size as CardSize) || "Medium";
      const tier = calculateCardPrice(product, size, (i.style as CardStyle) || "Standard");
      if (tier.soldOut) {
        return NextResponse.json(
          { error: `The ${size} shield size is currently sold out. Please remove it or select Small or Medium.` },
          { status: 400 }
        );
      }
    }

    const stripe = new Stripe(stripeKey);
    const origin =
      process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
      req.headers.get("origin") ||
      new URL(req.url).origin;

    const orderRef = `SAS-${Math.floor(100000 + Math.random() * 900000)}`;

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map((i: any) => {
      if (isStripeTestProduct(i.productSlug)) {
        return {
          price_data: {
            currency: "cad",
            product_data: {
              name: STRIPE_TEST_PRODUCT.name,
              description: "Private Stripe live/test verification item",
            },
            unit_amount: Math.round(STRIPE_TEST_PRODUCT.price * 100),
          },
          quantity: Math.max(1, Number(i.qty) || 1),
        };
      }

      const apparel = getApparelProduct(i.productSlug);
      if (apparel) {
        return {
          price_data: {
            currency: "cad",
            product_data: {
              name: `${apparel.name} (Size ${i.size || "M"})`,
              description: `Help Shiva Go to Italy — March 2027 Fundraiser · Size ${i.size || "M"}`,
            },
            unit_amount: Math.round(apparel.price * 100),
          },
          quantity: Math.max(1, Number(i.qty) || 1),
        };
      }

      const product = getProduct(i.productSlug);
      const size = (i.size as CardSize) || "Medium";
      const style = (i.style as CardStyle) || "Standard";
      const tier = calculateCardPrice(product, size, style);

      const serverUnitPrice = promoApplied ? tier.promoPrice : tier.price;

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
        promoApplied ? `Promo ${PROMO_CODE} applied` : null,
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
      .map((i: any) => `${i.productName || i.productSlug} (${i.name} · ${i.size} x${i.qty || 1})`)
      .join("; ")
      .slice(0, 490);

    const chosenShipping =
      SHIPPING_METHODS.find((m) => m.id === shippingMethod) || SHIPPING_METHODS[0];
    const orderedShippingMethods = [
      chosenShipping,
      ...SHIPPING_METHODS.filter((m) => m.id !== chosenShipping.id),
    ];

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: customer?.email?.trim() || undefined,
      line_items: lineItems,
      shipping_options: orderedShippingMethods.map((m) => ({
        shipping_rate_data: {
          type: "fixed_amount",
          fixed_amount: {
            amount: Math.round(m.price * 100),
            currency: "cad",
          },
          display_name: m.label,
        },
      })),
      metadata: {
        order_ref: orderRef,
        promo_code: promoApplied ? PROMO_CODE : "",
        shipping_method: chosenShipping.label,
        media_consent: "Yes",
        customer_name: (customer?.name || "").slice(0, 490),
        customer_email: (customer?.email || "").slice(0, 490),
        customer_phone: (customer?.phone || "").slice(0, 490),
        shipping_address: formattedAddress.slice(0, 490),
        items_summary: itemsSummary,
      },
      payment_intent_data: {
        metadata: {
          order_ref: orderRef,
          promo_code: promoApplied ? PROMO_CODE : "",
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
