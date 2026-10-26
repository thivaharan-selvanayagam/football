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
    a: "Standard cards use a gloss-finish PVC Foamex board.",
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
];

export default function AboutPage() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="w-full min-h-screen bg-neutral-50 text-neutral-900 py-16 px-6 sm:px-12 md:px-24">
      <div className="w-full max-w-3xl mx-auto space-y-16">

        {/* ⚽ ABOUT US STORY SECTION */}
        <div className="text-center space-y-4">
          <div>
            <span className="inline-block bg-[#2d2d2d] text-white text-[11px] font-bold px-3 py-1 rounded-md tracking-wide uppercase">
              Our Story
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-neutral-900 tracking-tight leading-none">
            About SAS Sports
          </h1>
          <p className="text-neutral-500 text-sm sm:text-base font-medium max-w-xl mx-auto">
            Born from a lifelong obsession with the beautiful game.
          </p>

          <div className="bg-white rounded-2xl border border-neutral-200/80 p-8 sm:p-10 shadow-sm text-left space-y-5 mt-6">
            <p className="text-neutral-600 text-sm sm:text-base md:text-lg leading-relaxed font-medium">
              We are three brothers who live and breathe the beautiful game. If we’re not outside playing or training, having fun, you’ll find us glued to the TV watching a game or battling it out on the PS5 playing FC. Soccer isn't just a sport to us, it’s how we are growing up, around the game, and it has brought us much joy.
            </p>
            <p className="text-neutral-600 text-sm sm:text-base md:text-lg leading-relaxed font-medium">
              We launched this business to take that lifelong obsession and build something all three of us can be proud of, creating a way to support our own growth while giving back to the community. Thanks for backing our vision, supporting our business, and being a part of this journey with us.
            </p>

            <div className="pt-4 flex items-center gap-3 border-t border-neutral-100">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
              <span className="text-xs font-bold text-neutral-500 uppercase tracking-widest">
                Arun, Shiva & Seyon
              </span>
            </div>
          </div>
        </div>

        {/* ❓ FREQUENTLY ASKED QUESTIONS SECTION */}
        <div className="border-t border-neutral-200/80 pt-16">
          <div className="text-center space-y-2 mb-10">
            <p className="text-[11px] font-bold tracking-[0.2em] text-neutral-400 uppercase">
              Got Questions?
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-neutral-900 tracking-tight leading-tight">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {FAQS.map((f, i) => (
              <div key={f.q} className="border border-neutral-200/80 rounded-xl bg-white overflow-hidden shadow-sm">
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="w-full flex items-center justify-between text-left px-6 py-5 hover:bg-neutral-100/50 transition"
                >
                  <span className="font-bold text-sm sm:text-base text-neutral-900 pr-4">{f.q}</span>
                  <span className={`text-neutral-400 font-bold transition-transform ${open === i ? "rotate-45" : ""}`}>
                    +
                  </span>
                </button>
                {open === i && (
                  <p className="px-6 pb-5 text-sm text-neutral-600 leading-relaxed border-t border-neutral-100 pt-3 font-medium">
                    {f.a}
                  </p>
                )}
              </div>
            ))}
          </div>

          <p className="text-center text-sm text-neutral-600 mt-10 font-medium">
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