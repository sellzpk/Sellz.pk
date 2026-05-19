import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description: "Sellz.pk is Pakistan's first CNIC-verified classifieds marketplace. Learn how we're making buying and selling safer for every Pakistani.",
  alternates: { canonical: "https://www.sellz.pk/about" },
  openGraph: {
    title: "About Sellz.pk — Pakistan's Verified Marketplace",
    description: "The story behind Pakistan's safest buy-and-sell platform. CNIC-verified sellers, ownership proof, scam-free transactions.",
    url: "https://www.sellz.pk/about",
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
