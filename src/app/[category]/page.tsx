import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { BottomNav } from "@/components/BottomNav";
import { Footer, FooterMobile } from "@/components/Footer";
import CategoryAds from "./CategoryAds";

export const dynamicParams = false;

const CATEGORY_SEO: Record<
  string,
  {
    h1: string;
    intro: string[];
    faqs: { q: string; a: string }[];
    metaTitle: string;
    metaDesc: string;
  }
> = {
  mobiles: {
    metaTitle: "Used Mobile Phones for Sale in Pakistan — Verified Sellers",
    metaDesc:
      "Buy second-hand mobile phones in Pakistan from CNIC-verified sellers. Samsung, Apple, Xiaomi, Oppo and more. Real photos, safe deals on Sellz.pk.",
    h1: "Buy & Sell Mobile Phones in Pakistan",
    intro: [
      "Find used and new mobile phones from verified sellers across Pakistan. Every seller on Sellz.pk is verified with their CNIC — one real identity per account, no exceptions.",
      "Browse Samsung, Apple iPhone, Xiaomi, Oppo, Vivo, Realme, and more. All listings include live camera photos of the actual device, so you see exactly what you're buying before you meet.",
    ],
    faqs: [
      {
        q: "How do I safely buy a used mobile phone in Pakistan?",
        a: "On Sellz.pk, every seller is verified with their CNIC (National Identity Card) before they can post a listing. Photos must be taken live using the camera — no stock images or stolen photos. You can message the seller directly through the platform, agree on a meeting point, and inspect the phone before paying. Always meet in a public place and test the phone's IMEI status before handover.",
      },
      {
        q: "What is the best website to sell a used phone in Pakistan?",
        a: "Sellz.pk is Pakistan's first CNIC-verified classifieds marketplace. Unlike other platforms, sellers cannot pay to boost their listings — ads are shown in order of time posted. This means genuine sellers get equal visibility, and buyers see the most recent listings first without manipulated rankings.",
      },
      {
        q: "Is it safe to buy a second-hand iPhone in Pakistan?",
        a: "Yes, especially from a CNIC-verified seller on Sellz.pk. Before buying, ask the seller to show the IMEI number (dial *#06#) and check it on the PTA Device Verification website. Listings on Sellz.pk show PTA status (approved or non-PTA) and condition details so you can compare options confidently.",
      },
      {
        q: "How do I check if a used phone is original before buying?",
        a: "Ask the seller to dial *#06# to display the IMEI, then verify it on the PTA Device Verification portal. On Sellz.pk, sellers must disclose PTA status in the listing. You can also ask the seller to video call or meet in person so you can inspect the phone before completing the transaction.",
      },
    ],
  },
  vehicles: {
    metaTitle: "Cars & Motorcycles for Sale in Pakistan — Verified Sellers",
    metaDesc:
      "Buy and sell used cars and motorcycles in Pakistan from CNIC-verified owners. Toyota, Honda, Suzuki, Kia and more. No dealer listings on Sellz.pk.",
    h1: "Buy & Sell Cars and Motorcycles in Pakistan",
    intro: [
      "Find used cars and motorcycles from individual, verified owners across Pakistan. Sellz.pk only allows private sellers — no car dealers — so you deal directly with the actual owner.",
      "Browse Toyota, Honda, Suzuki, Kia, Hyundai, and more. Every seller is verified with their CNIC, and photos are taken live of the actual vehicle.",
    ],
    faqs: [
      {
        q: "How do I buy a used car safely in Pakistan?",
        a: "On Sellz.pk, every seller must verify their identity with a CNIC before listing a vehicle. This eliminates anonymous or fraudulent sellers. Before purchase, always verify the vehicle's registration documents (book) match the seller's CNIC, check for any court orders or bank liens at the local excise office, and get the car inspected by a trusted mechanic. Avoid advance payments.",
      },
      {
        q: "Where can I sell my car in Pakistan without a dealer?",
        a: "Sellz.pk is a peer-to-peer marketplace for individual sellers only — no car dealers are allowed. You list your car directly, buyers contact you, and you negotiate without any middlemen. All sellers are CNIC-verified, so buyers trust the platform, which means more genuine inquiries for your listing.",
      },
      {
        q: "What documents do I need to sell a car in Pakistan?",
        a: "To sell a car in Pakistan, you need the original registration book (RC book), your CNIC, and a sale deed or transfer letter. The car should be in the seller's name or have a proper authority letter if selling on behalf of someone else. Sellz.pk verifies seller identity via CNIC, so fraudulent listings are minimised.",
      },
    ],
  },
  property: {
    metaTitle: "Property for Sale & Rent in Pakistan — Verified Owners",
    metaDesc:
      "Buy, sell and rent property in Pakistan from CNIC-verified individual owners. Houses, apartments, plots and commercial spaces. No agencies on Sellz.pk.",
    h1: "Buy, Sell & Rent Property in Pakistan",
    intro: [
      "Find houses, apartments, plots, and commercial property in Pakistan from individual, verified owners. Sellz.pk verifies every seller by CNIC — you always know who you are dealing with.",
      "All property listings on Sellz.pk are from private individuals only. No real estate agencies. This means less commission pressure and more straightforward negotiations.",
    ],
    faqs: [
      {
        q: "How do I avoid property scams in Pakistan?",
        a: "The most common property scams in Pakistan involve sellers who are not the actual owners. On Sellz.pk, every seller is verified with their CNIC, which significantly reduces fraud risk. Always verify the property's registry at the relevant local authority (Patwari or Registrar office), ensure the seller's name on the documents matches their CNIC, and never make advance payments without proper verification.",
      },
      {
        q: "Where can I find genuine property listings in Pakistan without agents?",
        a: "Sellz.pk is a peer-to-peer property marketplace where only individual owners can list. There are no real estate agencies or dealers. This means you deal directly with the person who owns the property, avoiding agency commissions and getting more transparent pricing.",
      },
      {
        q: "What is the safest way to rent a house or apartment in Pakistan?",
        a: "On Sellz.pk, landlords are CNIC-verified before they can post rental listings. Always insist on a signed rent agreement (rental deed) that specifies the monthly rent, deposit amount, duration, and termination terms. Visit the property in person before paying any deposit, and confirm the landlord's identity with their CNIC.",
      },
    ],
  },
  electronics: {
    metaTitle: "Used Electronics for Sale in Pakistan — Verified Sellers",
    metaDesc:
      "Buy second-hand laptops, TVs, cameras, and electronics in Pakistan from CNIC-verified sellers. Real photos, honest listings on Sellz.pk.",
    h1: "Buy & Sell Electronics in Pakistan",
    intro: [
      "Find used laptops, televisions, cameras, gaming consoles, and other electronics from verified sellers across Pakistan. Every seller is CNIC-verified — one real person per account.",
      "All listing photos on Sellz.pk are taken live using the camera. No stolen images, no misleading stock photos — you see the actual item before deciding to buy.",
    ],
    faqs: [
      {
        q: "How do I buy a used laptop safely in Pakistan?",
        a: "On Sellz.pk, every seller is CNIC-verified, which eliminates most fraudulent listings. When buying a used laptop, ask the seller to show it running, check the battery health (Settings > System > Power on Windows; About This Mac > System Report on Mac), verify there are no hidden faults, and test all ports and the display before paying.",
      },
      {
        q: "Where can I sell my old TV or laptop in Pakistan quickly?",
        a: "List it on Sellz.pk — Pakistan's verified classifieds. Your listing is shown in chronological order without paid bumps, so every genuine seller gets equal visibility. Buyers on Sellz.pk are looking for real individual sellers, not dealers.",
      },
    ],
  },
  furniture: {
    metaTitle: "Used Furniture for Sale in Pakistan — Verified Sellers",
    metaDesc:
      "Buy and sell second-hand furniture in Pakistan from CNIC-verified sellers. Sofas, beds, wardrobes and more. Real photos on Sellz.pk.",
    h1: "Buy & Sell Furniture in Pakistan",
    intro: [
      "Find used sofas, beds, wardrobes, dining tables, and other furniture from verified sellers across Pakistan. Every seller is CNIC-verified before they can post.",
      "Photos on Sellz.pk are taken live — what you see is what exists. Browse furniture listings in your city and contact sellers directly.",
    ],
    faqs: [
      {
        q: "Where can I buy affordable used furniture in Pakistan?",
        a: "Sellz.pk has verified individual sellers listing used furniture across Pakistan. All photos are live-taken, so you see the actual condition. You can filter by city to find sellers near you and arrange to inspect before buying.",
      },
      {
        q: "How do I sell my furniture quickly in Pakistan?",
        a: "Post a listing on Sellz.pk with clear photos taken from multiple angles. Your listing appears in front of buyers searching in your category and city. Sellz.pk is free for individual sellers and shows listings chronologically — no paid bumps required.",
      },
    ],
  },
  fashion: {
    metaTitle: "Buy & Sell Clothes and Fashion in Pakistan — Verified Sellers",
    metaDesc:
      "Buy second-hand branded clothes, shoes, bags and accessories in Pakistan from CNIC-verified sellers. Authentic listings on Sellz.pk.",
    h1: "Buy & Sell Fashion and Clothing in Pakistan",
    intro: [
      "Find pre-owned branded clothing, shoes, handbags, watches, and accessories from verified individuals across Pakistan.",
      "Every seller is CNIC-verified, and all photos are live-taken. A genuine way to buy and sell fashion without middlemen.",
    ],
    faqs: [
      {
        q: "Where can I sell branded clothes and bags in Pakistan?",
        a: "List on Sellz.pk — only CNIC-verified individual sellers. Buyers trust the platform because every seller's identity is confirmed. Photos must be live-taken, so buyers see the actual item.",
      },
      {
        q: "How do I find genuine branded items in Pakistan at fair prices?",
        a: "Sellz.pk shows listings from individual sellers only — not resellers or businesses. Every seller is CNIC-verified and listings include live photos of the actual item. You can message sellers directly and ask for additional photos or meet in person.",
      },
    ],
  },
  "books-sports": {
    metaTitle: "Books, Sports Equipment for Sale in Pakistan — Verified Sellers",
    metaDesc:
      "Buy and sell used books, textbooks, sports gear and equipment in Pakistan from CNIC-verified sellers. Honest listings on Sellz.pk.",
    h1: "Buy & Sell Books and Sports Equipment in Pakistan",
    intro: [
      "Find used textbooks, novels, study guides, and sports equipment from verified individuals across Pakistan. Great condition items at fair prices from CNIC-verified sellers.",
    ],
    faqs: [
      {
        q: "Where can I buy or sell used textbooks in Pakistan?",
        a: "Sellz.pk lets students and individuals list their used textbooks directly. All sellers are CNIC-verified. Browse by city to find sellers near your school or university.",
      },
    ],
  },
  kids: {
    metaTitle: "Kids Items for Sale in Pakistan — Verified Sellers",
    metaDesc:
      "Buy and sell baby clothes, toys, strollers and kids items in Pakistan from CNIC-verified individual sellers on Sellz.pk.",
    h1: "Buy & Sell Kids Items in Pakistan",
    intro: [
      "Find baby clothes, toys, strollers, cribs, and kids items from verified parents across Pakistan. All sellers are CNIC-verified — safe, trusted transactions.",
    ],
    faqs: [
      {
        q: "Where can I sell baby items and kids clothes in Pakistan?",
        a: "Post on Sellz.pk — Pakistan's verified classifieds where every seller is CNIC-verified. Buyers know they're dealing with real individuals. List baby clothes, strollers, toys and more for free.",
      },
    ],
  },
  services: {
    metaTitle: "Local Services in Pakistan — Verified Providers",
    metaDesc:
      "Find local services in Pakistan from CNIC-verified individuals. Home repair, tutoring, photography and more on Sellz.pk.",
    h1: "Find Local Services in Pakistan",
    intro: [
      "Connect with local service providers across Pakistan — home repair, tutoring, photography, IT help, and more. Every provider is CNIC-verified before they can post.",
    ],
    faqs: [
      {
        q: "How do I find a reliable local service provider in Pakistan?",
        a: "On Sellz.pk, every service provider must verify their CNIC before listing. This means you always know who you're hiring. Read their listing, message them directly, and agree on terms before work begins.",
      },
    ],
  },
  animals: {
    metaTitle: "Pets and Animals for Sale in Pakistan — Verified Sellers",
    metaDesc:
      "Buy and sell pets and animals in Pakistan from CNIC-verified individual owners. Dogs, cats, birds, livestock and more on Sellz.pk.",
    h1: "Buy & Sell Pets and Animals in Pakistan",
    intro: [
      "Find pets and animals from verified individual owners across Pakistan. Dogs, cats, birds, livestock, and more — listed by CNIC-verified sellers.",
    ],
    faqs: [
      {
        q: "Where can I buy or sell pets safely in Pakistan?",
        a: "Sellz.pk verifies every seller by CNIC before they can post. All photos must be live-taken of the actual animal. You can message sellers directly and arrange to meet and see the animal before committing.",
      },
    ],
  },
  jobs: {
    metaTitle: "Jobs and Freelance Work in Pakistan — Post & Find Opportunities",
    metaDesc:
      "Find jobs and freelance opportunities in Pakistan posted by CNIC-verified individuals and small businesses on Sellz.pk.",
    h1: "Find Jobs and Work Opportunities in Pakistan",
    intro: [
      "Browse job listings and freelance opportunities posted by verified individuals across Pakistan. Every poster on Sellz.pk is CNIC-verified.",
    ],
    faqs: [
      {
        q: "How do I find legitimate job listings in Pakistan online?",
        a: "Sellz.pk requires all posters to be CNIC-verified, which filters out most fake or fraudulent job listings. Browse opportunities in your city and contact employers directly through the platform.",
      },
    ],
  },
  other: {
    metaTitle: "Miscellaneous Items for Sale in Pakistan — Verified Sellers",
    metaDesc:
      "Buy and sell miscellaneous items in Pakistan from CNIC-verified individual sellers on Sellz.pk.",
    h1: "Buy & Sell Miscellaneous Items in Pakistan",
    intro: [
      "Can't find your category? List anything here — from collectibles to tools to unique finds. Every seller is CNIC-verified on Sellz.pk.",
    ],
    faqs: [
      {
        q: "What can I sell on Sellz.pk?",
        a: "Sellz.pk is for individual sellers — not businesses or dealers. You can sell almost anything: electronics, vehicles, property, clothes, books, animals, and more. Every seller must verify their CNIC before listing. Items must be legal and accurately described with live photos.",
      },
    ],
  },
};

