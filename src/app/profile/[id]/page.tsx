"use client";

import { Navbar } from "@/components/Navbar";
import { BottomNav } from "@/components/BottomNav";
import { BadgeVerified } from "@/components/BadgeVerified";
import { AdCard } from "@/components/AdCard";
import { MOCK_ADS } from "@/lib/mockData";
import { Footer, FooterMobile } from "@/components/Footer";
import { MapPin, Calendar, ArrowLeft } from "lucide-react";
import Link from "next/link";

const REVIEWS = [
  { name: "Kashif Mehmood", rating: 5, comment: "Bilkul sahi condition thi. Photos accurate theen, seller ne jaldi response kiya. Recommended.", time: "3 days ago" },
  { name: "Rabia Noor", rating: 5, comment: "Met at Dolmen Mall — smooth transaction. Item exactly as described. Will buy again.", time: "2 weeks ago" },
  { name: "Tariq Hussain", rating: 4, comment: "Good seller, slight delay in response but item was genuine. Price was fair.", time: "1 month ago" },
  { name: "Ayesha Siddiqui", rating: 5, comment: "Honest listing, no hidden issues. Quick WhatsApp response. Dealt professionally.", time: "6 weeks ago" },
];

export default function ProfilePage() {
  const ads = MOCK_ADS.slice(0, 6);
  const avgRating = 4.7;

  return (
    <div className="min-h-dvh flex flex-col" style={{ background: "var(--bg)" }}>
      <Navbar />

      <main className="flex-1 pb-24 md:pb-8">
        {/* Back */}
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
                A
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h1 className="text-lg font-bold text-[var(--text-primary)]">Abdul Rehman</h1>
                  <BadgeVerified type="verified" />
                </div>
                <div className="flex items-center gap-4 text-xs text-[var(--text-muted)] mb-3">
                  <span className="flex items-center gap-1">
                    <MapPin size={12} strokeWidth={2} />
                    Karachi
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar size={12} strokeWidth={2} />
                    Member since Jan 2024
                  </span>
                </div>
                {/* Rating */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-0.5">
                    {[1,2,3,4,5].map(i => (
                      <svg key={i} width="14" height="14" viewBox="0 0 14 14" fill={i <= Math.round(avgRating) ? "#f5a623" : "#E8E8E4"}>
                        <path d="M7 1l1.6 3.3 3.6.5-2.6 2.5.6 3.6L7 9.3 3.8 10.9l.6-3.6L2 4.8l3.6-.5z"/>
                      </svg>
                    ))}
                  </div>
                  <span className="text-sm font-semibold text-[var(--text-primary)]">{avgRating}</span>
                  <span className="text-xs text-[var(--text-muted)]">({REVIEWS.length} reviews)</span>
                </div>
              </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-[var(--border)]">
              <Stat value={ads.length.toString()} label="Active Ads" />
              <Stat value={REVIEWS.length.toString()} label="Reviews" />
              <Stat value="100%" label="Response Rate" />
            </div>
          </div>

          {/* Active listings */}
          <section className="mb-6">
            <h2 className="text-base font-semibold text-[var(--text-primary)] mb-3">Active Listings</h2>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
              {ads.map(ad => <AdCard key={ad.id} ad={ad} />)}
            </div>
          </section>

          {/* Reviews */}
          <section>
            <h2 className="text-base font-semibold text-[var(--text-primary)] mb-3">Reviews</h2>
            <div className="space-y-3">
              {REVIEWS.map((review, i) => (
                <div key={i} className="card p-4">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
                        style={{ background: `hsl(${i * 60 + 200}, 60%, 50%)` }}>
                        {review.name[0]}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[var(--text-primary)]">{review.name}</p>
                        <p className="text-xs text-[var(--text-muted)]">{review.time}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-0.5">
                      {[1,2,3,4,5].map(j => (
                        <svg key={j} width="12" height="12" viewBox="0 0 14 14" fill={j <= review.rating ? "#f5a623" : "#E8E8E4"}>
                          <path d="M7 1l1.6 3.3 3.6.5-2.6 2.5.6 3.6L7 9.3 3.8 10.9l.6-3.6L2 4.8l3.6-.5z"/>
                        </svg>
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{review.comment}</p>
                </div>
              ))}
            </div>
          </section>
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
