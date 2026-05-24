import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog — Buying & Selling Tips for Pakistan",
  description: "Guides and tips for safe buying and selling in Pakistan. How to avoid scams, sell your phone, buy a used car, and more — from the Sellz.pk team.",
  alternates: { canonical: "https://www.sellz.pk/blog" },
  openGraph: {
    title: "Sellz.pk Blog — Safe Buying & Selling in Pakistan",
    description: "Practical guides on avoiding scams, selling your phone safely, buying used cars, and more.",
    url: "https://www.sellz.pk/blog",
  },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children;
}