const VALID_SLUGS = Object.keys(CATEGORY_SEO);

interface Props {
  params: Promise<{ category: string }>;
}

export async function generateStaticParams() {
  return VALID_SLUGS.map((slug) => ({ category: slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const seo = CATEGORY_SEO[category];
  if (!seo) return { title: "Not Found", robots: { index: false } };

  const ogUrl = `https://www.sellz.pk/api/og?title=${encodeURIComponent(seo.h1)}&sub=${encodeURIComponent("Sellz.pk — Pakistan's Verified Classifieds")}`;

  return {
    title: seo.metaTitle,
    description: seo.metaDesc,
    alternates: { canonical: `https://www.sellz.pk/${category}` },
    openGraph: {
      title: seo.metaTitle,
      description: seo.metaDesc,
      url: `https://www.sellz.pk/${category}`,
      type: "website",
      images: [{ url: ogUrl, width: 1200, height: 630, alt: seo.h1 }],
    },
    twitter: {
      card: "summary_large_image",
      title: seo.metaTitle,
      description: seo.metaDesc,
      images: [ogUrl],
    },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  const seo = CATEGORY_SEO[category];
  if (!seo) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
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
            name: seo.h1,
            item: `https://www.sellz.pk/${category}`,
          },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: seo.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.q,
          acceptedAnswer: { "@type": "Answer", text: faq.a },
        })),
      },
    ],
  };

  return (
    <div className="min-h-dvh flex flex-col" style={{ background: "var(--bg)" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />

      <main className="flex-1 pb-24 md:pb-8">
        {/* Header */}
        <div className="bg-white border-b border-[var(--border)]">
          <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="mb-3">
              <ol className="flex items-center gap-1.5 text-sm" style={{ color: "var(--text-muted)" }}>
                <li>
                  <Link href="/" style={{ color: "var(--brand-green)" }}>
                    Home
                  </Link>
                </li>
                <li aria-hidden>/</li>
                <li aria-current="page" style={{ color: "var(--text-primary)" }}>
                  {seo.h1.split(" in Pakistan")[0].split("Buy & Sell ")[1] ??
                    seo.h1}
                </li>
              </ol>
            </nav>

            <h1
              className="text-2xl md:text-3xl font-bold mb-3"
              style={{ color: "var(--text-primary)" }}
            >
              {seo.h1}
            </h1>

            {seo.intro.map((para, i) => (
              <p
                key={i}
                className="text-sm md:text-base leading-relaxed mb-2"
                style={{ color: "var(--text-muted)", maxWidth: "720px" }}
              >
                {para}
              </p>
            ))}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Live listings */}
          <section aria-label="Listings">
            <h2
              className="text-base font-semibold mb-4"
              style={{ color: "var(--text-primary)" }}
            >
              Latest Listings
            </h2>
            <CategoryAds category={category} />
          </section>

          {/* FAQ section — GEO/AEO */}
          <section aria-label="Frequently asked questions" className="mt-10">
            <h2
              className="text-lg font-semibold mb-6"
              style={{ color: "var(--text-primary)" }}
            >
              Common Questions
            </h2>
            <div className="space-y-4 max-w-2xl">
              {seo.faqs.map((faq, i) => (
                <div key={i} className="card p-5">
                  <h3
                    className="text-sm font-semibold mb-2"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {faq.q}
                  </h3>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {faq.a}
                  </p>
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
