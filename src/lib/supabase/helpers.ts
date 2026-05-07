import type { Ad } from "@/components/AdCard";
import type { AdRow, AdPhotoRow, UserRow } from "@/lib/types";

type RawAd = AdRow & {
  ad_photos?: Pick<AdPhotoRow, "url" | "order_index">[];
  users?: Pick<UserRow, "cnic_verified" | "whatsapp_number"> | null;
};

export function mapAdRow(row: RawAd): Ad {
  const photos = (row.ad_photos ?? [])
    .slice()
    .sort((a, b) => a.order_index - b.order_index)
    .map(p => p.url);

  return {
    id: String(row.id),
    title: row.title,
    price: Number(row.price),
    images: photos,
    area: row.area ?? "",
    city: row.city ?? "",
    postedAt: relativeTime(row.created_at),
    verified: row.users?.cnic_verified ?? false,
    owned: Boolean(row.ownership_proof_url),
    category: row.category,
    whatsapp: row.users?.whatsapp_number ?? undefined,
  };
}

export function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m} minute${m === 1 ? "" : "s"} ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} hour${h === 1 ? "" : "s"} ago`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d} day${d === 1 ? "" : "s"} ago`;
  return new Date(iso).toLocaleDateString("en-PK", { day: "numeric", month: "short" });
}

export const AD_SELECT = `
  *,
  ad_photos(url, order_index),
  users(cnic_verified, whatsapp_number)
` as const;
