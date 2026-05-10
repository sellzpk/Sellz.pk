"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { BottomNav } from "@/components/BottomNav";
import { Footer, FooterMobile } from "@/components/Footer";
import { ArrowLeft, CheckCircle, MapPin, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { CITIES } from "@/lib/locations";

export default function LocationChangePage() {
  const router = useRouter();
  const [currentCity, setCurrentCity] = useState("");
  const [newCity, setNewCity] = useState("");
  const [reason, setReason] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/auth?redirect=/support/location-change");
        return;
      }

      setUserEmail(user.email ?? "");

      const { data: profile } = await supabase
        .from("users")
        .select("city")
        .eq("id", user.id)
        .single();

      if (profile?.city) setCurrentCity(profile.city);
      setAuthChecked(true);
    }

    checkAuth();
  }, [router]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!newCity || !reason) {
      setError("Please fill in all fields.");
      return;
    }
    if (newCity === currentCity) {
      setError("New city must be different from your current city.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const supabase = createClient();

      const { error: dbError } = await supabase.from("support_tickets").insert({
        type: "location-change",
        email: userEmail,
        subject: `Location change: ${currentCity} → ${newCity}`,
        message: reason.trim(),
        metadata: { current_city: currentCity, new_city: newCity },
        user_id: null,
      });

      if (dbError) throw dbError;
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please email hello@sellz.pk");
    } finally {
      setLoading(false);
    }
  }

  if (!authChecked) {
    return (
      <div className="min-h-dvh flex items-center justify-center" style={{ background: "var(--bg)" }}>
        <Loader2 size={24} strokeWidth={2} className="animate-spin" style={{ color: "var(--brand-green)" }} />
      </div>
    );
  }

  return (
    <div className="min-h-dvh flex flex-col" style={{ background: "var(--bg)" }}>
      <Navbar />
      <main className="flex-1 pb-24 md:pb-8">
        <div className="max-w-lg mx-auto px-4 py-8">
          <Link href="/" className="flex items-center gap-1.5 text-sm mb-6" style={{ color: "var(--text-muted)" }}>
            <ArrowLeft size={15} strokeWidth={2} /> Back
          </Link>

          <h1 className="text-3xl font-black mb-2" style={{ color: "var(--text-primary)" }}>Location Change</h1>
          <p className="text-base mb-8" style={{ color: "var(--text-secondary)" }}>
            City changes require manual verification. We'll update your location within 48 hours.
          </p>

          {submitted ? (
            <div className="card p-8 text-center">
              <CheckCircle size={48} strokeWidth={1.5} className="mx-auto mb-4" style={{ color: "var(--brand-green)" }} />
              <h2 className="text-xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>
                Request submitted
              </h2>
              <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>
                We'll update your location within 48 hours after verification.
              </p>
              <Link href="/profile" className="btn-primary justify-center inline-flex px-6">
                Back to Profile
              </Link>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ color: "var(--text-primary)" }}>
                  Current city
                </label>
                <div
                  className="w-full rounded-xl border px-4 py-3 flex items-center gap-2"
                  style={{
                    borderColor: "var(--border)",
                    background: "#F7F7F5",
                    color: "var(--text-muted)",
                  }}
                >
                  <MapPin size={15} strokeWidth={2} style={{ flexShrink: 0 }} />
                  <span className="text-sm">{currentCity || "Not set"}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ color: "var(--text-primary)" }}>
                  New city requested <span style={{ color: "#e53e3e" }}>*</span>
                </label>
                <select
                  value={newCity}
                  onChange={(e) => { setNewCity(e.target.value); setError(""); }}
                  className="w-full rounded-xl border px-4 py-3 text-sm outline-none transition-colors"
                  style={{
                    borderColor: "var(--border)",
                    background: "var(--bg)",
                    color: newCity ? "var(--text-primary)" : "var(--text-muted)",
                  }}
                  required
                >
                  <option value="" disabled>Select new city</option>
                  {CITIES.filter((c) => c !== currentCity).map((city) => (
                    <option key={city} value={city} style={{ color: "var(--text-primary)" }}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ color: "var(--text-primary)" }}>
                  Reason for change <span style={{ color: "#e53e3e" }}>*</span>
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => { setReason(e.target.value); setError(""); }}
                  placeholder="e.g. I have moved to Islamabad permanently"
                  rows={3}
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
                {loading ? "Submitting…" : "Submit Request"}
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
