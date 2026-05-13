"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { BottomNav } from "@/components/BottomNav";
import { AdCard } from "@/components/AdCard";
import type { Ad } from "@/components/AdCard";
import { Footer, FooterMobile } from "@/components/Footer";
import { BadgeVerified } from "@/components/BadgeVerified";
import {
  ShieldCheck, Clock, ShieldOff, Edit2, Check, X,
  MapPin, Calendar, Loader2, ArrowLeft,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { mapAdRow, AD_SELECT } from "@/lib/supabase/helpers";
import type { UserRow } from "@/lib/types";

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
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [form, setForm] = useState({ full_name: "", phone: "", whatsapp_number: "" });

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.replace("/auth/login"); return; }
      setEmail(user.email ?? "");

      const [{ data: profileData }, { data: adsData }] = await Promise.all([
        supabase.from("users").select("*").eq("id", user.id).single(),
        supabase.from("ads").select(AD_SELECT).eq("seller_id", user.id).eq("status", "active").order("created_at", { ascending: false }),
      ]);

      if (profileData) {
        setProfile(profileData as UserRow);
        setForm({
          full_name: profileData.full_name ?? "",
          phone: profileData.phone ?? "",
          whatsapp_number: profileData.whatsapp_number ?? "",
        });
      }
      if (adsData) setAds(adsData.map(mapAdRow));
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

            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-[var(--border)]">
              <div className="text-center">
                <p className="text-xl font-black" style={{ color: "var(--brand-green)", letterSpacing: "-0.5px" }}>{ads.length}</p>
                <p className="text-xs text-[var(--text-muted)]">Active Ads</p>
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
          {ads.length > 0 && (
            <section>
              <h2 className="text-base font-semibold text-[var(--text-primary)] mb-3">My Active Ads</h2>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                {ads.map(ad => (
                  <AdCard key={ad.id} ad={ad} />
                ))}
              </div>
            </section>
          )}

          {ads.length === 0 && !loading && (
            <div className="card p-8 text-center">
              <p className="text-sm font-semibold text-[var(--text-primary)] mb-1">No active ads yet</p>
              {profile.cnic_verified ? (
                <Link href="/post" className="text-sm" style={{ color: "var(--brand-green)" }}>Post your first ad →</Link>
              ) : (
                <p className="text-xs text-[var(--text-muted)]">Verify your CNIC to start posting</p>
              )}
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

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-semibold mb-1.5" style={{ color: "var(--text-muted)" }}>{label}</p>
      {children}
    </div>
  );
}
