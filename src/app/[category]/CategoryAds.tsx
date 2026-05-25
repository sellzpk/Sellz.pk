"use client";

import { useEffect, useState } from "react";
import { AdCard } from "@/components/AdCard";
import type { Ad } from "@/components/AdCard";
import { createClient } from "@/lib/supabase/client";
import { mapAdRow, AD_SELECT } from "@/lib/supabase/helpers";
import { Loader2, Inbox } from "lucide-react";

export default function CategoryAds({ category, city }: { category?: string; city?: string }) {
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      let query = supabase
        .from("ads")
        .select(AD_SELECT)
        .eq("status", "active");
      if (category) query = query.eq("category", category);
      if (city) query = query.eq("city", city);
      const { data, error } = await query
        .order("created_at", { ascending: false })
        .limit(60);
      if (!error && data) setAds(data.map(mapAdRow));
      setLoading(false);
    }
    load();
  }, [category, city]);

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-2 md:gap-3 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="card overflow-hidden animate-pulse">
            <div style={{ height: 160, background: "#F0F0EE" }} />
            <div className="p-3 space-y-2">
              <div className="h-4 rounded" style={{ background: "#F0F0EE", width: "60%" }} />
              <div className="h-3 rounded" style={{ background: "#F0F0EE", width: "80%" }} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!ads.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 rounded-2xl bg-[var(--brand-green-light)] flex items-center justify-center mb-4">
          <Inbox size={32} strokeWidth={1.5} style={{ color: "var(--brand-green)" }} />
        </div>
        <p className="text-base font-semibold mb-1" style={{ color: "var(--text-primary)" }}>
          No listings yet
        </p>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          {city && !category ? `Be the first to post in ${city}` : "Be the first to post in this category"}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-2 md:gap-3 md:grid-cols-3 lg:grid-cols-4">
      {ads.map((ad) => (
        <AdCard key={ad.id} ad={ad} />
      ))}
    </div>
  );
}
