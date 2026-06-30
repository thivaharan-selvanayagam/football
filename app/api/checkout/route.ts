import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { items, customer } = body;

  const subtotal = items.reduce(
    (sum: number, i: any) => sum + (i.unitPrice + i.addonsPrice) * i.qty,
    0
  );

  const stripeKey = process.env.STRIPE_SECRET_KEY;

  if (stripeKey) {
    try {
      const Stripe = (await import("stripe")).default;
      const stripe = new Stripe(stripeKey);
      const origin = req.headers.get("origin") || "http://localhost:3000";

      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        payment_method_types: ["card"],
        customer_email: customer?.email,
        line_items: items.map((i: any) => ({
          price_data: {
            currency: "lkr",
            product_data: { name: `${i.productName} — ${i.name}` },
            unit_amount: Math.round((i.unitPrice + i.addonsPrice) * 100),
          },
          quantity: i.qty,
        })),
        success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/checkout`,
      });

      return NextResponse.json({ url: session.url });
    } catch (err: any) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
  }

  // No Stripe key configured: simulate a successful order for demo purposes.
  const orderId = `CP-${Math.floor(100000 + Math.random() * 900000)}`;
  return NextResponse.json({ url: `/checkout/success?order=${orderId}&total=${subtotal}`, simulated: true });
}
