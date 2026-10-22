"use client";

import { useState } from "react";

export default function SupportPage() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", order: "", message: "" });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <section className="w-full min-h-screen bg-white text-neutral-900 flex items-center justify-center py-16 px-6 sm:px-12 md:px-24">
      <div className="w-full max-w-5xl mx-auto grid md:grid-cols-2 gap-12 md:gap-16 items-start">
        
        {/* Left Column: Contact Details */}
        <div className="space-y-6">
          <div>
            <p className="uppercase tracking-[0.25em] text-gold text-xs mb-2 font-medium">Get in touch</p>
            <h1 className="font-display text-4xl sm:text-5xl font-black text-neutral-900 tracking-tight leading-none mb-5">
              Support
            </h1>
            <p className="text-neutral-600 text-sm sm:text-base leading-relaxed font-medium">
              Questions about an order, sizing, or shipping? Send us a message and our team will get back to you within 24 hours.
            </p>
          </div>

          <div className="space-y-6 text-sm border-t border-neutral-100 pt-6">
            <div>
              <p className="font-display font-bold text-neutral-900 mb-1">Email</p>
              <p className="text-neutral-600">hisassports@gmail.com</p>
            </div>
            <div>
              <p className="font-display font-bold text-neutral-900 mb-1">Shipping</p>
              <p className="text-neutral-600">Canadawide shipping, 5-9 working days standard.</p>
            </div>
          </div>
        </div>

        {/* Right Column: Contact Form Box */}
        <div className="bg-white border border-neutral-200/80 rounded-2xl p-8 shadow-sm">
          {sent ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 rounded-full bg-emerald/10 text-emerald flex items-center justify-center mx-auto mb-4 font-bold">
                ✓
              </div>
              <h2 className="font-display text-lg font-bold text-neutral-900 mb-2">Message sent</h2>
              <p className="text-sm text-neutral-600">We'll be in touch shortly.</p>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              <input
                required
                placeholder="Your name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm focus-ring text-neutral-900 placeholder:text-neutral-400"
              />
              <input
                required
                type="email"
                placeholder="Email address"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm focus-ring text-neutral-900 placeholder:text-neutral-400"
              />
              <input
                placeholder="Order number (optional)"
                value={form.order}
                onChange={(e) => setForm({ ...form, order: e.target.value })}
                className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm focus-ring text-neutral-900 placeholder:text-neutral-400"
              />
              <textarea
                required
                placeholder="How can we help?"
                rows={5}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm focus-ring text-neutral-900 placeholder:text-neutral-400"
              />
              <button
                type="submit"
                className="w-full bg-[#232323] hover:bg-black text-white font-display font-bold py-3.5 rounded-full text-sm transition shadow-md"
              >
                Send message
              </button>
            </form>
          )}
        </div>

      </div>
    </section>
  );
}