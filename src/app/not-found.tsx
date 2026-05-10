"use client";

import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { BottomNav } from "@/components/BottomNav";
import { Footer, FooterMobile } from "@/components/Footer";
import { Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-dvh flex flex-col" style={{ background: "var(--bg)" }}>
      <Navbar />
      <main className="flex-1 pb-24 md:pb-8 flex items-center justify-center">
        <div className="max-w-sm mx-auto px-4 py-8 text-center">
          <div
            className="text-8xl font-black mb-4 leading-none"
            style={{ color: "var(--brand-green)", opacity: 0.15 }}
          >
            404
          </div>
          <h1 className="text-2xl font-black mb-3" style={{ color: "var(--text-primary)", marginTop: -16 }}>
            Page not found
          </h1>
          <p className="text-sm leading-relaxed mb-8" style={{ color: "var(--text-secondary)" }}>
            The page you're looking for doesn't exist or may have been removed.
          </p>
          <div className="flex flex-col gap-3">
            <Link href="/" className="btn-primary justify-center flex items-center gap-2">
              <Home size={16} strokeWidth={2} />
              Go back home
            </Link>
            <Link
              href="/search"
              className="flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-colors"
              style={{
                border: "1.5px solid var(--border)",
                color: "var(--text-secondary)",
                background: "var(--bg)",
              }}
            >
              <Search size={16} strokeWidth={2} />
              Browse ads
            </Link>
          </div>
        </div>
      </main>
      <BottomNav />
      <Footer />
      <FooterMobile />
    </div>
  );
}
