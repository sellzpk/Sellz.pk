"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { BottomNav } from "@/components/BottomNav";
import { BadgeVerified } from "@/components/BadgeVerified";
import { AdCard } from "@/components/AdCard";
import { ChatPanel } from "@/components/ChatPanel";
import { MOCK_ADS } from "@/lib/mockData";
import { Footer, FooterMobile } from "@/components/Footer";
import {
  ChevronLeft, ChevronRight, MapPin, Clock,
  Share2, Flag, ArrowLeft, MessageCircle, ImageOff,
  Lock, Phone,
} from "lucide-react";

const WaIcon = ({ size = 16, color = "currentColor" }: { size?: number; color?: string }) => (
  <svg viewBox="0 0 24 24" fill={color} width={size} height={size}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.49" />
  </svg>
);

function formatWaDisplay(num: string) {
  const digits = num.replace(/^0/, "");
  return `+92 ${digits.slice(0, 3)} ${digits.slice(3)}`;
}

export default function AdDetailPage() {
  const { id } = useParams();
  const ad = MOCK_ADS.find(a => a.id === id) || MOCK_ADS[0];
  const [currentImg, setCurrentImg] = useState(0);
  const [reported, setReported] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatStarted, setChatStarted] = useState(false);
  const [numberRevealed, setNumberRevealed] = useState(false);

  const similar = MOCK_ADS.filter(a => a.id !== ad.id && a.category === ad.category).slice(0, 4);
  const hasWhatsapp = Boolean(ad.whatsapp);

  function formatPrice(p: number) {
    if (p >= 100000) return "Rs " + (p / 100000).toFixed(p % 100000 === 0 ? 0 : 1) + " lac";
    if (p >= 1000) return "Rs " + (p / 1000).toFixed(0) + "k";
    return "Rs " + p.toLocaleString();
  }

  function handleViewNumber() {
    if (!chatStarted) { setChatOpen(true); return; }
    setNumberRevealed(true);
  }

  return (
    <div className="min-h-dvh flex flex-col" style={{ background: "var(--bg)" }}>
      <Navbar />

      <main className="flex-1 pb-32 md:pb-8">
        <div className="max-w-4xl mx-auto">
          {/* Back nav */}
          <div className="px-4 py-3 flex items-center gap-2">
            <Link href="/" className="flex items-center gap-1.5 text-sm transition-colors hover:text-[var(--brand-green)]" style={{ color: "var(--text-secondary)" }}>
              <ArrowLeft size={16} strokeWidth={2} />
              Back
            </Link>
            <span style={{ color: "var(--text-muted)" }}>/</span>
            <span className="text-sm capitalize" style={{ color: "var(--text-muted)" }}>{ad.category}</span>
          </div>

          <div className="md:grid md:grid-cols-5 md:gap-6 md:px-4">
            {/* Left: photos + details */}
            <div className="md:col-span-3">
              {/* Gallery */}
              <div className="relative bg-[#f0f0ed] md:rounded-xl overflow-hidden" style={{ aspectRatio: "4/3" }}>
                {ad.images[0] ? (
                  <img src={ad.images[currentImg] || ad.images[0]} alt={ad.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center" style={{ background: "#F5F5F3" }}>
                    <ImageOff size={40} strokeWidth={1.5} style={{ color: "#BABAB5" }} />
                  </div>
                )}
                {ad.images.length > 1 && (
                  <>
                    <button
                      onClick={() => setCurrentImg(i => Math.max(0, i - 1))}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 rounded-full flex items-center justify-center shadow"
                    >
                      <ChevronLeft size={18} strokeWidth={2} />
                    </button>
                    <button
                      onClick={() => setCurrentImg(i => Math.min(ad.images.length - 1, i + 1))}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 rounded-full flex items-center justify-center shadow"
                    >
                      <ChevronRight size={18} strokeWidth={2} />
                    </button>
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                      {ad.images.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setCurrentImg(i)}
                          className="rounded-full transition-all"
                          style={{ width: i === currentImg ? 20 : 6, height: 6, background: i === currentImg ? "var(--brand-green)" : "rgba(255,255,255,0.7)" }}
                        />
                      ))}
                    </div>
                  </>
                )}
                <div className="absolute top-3 right-3 flex gap-2">
                  <button className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow">
                    <Share2 size={15} strokeWidth={2} />
                  </button>
                </div>
              </div>

              {/* Details card */}
              <div className="px-4 md:px-0 mt-4">
                <div className="card p-4">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        {ad.verified && <BadgeVerified type="verified" />}
                        {ad.owned && <BadgeVerified type="owned" />}
                      </div>
                      <h1 className="text-xl font-bold leading-tight" style={{ color: "var(--text-primary)" }}>{ad.title}</h1>
                    </div>
                    <p className="text-2xl font-black whitespace-nowrap" style={{ color: "var(--text-primary)", letterSpacing: "-0.5px" }}>
                      {formatPrice(ad.price)}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 text-xs mb-4" style={{ color: "var(--text-muted)" }}>
                    <span className="flex items-center gap-1">
                      <MapPin size={12} strokeWidth={2} />
                      {ad.area}, {ad.city}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={12} strokeWidth={2} />
                      {ad.postedAt}
                    </span>
                  </div>

                  <div className="border-t pt-4" style={{ borderColor: "var(--border)" }}>
                    <p className="text-sm font-semibold mb-2" style={{ color: "var(--text-primary)" }}>Description</p>
                    <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                      Item is in the condition shown — all photos taken live via Sellz.pk camera. No hidden defects. Price is final. Serious buyers only. Available for inspection before purchase. Meet at a public location in {ad.city}. Contact on WhatsApp to confirm availability before visiting.
                    </p>
                  </div>

                  <button
                    onClick={() => setReported(!reported)}
                    className="mt-4 flex items-center gap-1.5 text-xs transition-colors"
                    style={{ color: reported ? "var(--danger)" : "var(--text-muted)" }}
                  >
                    <Flag size={12} strokeWidth={2} />
                    {reported ? "Reported" : "Report this ad"}
                  </button>
                </div>
              </div>
            </div>

            {/* Right: seller + CTA */}
            <div className="md:col-span-2 px-4 md:px-0 mt-4 md:mt-0">
              {/* CTA buttons — desktop */}
              <div className="hidden md:flex flex-col gap-2 mb-4">
                <button
                  onClick={() => setChatOpen(true)}
                  className="btn-primary w-full justify-center py-3"
                >
                  <MessageCircle size={18} strokeWidth={2} />
                  Send Message
                </button>

                {hasWhatsapp ? (
                  numberRevealed && ad.whatsapp ? (
                    <a
                      href={`https://wa.me/92${ad.whatsapp.replace(/^0/, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border font-medium text-sm transition-colors"
                      style={{ borderColor: "var(--brand-green)", color: "var(--brand-green)", background: "var(--brand-green-light)" }}
                    >
                      <WaIcon size={16} color="var(--brand-green)" />
                      {formatWaDisplay(ad.whatsapp)}
                      <span className="text-xs opacity-70">· Open in WhatsApp →</span>
                    </a>
                  ) : (
                    <button
                      onClick={handleViewNumber}
                      className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border font-medium text-sm transition-colors"
                      style={
                        chatStarted
                          ? { borderColor: "var(--brand-green)", color: "var(--brand-green)" }
                          : { borderColor: "var(--border)", color: "var(--text-muted)", cursor: "not-allowed" }
                      }
                      title={chatStarted ? undefined : "Start a chat first"}
                    >
                      {chatStarted ? <Phone size={16} strokeWidth={2} /> : <Lock size={16} strokeWidth={2} />}
                      View Number
                      {!chatStarted && (
                        <span className="text-[10px] opacity-60 ml-1">— chat first</span>
                      )}
                    </button>
                  )
                ) : null}
              </div>

              {/* Seller card */}
              <div className="card p-4 mb-4">
                <p className="text-sm font-semibold mb-3" style={{ color: "var(--text-primary)" }}>Seller</p>
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-11 h-11 rounded-full flex items-center justify-center text-base font-black text-white"
                    style={{ background: "var(--brand-green)" }}
                  >
                    A
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <p className="text-sm font-semibold truncate" style={{ color: "var(--text-primary)" }}>M. Usman Tariq</p>
                      <BadgeVerified type="verified" />
                      {hasWhatsapp && (
                        <span
                          className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{ background: "rgba(37,211,102,0.12)" }}
                          title="Has WhatsApp"
                        >
                          <WaIcon size={12} color="#25D366" />
                        </span>
                      )}
                    </div>
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>{ad.city} · Member since Mar 2024</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 mb-3">
                  {[1,2,3,4,5].map(i => (
                    <svg key={i} width="14" height="14" viewBox="0 0 14 14" fill={i <= 4 ? "#f5a623" : "#E8E8E4"}>
                      <path d="M7 1l1.6 3.3 3.6.5-2.6 2.5.6 3.6L7 9.3 3.8 10.9l.6-3.6L2 4.8l3.6-.5z"/>
                    </svg>
                  ))}
                  <span className="text-xs ml-1" style={{ color: "var(--text-muted)" }}>4.0 (12 reviews)</span>
                </div>
                <Link
                  href="/profile/seller-1"
                  className="block text-center text-sm font-medium hover:underline"
                  style={{ color: "var(--brand-green)" }}
                >
                  View all listings →
                </Link>
              </div>

              {/* Safety tips */}
              <div className="card p-4">
                <p className="text-xs font-semibold mb-2" style={{ color: "var(--text-primary)" }}>Safety Tips</p>
                <ul className="space-y-1.5">
                  {["Meet in a public place", "Never send money in advance", "Inspect the item before paying", "Only deal with Verified sellers", "Report suspicious listings"].map(tip => (
                    <li key={tip} className="flex items-center gap-2 text-xs" style={{ color: "var(--text-muted)" }}>
                      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "var(--brand-green)" }} />
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Similar ads */}
          {similar.length > 0 && (
            <div className="px-4 mt-8">
              <h2 className="text-base font-semibold mb-4" style={{ color: "var(--text-primary)" }}>Similar Listings</h2>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                {similar.map(a => <AdCard key={a.id} ad={a} />)}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Mobile sticky bottom bar */}
      <div className="fixed bottom-16 left-0 right-0 px-4 pb-2 md:hidden z-20 flex gap-2">
        <button
          onClick={() => setChatOpen(true)}
          className="btn-primary justify-center py-3"
          style={{ flex: "0 0 60%" }}
        >
          <MessageCircle size={18} strokeWidth={2} />
          Send Message
        </button>

        {hasWhatsapp ? (
          numberRevealed && ad.whatsapp ? (
            <a
              href={`https://wa.me/92${ad.whatsapp.replace(/^0/, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 rounded-xl border font-medium text-sm transition-colors"
              style={{ flex: "0 0 38%", borderColor: "var(--brand-green)", color: "var(--brand-green)", background: "var(--brand-green-light)" }}
            >
              <WaIcon size={16} color="var(--brand-green)" />
              WhatsApp
            </a>
          ) : (
            <button
              onClick={handleViewNumber}
              className="flex items-center justify-center gap-1.5 rounded-xl border font-medium text-sm transition-colors"
              style={
                chatStarted
                  ? { flex: "0 0 38%", borderColor: "var(--brand-green)", color: "var(--brand-green)" }
                  : { flex: "0 0 38%", borderColor: "var(--border)", color: "var(--text-muted)" }
              }
              title={chatStarted ? undefined : "Start a chat first"}
            >
              {chatStarted ? <Phone size={15} strokeWidth={2} /> : <Lock size={15} strokeWidth={2} />}
              View No.
            </button>
          )
        ) : (
          <div style={{ flex: "0 0 38%" }} />
        )}
      </div>

      <ChatPanel
        isOpen={chatOpen}
        onClose={() => setChatOpen(false)}
        sellerName="M. Usman Tariq"
        sellerCity={ad.city}
        sellerHasWhatsapp={hasWhatsapp}
        waNumber={ad.whatsapp}
        numberRevealed={numberRevealed}
        onChatStarted={() => setChatStarted(true)}
        onNumberRevealed={() => setNumberRevealed(true)}
      />

      <BottomNav />
      <Footer />
      <FooterMobile />
    </div>
  );
}
