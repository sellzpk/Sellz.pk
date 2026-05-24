"use client";

import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { BottomNav } from "@/components/BottomNav";
import { Footer, FooterMobile } from "@/components/Footer";
import { ArrowLeft, UserCheck, Camera, Search, MessageCircle, Star } from "lucide-react";

const SELLER_STEPS = [
  { icon: <UserCheck size={20} />, title: "1. Verify your CNIC", desc: "Upload CNIC front, back, and a selfie. Admin verifies within 24 hours." },
  { icon: <Camera size={20} />, title: "2. Take live photos", desc: "Open the app, take photos of your item with your phone camera. No uploads from gallery." },
  { icon: <Search size={20} />, title: "3. Fill ad details", desc: "Set your price, describe the condition honestly, choose category and area." },
  { icon: <MessageCircle size={20} />, title: "4. Wait for approval", desc: "Our team reviews the ad. Usually approved within 24 hours." },
  { icon: <Star size={20} />, title: "5. Get contacted by buyers", desc: "Buyers message you via Sellz.pk chat. Share WhatsApp only when you're comfortable." },
];

const BUYER_STEPS = [
  { icon: <Search size={20} />, title: "1. Browse or search", desc: "Filter by city, category, and price range. All sellers are CNIC-verified." },
  { icon: <UserCheck size={20} />, title: "2. Check the seller", desc: "View their profile, rating, and number of reviews before reaching out." },
  { icon: <MessageCircle size={20} />, title: "3. Message in-app", desc: "Chat safely within Sellz.pk. Phone numbers are only shared after mutual agreement." },
  { icon: <Camera size={20} />, title: "4. Inspect before paying", desc: "Always meet in a public place. Inspect the item in person before any money changes hands." },
  { icon: <Star size={20} />, title: "5. Leave a review", desc: "Rate the seller after a successful deal. Helps build community trust." },
];

const howToJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "HowTo",
      "name": "How to Sell Something on Sellz.pk",
      "description": "Step-by-step guide to listing and selling an item on Sellz.pk, Pakistan's CNIC-verified classifieds marketplace.",
      "step": [
        { "@type": "HowToStep", "position": 1, "name": "Verify your CNIC", "text": "Submit photos of your CNIC front, back, and a selfie. The Sellz.pk team manually verifies your identity within 24 hours." },
        { "@type": "HowToStep", "position": 2, "name": "Take live photos", "text": "Photograph your item live using your phone camera through the app. Gallery uploads are not allowed — photos must be taken in real time." },
        { "@type": "HowToStep", "position": 3, "name": "Fill in ad details", "text": "Set your asking price, describe the item's condition honestly, and select the correct category and your area." },
        { "@type": "HowToStep", "position": 4, "name": "Wait for approval", "text": "The Sellz.pk team reviews every ad before it goes live. Approval typically takes within 24 hours." },
        { "@type": "HowToStep", "position": 5, "name": "Respond to buyers", "text": "Buyers contact you through Sellz.pk's in-app chat. Share your WhatsApp number only when you're comfortable." },
      ],
    },
    {
      "@type": "HowTo",
      "name": "How to Buy Safely on Sellz.pk",
      "description": "Step-by-step guide to finding and safely purchasing items from CNIC-verified sellers on Sellz.pk.",
      "step": [
        { "@type": "HowToStep", "position": 1, "name": "Browse or search", "text": "Filter listings by city, category, and price range. Every seller you see is CNIC-verified." },
        { "@type": "HowToStep", "position": 2, "name": "Check the seller profile", "text": "View the seller's verified badge, rating, and previous reviews before reaching out." },
        { "@type": "HowToStep", "position": 3, "name": "Message in-app", "text": "Use Sellz.pk's built-in chat to communicate. Share phone numbers only after you're comfortable." },
        { "@type": "HowToStep", "position": 4, "name": "Inspect before paying", "text": "Always meet in a public place. Inspect the item thoroughly in person before handing over any money." },
        { "@type": "HowToStep", "position": 5, "name": "Leave a review", "text": "After a successful transaction, rate the seller. This builds trust for the entire community." },
      ],
    },
  ],
};

export default function HowItWorksPage() {
  return (
    <div className="min-h-dvh flex flex-col" style={{ background: "var(--bg)" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }}
      />
      <Navbar />
      <main className="flex-1 pb-24 md:pb-8">
        <div className="max-w-2xl mx-auto px-4 py-8">
          <Link href="/" className="flex items-center gap-1.5 text-sm mb-6" style={{ color: "var(--text-muted)" }}>
            <ArrowLeft size={15} strokeWidth={2} /> Back
          </Link>

          <h1 className="text-3xl font-black mb-2" style={{ color: "var(--text-primary)" }}>How it Works</h1>
          <p className="text-base mb-10" style={{ color: "var(--text-secondary)" }}>
            Buying and selling on Sellz.pk in a few simple steps.
          </p>

          <section className="mb-10">
            <h2 className="text-lg font-bold mb-4" style={{ color: "var(--text-primary)" }}>For Sellers</h2>
            <div className="space-y-3">
              {SELLER_STEPS.map(step => (
                <div key={step.title} className="card p-4 flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "var(--brand-green-light)", color: "var(--brand-green)" }}>
                    {step.icon}
                  </div>
                  <div>
                    <p className="text-sm font-semibold mb-0.5" style={{ color: "var(--text-primary)" }}>{step.title}</p>
                    <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-lg font-bold mb-4" style={{ color: "var(--text-primary)" }}>For Buyers</h2>
            <div className="space-y-3">
              {BUYER_STEPS.map(step => (
                <div key={step.title} className="card p-4 flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "#e0f2fe", color: "#0EA5E9" }}>
                    {step.icon}
                  </div>
                  <div>
                    <p className="text-sm font-semibold mb-0.5" style={{ color: "var(--text-primary)" }}>{step.title}</p>
                    <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="card p-5 text-center">
            <p className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)" }}>Ready to start?</p>
            <p className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>Verification takes 2 minutes</p>
            <Link href="/auth" className="btn-primary justify-center inline-flex px-6">
              Get Verified Free
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
