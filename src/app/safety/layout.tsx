import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Safety Tips — Buy & Sell Safely in Pakistan",
  description: "How to avoid scams and stay safe when buying or selling online in Pakistan. Essential tips for safe transactions, verified sellers, and secure payments.",
  alternates: { canonical: "https://www.sellz.pk/safety" },
  openGraph: {
    title: "Stay Safe When Buying & Selling in Pakistan",
    description: "Avoid online scams in Pakistan. Tips for safe transactions, spotting fake ads, and dealing only with verified sellers.",
    url: "https://www.sellz.pk/safety",
  },
};

export default function SafetyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
