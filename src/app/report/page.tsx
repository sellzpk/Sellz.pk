"use client";

import { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { BottomNav } from "@/components/BottomNav";
import { Footer, FooterMobile } from "@/components/Footer";
import { ArrowLeft, CheckCircle, AlertTriangle, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const REASONS = [
  "Fake listing",
  "Scam attempt",
  "Inappropriate content",
  "Counterfeit item",
  "Wrong price / bait and switch",
  "Other",
];

export default function ReportPage() {
  const [form, setForm] = useState({
    email: "",
    ad_link: "",
    reason: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError("");
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.email || !form.reason || !form.description) {
      setError("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const supabase = createClient();
      const { error: dbError } = await supabase.from("support_tickets").insert({
        type: "scam-report",
        email: form.email.trim(),
        subject: form.reason,
        message: form.description.trim(),
        metadata: form.ad_link.trim() ? { ad_link: form.ad_link.trim() } : null,
        user_id: null,
      });

      if (dbError) throw dbError;
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again or email hello@sellz.pk");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-dvh flex flex-col" style={{ background: "var(--bg)" }}>
      <Navbar />
      <main className="flex-1 pb-24 md:pb-8">
        <div className="max-w-lg mx-auto px-4 py-8">
          <Link href="/" className="flex items-center gap-1.5 text-sm mb-6" style={{ color: "var(--text-muted)" }}>
            <ArrowLeft size={15} strokeWidth={2} /> Back
          </Link>

          <h1 className="text-3xl font-black mb-2" style={{ color: "var(--text-primary)" }}>Report a Scam</h1>
          <p className="text-base mb-8" style={{ color: "var(--text-secondary)" }}>
            Help us keep Sellz.pk safe. We review every report within 24 hours.
          </p>

          {submitted ? (
            <div className="card p-8 text-center">
              <CheckCircle size={48} strokeWidth={1.5} className="mx-auto mb-4" style={{ color: "var(--brand-green)" }} />
              <h2 className="text-xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>
                Report submitted
              </h2>
              <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>
                Thank you. We'll review this within 24 hours.
              </p>
              <Link href="/" className="btn-primary justify-center inline-flex px-6">
                Back to Home
              </Link>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              <div className="card p-4 flex items-start gap-3" style={{ background: "#fff7ed", borderColor: "#fed7aa" }}>
                <AlertTriangle size={16} strokeWidth={2} className="flex-shrink-0 mt-0.5" style={{ color: "#d97706" }} />
                <p className="text-xs leading-relaxed" style={{ color: "#92400e" }}>
                  If you are in immediate danger, call <strong>15</strong> (Police) or Pakistan Cyber Crime Wing: <strong>0800-02345</strong>
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ color: "var(--text-primary)" }}>
                  Your email <span style={{ color: "#e53e3e" }}>*</span>
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  placeholder="your@email.com"
                  className="w-full rounded-xl border px-4 py-3 text-sm outline-none transition-colors"
                  style={{
                    borderColor: "var(--border)",
                    background: "var(--bg)",
                    color: "var(--text-primary)",
                  }}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ color: "var(--text-primary)" }}>
                  Ad link or ID
                  <span className="font-normal ml-1" style={{ color: "var(--text-muted)" }}>(optional)</span>
                </label>
                <input
                  type="text"
                  value={form.ad_link}
                  onChange={(e) => update("ad_link", e.target.value)}
                  placeholder="e.g. sellz.pk/ads/abc123 or just the ID"
                  className="w-full rounded-xl border px-4 py-3 text-sm outline-none transition-colors"
                  style={{
                    borderColor: "var(--border)",
                    background: "var(--bg)",
                    color: "var(--text-primary)",
                  }}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ color: "var(--text-primary)" }}>
                  Reason <span style={{ color: "#e53e3e" }}>*</span>
                </label>
                <select
                  value={form.reason}
                  onChange={(e) => update("reason", e.target.value)}
                  className="w-full rounded-xl border px-4 py-3 text-sm outline-none transition-colors"
                  style={{
                    borderColor: "var(--border)",
                    background: "var(--bg)",
                    color: form.reason ? "var(--text-primary)" : "var(--text-muted)",
                  }}
                  required
                >
                  <option value="" disabled>Select a reason</option>
                  {REASONS.map((r) => (
                    <option key={r} value={r} style={{ color: "var(--text-primary)" }}>{r}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ color: "var(--text-primary)" }}>
                  Description <span style={{ color: "#e53e3e" }}>*</span>
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => update("description", e.target.value)}
                  placeholder="Describe what happened in as much detail as possible..."
                  rows={4}
                  className="w-full rounded-xl border px-4 py-3 text-sm outline-none transition-colors resize-none"
                  style={{
                    borderColor: "var(--border)",
                    background: "var(--bg)",
                    color: "var(--text-primary)",
                  }}
                  required
                />
              </div>

              {error && (
                <p className="text-sm" style={{ color: "#e53e3e" }}>{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full justify-center flex items-center gap-2"
              >
                {loading && <Loader2 size={16} strokeWidth={2} className="animate-spin" />}
                {loading ? "Submitting…" : "Submit Report"}
              </button>
            </form>
          )}
        </div>
      </main>
      <BottomNav />
      <Footer />
      <FooterMobile />
    </div>
  );
}
