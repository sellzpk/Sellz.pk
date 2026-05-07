"use client";

import { useState } from "react";
import Link from "next/link";
import { BadgeVerified } from "./BadgeVerified";
import { MapPin, Clock, ImageOff } from "lucide-react";

export interface Ad {
  id: string;
  title: string;
  price: number;
  images: string[];
  area: string;
  city: string;
  postedAt: string;
  verified: boolean;
  owned: boolean;
  category: string;
  whatsapp?: string;
}

function formatPrice(p: number) {
  if (p >= 100000) return "Rs " + (p / 100000).toFixed(p % 100000 === 0 ? 0 : 1) + " lac";
  if (p >= 1000) return "Rs " + (p / 1000).toFixed(0) + "k";
  return "Rs " + p.toLocaleString();
}

export function AdCard({ ad }: AdCardProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <Link href={`/ads/${ad.id}`} className="block h-full">
      <div className="card overflow-hidden flex flex-col h-full">
        {/* Image — fixed 200px */}
        <div className="relative flex-shrink-0" style={{ height: 200, background: "#F5F5F3", borderRadius: "11px 11px 0 0", overflow: "hidden" }}>
          {ad.images[0] && !imgError ? (
            <img
              src={ad.images[0]}
              alt={ad.title}
              className="w-full h-full object-cover"
              loading="lazy"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ImageOff size={32} strokeWidth={1.5} style={{ color: "#BABAB5" }} />
            </div>
          )}
          {/* Badges — top-left, stacked vertically */}
          {(ad.verified || ad.owned) && (
            <div className="absolute flex flex-col gap-1" style={{ top: 10, left: 10 }}>
              {ad.verified && <BadgeVerified type="verified" />}
              {ad.owned && <BadgeVerified type="owned" />}
            </div>
          )}
        </div>

        {/* Body — flex-1 so all cards stretch equally */}
        <div className="flex flex-col flex-1 p-3">
          <p className="price mb-1">{formatPrice(ad.price)}</p>
          <p className="text-[13px] text-[var(--text-secondary)] leading-snug line-clamp-2 flex-1 mb-2">
            {ad.title}
          </p>
          {/* Footer row */}
          <div className="flex items-center justify-between gap-2 mt-auto">
            <div className="flex items-center gap-1 text-[11px] text-[var(--text-muted)] min-w-0">
              <MapPin size={11} strokeWidth={2} className="flex-shrink-0" />
              <span className="truncate">{ad.area}, {ad.city}</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-[var(--text-muted)] flex-shrink-0">
              <Clock size={11} strokeWidth={2} />
              <span>{ad.postedAt}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

interface AdCardProps {
  ad: Ad;
}
