"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { BottomNav } from "@/components/BottomNav";
import { BadgeVerified } from "@/components/BadgeVerified";
import { AdCard } from "@/components/AdCard";
import type { Ad } from "@/components/AdCard";
import { Footer, FooterMobile } from "@/components/Footer";
import { MapPin, Calendar, ArrowLeft, Loader2, ShieldCheck, ShieldOff, Clock } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import type { UserRow, ReviewRow } from "@/lib/types";

type ReviewWithReviewer = ReviewRow & {
  reviewer: { full_name: string | null } | null;
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

function memberSince(iso: string) {
  return new Date(iso).toLocaleDateString("en-PK", { month: "short", year: "numeric" });
}

export default function ProfilePage() {
  const { id } = useParams();
  const [profile, setProfile] = useState<UserRow | null>(null);
  const [ads, setAds] = useState<Ad[]>([]);
  const [reviews, setReviews] = useState<ReviewWithReviewer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    loadProfile(id as string);
  }, [id]);

  async function loadProfile(userId: string) {
    setLoading(true);
    const supabase = createClient();

    const [{ data: user }, { data: userAds }, { data: userReviews }] = await Promise.all([
      supabase.from("users").select("*").eq("id", userId).single(),
      supabase.from("ads")
        .select("id, title, price, city, area, category, created_at, ad_photos(url), users(cnic_verified)")
        .eq("seller_id", userId)
        .eq("status", "active")
        .order("created_at", { ascending: false }),
      supabase.from("reviews")
        .select("*, reviewer:users!reviews_reviewer_id_fkey(full_name)")
        .eq("seller_id", userId)
        .order("created_at", { ascending: false }),
    ]);

    if (user) setProfile(user as UserRow);

    setAds(
      (userAds ?? []).map((a: any) => ({
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
      }))
    );

    setReviews((userReviews as ReviewWithReviewer[]) ?? []);
    setLoading(false);
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

  if (!profile) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center" style={{ background: "var(--bg)" }}>
        <p className="text-base font-semibold mb-2" style={{ color: "var(--text-primary)" }}>User not found</p>
        <Link href="/" className="text-sm" style={{ color: "var(--brand-green)" }}>Go home</Link>
      </div>
    );
  }

  const name = profile.full_name ?? "Seller";
  const avgRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  return (
    <div className="min-h-dvh flex flex-col" style={{ background: "var(--bg)" }}>
      <Navbar />

      <main className="flex-1 pb-24 md:pb-8">
        <div className="max-w-3xl mx-auto px-4 py-3">
          <Link href="/" className="flex items-center gap-1.5 text-sm text-[var(--text-secondary)] hover:text-[var(--brand-green)] transition-colors">
            <ArrowLeft size={16} strokeWidth={2} />
            Back
          </Link>
        </div>

        <div className="max-w-3xl mx-auto px-4">
          {/* Profile header */}
          <div className="card p-5 mb-4">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-black text-white flex-shrink-0"
                style={{ background: "var(--brand-green)" }}>
                {name[0].toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h1 className="text-lg font-bold text-[var(--text-primary)]">{name}</h1>
                  {profile.cnic_verified && <BadgeVerified type="verified" />}
                </div>
                <div className="flex items-center gap-4 text-xs text-[var(--text-muted)] mb-3">
                  {profile.city && (
                    <span className="flex items-center gap-1">
                      <MapPin size={12} strokeWidth={2} />
                      {profile.city}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Calendar size={12} strokeWidth={2} />
                    Member since {memberSince(profile.created_at)}
                  </span>
                </div>
                {reviews.length > 0 && (
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map(i => (
                        <svg key={i} width="14" height="14" viewBox="0 0 14 14" fill={i <= Math.round(avgRating) ? "#f5a623" : "#E8E8E4"}>
                          <path d="M7 1l1.6 3.3 3.6.5-2.6 2.5.6 3.6L7 9.3 3.8 10.9l.6-3.6L2 4.8l3.6-.5z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-sm font-semibold text-[var(--text-primary)]">{avgRating.toFixed(1)}</span>
                    <span className="text-xs text-[var(--text-muted)]">({reviews.length} reviews)</span>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-[var(--border)]">
              <Stat value={String(ads.length)} label="Active Ads" />
              <Stat value={String(reviews.length)} label="Reviews" />
              <Stat value={profile.cnic_verified ? "Verified" : "Unverified"} label="Identity" />
            </div>
          </div>

          {/* Verification status card */}
          <div className="card p-4 mb-4">
            <div className="flex items-center gap-3">
              {profile.cnic_verified ? (
                <>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "var(--brand-green-light)" }}>
                    <ShieldCheck size={20} strokeWidth={2} style={{ color: "var(--brand-green)" }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-[var(--text-primary)]">Identity Verified</p>
                    <p className="text-xs text-[var(--text-muted)]">CNIC verified by Sellz.pk team</p>
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full flex-shrink-0" style={{ background: "var(--brand-green-light)", color: "var(--brand-green)" }}>
                    VERIFIED
                  </span>
                </>
              ) : profile.cnic_front_url ? (
                <>
                  <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0">
                    <Clock size={20} strokeWidth={2} className="text-amber-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-[var(--text-primary)]">Verification Pending</p>
                    <p className="text-xs text-[var(--text-muted)]">CNIC submitted, under review</p>
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-amber-50 text-amber-600 flex-shrink-0">PENDING</span>
                </>
              ) : (
                <>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "var(--bg)" }}>
                    <ShieldOff size={20} strokeWidth={2} className="text-[var(--text-muted)]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-[var(--text-primary)]">Not Verified</p>
                    <p className="text-xs text-[var(--text-muted)]">CNIC not submitted yet</p>
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[var(--bg)] text-[var(--text-muted)] flex-shrink-0">UNVERIFIED</span>
                </>
              )}
            </div>
          </div>

          {/* Active listings */}
          {ads.length > 0 && (
            <section className="mb-6">
              <h2 className="text-base font-semibold text-[var(--text-primary)] mb-3">Active Listings</h2>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                {ads.map(ad => <AdCard key={ad.id} ad={ad} />)}
              </div>
            </section>
          )}

          {/* Reviews */}
          {reviews.length > 0 && (
            <section>
              <h2 className="text-base font-semibold text-[var(--text-primary)] mb-3">Reviews</h2>
              <div className="space-y-3">
                {reviews.map((review, i) => {
                  const reviewerName = review.reviewer?.full_name ?? "Verified Buyer";
                  return (
                    <div key={review.id} className="card p-4">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
                            style={{ background: `hsl(${i * 60 + 200}, 60%, 50%)` }}>
                            {reviewerName[0].toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-[var(--text-primary)]">{reviewerName}</p>
                            <p className="text-xs text-[var(--text-muted)]">{relativeTime(review.created_at)}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map(j => (
                            <svg key={j} width="12" height="12" viewBox="0 0 14 14" fill={j <= review.rating ? "#f5a623" : "#E8E8E4"}>
                              <path d="M7 1l1.6 3.3 3.6.5-2.6 2.5.6 3.6L7 9.3 3.8 10.9l.6-3.6L2 4.8l3.6-.5z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                      {review.comment && (
                        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{review.comment}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {ads.length === 0 && reviews.length === 0 && (
            <div className="card p-8 text-center">
              <p className="text-sm text-[var(--text-muted)]">No active listings yet</p>
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

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <p className="text-xl font-black text-[var(--brand-green)]" style={{ letterSpacing: "-0.5px" }}>{value}</p>
      <p className="text-xs text-[var(--text-muted)]">{label}</p>
    </div>
  );
}
