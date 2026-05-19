import type { Metadata } from "next";
import { supabaseAdmin } from "@/lib/supabase-admin";
import AdDetailClient from "./AdDetailClient";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const { data: ad } = await supabaseAdmin
    .from("ads")
    .select("title, price, city, area, category, description, ad_photos(url, order_index)")
    .eq("id", Number(id))
    .single();

  if (!ad) {
    return { title: "Ad Not Found", robots: { index: false } };
  }

  const price = ad.price >= 100000
    ? `Rs ${(ad.price / 100000).toFixed(ad.price % 100000 === 0 ? 0 : 1)} lac`
    : `Rs ${Number(ad.price).toLocaleString()}`;

  const location = [ad.area, ad.city].filter(Boolean).join(", ");
  const title = `${ad.title} — ${price} in ${location}`;
  const description = ad.description
    ? `${ad.description.slice(0, 140)} — Buy from a verified seller on Sellz.pk`
    : `${ad.title} for ${price} in ${location}. Verified seller on Sellz.pk — Pakistan's safest marketplace.`;

  const photos = (ad.ad_photos as { url: string; order_index: number }[])
    ?.sort((a, b) => a.order_index - b.order_index);
  const image = photos?.[0]?.url;

  return {
    title,
    description,
    alternates: { canonical: `https://www.sellz.pk/ads/${id}` },
    openGraph: {
      title,
      description,
      url: `https://www.sellz.pk/ads/${id}`,
      type: "website",
      ...(image ? { images: [{ url: image, width: 800, height: 600, alt: ad.title }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(image ? { images: [image] } : {}),
    },
  };
}

export default function AdDetailPage({ params }: Props) {
  return <AdDetailClient />;
}
