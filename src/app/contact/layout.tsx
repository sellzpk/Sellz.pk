import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with the Sellz.pk team. Report issues, get help with your account, or give us feedback.",
  alternates: { canonical: "https://www.sellz.pk/contact" },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
