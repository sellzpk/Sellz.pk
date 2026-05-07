"use client";

import Link from "next/link";
import { SearchBar } from "./SearchBar";
import { Bell, Plus, User } from "lucide-react";

export function Navbar() {
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-[var(--border)]" style={{ backdropFilter: "blur(8px)" }}>
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-4">
        {/* Logo */}
        <Link href="/" className="flex-shrink-0 flex items-center gap-1.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "var(--brand-green)" }}>
            <span className="text-white font-black text-sm">S</span>
          </div>
          <span className="font-black text-lg tracking-tight text-[var(--text-primary)]">
            sellz<span style={{ color: "var(--brand-green)" }}>.pk</span>
          </span>
        </Link>

        {/* Search — hidden on mobile (shown in hero) */}
        <div className="hidden md:flex flex-1 max-w-xl">
          <SearchBar city="Karachi" />
        </div>

        {/* Right side */}
        <div className="ml-auto flex items-center gap-2">
          <button className="hidden md:flex items-center gap-1.5 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--brand-green)] transition-colors px-3 py-2">
            <Bell size={18} strokeWidth={2} />
          </button>
          <Link
            href="/auth"
            className="hidden md:flex items-center gap-1.5 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--brand-green)] transition-colors px-3 py-2"
          >
            <User size={18} strokeWidth={2} />
            Login
          </Link>
          <Link
            href="/post"
            className="btn-primary text-sm"
            style={{ padding: "8px 16px", borderRadius: 8 }}
          >
            <Plus size={16} strokeWidth={2.5} />
            Post Ad
          </Link>
        </div>
      </div>
    </header>
  );
}
