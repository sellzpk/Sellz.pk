import { cache } from "react";
import type { Metadata } from "next";
import { supabaseAdmin } from "@/lib/supabase-admin";
import AdDetailClient from "./AdDetailClient";

interface Props {
  params: Promise<{ id: string }>;
}

type AdRow = {
  title: string;
  price: number;
  city: string | null;
  area: string | null;
  category: string | null;
  description: string | null;
  condition: string | null;
  ad_photos: { url: string; order_index: number }[];
  users: { full_name: string | null } | null;
};

const getAd = cache(async (id: string): Promise<AdRow | null> => {
  const { data } = await supabaseAdmin
    .from("ads")
    .select(
      "title, price, city, area, category, description, condition, ad_photos(url, order_index), users(full_name)"
    )
    .eq("id", Number(id))
    .single();
  return data as AdRow | null;
});

function formatPrice(price: number): string {
  return price >= 100000
    ? `Rs ${(price / 100000).toFixed(price % 100000 === 0 ? 0 : 1)} lac`
    : `Rs ${Number(price).toLocaleString()}`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const ad = await getAd(id);

  if (!ad) return { title: "Ad Not Found", robots: { index: false } };

  const price = formatPrice(ad.price);
  const location = [ad.area, ad.city].filter(Boolean).join(", ");
  const title = `${ad.title} — ${price} in ${location}`;
  const description = ad.description
    ? `${ad.description.slice(0, 140)} — Buy from a verified seller on Sellz.pk`
    : `${ad.title} for ${price} in ${location}. Verified seller on Sellz.pk — Pakistan's safest marketplace.`;

  const photos = [...(ad.ad_photos ?? [])].sort(
    (a, b) => a.order_index - b.order_index
  );
  const photo = photos[0]?.url;
  const ogImageUrl = photo
    ? photo
    : `https://www.sellz.pk/api/og?title=${encodeURIComponent(ad.title)}&sub=${encodeURIComponent(`${price} • ${location}`)}`;

  return {
    title,
    description,
    alternates: { canonical: `https://www.sellz.pk/ads/${id}` },
    openGraph: {
      title,
      description,
      url: `https://www.sellz.pk/ads/${id}`,
      type: "website",
      images: [
        photo
          ? { url: ogImageUrl, width: 800, height: 600, alt: ad.title }
          : { url: ogImageUrl, width: 1200, height: 630, alt: ad.title },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
    },
  };
}

export default async function AdDetailPage({ params }: Props) {
  const { id } = await params;
  const ad = await getAd(id);

  if (!ad) return <AdDetailClient />;

  const price = formatPrice(ad.price);
  const location = [ad.area, ad.city].filter(Boolean).join(", ");
  const photos = [...(ad.ad_photos ?? [])]
    .sort((a, b) => a.order_index - b.order_index)
    .map((p) => p.url);

  const categoryLabel =
    ad.category
      ? ad.category.charAt(0).toUpperCase() + ad.category.slice(1)
      : "Other";

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        name: ad.title,
        ...(ad.description ? { description: ad.description } : {}),
        ...(photos.length ? { image: photos } : {}),
        ...(ad.condition
          ? {
              itemCondition:
                ad.condition === "Brand New / Box Pack"
                  ? "https://schema.org/NewCondition"
                  : "https://schema.org/UsedCondition",
            }
          : {}),
        offers: {
          "@type": "Offer",
          price: ad.price,
          priceCurrency: "PKR",
          availability: "https://schema.org/InStock",
          url: `https://www.sellz.pk/ads/${id}`,
          seller: {
            "@type": "Person",
            ...(ad.users?.full_name ? { name: ad.users.full_name } : {}),
            memberOf: {
              "@type": "Organization",
              name: "Sellz.pk",
              url: "https://www.sellz.pk",
            },
          },
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://www.sellz.pk",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: categoryLabel,
            item: `https://www.sellz.pk/${ad.category}`,
          },
          { "@type": "ListItem", position: 3, name: ad.title },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AdDetailClient />
    </>
  );
}
