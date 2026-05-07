"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { BottomNav } from "@/components/BottomNav";
import { AdCard } from "@/components/AdCard";
import { SearchBar } from "@/components/SearchBar";
import { CategoryGrid } from "@/components/CategoryGrid";
import {
  ShieldCheck, Ban, UserCheck,
  CreditCard, Camera, ClipboardCheck,
  Inbox,
} from "lucide-react";
import { MOCK_ADS, CATEGORY_TABS } from "@/lib/mockData";
import { Footer, FooterMobile } from "@/components/Footer";

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState("all");

  const filtered = activeCategory === "all"
    ? MOCK_ADS
    : MOCK_ADS.filter(ad => ad.category === activeCategory);

  return (
    <div className="min-h-dvh flex flex-col" style={{ background: "var(--bg)" }}>
      <Navbar />

      <main className="flex-1 pb-24 md:pb-8">
        {/* Mobile hero search */}
        <div className="md:hidden px-4 pt-4 pb-3 bg-white border-b border-[var(--border)]">
          <SearchBar city="Karachi" large />
        </div>

        {/* Trust bar */}
        <div className="bg-white" style={{ borderBottom: "1px solid #F0F0EE" }}>
          <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center gap-5 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-1.5 whitespace-nowrap">
              <ShieldCheck size={14} strokeWidth={2} style={{ color: "#1D9E75", flexShrink: 0 }} />
              <span style={{ fontSize: 12, color: "#444", fontWeight: 500 }}>CNIC-Verified Sellers Only</span>
            </div>
            <div style={{ width: 1, height: 14, background: "#E8E8E4", flexShrink: 0 }} />
            <div className="flex items-center gap-1.5 whitespace-nowrap">
              <Ban size={14} strokeWidth={2} style={{ color: "#1D9E75", flexShrink: 0 }} />
              <span style={{ fontSize: 12, color: "#444", fontWeight: 500 }}>No Paid Bumps — Newest First</span>
            </div>
            <div style={{ width: 1, height: 14, background: "#E8E8E4", flexShrink: 0 }} />
            <div className="flex items-center gap-1.5 whitespace-nowrap">
              <UserCheck size={14} strokeWidth={2} style={{ color: "#1D9E75", flexShrink: 0 }} />
              <span style={{ fontSize: 12, color: "#444", fontWeight: 500 }}>Individuals Only — No Shops</span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4">
          {/* Category tabs */}
          <div className="py-4 overflow-x-auto no-scrollbar -mx-4 px-4">
            <div className="flex gap-2 w-max">
              {CATEGORY_TABS.map(cat => (
                <button
                  key={cat.slug}
                  onClick={() => setActiveCategory(cat.slug)}
                  className={`cat-pill ${activeCategory === cat.slug ? "active" : ""}`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Desktop: categories grid */}
          <section className="hidden md:block mb-8">
            <h2 style={{ fontSize: 18, fontWeight: 500, color: "#1A1A1A", marginBottom: 16 }}>
              Browse Categories
            </h2>
            <CategoryGrid compact />
          </section>

          {/* Ads grid */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 style={{ fontSize: 16, fontWeight: 500, color: "#1A1A1A" }}>
                {activeCategory === "all"
                  ? "Latest Listings"
                  : CATEGORY_TABS.find(c => c.slug === activeCategory)?.label}
              </h2>
              <span className="text-sm text-[var(--text-muted)]">{filtered.length} ads</span>
            </div>

            {filtered.length > 0 ? (
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4" style={{ alignItems: "stretch" }}>
                {filtered.map(ad => (
                  <AdCard key={ad.id} ad={ad} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-16 h-16 rounded-2xl bg-[var(--brand-green-light)] flex items-center justify-center mb-4">
                  <Inbox size={32} strokeWidth={1.5} className="text-[var(--brand-green)]" />
                </div>
                <p className="text-base font-semibold text-[var(--text-primary)] mb-1">No listings yet</p>
                <p className="text-sm text-[var(--text-muted)]">Be the first to post in this category</p>
              </div>
            )}
          </section>

          {/* Why Sellz.pk — mobile only */}
          <section className="mt-10 mb-4 md:hidden">
            <h2 style={{ fontSize: 16, fontWeight: 500, color: "#1A1A1A", marginBottom: 12 }}>Why Sellz.pk?</h2>
            <div className="grid grid-cols-1 gap-3">
              <TrustCard
                icon={<CreditCard size={20} strokeWidth={1.75} style={{ color: "#1D9E75" }} />}
                title="CNIC Verification"
                desc="Every seller verified by national ID. 1 CNIC = 1 account, no exceptions."
              />
              <TrustCard
                icon={<Camera size={20} strokeWidth={1.75} style={{ color: "#1D9E75" }} />}
                title="Camera-Only Photos"
                desc="All photos taken live — no stolen images from the internet."
              />
              <TrustCard
                icon={<ClipboardCheck size={20} strokeWidth={1.75} style={{ color: "#1D9E75" }} />}
                title="Manual Approval"
                desc="Every ad reviewed by our team before going live."
              />
            </div>
          </section>
        </div>
      </main>

      <BottomNav />
      <Footer />
      <FooterMobile />
    </div>
  );
}

function TrustCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="card p-4 flex items-start gap-3">
      <div className="w-10 h-10 rounded-xl bg-[var(--brand-green-light)] flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-sm font-semibold text-[var(--text-primary)] mb-0.5">{title}</p>
        <p className="text-xs text-[var(--text-muted)] leading-snug">{desc}</p>
      </div>
    </div>
  );
}
