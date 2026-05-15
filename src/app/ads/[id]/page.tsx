"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { BottomNav } from "@/components/BottomNav";
import { BadgeVerified } from "@/components/BadgeVerified";
import { AdCard } from "@/components/AdCard";
import { ChatPanel } from "@/components/ChatPanel";
import { FavoriteButton } from "@/components/FavoriteButton";
import { Footer, FooterMobile } from "@/components/Footer";
import { createClient } from "@/lib/supabase/client";
import type { AdWithPhotos } from "@/lib/types";
import { getSubcategoryFields } from "@/lib/categories";
import {
  ChevronLeft, ChevronRight, MapPin, Clock,
  Share2, Flag, ArrowLeft, MessageCircle, ImageOff,
  Lock, Phone, Loader2, ShieldCheck, Star, X,
} from "lucide-react";
import type { Ad } from "@/components/AdCard";

const WaIcon = ({ size = 16, color = "currentColor" }: { size?: number; color?: string }) => (
  <svg viewBox="0 0 24 24" fill={color} width={size} height={size}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.49" />
  </svg>
);

function formatWaDisplay(num: string) {
  const digits = num.replace(/^0/, "");
  return `+92 ${digits.slice(0, 3)} ${digits.slice(3)}`;
}

function formatPrice(p: number) {
  if (p >= 100000) return "Rs " + (p / 100000).toFixed(p % 100000 === 0 ? 0 : 1) + " lac";
  if (p >= 1000) return "Rs " + (p / 1000).toFixed(0) + "k";
  return "Rs " + p.toLocaleString();
}

function relativeTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "Just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default function AdDetailPage() {
  const { id } = useParams();
  const [ad, setAd] = useState<AdWithPhotos | null>(null);
  const [similar, setSimilar] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentImg, setCurrentImg] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const [reported, setReported] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatStarted, setChatStarted] = useState(false);
  const [numberRevealed, setNumberRevealed] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    if (!id) return;
    loadAd(Number(id));
  }, [id]);

  async function trackView(adId: number, sellerId: string) {
    const sessionKey = `viewed_${adId}`;
    if (sessionStorage.getItem(sessionKey)) return;
    sessionStorage.setItem(sessionKey, "1");
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user?.id === sellerId) return;
    await fetch("/api/ads/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ adId, type: "view", viewerId: user?.id ?? null }),
    });
  }

  async function trackClick(adId: number, sellerId: string, type: "whatsapp" | "message" | "phone") {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user?.id === sellerId) return;
    fetch("/api/ads/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ adId, type: `click_${type}`, clickerId: user?.id ?? null }),
    });
  }

  async function loadAd(adId: number) {
    setLoading(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const { data } = await supabase
      .from("ads")
      .select("*, ad_photos(*), users(id, full_name, city, cnic_verified, whatsapp_number)")
      .eq("id", adId)
      .single();

    if (data) {
      setAd(data as AdWithPhotos);
      // Track view (fire-and-forget)
      trackView(adId, (data as AdWithPhotos).seller_id);
      // Check if user favorited this ad
      if (user) {
        const { data: fav } = await supabase
          .from("favorites")
          .select("id")
          .eq("user_id", user.id)
          .eq("ad_id", adId)
          .maybeSingle();
        setIsFavorited(!!fav);
      }
      const { data: simData } = await supabase
        .from("ads")
        .select("id, title, price, city, area, category, created_at, ad_photos(url)")
        .eq("status", "active")
        .eq("category", (data as AdWithPhotos).category)
        .neq("id", adId)
        .limit(4);

      if (simData) {
        setSimilar(simData.map(a => ({
          id: String(a.id),
          title: a.title,
          price: a.price,
          images: (a.ad_photos as { url: string }[]).map(p => p.url),
          area: a.area ?? "",
          city: a.city ?? "",
          postedAt: relativeTime(a.created_at),
          verified: false,
          owned: false,
          category: a.category,
        })));
      }
    }
    setLoading(false);
  }

  if (loading) {
    return (
      <div className="min-h-dvh flex flex-col" style={{ background: "var(--bg)" }}>
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 size={28} className="animate-spin" style={{ color: "var(--brand-green)" }} />
        </main>
        <BottomNav />
      </div>
    );
  }

  if (!ad) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center" style={{ background: "var(--bg)" }}>
        <p className="text-base font-semibold mb-2" style={{ color: "var(--text-primary)" }}>Ad not found</p>
        <Link href="/" className="text-sm" style={{ color: "var(--brand-green)" }}>Go home</Link>
      </div>
    );
  }

  const seller = ad.users;
  const sellerName = seller?.full_name ?? "Seller";
  const sellerCity = seller?.city ?? ad.city ?? "";
  const sellerVerified = seller?.cnic_verified ?? false;
  const waNumber = seller?.whatsapp_number ?? undefined;
  const hasWhatsapp = Boolean(waNumber);
  const images = [...ad.ad_photos].sort((a, b) => a.order_index - b.order_index).map(p => p.url);

  function prev() { setCurrentImg(i => Math.max(0, i - 1)); }
  function next() { setCurrentImg(i => Math.min(images.length - 1, i + 1)); }

  function handleTouchStart(e: React.TouchEvent) { setTouchStart(e.targetTouches[0].clientX); }
  function handleTouchEnd(e: React.TouchEvent) {
    const diff = touchStart - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) { if (diff > 0) next(); else prev(); }
  }

  function handleViewNumber() {
    if (!chatStarted) { setChatOpen(true); return; }
    setNumberRevealed(true);
  }

  return (
    <div className="min-h-dvh flex flex-col" style={{ background: "var(--bg)" }}>
      <Navbar />

      <main className="flex-1 pb-28 md:pb-12">
        {/* Breadcrumb */}
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-3 flex items-center gap-2 text-sm" style={{ color: "var(--text-muted)" }}>
          <Link href="/" className="hover:text-[var(--brand-green)] transition-colors flex items-center gap-1">
            <ArrowLeft size={14} strokeWidth={2} /> Home
          </Link>
          <ChevronRight size={13} strokeWidth={2} />
          <Link href={`/search?category=${ad.category}`} className="capitalize hover:text-[var(--brand-green)] transition-colors">
            {ad.category}
          </Link>
          <ChevronRight size={13} strokeWidth={2} />
          <span className="truncate max-w-xs" style={{ color: "var(--text-primary)", fontWeight: 500 }}>{ad.title}</span>
        </div>

        {/* Main grid */}
        <div className="max-w-6xl mx-auto px-0 md:px-8" style={{ display: "grid", gridTemplateColumns: "1fr", gap: 24 }}>
          <div className="md:grid" style={{ gridTemplateColumns: "1fr 360px", gap: 24, display: "inherit" }}>

            {/* LEFT: photos + info */}
            <div>
              {/* Gallery */}
              <div>
                {/* Main photo */}
                <div
                  className="relative overflow-hidden md:rounded-xl"
                  style={{ background: "#111", cursor: images.length ? "zoom-in" : "default" }}
                  onTouchStart={handleTouchStart}
                  onTouchEnd={handleTouchEnd}
                  onClick={() => images.length && setLightbox(true)}
                >
                  {images[0] ? (
                    <img
                      src={images[currentImg]}
                      alt={ad.title}
                      style={{ width: "100%", height: "clamp(240px, 45vw, 500px)", objectFit: "contain", display: "block" }}
                    />
                  ) : (
                    <div style={{ width: "100%", height: 300, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <ImageOff size={40} strokeWidth={1.5} style={{ color: "#555" }} />
                    </div>
                  )}

                  {/* Arrows */}
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={e => { e.stopPropagation(); prev(); }}
                        disabled={currentImg === 0}
                        style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", background: "rgba(0,0,0,0.55)", border: "none", borderRadius: "50%", width: 44, height: 44, color: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", opacity: currentImg === 0 ? 0.3 : 1, transition: "opacity 0.15s" }}
                      >
                        <ChevronLeft size={22} strokeWidth={2.5} />
                      </button>
                      <button
                        onClick={e => { e.stopPropagation(); next(); }}
                        disabled={currentImg === images.length - 1}
                        style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "rgba(0,0,0,0.55)", border: "none", borderRadius: "50%", width: 44, height: 44, color: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", opacity: currentImg === images.length - 1 ? 0.3 : 1, transition: "opacity 0.15s" }}
                      >
                        <ChevronRight size={22} strokeWidth={2.5} />
                      </button>
                    </>
                  )}

                  {/* Counter + share */}
                  <div style={{ position: "absolute", bottom: 12, right: 12, display: "flex", gap: 8, alignItems: "center" }}>
                    {images.length > 1 && (
                      <span style={{ background: "rgba(0,0,0,0.6)", color: "white", fontSize: 12, padding: "4px 10px", borderRadius: 20 }}>
                        {currentImg + 1} / {images.length}
                      </span>
                    )}
                    <button
                      onClick={e => { e.stopPropagation(); }}
                      style={{ background: "rgba(0,0,0,0.55)", border: "none", borderRadius: "50%", width: 36, height: 36, color: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                    >
                      <Share2 size={15} strokeWidth={2} />
                    </button>
                  </div>
                  {/* Favorite — top right of image */}
                  <div style={{ position: "absolute", top: 12, right: 12 }} onClick={e => e.stopPropagation()}>
                    <FavoriteButton adId={ad.id} initialFavorited={isFavorited} size="small" />
                  </div>
                </div>

                {/* Thumbnail strip */}
                {images.length > 1 && (
                  <div style={{ display: "flex", gap: 8, overflowX: "auto", padding: "10px 16px 4px", scrollbarWidth: "none" }}>
                    {images.map((url, i) => (
                      <img
                        key={i}
                        src={url}
                        onClick={() => setCurrentImg(i)}
                        style={{ width: 72, height: 54, objectFit: "cover", borderRadius: 7, cursor: "pointer", flexShrink: 0, border: `2px solid ${i === currentImg ? "var(--brand-green)" : "transparent"}`, opacity: i === currentImg ? 1 : 0.65, transition: "all 0.15s" }}
                        alt=""
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Ad info */}
              <div className="px-4 md:px-0 mt-5">
                {/* Badges */}
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
                  {sellerVerified && (
                    <span style={{ background: "var(--brand-green-light)", color: "var(--brand-green)", fontSize: 12, fontWeight: 600, padding: "4px 10px", borderRadius: 20, display: "flex", alignItems: "center", gap: 4 }}>
                      <ShieldCheck size={13} strokeWidth={2} /> Verified Seller
                    </span>
                  )}
                  {ad.ownership_proof_url && (
                    <span style={{ background: "#EFF6FF", color: "#185FA5", fontSize: 12, fontWeight: 600, padding: "4px 10px", borderRadius: 20, display: "flex", alignItems: "center", gap: 4 }}>
                      <Star size={13} strokeWidth={2} /> Ownership Proof
                    </span>
                  )}
                  {ad.condition && (
                    <span style={{ background: "var(--bg)", color: "var(--text-secondary)", fontSize: 12, fontWeight: 500, padding: "4px 10px", borderRadius: 20, border: "1px solid var(--border)" }}>
                      {ad.condition}
                    </span>
                  )}
                </div>

                {/* Sold banner */}
                {ad.status === "sold" && (
                  <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 10, padding: "10px 14px", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 16 }}>🎉</span>
                    <p style={{ fontSize: 13, fontWeight: 600, color: "#DC2626", margin: 0 }}>This item has been sold</p>
                  </div>
                )}

                {/* Price */}
                <div style={{ fontSize: 30, fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-1px", marginBottom: 6 }}>
                  {formatPrice(ad.price)}
                </div>

                {/* Title */}
                <h1 style={{ fontSize: 20, fontWeight: 600, color: "var(--text-primary)", margin: "0 0 12px", lineHeight: 1.35 }}>
                  {ad.title}
                </h1>

                {/* Meta */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 16, color: "var(--text-muted)", fontSize: 13, marginBottom: 20 }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <MapPin size={13} strokeWidth={2} style={{ color: "var(--brand-green)" }} />
                    {ad.area ? `${ad.area}, ` : ""}{ad.city}
                  </span>
                  <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <Clock size={13} strokeWidth={2} />
                    {relativeTime(ad.created_at)}
                  </span>
                </div>

                <div style={{ borderTop: "1px solid var(--border)", marginBottom: 20 }} />

                {/* Description */}
                {ad.description && (
                  <div style={{ marginBottom: 20 }}>
                    <p className="text-sm font-semibold mb-2" style={{ color: "var(--text-primary)" }}>Description</p>
                    <p style={{ fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.8, whiteSpace: "pre-wrap", margin: 0 }}>
                      {ad.description}
                    </p>
                  </div>
                )}

                {/* Details table */}
                {(() => {
                  if (!ad.details) return null;
                  const fields = getSubcategoryFields(ad.category, ad.subcategory ?? "");
                  const entries = fields
                    .map(f => ({ label: f.label, value: (ad.details as Record<string, unknown>)[f.key], unit: f.unit }))
                    .filter(e => e.value !== undefined && e.value !== null && e.value !== "");
                  if (entries.length === 0) return null;
                  return (
                    <div style={{ marginBottom: 20 }}>
                      <p className="text-sm font-semibold mb-3" style={{ color: "var(--text-primary)" }}>Details</p>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, background: "var(--border)", border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden" }}>
                        {entries.map(({ label, value, unit }) => (
                          <div key={label} style={{ background: "var(--surface)", padding: "10px 12px" }}>
                            <p style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 2 }}>{label}</p>
                            <p style={{ fontSize: 13, color: "var(--text-primary)", fontWeight: 500 }}>
                              {typeof value === "boolean" ? (value ? "Yes" : "No") : `${value}${unit ? " " + unit : ""}`}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}

                <div style={{ borderTop: "1px solid var(--border)", marginBottom: 16 }} />

                {/* Report */}
                <button
                  onClick={() => setReported(!reported)}
                  style={{ background: "none", border: "none", color: reported ? "var(--danger)" : "var(--text-muted)", fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}
                >
                  <Flag size={13} strokeWidth={2} />
                  {reported ? "Reported" : "Report this ad"}
                </button>
              </div>
            </div>

            {/* RIGHT: sticky sidebar */}
            <div className="hidden md:block px-0">
              <div style={{ position: "sticky", top: 80 }}>
                {ad.status === "sold" ? (
                  <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 10, padding: "14px 16px", marginBottom: 20, textAlign: "center" }}>
                    <p style={{ fontSize: 15, fontWeight: 700, color: "#DC2626", margin: "0 0 4px" }}>Item Sold</p>
                    <p style={{ fontSize: 13, color: "#991B1B", margin: 0 }}>This item is no longer available</p>
                  </div>
                ) : (
                  <>
                    {/* Send Message */}
                    <button
                      onClick={() => setChatOpen(true)}
                      className="btn-primary w-full justify-center"
                      style={{ padding: "14px 16px", borderRadius: 10, fontSize: 15, marginBottom: 10 }}
                    >
                      <MessageCircle size={18} strokeWidth={2} />
                      Send Message
                    </button>

                    {/* WhatsApp / View Number */}
                    {hasWhatsapp && waNumber ? (
                      numberRevealed ? (
                        <a
                          href={`https://wa.me/92${waNumber.replace(/^0/, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 w-full rounded-xl border font-medium text-sm transition-colors"
                          style={{ padding: "13px 16px", borderColor: "var(--brand-green)", color: "var(--brand-green)", background: "var(--brand-green-light)", marginBottom: 20, textDecoration: "none" }}
                        >
                          <WaIcon size={16} color="var(--brand-green)" />
                          {formatWaDisplay(waNumber)} · Open WhatsApp →
                        </a>
                      ) : (
                        <button
                          onClick={handleViewNumber}
                          className="flex items-center justify-center gap-2 w-full rounded-xl border font-medium text-sm"
                          style={{
                            padding: "13px 16px", marginBottom: 20,
                            ...(chatStarted
                              ? { borderColor: "var(--brand-green)", color: "var(--brand-green)", cursor: "pointer" }
                              : { borderColor: "var(--border)", color: "var(--text-muted)", cursor: "not-allowed" }),
                          }}
                        >
                          {chatStarted ? <Phone size={16} strokeWidth={2} /> : <Lock size={16} strokeWidth={2} />}
                          View Number{!chatStarted && <span style={{ fontSize: 11, opacity: 0.6 }}>— chat first</span>}
                        </button>
                      )
                    ) : (
                      <div style={{ marginBottom: 20 }} />
                    )}
                  </>
                )}

                {/* Seller card */}
                <div className="card p-4 mb-4">
                  <p style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.08em", marginBottom: 12 }}>SELLER</p>
                  <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
                    <div style={{ width: 44, height: 44, borderRadius: "50%", background: "var(--brand-green)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 700, flexShrink: 0 }}>
                      {sellerName[0].toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                        <span className="text-sm font-semibold truncate" style={{ color: "var(--text-primary)" }}>{sellerName}</span>
                        {sellerVerified && <BadgeVerified type="verified" />}
                        {hasWhatsapp && (
                          <span style={{ width: 18, height: 18, borderRadius: "50%", background: "rgba(37,211,102,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <WaIcon size={11} color="#25D366" />
                          </span>
                        )}
                      </div>
                      <p style={{ fontSize: 12, color: "var(--text-muted)" }}>{sellerCity}</p>
                    </div>
                  </div>
                  <Link
                    href={`/profile/${seller?.id ?? ""}`}
                    className="block text-center text-xs font-medium py-2 rounded-lg border hover:bg-[var(--bg)] transition-colors"
                    style={{ color: "var(--brand-green)", borderColor: "var(--border)" }}
                  >
                    View all listings →
                  </Link>
                </div>

                {/* Safety tips */}
                <div className="card p-4">
                  <p style={{ fontSize: 12, fontWeight: 700, color: "var(--text-primary)", marginBottom: 10 }}>Safety Tips</p>
                  {["Meet in a public place", "Never send money in advance", "Inspect item before paying", "Only deal with Verified sellers", "Report suspicious listings"].map(tip => (
                    <div key={tip} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 8, fontSize: 12, color: "var(--text-secondary)" }}>
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--brand-green)", flexShrink: 0, marginTop: 5 }} />
                      {tip}
                    </div>
                  ))}
                </div>

                <p style={{ fontSize: 11, color: "var(--text-muted)", textAlign: "center" }}>Ad ID: {ad.id}</p>
              </div>
            </div>
          </div>

          {/* Similar ads */}
          {similar.length > 0 && (
            <div className="px-4 md:px-0 mt-4">
              <h2 className="text-base font-semibold mb-4" style={{ color: "var(--text-primary)" }}>Similar Listings</h2>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                {similar.map(a => <AdCard key={a.id} ad={a} />)}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Mobile sticky bottom bar */}
      <div className="md:hidden fixed left-0 right-0 bg-white border-t border-[var(--border)] px-4 py-3 z-20 flex gap-2" style={{ bottom: "calc(56px + env(safe-area-inset-bottom, 0px))", paddingBottom: "12px" }}>
        {ad.status === "sold" ? (
          <div className="flex-1 flex items-center justify-center gap-2 rounded-xl py-3" style={{ background: "#FEF2F2", border: "1px solid #FECACA" }}>
            <span style={{ fontSize: 16 }}>🎉</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: "#B91C1C" }}>Item Sold</span>
          </div>
        ) : (
          <>
            <button
              onClick={() => { setChatOpen(true); trackClick(ad.id, ad.seller_id, "message"); }}
              className="btn-primary justify-center flex-1"
              style={{ padding: "13px 16px", borderRadius: 10, fontSize: 15 }}
            >
              <MessageCircle size={18} strokeWidth={2} /> Send Message
            </button>

            {hasWhatsapp && waNumber ? (
              numberRevealed ? (
                <a
                  href={`https://wa.me/92${waNumber.replace(/^0/, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackClick(ad.id, ad.seller_id, "whatsapp")}
                  className="flex items-center justify-center gap-1.5 rounded-xl border font-medium text-sm"
                  style={{ flex: "0 0 38%", borderColor: "var(--brand-green)", color: "var(--brand-green)", background: "var(--brand-green-light)", textDecoration: "none" }}
                >
                  <WaIcon size={16} color="var(--brand-green)" /> WhatsApp
                </a>
              ) : (
                <button
                  onClick={() => { handleViewNumber(); if (chatStarted) trackClick(ad.id, ad.seller_id, "phone"); }}
                  className="flex items-center justify-center gap-1.5 rounded-xl border font-medium text-sm"
                  style={chatStarted
                    ? { flex: "0 0 38%", borderColor: "var(--brand-green)", color: "var(--brand-green)", cursor: "pointer" }
                    : { flex: "0 0 38%", borderColor: "var(--border)", color: "var(--text-muted)", cursor: "default" }
                  }
                >
                  {chatStarted ? <Phone size={15} strokeWidth={2} /> : <Lock size={15} strokeWidth={2} />}
                  View No.
                </button>
              )
            ) : (
              <div style={{ flex: "0 0 38%" }} />
            )}
          </>
        )}
      </div>

      {/* Mobile seller info (below photo on mobile) */}
      <div className="md:hidden px-4 mt-4" style={{ paddingBottom: 8 }}>
        <div className="card p-4">
          <p style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.08em", marginBottom: 10 }}>SELLER</p>
          <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 10 }}>
            <div style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--brand-green)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700, flexShrink: 0 }}>
              {sellerName[0].toUpperCase()}
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{sellerName}</span>
                {sellerVerified && <BadgeVerified type="verified" />}
              </div>
              <p style={{ fontSize: 12, color: "var(--text-muted)" }}>{sellerCity}</p>
            </div>
          </div>
          <Link href={`/profile/${seller?.id ?? ""}`} className="text-xs font-medium" style={{ color: "var(--brand-green)" }}>
            View all listings →
          </Link>
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          onClick={() => setLightbox(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.95)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          <img
            src={images[currentImg]}
            onClick={e => e.stopPropagation()}
            style={{ maxWidth: "95vw", maxHeight: "95vh", objectFit: "contain", borderRadius: 8 }}
            alt={ad.title}
          />
          <button
            onClick={() => setLightbox(false)}
            style={{ position: "absolute", top: 16, right: 16, background: "rgba(255,255,255,0.15)", border: "none", borderRadius: "50%", width: 40, height: 40, color: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            <X size={20} strokeWidth={2.5} />
          </button>
          {images.length > 1 && (
            <>
              <button onClick={e => { e.stopPropagation(); prev(); }} style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,0.15)", border: "none", borderRadius: "50%", width: 44, height: 44, color: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <ChevronLeft size={22} strokeWidth={2.5} />
              </button>
              <button onClick={e => { e.stopPropagation(); next(); }} style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,0.15)", border: "none", borderRadius: "50%", width: 44, height: 44, color: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <ChevronRight size={22} strokeWidth={2.5} />
              </button>
              <span style={{ position: "absolute", bottom: 20, left: "50%", transform: "translateX(-50%)", background: "rgba(0,0,0,0.5)", color: "white", fontSize: 13, padding: "5px 14px", borderRadius: 20 }}>
                {currentImg + 1} / {images.length}
              </span>
            </>
          )}
        </div>
      )}

      <ChatPanel
        isOpen={chatOpen}
        onClose={() => setChatOpen(false)}
        sellerName={sellerName}
        sellerCity={sellerCity}
        sellerHasWhatsapp={hasWhatsapp}
        waNumber={waNumber}
        numberRevealed={numberRevealed}
        onChatStarted={() => setChatStarted(true)}
        onNumberRevealed={() => setNumberRevealed(true)}
        adId={ad.id}
        sellerId={ad.seller_id}
      />

      <BottomNav />
      <Footer />
      <FooterMobile />
    </div>
  );
}
