import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Sellz.pk terms of service. Rules and guidelines for using Pakistan's verified classifieds marketplace.",
  alternates: { canonical: "https://www.sellz.pk/terms" },
  robots: { index: false },
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
