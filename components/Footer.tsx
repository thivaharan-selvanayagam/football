import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-ink text-chalk/80 mt-24">
      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-2 md:grid-cols-4 gap-10 text-sm">
        <div>
          <h4 className="font-display text-chalk text-base mb-3 tracking-wide">Website</h4>
          <ul className="space-y-2">
            <li><Link href="/cards">Football Cards</Link></li>
            <li><Link href="/faq">FAQ</Link></li>
            <li><Link href="/support">Support</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-display text-chalk text-base mb-3 tracking-wide">Support</h4>
          <ul className="space-y-2">
            <li><Link href="/support">Contact Us</Link></li>
            <li><Link href="/faq">FAQ</Link></li>
            <li><Link href="/support">Shipping Information</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-display text-chalk text-base mb-3 tracking-wide">Company</h4>
          <ul className="space-y-2">
            <li><Link href="/">About us</Link></li>
            <li><Link href="/support">Returns Policy</Link></li>
            <li><Link href="/support">Privacy Policy</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-display text-chalk text-base mb-3 tracking-wide">CardsPlug</h4>
          <p>Personalised football cards inspired by the icons of the game. Designed, printed and shipped worldwide.</p>
        </div>
      </div>
      <div className="border-t border-chalk/10 text-center text-xs py-5">
        © 2026 CardsPlug. All rights reserved.
      </div>
    </footer>
  );
}
