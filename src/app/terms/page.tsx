"use client";

import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { BottomNav } from "@/components/BottomNav";
import { Footer, FooterMobile } from "@/components/Footer";
import { ArrowLeft } from "lucide-react";

const TERMS = [
  {
    title: "Individuals only",
    body: "Sellz.pk is for individual sellers only. Businesses, shops, dealers, and commercial entities are not permitted.",
  },
  {
    title: "One account per CNIC",
    body: "Each National Identity Card can be associated with only one Sellz.pk account. Multiple accounts will result in a permanent ban.",
  },
  {
    title: "Live photos required",
    body: "All product photos must be taken live using the Sellz.pk app camera. Gallery uploads, stock images, and downloaded photos are not allowed.",
  },
  {
    title: "Honest listings",
    body: "Sellers must accurately describe item condition, defects, and any relevant history. Misleading descriptions are grounds for immediate removal.",
  },
  {
    title: "False information = permanent ban",
    body: "Providing false CNIC details, fake listings, or misrepresenting items will result in permanent account suspension.",
  },
  {
    title: "Ad removal rights",
    body: "Sellz.pk reserves the right to remove any ad at any time without prior notice, at our sole discretion.",
  },
  {
    title: "User responsibility",
    body: "Users are solely responsible for their transactions. Always inspect items in person before making payment.",
  },
  {
    title: "No liability for disputes",
    body: "Sellz.pk is a platform connecting buyers and sellers. We are not liable for disputes, losses, or damages arising from transactions between users.",
  },
  {
    title: "Prohibited items",
    body: "Listing illegal items, weapons, counterfeit goods, or anything prohibited by Pakistani law will result in immediate ban and may be reported to authorities.",
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-dvh flex flex-col" style={{ background: "var(--bg)" }}>
      <Navbar />
      <main className="flex-1 pb-24 md:pb-8">
        <div className="max-w-2xl mx-auto px-4 py-8">
          <Link href="/" className="flex items-center gap-1.5 text-sm mb-6" style={{ color: "var(--text-muted)" }}>
            <ArrowLeft size={15} strokeWidth={2} /> Back
          </Link>

          <h1 className="text-3xl font-black mb-2" style={{ color: "var(--text-primary)" }}>Terms of Use</h1>
          <p className="text-sm mb-8" style={{ color: "var(--text-muted)" }}>
            Last updated: January 2025
          </p>

          <div className="space-y-3 mb-10">
            {TERMS.map((term, i) => (
              <div key={i} className="card p-4">
                <div className="flex items-start gap-3">
                  <span
                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5"
                    style={{ background: "var(--brand-green-light)", color: "var(--brand-green)" }}
                  >
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)" }}>
                      {term.title}
                    </p>
                    <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                      {term.body}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <p className="text-xs text-center" style={{ color: "var(--text-muted)" }}>
            Questions?{" "}
            <Link href="/contact" style={{ color: "var(--brand-green)" }}>
              Contact us
            </Link>{" "}
            at hello@sellz.pk
          </p>
        </div>
      </main>
      <BottomNav />
      <Footer />
      <FooterMobile />
    </div>
  );
}
