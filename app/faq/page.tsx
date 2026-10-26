"use client";
import { useState } from "react";
import Link from "next/link";

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

export default function AboutPage() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="w-full min-h-screen bg-neutral-50 text-neutral-900 py-16 px-6 sm:px-12 md:px-24">
      <div className="w-full max-w-3xl mx-auto space-y-16">

        {/* ⚽ ABOUT US STORY SECTION */}
        <div className="text-center space-y-6">
          <span className="inline-block bg-[#232323] text-white text-[11px] font-bold px-3 py-1 rounded-md tracking-wider uppercase">
            Our Story
          </span>
          <h1 className="font-display text-4xl sm:text-5xl font-black text-neutral-900 tracking-tight leading-none">
            About SAS Sports
          </h1>
          
          <div className="bg-white rounded-2xl border border-neutral-200/80 p-8 sm:p-10 shadow-sm text-left space-y-5">
            <p className="text-neutral-700 text-base sm:text-lg leading-relaxed font-medium">
              Just three brothers living and breathing the beautiful game. If we’re not out on the pitch playing or training to sharpen our game, you’ll find us glued to the TV watching a match or battling it out on the PS5 playing FC. Soccer isn't just a sport to us, it’s how we grew up, how we stay connected, and the standard for everything we do.
            </p>
            <p className="text-neutral-700 text-base sm:text-lg leading-relaxed font-medium">
              We launched this business to take that lifelong obsession and build something meaningful around it, creating a way to support our own growth while giving back to the community that loves the game just as much as we do. Thanks for backing our vision, supporting our business, and being a part of this journey with us. Let's grow together!
            </p>

            <div className="pt-2 flex items-center gap-3 border-t border-neutral-100">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
              <span className="text-xs font-bold text-neutral-500 uppercase tracking-widest">
                The SAS Sports Team
              </span>
            </div>
          </div>
        </div>

        {/* ❓ FREQUENTLY ASKED QUESTIONS SECTION */}
        <div className="border-t border-neutral-200/80 pt-16">
          <p className="uppercase tracking-[0.25em] text-neutral-400 text-xs mb-2 text-center font-bold">
            Got Questions?
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-black text-neutral-900 tracking-tight text-center mb-10 leading-tight">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-3">
            {FAQS.map((f, i) => (
              <div key={f.q} className="border border-neutral-200/80 rounded-xl bg-white overflow-hidden shadow-sm">
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="w-full flex items-center justify-between text-left px-6 py-5 hover:bg-neutral-100/50 transition"
                >
                  <span className="font-display font-bold text-sm text-neutral-900 pr-4">{f.q}</span>
                  <span className={`text-neutral-400 font-bold transition-transform ${open === i ? "rotate-45" : ""}`}>
                    +
                  </span>
                </button>
                {open === i && (
                  <p className="px-6 pb-5 text-sm text-neutral-600 leading-relaxed border-t border-neutral-100 pt-3">
                    {f.a}
                  </p>
                )}
              </div>
            ))}
          </div>

          <p className="text-center text-sm text-neutral-600 mt-10">
            Still need help?{" "}
            <Link href="/support" className="text-neutral-900 font-bold underline underline-offset-4 hover:text-black">
              Contact our support team
            </Link>
          </p>
        </div>

      </div>
    </section>
  );
}