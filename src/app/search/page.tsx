"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { BottomNav } from "@/components/BottomNav";
import { AdCard } from "@/components/AdCard";
import { FilterSheet } from "@/components/FilterSheet";
import { SearchBar } from "@/components/SearchBar";
import { MOCK_ADS, CATEGORY_TABS } from "@/lib/mockData";
import { Search } from "lucide-react";
import { Footer, FooterMobile } from "@/components/Footer";

function SearchContent() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") || "";
  const category = searchParams.get("category") || "all";
  const [activeCategory, setActiveCategory] = useState(category);

  const results = MOCK_ADS.filter(ad => {
    const matchQuery = !q || ad.title.toLowerCase().includes(q.toLowerCase());
    const matchCategory = activeCategory === "all" || ad.category === activeCategory;
    return matchQuery && matchCategory;
  });

  return (
    <div className="min-h-dvh flex flex-col" style={{ background: "var(--bg)" }}>
      <Navbar />

      <main className="flex-1 pb-24 md:pb-8">
        {/* Search bar on mobile */}
        <div className="md:hidden px-4 pt-4 pb-3 bg-white border-b border-[var(--border)]">
          <SearchBar city="Karachi" defaultValue={q} />
        </div>

        {/* Category tabs */}
        <div className="bg-white border-b border-[var(--border)]">
          <div className="max-w-7xl mx-auto overflow-x-auto no-scrollbar">
            <div className="flex gap-1 px-4 py-2 w-max">
              {CATEGORY_TABS.map(cat => (
                <button
                  key={cat.slug}
                  onClick={() => setActiveCategory(cat.slug)}
                  className={`cat-pill ${activeCategory === cat.slug ? "active" : ""}`}
                  style={{ padding: "5px 12px", fontSize: 12 }}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-4">
          {/* Results header */}
          <div className="flex items-center justify-between mb-4">
            <div>
              {q && (
                <h1 className="text-base font-semibold text-[var(--text-primary)]">
                  Results for &ldquo;<span style={{ color: "var(--brand-green)" }}>{q}</span>&rdquo;
                </h1>
              )}
              <p className="text-sm text-[var(--text-muted)]">{results.length} listings found</p>
            </div>
            <FilterSheet />
          </div>

          {results.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
              {results.map(ad => (
                <AdCard key={ad.id} ad={ad} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 rounded-2xl bg-[var(--bg)] border border-[var(--border)] flex items-center justify-center mb-4">
                <Search size={28} strokeWidth={1.5} className="text-[var(--text-muted)]" />
              </div>
              <p className="text-base font-semibold text-[var(--text-primary)] mb-1">No results found</p>
              <p className="text-sm text-[var(--text-muted)] max-w-xs">
                Try a different search term or browse a different category
              </p>
            </div>
          )}
        </div>
      </main>

      <BottomNav />
      <Footer />
      <FooterMobile />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense>
      <SearchContent />
    </Suspense>
  );
}
