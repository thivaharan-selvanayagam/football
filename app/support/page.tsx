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
    <div className="max-w-5xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-14">
      <div>
        <p className="uppercase tracking-[0.25em] text-gold text-xs mb-2">Get in touch</p>
        <h1 className="font-display text-4xl text-ink mb-5">Support</h1>
        <p className="text-ink/60 mb-10 leading-relaxed">
          Questions about an order, sizing, or shipping? Send us a message and our team will get back to you within 24 hours.
        </p>
        <div className="space-y-6 text-sm">
          <div>
            <p className="font-display text-ink mb-1">Email</p>
            <p className="text-ink/60">support@sassports.com</p>
          </div>
          <div>
            <p className="font-display text-ink mb-1">Hours</p>
            <p className="text-ink/60">Mon – Fri, 9am – 6pm</p>
          </div>
          <div>
            <p className="font-display text-ink mb-1">Shipping</p>
            <p className="text-ink/60">Worldwide shipping, 5-9 working days standard.</p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-black/5 rounded-xl p-8">
        {sent ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 rounded-full bg-emerald/10 text-emerald flex items-center justify-center mx-auto mb-4">✓</div>
            <h2 className="font-display text-lg text-ink mb-2">Message sent</h2>
            <p className="text-sm text-ink/60">We'll be in touch shortly.</p>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            <input
              required
              placeholder="Your name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border border-black/10 rounded-lg px-4 py-3 text-sm focus-ring"
            />
            <input
              required
              type="email"
              placeholder="Email address"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full border border-black/10 rounded-lg px-4 py-3 text-sm focus-ring"
            />
            <input
              placeholder="Order number (optional)"
              value={form.order}
              onChange={(e) => setForm({ ...form, order: e.target.value })}
              className="w-full border border-black/10 rounded-lg px-4 py-3 text-sm focus-ring"
            />
            <textarea
              required
              placeholder="How can we help?"
              rows={5}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="w-full border border-black/10 rounded-lg px-4 py-3 text-sm focus-ring"
            />
            <button type="submit" className="w-full bg-ink text-chalk font-display py-3.5 rounded-full text-sm">
              Send message
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
