import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function GET(req: NextRequest) {
  try {
    const sessionId = req.nextUrl.searchParams.get("session_id");
    if (!sessionId) {
      return NextResponse.json({ verified: false, error: "Missing session_id." }, { status: 400 });
    }

    const stripeKey = process.env.STRIPE_SECRET_KEY?.trim();
    if (!stripeKey) {
      return NextResponse.json(
        { verified: false, error: "STRIPE_SECRET_KEY is not configured." },
        { status: 500 }
      );
    }

    const stripe = new Stripe(stripeKey);
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items"],
    });

    const isPaid = session.payment_status === "paid";

    const fallbackItems =
      session.line_items?.data.map((li) => ({
        itemType: "stripe-fallback",
        productName: li.description || "Order Item",
        qty: li.quantity || 1,
      })) || [];

    return NextResponse.json({
      verified: isPaid,
      paymentStatus: session.payment_status,
      sessionId: session.id,
      orderRef: session.metadata?.order_ref || session.id,
      promoCode: session.metadata?.promo_code || null,
      shippingMethod: session.metadata?.shipping_method || "Standard Shipping (GTA) (Free)",
      mediaConsent: session.metadata?.media_consent === "Yes",
      amountTotal: session.amount_total != null ? session.amount_total / 100 : null,
      currency: (session.currency || "cad").toUpperCase(),
      fallbackItems,
      customer: {
        name: session.metadata?.customer_name || session.customer_details?.name || "Customer",
        email:
          session.customer_details?.email ||
          session.customer_email ||
          session.metadata?.customer_email ||
          "N/A",
        phone: session.metadata?.customer_phone || session.customer_details?.phone || "N/A",
        address: session.metadata?.shipping_address || "N/A",
      },
    });
  } catch (err: any) {
    console.error("Stripe verify session error:", err);
    return NextResponse.json(
      { verified: false, error: err?.message || "Unable to verify payment session." },
      { status: 500 }
    );
  }
}
