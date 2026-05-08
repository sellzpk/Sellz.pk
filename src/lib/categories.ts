import type { LucideIcon } from "lucide-react";
import { Smartphone, Car, Home, Tv, Sofa, Shirt, BookOpen, Baby, Wrench, PawPrint, Briefcase, Package } from "lucide-react";

export type Category = {
  slug: string;
  label: string;
  Icon: LucideIcon;
  color: string;
  iconColor: string;
  subcategories: string[];
};

export const CATEGORIES: Category[] = [
  { slug: "mobiles", label: "Mobiles", Icon: Smartphone, color: "#e8f5e9", iconColor: "#1D9E75",
    subcategories: ["Mobile Phones", "Accessories", "Tablets", "SIM Cards"] },
  { slug: "vehicles", label: "Vehicles", Icon: Car, color: "#fde8e0", iconColor: "#E85D24",
    subcategories: ["Cars", "Motorcycles", "Rickshaws", "Trucks & Buses", "Boats", "Auto Parts", "Vehicle Accessories"] },
  { slug: "property", label: "Property", Icon: Home, color: "#fff8e1", iconColor: "#F59E0B",
    subcategories: ["Houses", "Apartments", "Plots", "Shops & Offices", "Rooms", "Vacation Rentals"] },
  { slug: "electronics", label: "Electronics", Icon: Tv, color: "#ede9fe", iconColor: "#6366F1",
    subcategories: ["TVs", "Fridges & Freezers", "Washing Machines", "ACs", "Generators & UPS", "Computers", "Cameras", "Other Electronics"] },
  { slug: "furniture", label: "Furniture", Icon: Sofa, color: "#e0f2fe", iconColor: "#0EA5E9",
    subcategories: ["Sofa Sets", "Beds", "Dining Tables", "Wardrobes", "Curtains & Rugs", "Home Decor"] },
  { slug: "fashion", label: "Fashion", Icon: Shirt, color: "#fce7f3", iconColor: "#EC4899",
    subcategories: ["Men's Clothing", "Women's Clothing", "Kids' Clothing", "Shoes", "Watches", "Bags", "Jewellery"] },
  { slug: "books-sports", label: "Books & Sports", Icon: BookOpen, color: "#d1fae5", iconColor: "#10B981",
    subcategories: ["Books & Magazines", "Sports Equipment", "Musical Instruments", "Gym Equipment", "Art & Collectibles"] },
  { slug: "kids", label: "Kids", Icon: Baby, color: "#fff3e0", iconColor: "#F97316",
    subcategories: ["Baby Gear", "Toys", "Kids' Furniture"] },
  { slug: "services", label: "Services", Icon: Wrench, color: "#ede9fe", iconColor: "#8B5CF6",
    subcategories: ["Home Services", "Tutoring", "Repair Services", "Other Services"] },
  { slug: "animals", label: "Animals", Icon: PawPrint, color: "#ccfbf1", iconColor: "#14B8A6",
    subcategories: ["Cats", "Dogs", "Birds", "Fish", "Livestock", "Other Animals"] },
  { slug: "jobs", label: "Jobs", Icon: Briefcase, color: "#e2e8f0", iconColor: "#64748B",
    subcategories: ["Full Time", "Part Time", "Freelance"] },
  { slug: "other", label: "Other", Icon: Package, color: "#ede9fe", iconColor: "#A78BFA",
    subcategories: ["Everything Else"] },
];

export const CATEGORY_TABS = [
  { slug: "all", label: "All" },
  ...CATEGORIES.map(c => ({ slug: c.slug, label: c.label })),
];

export function getCategoryBySlug(slug: string): Category | undefined {
  return CATEGORIES.find(c => c.slug === slug);
}

export function getSubcategories(slug: string): string[] {
  return getCategoryBySlug(slug)?.subcategories ?? [];
}

export const CONDITIONS = [
  "Brand New / Box Pack",
  "Like New (< 3 months)",
  "Excellent (10/10)",
  "Very Good (9/10)",
  "Good (8/10)",
  "Fair (minor repair needed)",
  "For Parts / Not Working",
];
