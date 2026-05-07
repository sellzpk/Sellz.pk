"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck, Ban, Camera,
  ChevronDown, Heart,
} from "lucide-react";

type SocialIconProps = { size?: number; strokeWidth?: number };
const FacebookIcon = ({ size = 20 }: SocialIconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size}><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
);
const InstagramIcon = ({ size = 20 }: SocialIconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width={size} height={size}><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><circle cx="12" cy="12" r="3"/><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none"/></svg>
);
const XIcon = ({ size = 20 }: SocialIconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size}><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
);
const YoutubeIcon = ({ size = 20 }: SocialIconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size}><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58zM9.75 15.02V8.98L15.5 12z"/></svg>
);

const COLUMNS = [
  {
    heading: "Popular Categories",
    links: [
      { label: "Mobile Phones",       href: "/search?category=mobiles" },
      { label: "Cars",                href: "/search?category=vehicles" },
      { label: "Motorcycles",         href: "/search?category=vehicles" },
      { label: "Property for Sale",   href: "/search?category=property" },
      { label: "Electronics",         href: "/search?category=electronics" },
      { label: "Furniture",           href: "/search?category=furniture" },
      { label: "Jobs",                href: "/search?category=jobs" },
    ],
  },
  {
    heading: "Trending Searches",
    links: [
      { label: "iPhone in Karachi",   href: "/search?q=iphone&city=karachi" },
      { label: "Honda City",          href: "/search?q=honda+city" },
      { label: "Samsung TV",          href: "/search?q=samsung+tv" },
      { label: "Suzuki Mehran",       href: "/search?q=suzuki+mehran" },
      { label: "Laptop",              href: "/search?q=laptop" },
      { label: "Sofa Set",            href: "/search?q=sofa+set" },
    ],
  },
  {
    heading: "About Sellz.pk",
    links: [
      { label: "About Us",            href: "/about" },
      { label: "How It Works",        href: "/how-it-works" },
      { label: "Safety Tips",         href: "/safety" },
      { label: "Blog",                href: "/blog" },
      { label: "Contact Us",          href: "/contact" },
    ],
  },
  {
    heading: "Support & Legal",
    links: [
      { label: "Help Center",                 href: "/help" },
      { label: "Report a Scam",              href: "/report" },
      { label: "Terms of Use",               href: "/terms" },
      { label: "Privacy Policy",             href: "/privacy" },
      { label: "Location Change Request",    href: "/support/location-change" },
    ],
  },
];

const SOCIAL = [
  { Icon: FacebookIcon,  href: "https://facebook.com/sellzpk",   label: "Facebook" },
  { Icon: InstagramIcon, href: "https://instagram.com/sellzpk",  label: "Instagram" },
  { Icon: XIcon,         href: "https://twitter.com/sellzpk",    label: "Twitter / X" },
  { Icon: YoutubeIcon,   href: "https://youtube.com/@sellzpk",   label: "YouTube" },
];

const TRUST = [
  {
    Icon: ShieldCheck,
    title: "CNIC Verified Sellers",
    sub: "Har seller ka identity verify hai",
  },
  {
    Icon: Ban,
    title: "Zero Business Accounts",
    sub: "Sirf individuals, koi dukan nahi",
  },
  {
    Icon: Camera,
    title: "Camera-Only Photos",
    sub: "Har photo authentic aur real",
  },
];

