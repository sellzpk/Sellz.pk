"use client";

import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { BottomNav } from "@/components/BottomNav";
import { Footer, FooterMobile } from "@/components/Footer";
import { ArrowLeft, Lock } from "lucide-react";

const SECTIONS = [
  {
    title: "What we collect",
    items: [
      "Name, email address, and phone number",
      "City and general area",
      "CNIC front, back, and selfie for identity verification",
      "Photos of items you list for sale",
      "Chat messages between buyers and sellers",
    ],
  },
  {
    title: "How we use your data",
    items: [
      "To verify your identity and maintain marketplace trust",
      "To display your ads to potential buyers",
      "To facilitate in-app communication",
      "To investigate reports of fraud or scams",
      "To improve the platform experience",
    ],
  },
  {
    title: "What we protect",
    items: [
      "CNIC images are stored securely and never shown to other users",
      "Phone numbers are only revealed when you choose to share them in chat",
      "We do not sell your data to any third party",
      "We do not share your personal information with advertisers",
    ],
  },
  {
    title: "Your rights",
    items: [
      "You can request a copy of your data by emailing hello@sellz.pk",
      "You can request account deletion by emailing hello@sellz.pk",
      "Account deletion removes your profile and listings within 48 hours",
      "Chat history may be retained for up to 30 days after deletion for fraud investigation purposes",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-dvh flex flex-col" style={{ background: "var(--bg)" }}>
      <Navbar />
      <main className="flex-1 pb-24 md:pb-8">
        <div className="max-w-2xl mx-auto px-4 py-8">
          <Link href="/" className="flex items-center gap-1.5 text-sm mb-6" style={{ color: "var(--text-muted)" }}>
            <ArrowLeft size={15} strokeWidth={2} /> Back
          </Link>

          <h1 className="text-3xl font-black mb-2" style={{ color: "var(--text-primary)" }}>Privacy Policy</h1>
          <p className="text-sm mb-8" style={{ color: "var(--text-muted)" }}>
            Last updated: January 2025
          </p>

          <div className="card p-4 flex items-start gap-3 mb-6" style={{ background: "#F0FAF6", borderColor: "#D4EDE5" }}>
            <Lock size={16} strokeWidth={2} style={{ color: "var(--brand-green)", flexShrink: 0, marginTop: 2 }} />
            <p className="text-sm leading-relaxed" style={{ color: "#1A4D3A" }}>
              Your CNIC and personal details are stored securely and are never visible to other users or sold to third parties.
            </p>
          </div>

          <div className="space-y-4 mb-10">
            {SECTIONS.map((section) => (
              <div key={section.title} className="card p-5">
                <h3 className="text-sm font-bold mb-3" style={{ color: "var(--text-primary)" }}>
                  {section.title}
                </h3>
                <ul className="space-y-2">
                  {section.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                      <span className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: "var(--brand-green)" }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <p className="text-xs text-center" style={{ color: "var(--text-muted)" }}>
            Questions about your data?{" "}
            <a href="mailto:hello@sellz.pk" style={{ color: "var(--brand-green)" }}>
              hello@sellz.pk
            </a>
          </p>
        </div>
      </main>
      <BottomNav />
      <Footer />
      <FooterMobile />
    </div>
  );
}
