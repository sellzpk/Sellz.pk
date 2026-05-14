"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resendSuccess, setResendSuccess] = useState(false);
  const supabase = createClient();

  async function handleResend() {
    if (resendCooldown > 0 || !email) return;
    await supabase.auth.resend({ type: "signup", email });
    setResendSuccess(true);
    setResendCooldown(60);
    const interval = setInterval(() => {
      setResendCooldown(prev => {
        if (prev <= 1) { clearInterval(interval); return 0; }
        return prev - 1;
      });
    }, 1000);
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

      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center max-w-sm mx-auto w-full">
        <div className="text-6xl mb-5">📧</div>

        <h2 className="text-xl font-black mb-2" style={{ color: "var(--text-primary)" }}>Check your email</h2>
        <p className="text-sm mb-1" style={{ color: "var(--text-muted)" }}>We sent a confirmation link to:</p>
        <p className="text-sm font-bold mb-6" style={{ color: "var(--text-primary)" }}>{email || "your email"}</p>

        <div className="card p-4 w-full text-left mb-6">
          <p className="text-xs font-bold mb-2" style={{ color: "var(--text-primary)" }}>Next steps:</p>
          <ol className="space-y-1.5 list-decimal list-inside">
            {["Open your email inbox", "Click the confirmation link from Sellz.pk", "You'll be redirected to complete your profile"].map(s => (
              <li key={s} className="text-xs" style={{ color: "var(--text-secondary)" }}>{s}</li>
            ))}
          </ol>
        </div>

        <p className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>Didn&apos;t receive the email?</p>

        <button
          onClick={handleResend}
          disabled={resendCooldown > 0}
          className="px-5 py-2.5 rounded-xl border text-sm font-medium transition-colors disabled:opacity-50"
          style={{ borderColor: resendCooldown > 0 ? "var(--border)" : "var(--brand-green)", color: resendCooldown > 0 ? "var(--text-muted)" : "var(--brand-green)" }}
        >
          {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend Email"}
        </button>

        {resendSuccess && (
          <p className="text-xs mt-2" style={{ color: "var(--brand-green)" }}>✓ Email sent!</p>
        )}

        <p className="text-xs mt-6" style={{ color: "var(--text-muted)" }}>
          Wrong email?{" "}
          <Link href="/auth/signup" style={{ color: "var(--brand-green)" }}>Start over</Link>
        </p>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense>
      <VerifyEmailContent />
    </Suspense>
  );
}
