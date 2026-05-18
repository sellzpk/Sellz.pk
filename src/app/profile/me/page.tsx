"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { BottomNav } from "@/components/BottomNav";
import { Footer, FooterMobile } from "@/components/Footer";
import { BadgeVerified } from "@/components/BadgeVerified";
import {
  ShieldCheck, Clock, ShieldOff, Edit2, Check, X,
  MapPin, Calendar, Loader2, ArrowLeft, LogOut,
  Pencil, Trash2, CheckCheck, Heart, ChevronRight,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { UserRow } from "@/lib/types";

type MyAd = {
  id: number;
  title: string;
  price: number;
  city: string | null;
  status: string;
  rejection_reason: string | null;
  created_at: string;
  ownership_proof_url: string | null;
  edit_count: number;
  ad_photos: { url: string; order_index: number }[];
};

function relativeTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "Just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d ago`;
  if (d < 30) return `${Math.floor(d / 7)}w ago`;
  return `${Math.floor(d / 30)}mo ago`;
}

export default function MyProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserRow | null>(null);
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [ads, setAds] = useState<MyAd[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [actioning, setActioning] = useState<string | null>(null);
  const [form, setForm] = useState({ full_name: "", phone: "", whatsapp_number: "" });

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.replace("/auth/login"); return; }
      setEmail(user.email ?? "");
      setUserId(user.id);

      const [{ data: profileData }, { data: adsData }] = await Promise.all([
        supabase.from("users").select("*").eq("id", user.id).single(),
        supabase.from("ads")
          .select("id, title, price, city, status, rejection_reason, created_at, ownership_proof_url, edit_count, ad_photos(url, order_index)")
          .eq("seller_id", user.id)
          .order("created_at", { ascending: false }),
      ]);

      if (profileData) {
        setProfile(profileData as UserRow);
        setForm({
          full_name: profileData.full_name ?? "",
          phone: profileData.phone ?? "",
          whatsapp_number: profileData.whatsapp_number ?? "",
        });
      }
      if (adsData) setAds(adsData as MyAd[]);
      setLoading(false);
    }
    load();
  }, [router]);

  async function handleSave() {
    if (!profile) return;
    setSaving(true);
    setSaveError("");
    const supabase = createClient();
    const { error } = await supabase
      .from("users")
      .update({
        full_name: form.full_name || null,
        phone: form.phone || null,
        whatsapp_number: form.whatsapp_number || null,
      })
      .eq("id", profile.id);
    setSaving(false);
    if (error) { setSaveError("Failed to save. Try again."); return; }
    setProfile(p => p ? { ...p, ...form } : p);
    setEditing(false);
  }

  async function handleMarkSold(adId: number) {
    if (!confirm("Mark this ad as sold? It will be removed from active listings.")) return;
    setActioning(`sold-${adId}`);
    const supabase = createClient();
    await supabase.from("ads").update({ status: "sold" }).eq("id", adId).eq("seller_id", userId);
    setAds(prev => prev.map(a => a.id === adId ? { ...a, status: "sold" } : a));
    setActioning(null);
  }

  async function handleDelete(adId: number) {
    if (!confirm("Delete this ad? This cannot be undone.")) return;
    setActioning(`del-${adId}`);
    const res = await fetch("/api/delete-ad", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ adId }),
    });
    if (!res.ok) { alert("Delete failed — please try again"); setActioning(null); return; }
    setAds(prev => prev.filter(a => a.id !== adId));
    setActioning(null);
  }

  if (loading) {
    return (
      <div className="min-h-dvh flex flex-col" style={{ background: "var(--bg)" }}>
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 size={28} strokeWidth={2} className="animate-spin" style={{ color: "var(--brand-green)" }} />
        </main>
        <BottomNav />
      </div>
    );
  }

  if (!profile) return null;

  const name = form.full_name || profile.full_name || "User";
  const initial = name[0]?.toUpperCase() ?? "U";

  return (
    <div className="min-h-dvh flex flex-col" style={{ background: "var(--bg)" }}>
      <Navbar />

      <main className="flex-1 pb-24 md:pb-8">
        <div className="max-w-2xl mx-auto px-4 py-3">
          <Link href="/" className="flex items-center gap-1.5 text-sm text-[var(--text-secondary)] hover:text-[var(--brand-green)] transition-colors">
            <ArrowLeft size={16} strokeWidth={2} />
            Back
          </Link>
        </div>

        <div className="max-w-2xl mx-auto px-4 space-y-4">
          {/* Profile header card */}
          <div className="card p-5">
            <div className="flex items-start gap-4 mb-5">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-black text-white flex-shrink-0"
                style={{ background: "var(--brand-green)" }}
              >
                {initial}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h1 className="text-lg font-bold text-[var(--text-primary)]">{name}</h1>
                  {profile.cnic_verified && <BadgeVerified type="verified" />}
                </div>
                <p className="text-sm text-[var(--text-muted)] truncate">{email}</p>
                <div className="flex items-center gap-3 text-xs text-[var(--text-muted)] mt-1">
                  {profile.city && (
                    <span className="flex items-center gap-1">
                      <MapPin size={12} strokeWidth={2} />
                      {profile.city}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Calendar size={12} strokeWidth={2} />
                    Joined {new Date(profile.created_at).toLocaleDateString("en-PK", { month: "short", year: "numeric" })}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-[var(--border)]">
              <div className="text-center">
                <p className="text-xl font-black" style={{ color: "var(--brand-green)", letterSpacing: "-0.5px" }}>{ads.filter(a => a.status === "active").length}</p>
                <p className="text-xs text-[var(--text-muted)]">Live Ads</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-black" style={{ color: "#F59E0B", letterSpacing: "-0.5px" }}>{ads.filter(a => a.status === "pending").length}</p>
                <p className="text-xs text-[var(--text-muted)]">Pending</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-black" style={{ color: "var(--brand-green)", letterSpacing: "-0.5px" }}>
                  {profile.cnic_verified ? "✓" : "—"}
                </p>
                <p className="text-xs text-[var(--text-muted)]">Verified</p>
              </div>
            </div>
          </div>

          {/* Verification status */}
          <div className="card p-4">
            <div className="flex items-center gap-3">
              {profile.cnic_verified ? (
                <>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "var(--brand-green-light)" }}>
                    <ShieldCheck size={20} strokeWidth={2} style={{ color: "var(--brand-green)" }} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-[var(--text-primary)]">Identity Verified</p>
                    <p className="text-xs text-[var(--text-muted)]">You can post ads — CNIC verified by Sellz.pk</p>
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full flex-shrink-0" style={{ background: "var(--brand-green-light)", color: "var(--brand-green)" }}>VERIFIED</span>
                </>
              ) : profile.cnic_front_url ? (
                <>
                  <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0">
                    <Clock size={20} strokeWidth={2} className="text-amber-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-[var(--text-primary)]">Verification Pending</p>
                    <p className="text-xs text-[var(--text-muted)]">CNIC submitted — usually verified within 24h</p>
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-amber-50 text-amber-600 flex-shrink-0">PENDING</span>
                </>
              ) : (
                <>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "var(--bg)" }}>
                    <ShieldOff size={20} strokeWidth={2} className="text-[var(--text-muted)]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-[var(--text-primary)]">Not Verified</p>
                    <p className="text-xs text-[var(--text-muted)]">Submit CNIC to post ads</p>
                  </div>
                  <Link href="/onboarding" className="text-xs font-semibold px-3 py-1.5 rounded-lg flex-shrink-0" style={{ background: "var(--brand-green-light)", color: "var(--brand-green)" }}>
                    Verify Now
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Editable details */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-[var(--text-primary)]">Personal Details</h2>
              {!editing ? (
                <button
                  onClick={() => setEditing(true)}
                  className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-[var(--bg)] transition-colors"
                  style={{ color: "var(--brand-green)" }}
                >
                  <Edit2 size={13} strokeWidth={2} /> Edit
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => { setEditing(false); setSaveError(""); setForm({ full_name: profile.full_name ?? "", phone: profile.phone ?? "", whatsapp_number: profile.whatsapp_number ?? "" }); }}
                    className="flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-lg border border-[var(--border)] text-[var(--text-secondary)]"
                  >
                    <X size={12} strokeWidth={2.5} /> Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg disabled:opacity-50"
                    style={{ background: "var(--brand-green)", color: "white" }}
                  >
                    {saving ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} strokeWidth={2.5} />}
                    Save
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <Field label="Full Name">
                {editing ? (
                  <input
                    value={form.full_name}
                    onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))}
                    placeholder="Your full name"
                    className="input-base text-sm"
                    autoComplete="name"
                  />
                ) : (
                  <p className="text-sm text-[var(--text-primary)]">{profile.full_name || "—"}</p>
                )}
              </Field>

              <Field label="Email">
                <p className="text-sm text-[var(--text-muted)]">{email} <span className="text-xs">(cannot change)</span></p>
              </Field>

              <Field label="Phone Number">
                {editing ? (
                  <input
                    value={form.phone}
                    onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    placeholder="03XXXXXXXXX"
                    className="input-base text-sm"
                    type="tel"
                    autoComplete="tel"
                  />
                ) : (
                  <p className="text-sm text-[var(--text-primary)]">{profile.phone || "—"}</p>
                )}
              </Field>

              <Field label="WhatsApp Number">
                {editing ? (
                  <input
                    value={form.whatsapp_number}
                    onChange={e => setForm(f => ({ ...f, whatsapp_number: e.target.value }))}
                    placeholder="03XXXXXXXXX"
                    className="input-base text-sm"
                    type="tel"
                  />
                ) : (
                  <p className="text-sm text-[var(--text-primary)]">{profile.whatsapp_number || "—"}</p>
                )}
              </Field>

              <Field label="City">
                <div className="flex items-center gap-2">
                  <p className="text-sm text-[var(--text-primary)]">{profile.city || "—"}</p>
                  <Link href="/support/location-change" className="text-xs" style={{ color: "var(--brand-green)" }}>
                    Change via support
                  </Link>
                </div>
              </Field>
            </div>

            {saveError && <p className="text-xs font-medium mt-3" style={{ color: "var(--danger)" }}>{saveError}</p>}
          </div>

          {/* My ads */}
          <section>
            <h2 className="text-base font-semibold text-[var(--text-primary)] mb-3">My Ads</h2>
            {ads.length === 0 && !loading ? (
              <div className="card p-8 text-center">
                <p className="text-sm font-semibold text-[var(--text-primary)] mb-1">No ads yet</p>
                {profile.cnic_verified ? (
                  <Link href="/post" className="text-sm" style={{ color: "var(--brand-green)" }}>Post your first ad →</Link>
                ) : (
                  <p className="text-xs text-[var(--text-muted)]">Verify your CNIC to start posting</p>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {ads.map(ad => {
                  const cover = [...(ad.ad_photos ?? [])].sort((a, b) => a.order_index - b.order_index)[0]?.url;
                  const statusMap: Record<string, { bg: string; color: string; text: string }> = {
                    active:   { bg: "var(--brand-green-light)", color: "var(--brand-green)", text: "✓ Live" },
                    pending:  { bg: "#FFF8E6", color: "#D97706", text: "⏳ Pending Review" },
                    rejected: { bg: "#FFF0F0", color: "#DC2626", text: "✕ Rejected" },
                    sold:     { bg: "var(--bg)", color: "var(--text-muted)", text: "Sold" },
                  };
                  const s = statusMap[ad.status] ?? statusMap.pending;
                  return (
                    <div key={ad.id} className="card p-3 flex gap-3">
                      <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-[var(--bg)]">
                        {cover ? (
                          <img src={cover} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs text-[var(--text-muted)]">No photo</div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <p className="text-sm font-semibold text-[var(--text-primary)] leading-snug line-clamp-2">{ad.title}</p>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0" style={{ background: s.bg, color: s.color }}>{s.text}</span>
                        </div>
                        <p className="text-sm font-bold mb-1" style={{ color: "var(--brand-green)" }}>Rs {ad.price.toLocaleString("en-PK")}</p>
                        <p className="text-[11px] text-[var(--text-muted)]">{relativeTime(ad.created_at)}{ad.city ? ` · ${ad.city}` : ""}</p>
                        {ad.status === "pending" && (
                          <div className="mt-2 px-2.5 py-1.5 rounded-lg text-xs" style={{ background: "#FFF8E6", color: "#92640A" }}>
                            Under review — usually approved within 24 hours
                          </div>
                        )}
                        {ad.status === "rejected" && (
                          <div className="mt-2 px-2.5 py-1.5 rounded-lg text-xs" style={{ background: "#FFF0F0", color: "#B91C1C" }}>
                            {ad.rejection_reason ? `Rejected: ${ad.rejection_reason}` : "Ad was rejected."}
                          </div>
                        )}
                        {/* Action buttons */}
                        <div className="flex gap-2 flex-wrap mt-2.5">
                          {["active", "pending", "rejected"].includes(ad.status) && (
                            <button
                              onClick={() => router.push(`/post/edit/${ad.id}`)}
                              className="flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors"
                              style={{ borderColor: "var(--border)", color: "var(--text-secondary)", background: "var(--bg)" }}
                            >
                              <Pencil size={12} strokeWidth={2} /> Edit
                            </button>
                          )}
                          {ad.status === "active" && (
                            <button
                              onClick={() => handleMarkSold(ad.id)}
                              disabled={actioning === `sold-${ad.id}`}
                              className="flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors disabled:opacity-50"
                              style={{ borderColor: "#818CF8", color: "#6366F1", background: "#F0F0FF" }}
                            >
                              <CheckCheck size={12} strokeWidth={2} /> Mark as Sold
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(ad.id)}
                            disabled={actioning === `del-${ad.id}`}
                            className="flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors disabled:opacity-50"
                            style={{ borderColor: "#FECACA", color: "#DC2626", background: "#FFF0F0" }}
                          >
                            <Trash2 size={12} strokeWidth={2} /> Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* Saved Ads */}
          <Link
            href="/favorites"
            className="flex items-center justify-between p-4 rounded-xl border"
            style={{ background: "white", borderColor: "var(--border)", textDecoration: "none", color: "var(--text-primary)" }}
          >
            <div className="flex items-center gap-3">
              <Heart size={20} color="#EF4444" />
              <span style={{ fontSize: 15 }}>Saved Ads</span>
            </div>
            <ChevronRight size={18} color="#999" />
          </Link>

          {/* Sign out */}
          <div className="pt-2 pb-4">
            <button
              onClick={async () => {
                const supabase = createClient();
                await supabase.auth.signOut();
                window.location.href = "/";
              }}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border text-sm font-semibold transition-colors hover:bg-red-50"
              style={{ borderColor: "#FECACA", color: "#DC2626" }}
            >
              <LogOut size={16} strokeWidth={2} /> Sign Out
            </button>
          </div>
        </div>
      </main>

      <BottomNav />
      <Footer />
      <FooterMobile />
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-semibold mb-1.5" style={{ color: "var(--text-muted)" }}>{label}</p>
      {children}
    </div>
  );
}
