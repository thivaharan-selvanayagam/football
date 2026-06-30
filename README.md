# CardsPlug — Personalised Football Cards (Next.js)

A multi-page e-commerce site for selling personalised football cards, inspired by FUT-style card builders.

## Pages
- `/` — Home
- `/cards` — Shop grid (Football Cards), with style/collection filters
- `/cards/[slug]` — Single product page (style, size, "Customise my card")
- `/cards/[slug]/customize` — 5-step card builder (name/photo/position → club → flag → attributes → add-ons) with a live card preview, then adds to cart
- `/cart` — Cart
- `/checkout` — Checkout (shipping details + pay)
- `/checkout/success` — Order confirmation
- `/faq` — FAQ accordion
- `/support` — Contact form

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Payments

Checkout posts to `/api/checkout`. If you set a `STRIPE_SECRET_KEY` environment variable (in `.env.local`), it creates a real Stripe Checkout Session and redirects the customer there. Without a key, it simulates a successful order so you can test the full flow end-to-end.

```
STRIPE_SECRET_KEY=sk_test_xxx
```

To go fully live: add your Stripe key, deploy (e.g. Vercel), and update the `success_url` domain.

## Notes
- Card art is rendered live as SVG (`components/FutCard.tsx`) so every customisation (name, photo, position, attributes, club initial) updates instantly — no image assets required.
- Cart persists to `localStorage`.
- Swap in real club/country badge icons and your own card frame artwork in `FutCard.tsx` and `lib/data.ts` (`CLUBS`, `COUNTRIES`, `products`) to match your final brand assets.
