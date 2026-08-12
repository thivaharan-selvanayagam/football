import type { Metadata } from "next";
import "@/app/globals.css";
import { CartProvider } from "@/lib/cart";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "SAS Sports — Custom Personalized Sports Cards",
  description: "Design your own custom sports cards at SAS Sports. Premium prints, high quality materials, and worldwide shipping.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-body antialiased bg-cream text-ink">
        <CartProvider>
          <Header />
          {/* Added top padding to ensure content sits cleanly below the fixed header */}
          <main className="pt-28 md:pt-32 min-h-screen">
            {children}
          </main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}