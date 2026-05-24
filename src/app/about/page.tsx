"use client";

import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { BottomNav } from "@/components/BottomNav";
import { Footer, FooterMobile } from "@/components/Footer";
import { Shield, Camera, ClipboardCheck, Ban, UserCheck, ArrowLeft } from "lucide-react";

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://www.sellz.pk/#organization",
  "name": "Sellz.pk",
  "url": "https://www.sellz.pk",
  "description": "Pakistan's first CNIC-verified peer-to-peer classifieds marketplace. Every seller must verify their national identity card. One CNIC, one account — no fake listings, no anonymous sellers, no paid bumps.",
  "foundingLocation": { "@type": "Country", "name": "Pakistan" },
  "areaServed": { "@type": "Country", "name": "Pakistan" },
  "knowsAbout": ["classifieds marketplace", "CNIC verification", "peer-to-peer commerce", "online marketplace Pakistan"],
};

export default function AboutPage() {
  return (
    <div className="min-h-dvh flex flex-col" style={{ background: "var(--bg)" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
      />
      <Navbar />
      <main className="flex-1 pb-24 md:pb-8">
        <div className="max-w-2xl mx-auto px-4 py-8">
          <Link href="/" className="flex items-center gap-1.5 text-sm mb-6" style={{ color: "var(--text-muted)" }}>
            <ArrowLeft size={15} strokeWidth={2} /> Back
          </Link>

          <h1 className="text-3xl font-black mb-2" style={{ color: "var(--text-primary)" }}>
            About sellz<span style={{ color: "var(--brand-green)" }}>.pk</span>
          </h1>
          <p className="text-base mb-8 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            Pakistan&apos;s first classifieds platform built around trust — not ads, not paid bumps, not shops pretending to be individuals.
          </p>

          <section className="space-y-6 mb-10">
            <h2 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>Why we exist</h2>
            <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              OLX became a mess. Shops flooded it. Duplicate listings buried genuine sellers. Scammers operated freely. Buyers got burned — fake photos, wrong conditions, numbers never picked up.
            </p>
            <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              Sellz.pk fixes this with three rules: CNIC verification for every seller, camera-only photos (no stolen images), and manual approval of every ad before it goes live.
            </p>
          </section>

          <section className="space-y-4 mb-10">
            <h2 className="text-lg font-bold mb-4" style={{ color: "var(--text-primary)" }}>Our principles</h2>
            {[
              { icon: <Shield size={20} />, title: "1 CNIC = 1 account", desc: "Every seller verified by national ID. No duplicates, no fake accounts." },
              { icon: <Camera size={20} />, title: "Camera-only photos", desc: "All listing photos taken live via the app. No Google Images, no stock photos." },
              { icon: <ClipboardCheck size={20} />, title: "Every ad reviewed", desc: "Real humans check every submission before it goes live. No auto-publishing." },
              { icon: <Ban size={20} />, title: "No paid bumps", desc: "Newest first, always. No one can pay to appear at the top. Fair for everyone." },
              { icon: <UserCheck size={20} />, title: "Individuals only", desc: "Shops and dealers are not allowed. This is for people selling their own stuff." },
            ].map(item => (
              <div key={item.title} className="card p-4 flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "var(--brand-green-light)", color: "var(--brand-green)" }}>
                  {item.icon}
                </div>
                <div>
                  <p className="text-sm font-semibold mb-0.5" style={{ color: "var(--text-primary)" }}>{item.title}</p>
                  <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </section>

          <div className="card p-5 text-center">
            <p className="text-sm font-semibold mb-3" style={{ color: "var(--text-primary)" }}>Start buying and selling safely</p>
            <Link href="/auth" className="btn-primary justify-center inline-flex px-6">
              Create Account
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
