"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Heart, ImageOff, ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { BottomNav } from "@/components/BottomNav";

type FavAd = {
  fav_id: number;
  ad: {
    id: number;
    title: string;
    price: number;
    city: string | null;
    status: string;
    ad_photos: { url: string; order_index: number }[];
  };
};

export default function FavoritesPage() {
  const router = useRouter();
  const [favorites, setFavorites] = useState<FavAd[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
  }, []);

  async function loadFavorites() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.replace("/auth/login"); return; }

    const { data } = await supabase
      .from("favorites")
      .select("id, ads(id, title, price, city, status, ad_photos(url, order_index))")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    setFavorites(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (data ?? []).filter((f: any) => f.ads).map((f: any) => ({ fav_id: f.id, ad: f.ads }))
    );
    setLoading(false);
  }

  async function removeFavorite(adId: number) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("favorites").delete().eq("user_id", user.id).eq("ad_id", adId);
    fetch("/api/favorites/toggle", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ adId, action: "remove" }),
    });
    setFavorites(prev => prev.filter(f => f.ad.id !== adId));
  }

  return (
    <div className="min-h-dvh" style={{ background: "#F8F8F6" }}>
      {/* Header */}
      <div style={{ background: "white", borderBottom: "1px solid #E8E8E4", position: "sticky", top: 0, zIndex: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px" }}>
          <button
            onClick={() => router.back()}
            style={{ background: "none", border: "none", cursor: "pointer", padding: 4, display: "flex" }}
          >
            <ArrowLeft size={22} />
          </button>
          <h1 style={{ fontSize: 18, fontWeight: 700, margin: 0, color: "#1A1A1A" }}>
            Saved Ads{favorites.length > 0 ? ` (${favorites.length})` : ""}
          </h1>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: 16, paddingBottom: 88 }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: 60, color: "#999" }}>Loading...</div>
        ) : favorites.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 24px" }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>❤️</div>
            <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8, color: "#1A1A1A" }}>No saved ads yet</h3>
            <p style={{ color: "#999", fontSize: 14, marginBottom: 24 }}>Tap the heart icon on any ad to save it here</p>
            <button
              onClick={() => router.push("/")}
              style={{ padding: "12px 28px", background: "#1D9E75", color: "white", border: "none", borderRadius: 10, fontWeight: 600, cursor: "pointer", fontSize: 15 }}
            >
              Browse Ads
            </button>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
            {favorites.map(({ fav_id, ad }) => {
              const photo = [...(ad.ad_photos ?? [])].sort((a, b) => a.order_index - b.order_index)[0];
              return (
                <div
                  key={fav_id}
                  onClick={() => router.push(`/ads/${ad.id}`)}
                  style={{ background: "white", borderRadius: 10, border: "1px solid #E8E8E4", overflow: "hidden", cursor: "pointer", position: "relative" }}
                >
                  <div style={{ position: "relative" }}>
                    {photo ? (
                      <img src={photo.url} alt="" style={{ width: "100%", height: 140, objectFit: "cover", display: "block" }} />
                    ) : (
                      <div style={{ width: "100%", height: 140, background: "#F5F5F3", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <ImageOff size={24} color="#CCC" />
                      </div>
                    )}
                    <button
                      onClick={e => { e.stopPropagation(); removeFavorite(ad.id); }}
                      style={{ position: "absolute", top: 8, right: 8, width: 28, height: 28, borderRadius: "50%", background: "rgba(255,255,255,0.92)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 1px 4px rgba(0,0,0,0.15)" }}
                    >
                      <Heart size={14} fill="#EF4444" color="#EF4444" />
                    </button>
                    {ad.status === "sold" && (
                      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.35)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ background: "#EF4444", color: "white", fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 4, transform: "rotate(-15deg)" }}>SOLD</span>
                      </div>
                    )}
                  </div>
                  <div style={{ padding: 10 }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: "#1D9E75" }}>
                      Rs {Number(ad.price).toLocaleString("en-PK")}
                    </div>
                    <div style={{ fontSize: 13, color: "#1A1A1A", marginTop: 3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {ad.title}
                    </div>
                    {ad.city && (
                      <div style={{ fontSize: 12, color: "#999", marginTop: 3 }}>{ad.city}</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
