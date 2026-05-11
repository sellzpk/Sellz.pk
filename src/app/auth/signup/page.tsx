"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, CheckCircle, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const supabase = createClient();

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 8) { setError("Password must be at least 8 characters"); return; }
    setError("");
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    setLoading(false);
    if (error) { setError(error.message); return; }
    setDone(true);
  }

  if (done) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center px-6 text-center" style={{ background: "var(--bg)" }}>
        <div className="w-20 h-20 rounded-full bg-[var(--brand-green-light)] flex items-center justify-center mb-6">
          <CheckCircle size={36} strokeWidth={2} style={{ color: "var(--brand-green)" }} />
        </div>
        <h2 className="text-xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>Check your email</h2>
        <p className="text-sm mb-8 max-w-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          We sent a confirmation link to <strong>{email}</strong>. Click it to activate your account and complete setup.
        </p>
        <Link href="/auth/login" className="btn-primary">Back to Login</Link>
      </div>
    );
  }

  return (
    <div className="min-h-dvh flex flex-col" style={{ background: "var(--bg)" }}>
      <header className="px-4 h-14 flex items-center bg-white border-b border-[var(--border)]">
        <Link href="/" className="flex items-center gap-1.5">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "var(--brand-green)" }}>
            <span className="text-white font-black text-xs">S</span>
          </div>
          <span className="font-black text-base tracking-tight">
            sellz<span style={{ color: "var(--brand-green)" }}>.pk</span>
          </span>
        </Link>
        <Link href="/auth/login" className="ml-auto text-sm font-medium" style={{ color: "var(--brand-green)" }}>
          Sign in
        </Link>
      </header>

      <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full px-4">
        <div className="mb-8">
          <h1 className="text-2xl font-black mb-1" style={{ color: "var(--text-primary)" }}>Create account</h1>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>Join Sellz.pk — Pakistan&apos;s verified marketplace</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="text-sm font-semibold block mb-1.5" style={{ color: "var(--text-primary)" }}>Full Name</label>
            <input
              type="text"
              placeholder="Muhammad Ali"
              value={name}
              onChange={e => { setName(e.target.value); setError(""); }}
              className="input-base"
              required
              autoComplete="name"
            />
          </div>

          <div>
            <label className="text-sm font-semibold block mb-1.5" style={{ color: "var(--text-primary)" }}>Email</label>
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

          <div>
            <label className="text-sm font-semibold block mb-1.5" style={{ color: "var(--text-primary)" }}>Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Minimum 8 characters"
                value={password}
                onChange={e => { setPassword(e.target.value); setError(""); }}
                className="input-base pr-10"
                required
                minLength={8}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-xs font-medium" style={{ color: "var(--danger)" }}>{error}</p>
          )}

          <button
            type="submit"
            disabled={!name || !email || !password || loading}
            className="btn-primary w-full justify-center py-3 disabled:opacity-40"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : null}
            Create Account
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Already have an account?{" "}
            <Link href="/auth/login" className="font-semibold" style={{ color: "var(--brand-green)" }}>
              Sign in
            </Link>
          </p>
        </div>

        <p className="mt-6 text-xs text-center leading-relaxed" style={{ color: "var(--text-muted)" }}>
          By creating an account, you agree to our{" "}
          <Link href="/terms" style={{ color: "var(--brand-green)" }}>Terms</Link>
          {" "}and{" "}
          <Link href="/privacy" style={{ color: "var(--brand-green)" }}>Privacy Policy</Link>.
        </p>
      </div>
    </div>
  );
}
