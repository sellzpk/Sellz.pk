"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/auth/reset-password`,
    });
    setLoading(false);
    if (error) { setError(error.message); return; }
    setSent(true);
  }

  if (sent) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center px-6 text-center" style={{ background: "var(--bg)" }}>
        <div className="w-20 h-20 rounded-full bg-[var(--brand-green-light)] flex items-center justify-center mb-6">
          <CheckCircle size={36} strokeWidth={2} style={{ color: "var(--brand-green)" }} />
        </div>
        <h2 className="text-xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>Email sent!</h2>
        <p className="text-sm mb-8 max-w-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          Check <strong>{email}</strong> for a reset link. It expires in 1 hour.
        </p>
        <Link href="/auth/login" className="btn-primary">Back to Login</Link>
      </div>
    );
  }

  return (
    <div className="min-h-dvh flex flex-col" style={{ background: "var(--bg)" }}>
      <header className="px-4 h-14 flex items-center bg-white border-b border-[var(--border)]">
        <Link href="/auth/login" className="flex items-center gap-2 text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
          <ArrowLeft size={18} strokeWidth={2} />
          Back to Login
        </Link>
        <Link href="/" className="ml-auto flex items-center gap-1.5">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "var(--brand-green)" }}>
            <span className="text-white font-black text-xs">S</span>
          </div>
        </Link>
      </header>

      <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full px-4">
        <div className="mb-8">
          <h1 className="text-2xl font-black mb-1" style={{ color: "var(--text-primary)" }}>Reset password</h1>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>Enter your email and we&apos;ll send a reset link</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-semibold block mb-1.5" style={{ color: "var(--text-primary)" }}>Email address</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={e => { setEmail(e.target.value); setError(""); }}
              className="input-base"
              required
              autoComplete="email"
            />
          </div>

          {error && (
            <p className="text-xs font-medium" style={{ color: "var(--danger)" }}>{error}</p>
          )}

          <button
            type="submit"
            disabled={!email || loading}
            className="btn-primary w-full justify-center py-3 disabled:opacity-40"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : null}
            Send Reset Link
          </button>
        </form>
      </div>
    </div>
  );
}
