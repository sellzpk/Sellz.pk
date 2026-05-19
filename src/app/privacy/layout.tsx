import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Sellz.pk privacy policy. How we collect, use, and protect your data.",
  alternates: { canonical: "https://www.sellz.pk/privacy" },
  robots: { index: false },
};

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
