"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phone: "", password: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) router.replace("/");
    });
  }, []);

  async function handleGoogle() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) { setError(error.message); setLoading(false); }
  }

  async function handleSignup() {
    setError("");
    if (!form.firstName.trim()) return setError("First name is required");
    if (!form.lastName.trim()) return setError("Last name is required");
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return setError("Enter a valid email address");
    if (!form.phone || form.phone.length !== 10) return setError("Enter valid 10-digit phone number (without 0)");
    if (form.password.length < 8) return setError("Password must be at least 8 characters");
    if (form.password !== form.confirmPassword) return setError("Passwords do not match");

    setLoading(true);
    const fullName = `${form.firstName.trim()} ${form.lastName.trim()}`;

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: { full_name: fullName, phone: `+92${form.phone}` },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (signUpError) { setError(signUpError.message); setLoading(false); return; }

    if (data.user) {
      await supabase.from("users").upsert({
        id: data.user.id,
        full_name: fullName,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        email: form.email as any,
        phone: `+92${form.phone}`,
      });
    }

    setLoading(false);
    router.push(`/auth/verify-email?email=${encodeURIComponent(form.email)}`);
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

      <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-black mb-1" style={{ color: "var(--text-primary)" }}>Create account</h1>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>Join Sellz.pk — Pakistan&apos;s verified marketplace</p>
        </div>

        <button
          onClick={handleGoogle}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border font-medium text-sm mb-5 transition-colors hover:bg-[var(--bg)] disabled:opacity-60"
          style={{ borderColor: "var(--border)", color: "var(--text-primary)" }}
        >
          {loading ? <Loader2 size={18} className="animate-spin" /> : <GoogleIcon />}
          Continue with Google
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
          <span className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>or sign up with email</span>
          <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
        </div>

        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold block mb-1.5" style={{ color: "var(--text-primary)" }}>First Name *</label>
              <input
                type="text"
                placeholder="Ali"
                value={form.firstName}
                onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))}
                className="input-base"
                autoComplete="given-name"
              />
            </div>
            <div>
              <label className="text-xs font-semibold block mb-1.5" style={{ color: "var(--text-primary)" }}>Last Name *</label>
              <input
                type="text"
                placeholder="Khan"
                value={form.lastName}
                onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))}
                className="input-base"
                autoComplete="family-name"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold block mb-1.5" style={{ color: "var(--text-primary)" }}>Email *</label>
            <input
              type="email"
              placeholder="ali@example.com"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              className="input-base"
              autoComplete="email"
            />
          </div>

          <div>
            <label className="text-xs font-semibold block mb-1.5" style={{ color: "var(--text-primary)" }}>Phone Number *</label>
            <div className="flex rounded-xl border border-[var(--border)] overflow-hidden focus-within:border-[var(--brand-green)] transition-colors" style={{ background: "white" }}>
              <span className="px-3 flex items-center text-sm border-r border-[var(--border)] flex-shrink-0 select-none" style={{ background: "var(--bg)", color: "var(--text-muted)" }}>+92</span>
              <input
                type="tel"
                placeholder="3001234567"
                value={form.phone}
                onChange={e => setForm(f => ({ ...f, phone: e.target.value.replace(/\D/g, "").slice(0, 10) }))}
                className="flex-1 px-3 py-3 text-sm outline-none bg-transparent"
                inputMode="numeric"
                maxLength={10}
              />
            </div>
            <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>Without leading 0 — e.g. 3001234567</p>
          </div>

          <div>
            <label className="text-xs font-semibold block mb-1.5" style={{ color: "var(--text-primary)" }}>Password *</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Minimum 8 characters"
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                className="input-base pr-10"
                autoComplete="new-password"
              />
              <button type="button" onClick={() => setShowPassword(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold block mb-1.5" style={{ color: "var(--text-primary)" }}>Confirm Password *</label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                placeholder="Repeat password"
                value={form.confirmPassword}
                onChange={e => setForm(f => ({ ...f, confirmPassword: e.target.value }))}
                className="input-base pr-10"
                autoComplete="new-password"
                onKeyDown={e => e.key === "Enter" && handleSignup()}
              />
              <button type="button" onClick={() => setShowConfirm(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">
                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="px-3 py-2.5 rounded-lg text-xs font-medium" style={{ background: "#FFF0F0", color: "var(--danger)", border: "1px solid #FECACA" }}>
              {error}
            </div>
          )}

          <button
            onClick={handleSignup}
            disabled={loading}
            className="btn-primary w-full justify-center py-3 disabled:opacity-40"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : null}
            Create Account
          </button>
        </div>

        <p className="mt-5 text-sm text-center" style={{ color: "var(--text-muted)" }}>
          Already have an account?{" "}
          <Link href="/auth/login" className="font-semibold" style={{ color: "var(--brand-green)" }}>Sign in</Link>
        </p>

        <p className="mt-4 text-xs text-center leading-relaxed" style={{ color: "var(--text-muted)" }}>
          By creating an account you agree to our{" "}
          <Link href="/terms" style={{ color: "var(--brand-green)" }}>Terms</Link> and{" "}
          <Link href="/privacy" style={{ color: "var(--brand-green)" }}>Privacy Policy</Link>.
        </p>
      </div>
    </div>
  );
}
