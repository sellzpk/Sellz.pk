import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How It Works — Safe Buying & Selling in Pakistan",
  description: "Learn how to buy and sell safely on Sellz.pk. CNIC verification, ownership documents, secure messaging — step-by-step guide for Pakistani buyers and sellers.",
  alternates: { canonical: "https://www.sellz.pk/how-it-works" },
  openGraph: {
    title: "How Sellz.pk Works — Verified, Safe, Simple",
    description: "Step-by-step guide to buying and selling safely in Pakistan. Verified sellers, ownership proof, scam protection.",
    url: "https://www.sellz.pk/how-it-works",
  },
};

export default function HowItWorksLayout({ children }: { children: React.ReactNode }) {
  return children;
}
