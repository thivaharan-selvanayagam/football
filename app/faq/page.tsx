"use client";
import { useState } from "react";

const FAQS = [
  {
    q: "What is SAS Sports?",
    a: "SAS Sports is home to the world's favourite personalised football cards. Our easy card builder lets you make a real life football card with your own name, photo, and skill ratings. Once you've personalised your card, our design experts will edit your photo and bring it to life in stunning quality. You'll get a full preview before we print and every card's quality is backed by our Gold Standard Guarantee.",
  },
  {
    q: "How do I create a personalised football card?",
    a: "Pick a design from the Football Cards page, choose your style and size, then hit Customise my card. Follow the 5-step builder: basic info & photo, club badge, country flag, attributes, and optional add-ons. Once you've added it to cart, checkout and we'll handle the rest.",
  },
  {
    q: "What are the cards made of?",
    a: "Standard cards use a gloss-finish Foamex board. Metal cards are 100% metal with a gloss finish, available in 3 sizes across both styles.",
  },
  {
    q: "Can I view my order before it's sent?",
    a: "Yes — every order includes a full design preview before printing. Our team checks and edits your uploaded photo so the final card looks its best.",
  },
  {
    q: "Will SAS Sports edit my photo for me?",
    a: "Absolutely. Background removal and touch-ups are included with every order at no extra cost, performed by our in-house design team.",
  },
  {
    q: "What is Gold Standard Guarantee?",
    a: "If your card arrives damaged or isn't what you expected, we'll replace it or refund you — no hassle. Add Damage Protection at checkout for full transit coverage.",
  },
  {
    q: "How long does shipping take?",
    a: "Standard production and shipping takes 5-9 working days. Add Super Fast Track at checkout for 1-3 working day production.",
  },
  {
    q: "Do you ship worldwide?",
    a: "Yes, we ship to most countries worldwide. Shipping costs and times are calculated at checkout based on your address.",
  },
];

export default function FaqPage() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <p className="uppercase tracking-[0.25em] text-gold text-xs mb-2 text-center">We're here to help</p>
      <h1 className="font-display text-4xl text-ink text-center mb-12">Frequently asked questions</h1>
      <div className="space-y-3">
        {FAQS.map((f, i) => (
          <div key={f.q} className="border border-black/5 rounded-xl bg-white overflow-hidden">
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-center justify-between text-left px-6 py-5"
            >
              <span className="font-display text-sm text-ink pr-4">{f.q}</span>
              <span className={`text-ink/40 transition-transform ${open === i ? "rotate-45" : ""}`}>+</span>
            </button>
            {open === i && <p className="px-6 pb-5 text-sm text-ink/60 leading-relaxed">{f.a}</p>}
          </div>
        ))}
      </div>
      <p className="text-center text-sm text-ink/60 mt-10">
        Still need help?{" "}
        <a href="/support" className="text-ink underline underline-offset-4">
          Contact our support team
        </a>
      </p>
    </div>
  );
}
