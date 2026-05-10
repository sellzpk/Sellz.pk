"use client";

import { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { BottomNav } from "@/components/BottomNav";
import { Footer, FooterMobile } from "@/components/Footer";
import { ArrowLeft, ChevronDown } from "lucide-react";

const FAQS = [
  {
    q: "How do I post an ad?",
    a: "Create an account, complete CNIC verification, then click Post Ad. Our team reviews every ad within 24 hours.",
  },
  {
    q: "How long does CNIC verification take?",
    a: "Usually within 24 hours on working days.",
  },
  {
    q: "Can I change my city?",
    a: "Yes, but only through our support team. Submit a request at /support/location-change or contact us at hello@sellz.pk",
  },
  {
    q: "Why was my ad rejected?",
    a: "Common reasons: unclear photos, missing ownership proof, price too unrealistic, or incomplete description.",
  },
  {
    q: "How do I report a scam?",
    a: "Click the Report button on any ad, or visit /report to submit a detailed report.",
  },
  {
    q: "Is Sellz.pk free?",
    a: "Yes, posting and browsing ads is completely free.",
  },
  {
    q: "Can I edit my ad after posting?",
    a: "Yes, go to your profile, open the ad, and tap Edit. Changes go through review again.",
  },
  {
    q: "How does in-app chat work?",
    a: "Tap the Message button on any ad. Your phone number stays hidden until you choose to share it.",
  },
  {
    q: "Can I delete my account?",
    a: "Yes. Email us at hello@sellz.pk with your registered email and we will delete your account within 48 hours.",
  },
];

export default function HelpPage() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="min-h-dvh flex flex-col" style={{ background: "var(--bg)" }}>
      <Navbar />
      <main className="flex-1 pb-24 md:pb-8">
        <div className="max-w-2xl mx-auto px-4 py-8">
          <Link href="/" className="flex items-center gap-1.5 text-sm mb-6" style={{ color: "var(--text-muted)" }}>
            <ArrowLeft size={15} strokeWidth={2} /> Back
          </Link>

          <h1 className="text-3xl font-black mb-2" style={{ color: "var(--text-primary)" }}>Help Center</h1>
          <p className="text-base mb-8" style={{ color: "var(--text-secondary)" }}>
            Frequently asked questions about buying and selling on Sellz.pk.
          </p>

          <div className="space-y-2 mb-10">
            {FAQS.map((faq, i) => (
              <div key={i} className="card overflow-hidden">
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="w-full flex items-center justify-between p-4 text-left"
                  style={{ background: "none", border: "none", cursor: "pointer" }}
                >
                  <span className="text-sm font-semibold pr-4" style={{ color: "var(--text-primary)" }}>
                    {faq.q}
                  </span>
                  <ChevronDown
                    size={16}
                    strokeWidth={2}
                    style={{
                      color: "var(--text-muted)",
                      flexShrink: 0,
                      transform: open === i ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 0.2s",
                    }}
                  />
                </button>
                {open === i && (
                  <div className="px-4 pb-4">
                    <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                      {faq.a}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="card p-5 text-center">
            <p className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)" }}>
              Still need help?
            </p>
            <p className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>
              Our team responds within 24 hours
            </p>
            <Link href="/contact" className="btn-primary justify-center inline-flex px-6">
              Contact Us
            </Link>
          </div>
        </div>
      </main>
      <BottomNav />
      <Footer />
      <FooterMobile />
    </div>
  );
}
