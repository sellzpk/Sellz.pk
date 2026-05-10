"use client";

import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { BottomNav } from "@/components/BottomNav";
import { Footer, FooterMobile } from "@/components/Footer";
import { ArrowLeft, BookOpen } from "lucide-react";

export default function BlogPage() {
  return (
    <div className="min-h-dvh flex flex-col" style={{ background: "var(--bg)" }}>
      <Navbar />
      <main className="flex-1 pb-24 md:pb-8 flex items-center">
        <div className="max-w-lg mx-auto px-4 py-8 w-full">
          <Link href="/" className="flex items-center gap-1.5 text-sm mb-10" style={{ color: "var(--text-muted)" }}>
            <ArrowLeft size={15} strokeWidth={2} /> Back
          </Link>

          <div className="text-center">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6"
              style={{ background: "var(--brand-green-light)" }}
            >
              <BookOpen size={36} strokeWidth={1.5} style={{ color: "var(--brand-green)" }} />
            </div>
            <h1 className="text-3xl font-black mb-3" style={{ color: "var(--text-primary)" }}>
              Coming Soon
            </h1>
            <p className="text-base leading-relaxed mb-8" style={{ color: "var(--text-secondary)" }}>
              Tips for buying and selling safely in Pakistan.
              <br />
              Check back soon.
            </p>
            <Link href="/" className="btn-primary justify-center inline-flex px-8">
              Browse Ads
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
