"use client";

import { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { BottomNav } from "@/components/BottomNav";
import { Footer, FooterMobile } from "@/components/Footer";
import { ArrowLeft, CheckCircle, Mail, Clock, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
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
    if (!form.name || !form.email || !form.subject || !form.message) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const supabase = createClient();
      const { error: dbError } = await supabase.from("support_tickets").insert({
        type: "contact",
        name: form.name.trim(),
        email: form.email.trim(),
        subject: form.subject.trim(),
        message: form.message.trim(),
        user_id: null,
      });

      if (dbError) throw dbError;
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please email us directly at hello@sellz.pk");
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

          <h1 className="text-3xl font-black mb-2" style={{ color: "var(--text-primary)" }}>Contact Us</h1>
          <p className="text-base mb-6" style={{ color: "var(--text-secondary)" }}>
            We're here to help. Send us a message and we'll get back to you.
          </p>

          <div className="grid grid-cols-2 gap-3 mb-8">
            <div className="card p-4 flex items-center gap-3">
              <Mail size={18} strokeWidth={2} style={{ color: "var(--brand-green)", flexShrink: 0 }} />
              <div>
                <p className="text-xs font-semibold mb-0.5" style={{ color: "var(--text-primary)" }}>Email</p>
                <a href="mailto:hello@sellz.pk" className="text-xs" style={{ color: "var(--text-muted)" }}>
                  hello@sellz.pk
                </a>
              </div>
            </div>
            <div className="card p-4 flex items-center gap-3">
              <Clock size={18} strokeWidth={2} style={{ color: "var(--brand-green)", flexShrink: 0 }} />
              <div>
                <p className="text-xs font-semibold mb-0.5" style={{ color: "var(--text-primary)" }}>Response time</p>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>Within 24 hours</p>
              </div>
            </div>
          </div>

          {submitted ? (
            <div className="card p-8 text-center">
              <CheckCircle size={48} strokeWidth={1.5} className="mx-auto mb-4" style={{ color: "var(--brand-green)" }} />
              <h2 className="text-xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>
                Message sent
              </h2>
              <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>
                We'll get back to you within 24 hours.
              </p>
              <Link href="/" className="btn-primary justify-center inline-flex px-6">
                Back to Home
              </Link>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ color: "var(--text-primary)" }}>
                  Your name
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  placeholder="e.g. Ahmed Khan"
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
                  Email address
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
                  Subject
                </label>
                <input
                  type="text"
                  value={form.subject}
                  onChange={(e) => update("subject", e.target.value)}
                  placeholder="e.g. My ad was rejected"
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
                  Message
                </label>
                <textarea
                  value={form.message}
                  onChange={(e) => update("message", e.target.value)}
                  placeholder="Tell us how we can help..."
                  rows={5}
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
                {loading ? "Sending…" : "Send Message"}
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
