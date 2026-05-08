"use client";

import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { BottomNav } from "@/components/BottomNav";
import { Footer, FooterMobile } from "@/components/Footer";
import { ArrowLeft, AlertTriangle, Flag, Phone, MapPin, CreditCard, ShieldAlert } from "lucide-react";

const TIPS = [
  {
    icon: <MapPin size={18} />,
    title: "Meet in a public place",
    tips: [
      "Always meet in a busy, well-lit public area — Dolmen Mall, a bank branch, or a busy cafe",
      "Never invite strangers to your home or agree to meet at theirs",
      "Bring a friend or family member if possible",
    ],
  },
  {
    icon: <CreditCard size={18} />,
    title: "Never send money in advance",
    tips: [
      "Pay only after physically inspecting the item",
      "Ignore any requests for advance payment, token money, or booking fees",
      "No genuine seller will ask for payment before the meeting",
    ],
  },
  {
    icon: <Phone size={18} />,
    title: "Guard your phone number",
    tips: [
      "Use Sellz.pk in-app chat first — your number stays hidden until you choose to share",
      "Be cautious if a buyer pushes hard for your WhatsApp before any discussion",
      "Never share OTPs or banking credentials with anyone",
    ],
  },
  {
    icon: <AlertTriangle size={18} />,
    title: "Spot fake listings",
    tips: [
      "If the price seems too good to be true, it is",
      "Sellz.pk only shows camera-captured photos — if photos look like stock images, report it",
      "Check seller rating and how long they've been on the platform",
    ],
  },
  {
    icon: <ShieldAlert size={18} />,
    title: "Vehicles and property",
    tips: [
      "For vehicles: check the registration book, engine number, and chassis number match",
      "For property: verify ownership documents with a lawyer before any payment",
      "Always do a physical inspection — never buy without seeing it in person",
    ],
  },
  {
    icon: <Flag size={18} />,
    title: "Report suspicious activity",
    tips: [
      "Use the Report button on any listing that seems fake or misleading",
      "Report users who ask for advance payment or push for off-platform deals",
      "Our team reviews all reports within 24 hours",
    ],
  },
];

export default function SafetyPage() {
  return (
    <div className="min-h-dvh flex flex-col" style={{ background: "var(--bg)" }}>
      <Navbar />
      <main className="flex-1 pb-24 md:pb-8">
        <div className="max-w-2xl mx-auto px-4 py-8">
          <Link href="/" className="flex items-center gap-1.5 text-sm mb-6" style={{ color: "var(--text-muted)" }}>
            <ArrowLeft size={15} strokeWidth={2} /> Back
          </Link>

          <h1 className="text-3xl font-black mb-2" style={{ color: "var(--text-primary)" }}>Safety Tips</h1>
          <p className="text-base mb-8 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            Sellz.pk verifies every seller — but always stay cautious. These tips keep you safe.
          </p>

          <div className="space-y-4 mb-10">
            {TIPS.map(section => (
              <div key={section.title} className="card p-5">
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "#fef3c7", color: "#d97706" }}>
                    {section.icon}
                  </div>
                  <h3 className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>{section.title}</h3>
                </div>
                <ul className="space-y-2">
                  {section.tips.map(tip => (
                    <li key={tip} className="flex items-start gap-2 text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                      <span className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: "var(--brand-green)" }} />
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="card p-4 flex items-start gap-3" style={{ background: "#fef2f2", borderColor: "#fecaca" }}>
            <AlertTriangle size={16} strokeWidth={2} className="text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-red-700 mb-1">Emergency</p>
              <p className="text-xs text-red-600 leading-relaxed">
                If you feel unsafe or believe you&apos;ve been scammed, contact Pakistan Cyber Crime Wing: <strong>0800-02345</strong> (free, 24/7).
              </p>
            </div>
          </div>
        </div>
      </main>
      <BottomNav />
      <Footer />
      <FooterMobile />
    </div>
  );
}
