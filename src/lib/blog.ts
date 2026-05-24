export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  date: string;
  readTime: string;
  category: string;
};

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "how-to-sell-mobile-phone-safely-pakistan",
    title: "How to Sell Your Mobile Phone Safely in Pakistan",
    description: "A complete guide to selling your used phone in Pakistan — from factory reset to safe handover. Avoid common mistakes and get a fair price.",
    date: "2026-05-15",
    readTime: "6 min read",
    category: "Selling Tips",
  },
  {
    slug: "used-car-buying-guide-pakistan",
    title: "Used Car Buying Guide in Pakistan: What to Check Before You Buy",
    description: "Everything you need to know before buying a second-hand car in Pakistan. Document checks, mechanic inspections, excise verification and red flags to avoid.",
    date: "2026-05-10",
    readTime: "8 min read",
    category: "Buying Tips",
  },
  {
    slug: "how-to-avoid-classifieds-scams-pakistan",
    title: "How to Avoid Online Classifieds Scams in Pakistan",
    description: "The most common classifieds scams in Pakistan and how to protect yourself. Practical tips for safe buying and selling online.",
    date: "2026-05-05",
    readTime: "5 min read",
    category: "Safety",
  },
];

export function getPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-PK", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