export function Footer() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  function toggle(i: number) {
    setOpenIndex(prev => (prev === i ? null : i));
  }

  return (
    <footer className="hidden md:block" style={{ background: "#fff", borderTop: "1px solid #E8E8E4" }}>
      {/* Trust strip — desktop only shown inline, mobile inside main footer */}
      <div
        className="flex items-center justify-center gap-0 flex-wrap"
        style={{ background: "#F0FAF6", borderBottom: "1px solid #D4EDE5", padding: "18px 32px" }}
      >
        {TRUST.map(({ Icon, title, sub }, i) => (
          <div key={title} className="flex items-center">
            <div className="flex items-center gap-3 px-8">
              <Icon size={20} strokeWidth={2} style={{ color: "#1D9E75", flexShrink: 0 }} />
              <div>
                <p style={{ fontSize: 13, fontWeight: 600, color: "#1A1A1A", lineHeight: 1.3 }}>{title}</p>
                <p style={{ fontSize: 12, color: "#555" }}>{sub}</p>
              </div>
            </div>
            {i < TRUST.length - 1 && (
              <div style={{ width: 1, height: 32, background: "#D4EDE5", flexShrink: 0 }} />
            )}
          </div>
        ))}
      </div>

      {/* Columns */}
      <div className="max-w-7xl mx-auto" style={{ padding: "48px 32px 0" }}>
        <div className="grid grid-cols-5 gap-8">
          {COLUMNS.map((col, i) => (
            <div key={col.heading}>
              <p style={{ fontSize: 13, fontWeight: 600, color: "#1A1A1A", marginBottom: 16 }}>
                {col.heading}
              </p>
              <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
                {col.links.map(link => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      style={{ fontSize: 13, color: "#666", lineHeight: 2.2, textDecoration: "none", display: "block" }}
                      className="hover:text-[#1D9E75] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Social column */}
          <div>
            <p style={{ fontSize: 13, fontWeight: 600, color: "#1A1A1A", marginBottom: 16 }}>
              Follow Us
            </p>
            <div className="flex flex-wrap gap-2">
              {SOCIAL.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="social-icon flex items-center justify-center rounded-full transition-colors"
                  style={{
                    width: 38, height: 38,
                    border: "1.5px solid #CCCCCA",
                    color: "#444",
                  }}
                >
                  <Icon size={18} strokeWidth={1.75} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-3"
        style={{ borderTop: "1px solid #E8E8E4", margin: "32px 32px 0", padding: "16px 0" }}
      >
        <p style={{ fontSize: 12, color: "#999" }}>
          © 2025 Sellz.pk — Pakistan ka verified marketplace
        </p>
        <p className="flex items-center gap-1" style={{ fontSize: 12, color: "#999" }}>
          Made with <Heart size={12} strokeWidth={2} style={{ color: "#e53e3e", fill: "#e53e3e" }} /> in Pakistan
        </p>
      </div>
    </footer>
  );
}

/* ── Mobile footer (separate component rendered below BottomNav padding) ── */
export function FooterMobile() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  function toggle(i: number) {
    setOpenIndex(prev => (prev === i ? null : i));
  }

  return (
    <div className="md:hidden" style={{ background: "#fff", borderTop: "1px solid #E8E8E4" }}>
      {/* Trust strip */}
      <div style={{ background: "#F0FAF6", borderBottom: "1px solid #D4EDE5", padding: "16px 20px" }}>
        <div className="flex flex-col gap-3">
          {TRUST.map(({ Icon, title, sub }) => (
            <div key={title} className="flex items-center gap-3">
              <Icon size={18} strokeWidth={2} style={{ color: "#1D9E75", flexShrink: 0 }} />
              <div>
                <p style={{ fontSize: 13, fontWeight: 600, color: "#1A1A1A", lineHeight: 1.3 }}>{title}</p>
                <p style={{ fontSize: 12, color: "#555" }}>{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Accordion columns */}
      <div style={{ padding: "0 20px" }}>
        {COLUMNS.map((col, i) => (
          <div key={col.heading} style={{ borderBottom: "1px solid #F0F0EE" }}>
            <button
              onClick={() => toggle(i)}
              className="w-full flex items-center justify-between py-4"
              style={{ background: "none", border: "none", cursor: "pointer" }}
            >
              <span style={{ fontSize: 13, fontWeight: 600, color: "#1A1A1A" }}>{col.heading}</span>
              <ChevronDown
                size={16}
                strokeWidth={2}
                style={{
                  color: "#999",
                  transform: openIndex === i ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.2s",
                }}
              />
            </button>
            {openIndex === i && (
              <ul style={{ listStyle: "none", margin: 0, padding: "0 0 12px" }}>
                {col.links.map(link => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      style={{ fontSize: 13, color: "#666", lineHeight: 2.4, textDecoration: "none", display: "block" }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>

      {/* Social — always visible */}
      <div style={{ padding: "20px 20px 0" }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: "#1A1A1A", marginBottom: 12 }}>Follow Us</p>
        <div className="flex gap-2 mb-5">
          {SOCIAL.map(({ Icon, href, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="flex items-center justify-center rounded-full"
              style={{ width: 38, height: 38, border: "1.5px solid #CCCCCA", color: "#444", flexShrink: 0 }}
            >
              <Icon size={18} strokeWidth={1.75} />
            </a>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div
        className="flex flex-col gap-1 items-center text-center"
        style={{ borderTop: "1px solid #E8E8E4", padding: "16px 20px", paddingBottom: "calc(16px + env(safe-area-inset-bottom, 0px))" }}
      >
        <p style={{ fontSize: 12, color: "#999" }}>© 2025 Sellz.pk — Pakistan ka verified marketplace</p>
        <p className="flex items-center gap-1" style={{ fontSize: 12, color: "#999" }}>
          Made with <Heart size={11} strokeWidth={2} style={{ color: "#e53e3e", fill: "#e53e3e" }} /> in Pakistan
        </p>
      </div>
    </div>
  );
}
