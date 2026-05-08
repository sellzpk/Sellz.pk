"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { BottomNav } from "@/components/BottomNav";
import { AdCard } from "@/components/AdCard";
import type { Ad } from "@/components/AdCard";
import { SearchBar } from "@/components/SearchBar";
import { Footer, FooterMobile } from "@/components/Footer";
import { createClient } from "@/lib/supabase/client";
import { CATEGORIES, CATEGORY_TABS, getSubcategories } from "@/lib/categories";
import { CITIES, getAreas } from "@/lib/locations";
import { Search, Loader2, SlidersHorizontal, X, ChevronDown, ChevronUp } from "lucide-react";

function relativeTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "Just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

const PAGE_SIZE = 20;

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const q = searchParams.get("q") || "";
  const initCategory = searchParams.get("category") || "all";

  const [activeCategory, setActiveCategory] = useState(initCategory);
  const [subcategory, setSubcategory] = useState(searchParams.get("sub") || "");
  const [filterCity, setFilterCity] = useState(searchParams.get("city") || "");
  const [filterArea, setFilterArea] = useState(searchParams.get("area") || "");
  const [minPrice, setMinPrice] = useState(searchParams.get("min") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("max") || "");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [results, setResults] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [subOpen, setSubOpen] = useState(true);

  const subcategories = getSubcategories(activeCategory);
  const areas = getAreas(filterCity);

  useEffect(() => {
    setPage(1);
    setResults([]);
    fetchResults(1, false);
  }, [q, activeCategory, subcategory, filterCity, filterArea, minPrice, maxPrice, verifiedOnly]);

  async function fetchResults(pageNum: number, append: boolean) {
    if (pageNum === 1) setLoading(true); else setLoadingMore(true);

    const supabase = createClient();
    let query = supabase
      .from("ads")
      .select("id, title, price, city, area, category, created_at, ad_photos(url), users(cnic_verified)")
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .range((pageNum - 1) * PAGE_SIZE, pageNum * PAGE_SIZE);

    if (q) query = query.ilike("title", `%${q}%`);
    if (activeCategory !== "all") query = query.eq("category", activeCategory);
    if (subcategory) query = query.eq("subcategory", subcategory);
    if (filterCity) query = query.eq("city", filterCity);
    if (filterArea) query = query.eq("area", filterArea);
    if (minPrice) query = query.gte("price", Number(minPrice));
    if (maxPrice) query = query.lte("price", Number(maxPrice));
    if (verifiedOnly) query = query.eq("users.cnic_verified", true);

    const { data } = await query;

    const mapped: Ad[] = (data ?? []).map((a: any) => ({
      id: String(a.id),
      title: a.title,
      price: a.price,
      images: (a.ad_photos as { url: string }[]).map((p: { url: string }) => p.url),
      area: a.area ?? "",
      city: a.city ?? "",
      postedAt: relativeTime(a.created_at),
      verified: a.users?.cnic_verified ?? false,
      owned: false,
      category: a.category,
    }));

    setHasMore(mapped.length > PAGE_SIZE);
    const display = mapped.slice(0, PAGE_SIZE);

    if (append) setResults(prev => [...prev, ...display]);
    else setResults(display);

    setLoading(false);
    setLoadingMore(false);
  }

  function handleCategoryChange(slug: string) {
    setActiveCategory(slug);
    setSubcategory("");
    setFilterArea("");
  }

  function clearFilters() {
    setFilterCity("");
    setFilterArea("");
    setMinPrice("");
    setMaxPrice("");
    setVerifiedOnly(false);
    setSubcategory("");
  }

  const hasFilters = !!(filterCity || filterArea || minPrice || maxPrice || verifiedOnly || subcategory);

  const FilterPanel = () => (
    <div className="space-y-5">
      {/* Subcategories */}
      {subcategories.length > 0 && (
        <div>
          <button
            className="flex items-center justify-between w-full text-sm font-semibold mb-2"
            style={{ color: "var(--text-primary)" }}
            onClick={() => setSubOpen(v => !v)}
          >
            Subcategory {subOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
          {subOpen && (
            <div className="space-y-1">
              <button
                onClick={() => setSubcategory("")}
                className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-colors ${!subcategory ? "bg-[var(--brand-green-light)] text-[var(--brand-green)] font-medium" : "text-[var(--text-secondary)] hover:bg-[var(--bg)]"}`}
              >
                All
              </button>
              {subcategories.map(sub => (
                <button
                  key={sub}
                  onClick={() => setSubcategory(sub)}
                  className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-colors ${subcategory === sub ? "bg-[var(--brand-green-light)] text-[var(--brand-green)] font-medium" : "text-[var(--text-secondary)] hover:bg-[var(--bg)]"}`}
                >
                  {sub}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* City */}
      <div>
        <label className="block text-sm font-semibold mb-2" style={{ color: "var(--text-primary)" }}>City</label>
        <select
          value={filterCity}
          onChange={e => { setFilterCity(e.target.value); setFilterArea(""); }}
          className="w-full px-3 py-2 text-sm border border-[var(--border)] rounded-lg outline-none"
          style={{ background: "var(--bg)" }}
        >
          <option value="">All Pakistan</option>
          {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Area */}
      {areas.length > 0 && (
        <div>
          <label className="block text-sm font-semibold mb-2" style={{ color: "var(--text-primary)" }}>Area</label>
          <select
            value={filterArea}
            onChange={e => setFilterArea(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-[var(--border)] rounded-lg outline-none"
            style={{ background: "var(--bg)" }}
          >
            <option value="">All areas</option>
            {areas.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>
      )}

      {/* Price range */}
      <div>
        <label className="block text-sm font-semibold mb-2" style={{ color: "var(--text-primary)" }}>Price (Rs)</label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={e => setMinPrice(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-[var(--border)] rounded-lg outline-none"
            style={{ background: "var(--bg)" }}
          />
          <span className="text-[var(--text-muted)] text-sm flex-shrink-0">—</span>
          <input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={e => setMaxPrice(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-[var(--border)] rounded-lg outline-none"
            style={{ background: "var(--bg)" }}
          />
        </div>
      </div>

      {/* Verified only */}
      <label className="flex items-center gap-3 cursor-pointer">
        <div
          onClick={() => setVerifiedOnly(v => !v)}
          className={`w-10 h-6 rounded-full transition-colors flex items-center px-0.5 ${verifiedOnly ? "bg-[var(--brand-green)]" : "bg-gray-200"}`}
        >
          <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${verifiedOnly ? "translate-x-4" : "translate-x-0"}`} />
        </div>
        <span className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>Verified sellers only</span>
      </label>

      {hasFilters && (
        <button
          onClick={clearFilters}
          className="w-full py-2 text-sm text-red-500 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
        >
          Clear all filters
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-dvh flex flex-col" style={{ background: "var(--bg)" }}>
      <Navbar />

      {/* Mobile search bar */}
      <div className="md:hidden px-4 pt-4 pb-3 bg-white border-b border-[var(--border)]">
        <SearchBar city="Pakistan" defaultValue={q} />
      </div>

      {/* Category tabs */}
      <div className="bg-white border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto overflow-x-auto no-scrollbar">
          <div className="flex gap-1 px-4 py-2 w-max">
            {CATEGORY_TABS.map(cat => (
              <button
                key={cat.slug}
                onClick={() => handleCategoryChange(cat.slug)}
                className={`cat-pill ${activeCategory === cat.slug ? "active" : ""}`}
                style={{ padding: "5px 12px", fontSize: 12 }}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full px-4 py-4 flex gap-6">
        {/* Desktop sidebar */}
        <aside className="hidden md:block w-56 flex-shrink-0">
          <div className="card p-4 sticky top-20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>Filters</h3>
              {hasFilters && (
                <button onClick={clearFilters} className="text-xs text-red-500">Clear</button>
              )}
            </div>
            <FilterPanel />
          </div>
        </aside>

        <main className="flex-1 min-w-0">
          {/* Results header */}
          <div className="flex items-center justify-between mb-4">
            <div>
              {q && (
                <h1 className="text-base font-semibold" style={{ color: "var(--text-primary)" }}>
                  &ldquo;<span style={{ color: "var(--brand-green)" }}>{q}</span>&rdquo;
                </h1>
              )}
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                {loading ? "Searching..." : `${results.length}${hasMore ? "+" : ""} listings`}
              </p>
            </div>
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="md:hidden flex items-center gap-1.5 px-3 py-2 rounded-lg border text-sm font-medium"
              style={{ borderColor: hasFilters ? "var(--brand-green)" : "var(--border)", color: hasFilters ? "var(--brand-green)" : "var(--text-secondary)" }}
            >
              <SlidersHorizontal size={14} strokeWidth={2} />
              Filters {hasFilters && "•"}
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 size={28} strokeWidth={2} className="animate-spin" style={{ color: "var(--brand-green)" }} />
            </div>
          ) : results.length > 0 ? (
            <>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {results.map(ad => <AdCard key={ad.id} ad={ad} />)}
              </div>
              {hasMore && (
                <div className="flex justify-center mt-6">
                  <button
                    onClick={() => {
                      const next = page + 1;
                      setPage(next);
                      fetchResults(next, true);
                    }}
                    disabled={loadingMore}
                    className="px-6 py-2.5 rounded-xl border text-sm font-medium transition-colors hover:bg-[var(--brand-green)] hover:text-white hover:border-[var(--brand-green)] disabled:opacity-50"
                    style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}
                  >
                    {loadingMore ? <Loader2 size={16} className="animate-spin inline mr-2" /> : null}
                    Load more
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 rounded-2xl bg-[var(--bg)] border border-[var(--border)] flex items-center justify-center mb-4">
                <Search size={28} strokeWidth={1.5} className="text-[var(--text-muted)]" />
              </div>
              <p className="text-base font-semibold mb-1" style={{ color: "var(--text-primary)" }}>No listings found</p>
              <p className="text-sm max-w-xs" style={{ color: "var(--text-muted)" }}>
                {hasFilters ? "Try removing some filters" : "Be the first to post in this category!"}
              </p>
            </div>
          )}
        </main>
      </div>

      {/* Mobile filter sheet */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 flex items-end">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileFiltersOpen(false)} />
          <div className="relative w-full bg-white rounded-t-3xl p-5 pb-8 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-bold" style={{ color: "var(--text-primary)" }}>Filters</h3>
              <button onClick={() => setMobileFiltersOpen(false)}>
                <X size={20} strokeWidth={2} style={{ color: "var(--text-muted)" }} />
              </button>
            </div>
            <FilterPanel />
            <button
              onClick={() => setMobileFiltersOpen(false)}
              className="mt-5 w-full py-3 rounded-xl text-sm font-semibold text-white"
              style={{ background: "var(--brand-green)" }}
            >
              Show results
            </button>
          </div>
        </div>
      )}

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
