"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X, Loader2, Phone, Check, ChevronRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
}

export function AuthModal({ isOpen, onClose, title, subtitle }: AuthModalProps) {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  async function handleGoogle() {
    setLoading(true);
    setError("");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) { setError(error.message); setLoading(false); }
  }

  async function sendOtp() {
    setError("");
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({ phone: `+92${phone}` });
    setLoading(false);
    if (error) { setError(error.message); return; }
    setOtpSent(true);
  }

  async function verifyOtp() {
    setError("");
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.verifyOtp({ phone: `+92${phone}`, token: otp, type: "sms" });
    setLoading(false);
    if (error) { setError(error.message); return; }
    onClose();
    router.refresh();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full sm:max-w-sm bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl p-6 pb-8 sm:pb-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[var(--bg)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
        >
          <X size={16} strokeWidth={2} />
        </button>

        <div className="mb-6">
          <h2 className="text-xl font-black" style={{ color: "var(--text-primary)" }}>
            {title ?? <>sellz<span style={{ color: "var(--brand-green)" }}>.pk</span></>}
          </h2>
          <p className="text-sm mt-0.5" style={{ color: "var(--text-muted)" }}>{subtitle ?? "Sign in to your account"}</p>
        </div>

        {/* Google */}
        <button
          onClick={handleGoogle}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border font-medium text-sm mb-4 transition-colors hover:bg-[var(--bg)] disabled:opacity-60"
          style={{ borderColor: "var(--border)", color: "var(--text-primary)" }}
        >
          {loading ? <Loader2 size={18} className="animate-spin" /> : <GoogleIcon />}
          Continue with Google
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>or phone</span>
          <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
        </div>

        <div className="space-y-3">
          <div className="flex">
            <div className="flex items-center px-3 py-2.5 border border-r-0 border-[var(--border)] rounded-l-lg bg-[var(--bg)] text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
              🇵🇰 +92
            </div>
            <input
              type="tel"
              placeholder="3001234567"
              value={phone}
              onChange={e => { setPhone(e.target.value); setError(""); }}
              className="flex-1 px-3 py-2.5 border border-[var(--border)] rounded-r-lg text-sm outline-none focus:border-[var(--brand-green)] transition-colors"
              style={{ background: "var(--bg)" }}
              maxLength={10}
              disabled={otpSent}
            />
          </div>

          {otpSent && (
            <input
              type="number"
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={e => { setOtp(e.target.value); setError(""); }}
              className="w-full px-3 py-2.5 border border-[var(--brand-green)] rounded-lg text-sm text-center font-bold tracking-widest outline-none"
              style={{ background: "var(--bg)" }}
            />
          )}

          {error && <p className="text-xs font-medium text-red-600">{error}</p>}

          {!otpSent ? (
            <button
              onClick={sendOtp}
              disabled={phone.length < 10 || loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white disabled:opacity-40 transition-opacity"
              style={{ background: "var(--brand-green)" }}
            >
              {loading ? <Loader2 size={15} className="animate-spin" /> : <Phone size={15} strokeWidth={2} />}
              Send OTP
            </button>
          ) : (
            <button
              onClick={verifyOtp}
              disabled={otp.length < 6 || loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white disabled:opacity-40 transition-opacity"
              style={{ background: "var(--brand-green)" }}
            >
              {loading ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} strokeWidth={2.5} />}
              Verify & Login
            </button>
          )}
        </div>

        <p className="text-xs text-center mt-4" style={{ color: "var(--text-muted)" }}>
          New to Sellz.pk?{" "}
          <a href="/auth" onClick={onClose} className="font-semibold" style={{ color: "var(--brand-green)" }}>
            Create account →
          </a>
        </p>
      </div>
    </div>
  );
}
