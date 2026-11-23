import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Stripe Payment Test — SAS Sports",
  robots: {
    index: false,
    follow: false,
  },
};

export default function TestStripeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
