import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Search Ads — Mobiles, Cars, Laptops & More in Pakistan",
  description: "Search thousands of verified ads across Pakistan. Find used mobiles, cars, laptops, property, electronics and more from CNIC-verified sellers.",
  alternates: { canonical: "https://www.sellz.pk/search" },
  openGraph: {
    title: "Search Verified Ads in Pakistan",
    description: "Find the best deals on used mobiles, cars, laptops, electronics and property from verified sellers across Pakistan.",
    url: "https://www.sellz.pk/search",
  },
};

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return children;
}
