"use client";

import Link from "next/link";
import {
  Smartphone, Car, Home, Tv, Sofa, Shirt,
  BookOpen, Baby, Wrench, PawPrint, Briefcase, Package,
} from "lucide-react";

const categories = [
  { slug: "mobiles",      label: "Mobiles",       Icon: Smartphone, color: "#e8f5e9", iconColor: "#1D9E75" },
  { slug: "vehicles",     label: "Vehicles",       Icon: Car,        color: "#fde8e0", iconColor: "#E85D24" },
  { slug: "property",     label: "Property",       Icon: Home,       color: "#fff8e1", iconColor: "#F59E0B" },
  { slug: "electronics",  label: "Electronics",    Icon: Tv,         color: "#ede9fe", iconColor: "#6366F1" },
  { slug: "furniture",    label: "Furniture",      Icon: Sofa,       color: "#e0f2fe", iconColor: "#0EA5E9" },
  { slug: "fashion",      label: "Fashion",        Icon: Shirt,      color: "#fce7f3", iconColor: "#EC4899" },
  { slug: "books-sports", label: "Books & Sports", Icon: BookOpen,   color: "#d1fae5", iconColor: "#10B981" },
  { slug: "kids",         label: "Kids",           Icon: Baby,       color: "#fff3e0", iconColor: "#F97316" },
  { slug: "services",     label: "Services",       Icon: Wrench,     color: "#ede9fe", iconColor: "#8B5CF6" },
  { slug: "animals",      label: "Animals",        Icon: PawPrint,   color: "#ccfbf1", iconColor: "#14B8A6" },
  { slug: "jobs",         label: "Jobs",           Icon: Briefcase,  color: "#e2e8f0", iconColor: "#64748B" },
  { slug: "other",        label: "Other",          Icon: Package,    color: "#ede9fe", iconColor: "#A78BFA" },
];

interface CategoryGridProps {
  compact?: boolean;
}

export function CategoryGrid({ compact = false }: CategoryGridProps) {
  if (compact) {
    return (
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-6 md:grid-cols-12">
        {categories.map(({ slug, label, Icon, color, iconColor }) => (
          <Link
            key={slug}
            href={`/search?category=${slug}`}
            className="flex flex-col items-center gap-2 group"
          >
            <div
              className="w-full aspect-square rounded-xl flex items-center justify-center transition-transform duration-150 group-hover:scale-105"
              style={{ background: color }}
            >
              <Icon size={28} strokeWidth={1.75} style={{ color: iconColor }} />
            </div>
            <span className="text-[13px] font-medium text-[var(--text-secondary)] text-center leading-tight group-hover:text-[var(--brand-green)] transition-colors">
              {label}
            </span>
          </Link>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
      {categories.map(({ slug, label, Icon, color, iconColor }) => (
        <Link
          key={slug}
          href={`/search?category=${slug}`}
          className="card p-4 flex flex-col items-center gap-2 text-center group transition-transform duration-150 hover:scale-[1.03]"
        >
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ background: color }}
          >
            <Icon size={28} strokeWidth={1.75} style={{ color: iconColor }} />
          </div>
          <span className="text-[13px] font-medium text-[var(--text-secondary)] group-hover:text-[var(--brand-green)] transition-colors leading-tight">
            {label}
          </span>
        </Link>
      ))}
    </div>
  );
}
