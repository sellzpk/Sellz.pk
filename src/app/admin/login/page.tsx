"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, Shield } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (res.ok) {
      sessionStorage.setItem("sellz_admin_auth", "true");
      router.push("/admin");
      router.refresh();
    } else {
      setError("Invalid username or password");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-dvh flex items-center justify-center bg-[#1a1a1a] px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3" style={{ background: "var(--brand-green)" }}>
            <Shield size={22} strokeWidth={2} className="text-white" />
          </div>
          <h1 className="text-xl font-bold text-white">sellz.pk</h1>
          <p className="text-sm text-white/50 mt-0.5">Admin Panel</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow-2xl">
          <h2 className="text-base font-bold text-[var(--text-primary)] mb-5">Sign in</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5">Username</label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Enter username"
                required
                autoComplete="username"
                className="w-full rounded-xl px-4 py-3 text-sm border border-[var(--border)] outline-none focus:border-[var(--brand-green)] transition-colors"
                style={{ background: "var(--bg)" }}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter password"
                  required
                  autoComplete="current-password"
                  className="w-full rounded-xl px-4 py-3 pr-11 text-sm border border-[var(--border)] outline-none focus:border-[var(--brand-green)] transition-colors"
                  style={{ background: "var(--bg)" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                >
                  {showPassword ? <EyeOff size={16} strokeWidth={2} /> : <Eye size={16} strokeWidth={2} />}
                </button>
              </div>
            </div>
          </div>

          {error && (
            <p className="mt-3 text-xs font-medium text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || !username || !password}
            className="mt-5 w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white transition-opacity disabled:opacity-50"
            style={{ background: "var(--brand-green)" }}
          >
            {loading ? <Loader2 size={16} strokeWidth={2} className="animate-spin" /> : null}
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
