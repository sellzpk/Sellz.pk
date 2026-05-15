"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, CheckCheck, RefreshCw, ImageOff, ArrowLeft, BarChart2, X } from "lucide-react";
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

type AnalyticsData = {
  totals: { views: number; clicks: number; favorites: number };
  period_views: { date: string; count: number }[];
  clicks_breakdown: { whatsapp: number; message: number; phone: number };
  conversion_rate: string;
};

export default function MyAdsPage() {
  const router = useRouter();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const [ads, setAds] = useState<MyAd[]>([]);
  const [counts, setCounts] = useState<Counts>({ all: 0, active: 0, pending: 0, rejected: 0, sold: 0 });
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState("");
  const [analyticsAdId, setAnalyticsAdId] = useState<number | null>(null);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [analyticsPeriod, setAnalyticsPeriod] = useState("7");
  const [analyticsLoading, setAnalyticsLoading] = useState(false);

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

  useEffect(() => {
    if (!analyticsAdId) return;
    setAnalyticsLoading(true);
    setAnalyticsData(null);
    fetch(`/api/ads/${analyticsAdId}/analytics?period=${analyticsPeriod}`)
      .then(r => r.json())
      .then(d => { setAnalyticsData(d); setAnalyticsLoading(false); })
      .catch(() => setAnalyticsLoading(false));
  }, [analyticsAdId, analyticsPeriod]);

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
                      <button onClick={() => { setAnalyticsAdId(ad.id); setAnalyticsPeriod("7"); }} style={{ display: "flex", alignItems: "center", gap: 5, padding: "8px 14px", background: "#F0F8FF", border: "1px solid #185FA5", borderRadius: 8, fontSize: 13, cursor: "pointer", color: "#185FA5" }}>
                        <BarChart2 size={13} /> Analytics
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

      {/* Analytics bottom sheet */}
      {analyticsAdId && (
        <>
          <div
            onClick={() => setAnalyticsAdId(null)}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 40 }}
          />
          <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "white", borderRadius: "20px 20px 0 0", zIndex: 50, maxHeight: "90dvh", overflowY: "auto", paddingBottom: "env(safe-area-inset-bottom, 0px)" }}>
            {/* Sheet header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 16px 12px", borderBottom: "1px solid #F0F0EE", position: "sticky", top: 0, background: "white", zIndex: 1 }}>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0, color: "#1A1A1A" }}>Ad Analytics</h3>
              </div>
              <button onClick={() => setAnalyticsAdId(null)} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, display: "flex" }}>
                <X size={20} color="#666" />
              </button>
            </div>

            <div style={{ padding: 16 }}>
              {/* Period selector */}
              <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
                {[{ label: "7 days", value: "7" }, { label: "30 days", value: "30" }, { label: "All time", value: "365" }].map(p => (
                  <button
                    key={p.value}
                    onClick={() => setAnalyticsPeriod(p.value)}
                    style={{ padding: "6px 14px", borderRadius: 20, cursor: "pointer", fontSize: 13, background: analyticsPeriod === p.value ? "#1D9E75" : "white", color: analyticsPeriod === p.value ? "white" : "#666", border: `1px solid ${analyticsPeriod === p.value ? "#1D9E75" : "#E0E0E0"}` }}
                  >{p.label}</button>
                ))}
              </div>

              {analyticsLoading || !analyticsData ? (
                <div style={{ textAlign: "center", padding: "40px", color: "#999" }}>Loading...</div>
              ) : (
                <>
                  {/* Stat cards */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 20 }}>
                    {[
                      { icon: "👁", label: "Views", value: analyticsData.totals.views, color: "#1D9E75" },
                      { icon: "👆", label: "Clicks", value: analyticsData.totals.clicks, color: "#185FA5" },
                      { icon: "❤️", label: "Saves", value: analyticsData.totals.favorites, color: "#EF4444" },
                    ].map(s => (
                      <div key={s.label} style={{ background: "white", border: "1px solid #E8E8E4", borderRadius: 10, padding: "14px 12px", textAlign: "center" }}>
                        <div style={{ fontSize: 22, marginBottom: 6 }}>{s.icon}</div>
                        <div style={{ fontSize: 22, fontWeight: 700, color: s.color }}>{s.value.toLocaleString()}</div>
                        <div style={{ fontSize: 12, color: "#999", marginTop: 2 }}>{s.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Conversion rate */}
                  <div style={{ background: "#F0FAF6", border: "1px solid #1D9E75", borderRadius: 10, padding: "14px 16px", marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontSize: 13, color: "#666" }}>Conversion Rate</div>
                      <div style={{ fontSize: 11, color: "#999" }}>Clicked after viewing</div>
                    </div>
                    <div style={{ fontSize: 26, fontWeight: 700, color: "#1D9E75" }}>{analyticsData.conversion_rate}%</div>
                  </div>

                  {/* Views chart */}
                  <div style={{ marginBottom: 20 }}>
                    <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: "#1A1A1A" }}>Views over time</h4>
                    {analyticsData.period_views.length === 0 ? (
                      <p style={{ color: "#999", fontSize: 13 }}>No views in this period yet</p>
                    ) : (
                      <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height: 80 }}>
                        {analyticsData.period_views.map(d => {
                          const max = Math.max(...analyticsData.period_views.map(x => x.count));
                          const h = max > 0 ? (d.count / max) * 80 : 0;
                          return (
                            <div key={d.date} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                              <div style={{ fontSize: 10, color: "#666" }}>{d.count}</div>
                              <div style={{ width: "100%", background: "#1D9E75", borderRadius: "3px 3px 0 0", height: Math.max(h, 4) }} />
                              <div style={{ fontSize: 9, color: "#999", textAlign: "center" }}>{d.date}</div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Clicks breakdown */}
                  <div>
                    <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: "#1A1A1A" }}>Contact clicks</h4>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {[
                        { key: "message" as const, label: "💬 In-app message", color: "#1D9E75" },
                        { key: "whatsapp" as const, label: "📱 WhatsApp", color: "#25D366" },
                        { key: "phone" as const, label: "📞 Phone number", color: "#185FA5" },
                      ].map(item => {
                        const count = analyticsData.clicks_breakdown[item.key] ?? 0;
                        const total = Object.values(analyticsData.clicks_breakdown).reduce((a, b) => a + b, 0);
                        const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                        return (
                          <div key={item.key} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <span style={{ fontSize: 13, flex: 1 }}>{item.label}</span>
                            <div style={{ width: 80, height: 6, background: "#F0F0EE", borderRadius: 3, overflow: "hidden" }}>
                              <div style={{ width: `${pct}%`, height: "100%", background: item.color, borderRadius: 3 }} />
                            </div>
                            <span style={{ fontSize: 13, fontWeight: 600, width: 24, textAlign: "right", color: "#1A1A1A" }}>{count}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      )}

      <BottomNav />
    </div>
  );
}
