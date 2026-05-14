"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, CheckCheck, RefreshCw, ImageOff, ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { BottomNav } from "@/components/BottomNav";
import type { User as SupabaseUser } from "@supabase/supabase-js";

type MyAd = {
  id: number;
  title: string;
  price: number;
  city: string | null;
  status: string;
  rejection_reason: string | null;
  created_at: string;
  ad_photos: { url: string; order_index: number }[];
};

type TabKey = "all" | "active" | "pending" | "rejected" | "sold";

type Counts = Record<TabKey, number>;

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d}d ago`;
  return `${Math.floor(d / 30)}mo ago`;
}

const statusConfig: Record<string, { bg: string; color: string; label: string }> = {
  active:   { bg: "#F0FAF6", color: "#1D9E75", label: "✅ Active" },
  pending:  { bg: "#FFF8E6", color: "#F59E0B", label: "⏳ Under Review" },
  rejected: { bg: "#FFF0F0", color: "#EF4444", label: "❌ Rejected" },
  sold:     { bg: "#F0F0FF", color: "#6366F1", label: "🎉 Sold" },
  expired:  { bg: "#F5F5F3", color: "#999",    label: "Expired" },
};

const TABS: { key: TabKey; label: string }[] = [
  { key: "all",      label: "All" },
  { key: "active",   label: "Active" },
  { key: "pending",  label: "Pending" },
  { key: "rejected", label: "Rejected" },
  { key: "sold",     label: "Sold" },
];

const EMPTY: Record<TabKey, { icon: string; title: string; desc: string }> = {
  all:      { icon: "📭", title: "No ads yet",        desc: "Post your first ad and start selling today" },
  active:   { icon: "📋", title: "No active ads",     desc: "Your approved ads will appear here" },
  pending:  { icon: "⏳", title: "No pending ads",    desc: "Ads under review will appear here" },
  rejected: { icon: "❌", title: "No rejected ads",   desc: "" },
  sold:     { icon: "🎉", title: "No sold items yet", desc: "Mark your ads as sold when items are sold" },
};

export default function MyAdsPage() {
  const router = useRouter();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const [ads, setAds] = useState<MyAd[]>([]);
  const [counts, setCounts] = useState<Counts>({ all: 0, active: 0, pending: 0, rejected: 0, sold: 0 });
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState("");

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.replace("/auth/login"); return; }
      setUser(user);
    });
  }, [router]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("updated") === "true") {
      setToast("✅ Ad updated — submitted for review");
      window.history.replaceState({}, "", "/my-ads");
      setTimeout(() => setToast(""), 4000);
    }
  }, []);

  const fetchCounts = useCallback(async (uid: string) => {
    const { data } = await createClient().from("ads").select("status").eq("seller_id", uid);
    const c: Counts = { all: 0, active: 0, pending: 0, rejected: 0, sold: 0 };
    data?.forEach(ad => {
      c.all++;
      const k = ad.status as TabKey;
      if (k !== "all" && k in c) c[k]++;
    });
    setCounts(c);
  }, []);

  const fetchAds = useCallback(async (uid: string, tab: TabKey) => {
    setLoading(true);
    const supabase = createClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let q: any = supabase
      .from("ads")
      .select("id, title, price, city, status, rejection_reason, created_at, ad_photos(url, order_index)")
      .eq("seller_id", uid)
      .order("created_at", { ascending: false });
    if (tab !== "all") q = q.eq("status", tab);
    const { data } = await q;
    setAds((data as MyAd[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (user) {
      fetchAds(user.id, activeTab);
      fetchCounts(user.id);
    }
  }, [user, activeTab, fetchAds, fetchCounts]);

  async function handleMarkSold(adId: number) {
    if (!user || !confirm("Mark as sold? The ad will be removed from listings.")) return;
    await createClient().from("ads").update({ status: "sold" }).eq("id", adId).eq("seller_id", user.id);
    fetchAds(user.id, activeTab);
    fetchCounts(user.id);
  }

  async function handleRelist(adId: number) {
    if (!user || !confirm("Relist this ad? It will go back for review.")) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await createClient().from("ads").update({ status: "pending", edited_at: new Date().toISOString() } as any).eq("id", adId).eq("seller_id", user.id);
    fetchAds(user.id, activeTab);
    fetchCounts(user.id);
  }

  async function handleDelete(adId: number) {
    if (!user || !confirm("Delete this ad? This cannot be undone.")) return;
    const supabase = createClient();
    await supabase.from("ad_photos").delete().eq("ad_id", adId);
    await supabase.from("ads").delete().eq("id", adId).eq("seller_id", user.id);
    fetchAds(user.id, activeTab);
    fetchCounts(user.id);
  }

  return (
    <div className="min-h-dvh" style={{ background: "#F8F8F6" }}>
      {/* Header + tabs */}
      <div style={{ background: "white", borderBottom: "1px solid #E8E8E4", position: "sticky", top: 0, zIndex: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px 12px" }}>
          <button onClick={() => router.back()} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, display: "flex" }}>
            <ArrowLeft size={22} />
          </button>
          <h1 style={{ fontSize: 18, fontWeight: 700, margin: 0, color: "#1A1A1A", flex: 1 }}>
            My Ads{counts.all > 0 ? ` (${counts.all})` : ""}
          </h1>
          <button
            onClick={() => router.push("/post")}
            style={{ padding: "8px 16px", background: "#1D9E75", color: "white", border: "none", borderRadius: 8, fontWeight: 600, cursor: "pointer", fontSize: 14 }}
          >
            + Post Ad
          </button>
        </div>

        <div style={{ display: "flex", overflowX: "auto", scrollbarWidth: "none" }}>
          {TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                padding: "10px 14px",
                background: "none", border: "none",
                borderBottom: activeTab === tab.key ? "2px solid #1D9E75" : "2px solid transparent",
                color: activeTab === tab.key ? "#1D9E75" : "#666",
                fontSize: 14, fontWeight: activeTab === tab.key ? 600 : 400,
                cursor: "pointer", whiteSpace: "nowrap",
                display: "flex", alignItems: "center", gap: 6,
              }}
            >
              {tab.label}
              {counts[tab.key] > 0 && (
                <span style={{
                  background: activeTab === tab.key ? "#1D9E75" : "#E8E8E4",
                  color: activeTab === tab.key ? "white" : "#666",
                  fontSize: 11, fontWeight: 600,
                  padding: "1px 6px", borderRadius: 10,
                }}>
                  {counts[tab.key]}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div style={{ position: "fixed", top: 72, left: "50%", transform: "translateX(-50%)", zIndex: 50, background: "#1D9E75", color: "white", padding: "12px 20px", borderRadius: 10, fontSize: 14, fontWeight: 600, boxShadow: "0 4px 16px rgba(0,0,0,0.15)", whiteSpace: "nowrap" }}>
          {toast}
        </div>
      )}

      {/* Content */}
      <div style={{ padding: 16, paddingBottom: 88 }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: 60, color: "#999" }}>Loading...</div>
        ) : ads.length === 0 ? (
          (() => {
            const m = EMPTY[activeTab];
            return (
              <div style={{ textAlign: "center", padding: "60px 24px" }}>
                <div style={{ fontSize: 56, marginBottom: 16 }}>{m.icon}</div>
                <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8, color: "#1A1A1A" }}>{m.title}</h3>
                {m.desc && <p style={{ color: "#999", fontSize: 14, marginBottom: 24 }}>{m.desc}</p>}
                {activeTab === "all" && (
                  <button
                    onClick={() => router.push("/post")}
                    style={{ padding: "12px 28px", background: "#1D9E75", color: "white", border: "none", borderRadius: 10, fontWeight: 600, cursor: "pointer", fontSize: 15 }}
                  >
                    Post an Ad
                  </button>
                )}
              </div>
            );
          })()
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {ads.map(ad => {
              const firstPhoto = [...(ad.ad_photos ?? [])].sort((a, b) => a.order_index - b.order_index)[0];
              const st = statusConfig[ad.status] ?? statusConfig.pending;
              return (
                <div key={ad.id} style={{ background: "white", borderRadius: 12, border: "1px solid #E8E8E4", overflow: "hidden" }}>
                  {/* Card body */}
                  <div style={{ display: "flex", gap: 12, padding: 12 }}>
                    <div style={{ position: "relative", flexShrink: 0 }}>
                      {firstPhoto ? (
                        <img src={firstPhoto.url} alt="" style={{ width: 90, height: 90, objectFit: "cover", borderRadius: 8 }} />
                      ) : (
                        <div style={{ width: 90, height: 90, background: "#F5F5F3", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <ImageOff size={24} color="#CCC" />
                        </div>
                      )}
                      {ad.status === "sold" && (
                        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.45)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <span style={{ background: "#EF4444", color: "white", fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 4, transform: "rotate(-15deg)" }}>SOLD</span>
                        </div>
                      )}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 15, fontWeight: 600, color: "#1A1A1A", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{ad.title}</div>
                      <div style={{ fontSize: 16, fontWeight: 700, color: "#1D9E75", marginTop: 4 }}>Rs {Number(ad.price).toLocaleString("en-PK")}</div>
                      <div style={{ fontSize: 12, color: "#999", marginTop: 4 }}>
                        {[ad.city, timeAgo(ad.created_at)].filter(Boolean).join(" · ")}
                      </div>
                      <span style={{ display: "inline-block", marginTop: 8, background: st.bg, color: st.color, fontSize: 12, fontWeight: 600, padding: "3px 10px", borderRadius: 20 }}>
                        {st.label}
                      </span>
                    </div>
                  </div>

                  {ad.status === "rejected" && ad.rejection_reason && (
                    <div style={{ margin: "0 12px 12px", background: "#FFF0F0", border: "1px solid #FECACA", borderRadius: 8, padding: "10px 12px", fontSize: 13, color: "#B91C1C" }}>
                      <strong>Reason:</strong> {ad.rejection_reason}
                    </div>
                  )}

                  {ad.status === "pending" && (
                    <div style={{ margin: "0 12px 12px", background: "#FFF8E6", border: "1px solid #FDE68A", borderRadius: 8, padding: "10px 12px", fontSize: 13, color: "#92640A" }}>
                      Your ad is under review — usually approved within 24 hours
                    </div>
                  )}

                  {/* Actions */}
                  <div style={{ borderTop: "1px solid #F0F0EE", padding: "10px 12px", display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {["active", "rejected", "pending"].includes(ad.status) && (
                      <button onClick={() => router.push(`/post/edit/${ad.id}`)} style={{ display: "flex", alignItems: "center", gap: 5, padding: "8px 14px", background: "#F5F5F3", border: "1px solid #E0E0E0", borderRadius: 8, fontSize: 13, cursor: "pointer", color: "#333" }}>
                        <Pencil size={13} /> Edit
                      </button>
                    )}
                    {ad.status === "active" && (
                      <button onClick={() => handleMarkSold(ad.id)} style={{ display: "flex", alignItems: "center", gap: 5, padding: "8px 14px", background: "#F0F0FF", border: "1px solid #6366F1", borderRadius: 8, fontSize: 13, cursor: "pointer", color: "#6366F1" }}>
                        <CheckCheck size={13} /> Mark as Sold
                      </button>
                    )}
                    {ad.status === "sold" && (
                      <button onClick={() => handleRelist(ad.id)} style={{ display: "flex", alignItems: "center", gap: 5, padding: "8px 14px", background: "#F0FAF6", border: "1px solid #1D9E75", borderRadius: 8, fontSize: 13, cursor: "pointer", color: "#1D9E75" }}>
                        <RefreshCw size={13} /> Relist
                      </button>
                    )}
                    <button onClick={() => handleDelete(ad.id)} style={{ display: "flex", alignItems: "center", gap: 5, padding: "8px 14px", background: "#FFF0F0", border: "1px solid #EF4444", borderRadius: 8, fontSize: 13, cursor: "pointer", color: "#EF4444", marginLeft: "auto" }}>
                      <Trash2 size={13} /> Delete
                    </button>
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
