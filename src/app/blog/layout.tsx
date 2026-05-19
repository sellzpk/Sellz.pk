import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog — Tips for Buying & Selling in Pakistan",
  description: "Expert tips, guides, and advice for buying and selling in Pakistan. Learn how to get the best deals, avoid scams, and sell faster on Sellz.pk.",
  alternates: { canonical: "https://www.sellz.pk/blog" },
  openGraph: {
    title: "Sellz.pk Blog — Pakistan Marketplace Tips & Guides",
    description: "Buying and selling tips for Pakistanis. Avoid scams, price guides, and how to sell faster.",
    url: "https://www.sellz.pk/blog",
  },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children;
}
