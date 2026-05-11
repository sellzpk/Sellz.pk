"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, CheckCircle, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);
  const [done, setDone] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setReady(true);
    });
    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) { setError("Passwords don't match"); return; }
    if (password.length < 8) { setError("Minimum 8 characters"); return; }
    setError("");
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
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
        <h2 className="text-xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>Password updated!</h2>
        <p className="text-sm mb-8 max-w-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          Your password has been changed. You can now sign in with your new password.
        </p>
        <button onClick={() => router.push("/")} className="btn-primary">Go to Home</button>
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
      </header>

      <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full px-4">
        <div className="mb-8">
          <h1 className="text-2xl font-black mb-1" style={{ color: "var(--text-primary)" }}>New password</h1>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            {ready ? "Enter your new password below" : "Validating your reset link…"}
          </p>
        </div>

        {!ready ? (
          <div className="flex justify-center py-8">
            <Loader2 size={28} className="animate-spin" style={{ color: "var(--brand-green)" }} />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-semibold block mb-1.5" style={{ color: "var(--text-primary)" }}>New Password</label>
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

            <div>
              <label className="text-sm font-semibold block mb-1.5" style={{ color: "var(--text-primary)" }}>Confirm Password</label>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Repeat your password"
                value={confirm}
                onChange={e => { setConfirm(e.target.value); setError(""); }}
                className="input-base"
                required
                autoComplete="new-password"
              />
            </div>

            {error && (
              <p className="text-xs font-medium" style={{ color: "var(--danger)" }}>{error}</p>
            )}

            <button
              type="submit"
              disabled={!password || !confirm || loading}
              className="btn-primary w-full justify-center py-3 disabled:opacity-40"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : null}
              Update Password
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
