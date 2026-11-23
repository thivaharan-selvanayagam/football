import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Help Shiva Go to Italy — SAS Sports",
  description: "Support Shiva on his soccer journey to Italy in March 2027.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ShivaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
