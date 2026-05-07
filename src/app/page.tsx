"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { BottomNav } from "@/components/BottomNav";
import { AdCard } from "@/components/AdCard";
import type { Ad } from "@/components/AdCard";
import { SearchBar } from "@/components/SearchBar";
import { CategoryGrid } from "@/components/CategoryGrid";
import {
  ShieldCheck, Ban, UserCheck,
  CreditCard, Camera, ClipboardCheck,
  Inbox, Loader2,
} from "lucide-react";
import { CATEGORY_TABS } from "@/lib/mockData";
import { Footer, FooterMobile } from "@/components/Footer";
import { createClient } from "@/lib/supabase/client";
import { mapAdRow, AD_SELECT } from "@/lib/supabase/helpers";

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAds() {
      setLoading(true);
      const supabase = createClient();
      const query = supabase
        .from("ads")
        .select(AD_SELECT)
        .eq("status", "active")
        .order("created_at", { ascending: false })
        .limit(60);

      if (activeCategory !== "all") {
        query.eq("category", activeCategory);
      }

      const { data, error } = await query;
      if (!error && data) {
        setAds(data.map(mapAdRow));
      } else {
        setAds([]);
      }
      setLoading(false);
    }
    fetchAds();
  }, [activeCategory]);

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
            <h2 style={{ fontSize: 18, fontWeight: 500, color: "#1A1A1A", marginBottom: 16 }}>Browse Categories</h2>
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
              {!loading && (
                <span className="text-sm" style={{ color: "var(--text-muted)" }}>{ads.length} ads</span>
              )}
            </div>

            {loading ? (
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="card overflow-hidden animate-pulse">
                    <div style={{ height: 200, background: "#F0F0EE" }} />
                    <div className="p-3 space-y-2">
                      <div className="h-4 rounded" style={{ background: "#F0F0EE", width: "60%" }} />
                      <div className="h-3 rounded" style={{ background: "#F0F0EE", width: "90%" }} />
                      <div className="h-3 rounded" style={{ background: "#F0F0EE", width: "70%" }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : ads.length > 0 ? (
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4" style={{ alignItems: "stretch" }}>
                {ads.map(ad => <AdCard key={ad.id} ad={ad} />)}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-16 h-16 rounded-2xl bg-[var(--brand-green-light)] flex items-center justify-center mb-4">
                  <Inbox size={32} strokeWidth={1.5} style={{ color: "var(--brand-green)" }} />
                </div>
                <p className="text-base font-semibold mb-1" style={{ color: "var(--text-primary)" }}>No listings yet</p>
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>Be the first to post in this category</p>
              </div>
            )}
          </section>

          {/* Why Sellz.pk */}
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
        <p className="text-sm font-semibold mb-0.5" style={{ color: "var(--text-primary)" }}>{title}</p>
        <p className="text-xs leading-snug" style={{ color: "var(--text-muted)" }}>{desc}</p>
      </div>
    </div>
  );
}
