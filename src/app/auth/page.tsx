"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Phone, Camera, Eye, Check, ChevronRight, AlertCircle, MapPin, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { CITIES } from "@/lib/mockData";

const SIGNUP_STEPS = ["Phone", "CNIC Front", "CNIC Back", "Selfie", "City", "Done"];

interface AuthData {
  phone: string;
  otp: string;
  cnicFront: string;
  cnicBack: string;
  selfie: string;
  city: string;
}

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [step, setStep] = useState(0);
  const [data, setData] = useState<AuthData>({
    phone: "", otp: "", cnicFront: "", cnicBack: "", selfie: "", city: "",
  });

  if (mode === "login") {
    return <LoginView onSignup={() => setMode("signup")} />;
  }

  function next() { setStep(s => Math.min(SIGNUP_STEPS.length - 1, s + 1)); }

  if (step === SIGNUP_STEPS.length - 1) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center px-6 text-center" style={{ background: "var(--bg)" }}>
        <div className="w-20 h-20 rounded-full bg-[var(--brand-green-light)] flex items-center justify-center mb-6">
          <Check size={36} strokeWidth={2.5} style={{ color: "var(--brand-green)" }} />
        </div>
        <h2 className="text-xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>You&apos;re verified!</h2>
        <p className="text-sm mb-8 max-w-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          Your account is active in <strong>{data.city}</strong>. You can now post ads and contact sellers.
        </p>
        <button onClick={() => router.push("/")} className="btn-primary">Start Browsing</button>
      </div>
    );
  }

  return (
    <div className="min-h-dvh flex flex-col" style={{ background: "var(--bg)" }}>
      <header className="sticky top-0 z-30 bg-white border-b border-[var(--border)]">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center gap-3">
          {step > 0 ? (
            <button onClick={() => setStep(s => s - 1)} className="p-1.5 -ml-1">
              <ArrowLeft size={20} strokeWidth={2} />
            </button>
          ) : (
            <Link href="/" className="p-1.5 -ml-1">
              <ArrowLeft size={20} strokeWidth={2} />
            </Link>
          )}
          <div className="flex-1">
            <p className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>
              sellz<span style={{ color: "var(--brand-green)" }}>.pk</span>
            </p>
          </div>
          <button onClick={() => setMode("login")} className="text-sm font-medium" style={{ color: "var(--brand-green)" }}>
            Login instead
          </button>
        </div>
        <div className="h-1" style={{ background: "var(--border)" }}>
          <div
            className="h-full transition-all duration-300"
            style={{ width: `${((step + 1) / SIGNUP_STEPS.length) * 100}%`, background: "var(--brand-green)" }}
          />
        </div>
      </header>

      <main className="flex-1">
        <div className="max-w-lg mx-auto px-4 py-8">
          {step === 0 && <StepPhone data={data} setData={setData} onNext={next} />}
          {step === 1 && <StepCNIC side="front" data={data} setData={setData} onNext={next} />}
          {step === 2 && <StepCNIC side="back" data={data} setData={setData} onNext={next} />}
          {step === 3 && <StepSelfie data={data} setData={setData} onNext={next} />}
          {step === 4 && <StepCity data={data} setData={setData} onNext={next} />}
        </div>
      </main>
    </div>
  );
}

function LoginView({ onSignup }: { onSignup: () => void }) {
  const [phone, setPhone] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const supabase = createClient();

  async function handleGoogleLogin() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) { setError(error.message); setLoading(false); }
  }

  async function sendOtp() {
    setError("");
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      phone: `+92${phone}`,
    });
    setLoading(false);
    if (error) { setError(error.message); return; }
    setOtpSent(true);
  }

  async function verifyOtp() {
    setError("");
    setLoading(true);
    const { error } = await supabase.auth.verifyOtp({
      phone: `+92${phone}`,
      token: otp,
      type: "sms",
    });
    setLoading(false);
    if (error) { setError(error.message); return; }
    router.push("/");
    router.refresh();
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
          <h1 className="text-2xl font-black mb-1" style={{ color: "var(--text-primary)" }}>Welcome back</h1>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>Login to your Sellz.pk account</p>
        </div>

        {/* Google OAuth */}
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border font-medium text-sm mb-5 transition-colors hover:bg-[var(--bg)] disabled:opacity-60"
          style={{ borderColor: "var(--border)", color: "var(--text-primary)" }}
        >
          {loading ? <Loader2 size={18} className="animate-spin" /> : <GoogleIcon />}
          Continue with Google
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
          <span className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>or use phone number</span>
          <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-semibold block mb-1.5" style={{ color: "var(--text-primary)" }}>Mobile Number</label>
            <div className="flex items-center">
              <div className="flex items-center gap-2 px-3 py-2.5 border border-r-0 border-[var(--border)] rounded-l-lg bg-[var(--bg)] text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                🇵🇰 +92
              </div>
              <input
                type="tel"
                placeholder="3001234567"
                value={phone}
                onChange={e => { setPhone(e.target.value); setError(""); }}
                className="input-base rounded-l-none border-l-0"
                maxLength={10}
                disabled={otpSent}
              />
            </div>
          </div>

          {error && (
            <p className="text-xs font-medium" style={{ color: "var(--danger)" }}>{error}</p>
          )}

          {!otpSent ? (
            <button
              onClick={sendOtp}
              disabled={phone.length < 10 || loading}
              className="btn-primary w-full justify-center py-3 disabled:opacity-40"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Phone size={16} strokeWidth={2} />}
              Send OTP
            </button>
          ) : (
            <>
              <div>
                <label className="text-sm font-semibold block mb-1.5" style={{ color: "var(--text-primary)" }}>Enter OTP</label>
                <input
                  type="number"
                  placeholder="Enter 6-digit code"
                  value={otp}
                  onChange={e => { setOtp(e.target.value); setError(""); }}
                  className="input-base text-center text-xl font-bold tracking-widest"
                  maxLength={6}
                />
                <p className="text-xs mt-1 text-center" style={{ color: "var(--text-muted)" }}>
                  Sent to +92{phone} ·{" "}
                  <button
                    onClick={() => { setOtpSent(false); setOtp(""); }}
                    style={{ color: "var(--brand-green)" }}
                  >
                    Resend
                  </button>
                </p>
              </div>
              <button
                onClick={verifyOtp}
                disabled={otp.length < 6 || loading}
                className="btn-primary w-full justify-center py-3 disabled:opacity-40"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} strokeWidth={2.5} />}
                Verify & Login
              </button>
            </>
          )}
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            New to Sellz.pk?{" "}
            <button onClick={onSignup} className="font-semibold" style={{ color: "var(--brand-green)" }}>
              Create account
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

function StepPhone({ data, setData, onNext }: { data: AuthData; setData: (d: AuthData) => void; onNext: () => void }) {
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const supabase = createClient();

  async function sendOtp() {
    setError("");
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({ phone: `+92${data.phone}` });
    setLoading(false);
    if (error) { setError(error.message); return; }
    setOtpSent(true);
  }

  async function verify() {
    setError("");
    setLoading(true);
    const { error } = await supabase.auth.verifyOtp({
      phone: `+92${data.phone}`,
      token: data.otp,
      type: "sms",
    });
    setLoading(false);
    if (error) { setError(error.message); return; }
    onNext();
  }

  return (
    <div>
      <div className="flex items-center justify-center w-14 h-14 rounded-2xl mb-5" style={{ background: "var(--brand-green-light)" }}>
        <Phone size={24} strokeWidth={2} style={{ color: "var(--brand-green)" }} />
      </div>
      <h2 className="text-xl font-bold mb-1" style={{ color: "var(--text-primary)" }}>Your mobile number</h2>
      <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>We&apos;ll send an OTP to verify it&apos;s you</p>

      <div className="space-y-4">
        <div className="flex">
          <div className="flex items-center gap-2 px-3 py-2.5 border border-r-0 border-[var(--border)] rounded-l-lg bg-[var(--bg)] text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
            🇵🇰 +92
          </div>
          <input
            type="tel"
            placeholder="3001234567"
            value={data.phone}
            onChange={e => { setData({ ...data, phone: e.target.value }); setError(""); }}
            className="input-base rounded-l-none border-l-0"
            maxLength={10}
            disabled={otpSent}
          />
        </div>

        {error && <p className="text-xs font-medium" style={{ color: "var(--danger)" }}>{error}</p>}

        {!otpSent ? (
          <button onClick={sendOtp} disabled={data.phone.length < 10 || loading} className="btn-primary w-full justify-center py-3 disabled:opacity-40">
            {loading ? <Loader2 size={16} className="animate-spin" /> : null}
            Send OTP <ChevronRight size={16} strokeWidth={2.5} />
          </button>
        ) : (
          <>
            <input
              type="number"
              placeholder="Enter OTP"
              value={data.otp}
              onChange={e => { setData({ ...data, otp: e.target.value }); setError(""); }}
              className="input-base text-center text-xl font-bold tracking-widest"
            />
            <button onClick={verify} disabled={data.otp.length < 6 || loading} className="btn-primary w-full justify-center py-3 disabled:opacity-40">
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} strokeWidth={2} />}
              Verify <ChevronRight size={16} strokeWidth={2.5} />
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function StepCNIC({ side, data, setData, onNext }: { side: "front" | "back"; data: AuthData; setData: (d: AuthData) => void; onNext: () => void }) {
  const [uploading, setUploading] = useState(false);
  const supabase = createClient();
  const captured = side === "front" ? data.cnicFront : data.cnicBack;

  async function capture() {
    setUploading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setUploading(false); return; }

    // In production: replace with real camera capture → file upload
    const mockImg = "https://images.unsplash.com/photo-1568667256549-094345857637?w=400&h=250&fit=crop";

    // Simulate upload delay
    await new Promise(r => setTimeout(r, 800));

    if (side === "front") setData({ ...data, cnicFront: mockImg });
    else setData({ ...data, cnicBack: mockImg });
    setUploading(false);
  }

  return (
    <div>
      <div className="flex items-center justify-center w-14 h-14 rounded-2xl mb-5" style={{ background: "var(--brand-green-light)" }}>
        <Camera size={24} strokeWidth={2} style={{ color: "var(--brand-green)" }} />
      </div>
      <h2 className="text-xl font-bold mb-1" style={{ color: "var(--text-primary)" }}>CNIC {side === "front" ? "Front" : "Back"}</h2>
      <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>
        {side === "front" ? "Place the front of your CNIC in frame" : "Now flip and capture the back"}
      </p>

      {captured ? (
        <div className="relative rounded-xl overflow-hidden mb-5" style={{ aspectRatio: "16/10" }}>
          <img src={captured} alt="CNIC" className="w-full h-full object-cover" />
          <div className="absolute inset-0 border-2 rounded-xl pointer-events-none" style={{ borderColor: "var(--brand-green)" }} />
          <div className="absolute bottom-3 left-3">
            <span className="badge-verified">Captured</span>
          </div>
        </div>
      ) : (
        <div
          onClick={capture}
          className="relative cursor-pointer rounded-xl overflow-hidden mb-5 flex items-center justify-center"
          style={{ aspectRatio: "16/10", background: "#1a1a1a" }}
        >
          <div className="border-2 border-dashed border-white/30 rounded-lg absolute inset-4 flex items-center justify-center">
            <div className="text-center text-white/60">
              {uploading ? (
                <Loader2 size={32} strokeWidth={1.5} className="mx-auto mb-2 animate-spin text-white/60" />
              ) : (
                <Camera size={32} strokeWidth={1.5} className="mx-auto mb-2" />
              )}
              <p className="text-sm font-medium">{uploading ? "Uploading..." : "Tap to capture"}</p>
            </div>
          </div>
        </div>
      )}

      <button onClick={onNext} disabled={!captured} className="btn-primary w-full justify-center py-3 disabled:opacity-40">
        Continue <ChevronRight size={16} strokeWidth={2.5} />
      </button>
    </div>
  );
}

function StepSelfie({ data, setData, onNext }: { data: AuthData; setData: (d: AuthData) => void; onNext: () => void }) {
  const [uploading, setUploading] = useState(false);
  const mockSelfie = "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&crop=face";

  async function capture() {
    setUploading(true);
    await new Promise(r => setTimeout(r, 800));
    setData({ ...data, selfie: mockSelfie });
    setUploading(false);
  }

  return (
    <div>
      <div className="flex items-center justify-center w-14 h-14 rounded-2xl mb-5" style={{ background: "var(--brand-green-light)" }}>
        <Eye size={24} strokeWidth={2} style={{ color: "var(--brand-green)" }} />
      </div>
      <h2 className="text-xl font-bold mb-1" style={{ color: "var(--text-primary)" }}>Liveness Check</h2>
      <p className="text-sm mb-2" style={{ color: "var(--text-muted)" }}>Face the camera and blink when prompted</p>

      <div className="card p-3 mb-5 flex items-start gap-2">
        <AlertCircle size={14} strokeWidth={2} style={{ color: "var(--brand-green)", flexShrink: 0 }} className="mt-0.5" />
        <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
          Your selfie is matched against your CNIC photo using AI verification. This prevents fake accounts.
        </p>
      </div>

      {data.selfie ? (
        <div className="relative w-40 h-40 rounded-full overflow-hidden mx-auto mb-5" style={{ border: "4px solid var(--brand-green)" }}>
          <img src={data.selfie} alt="Selfie" className="w-full h-full object-cover" />
          <div className="absolute inset-0 flex items-end justify-center pb-2">
            <span className="badge-verified text-[10px]">Match: 98%</span>
          </div>
        </div>
      ) : (
        <div
          onClick={capture}
          className="w-40 h-40 rounded-full mx-auto mb-5 cursor-pointer flex items-center justify-center"
          style={{ background: "#1a1a1a", border: "4px dashed rgba(255,255,255,0.2)" }}
        >
          {uploading ? (
            <Loader2 size={32} strokeWidth={1.5} className="animate-spin" style={{ color: "rgba(255,255,255,0.4)" }} />
          ) : (
            <Camera size={32} strokeWidth={1.5} style={{ color: "rgba(255,255,255,0.4)" }} />
          )}
        </div>
      )}

      <button onClick={onNext} disabled={!data.selfie} className="btn-primary w-full justify-center py-3 disabled:opacity-40">
        Continue <ChevronRight size={16} strokeWidth={2.5} />
      </button>
    </div>
  );
}

function StepCity({ data, setData, onNext }: { data: AuthData; setData: (d: AuthData) => void; onNext: () => void }) {
  const [saving, setSaving] = useState(false);
  const supabase = createClient();

  async function saveAndContinue() {
    if (!data.city) return;
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from("users").upsert({
        id: user.id,
        city: data.city,
        cnic_front_url: data.cnicFront || null,
        cnic_back_url: data.cnicBack || null,
        selfie_url: data.selfie || null,
        phone: data.phone ? `+92${data.phone}` : null,
      });
    }
    setSaving(false);
    onNext();
  }

  return (
    <div>
      <div className="flex items-center justify-center w-14 h-14 rounded-2xl mb-5" style={{ background: "var(--brand-green-light)" }}>
        <MapPin size={24} strokeWidth={2} style={{ color: "var(--brand-green)" }} />
      </div>
      <h2 className="text-xl font-bold mb-1" style={{ color: "var(--text-primary)" }}>Your City</h2>
      <p className="text-sm mb-2" style={{ color: "var(--text-muted)" }}>Set permanently — shown on all your listings</p>

      <div className="card p-3 mb-5 flex items-start gap-2">
        <AlertCircle size={14} strokeWidth={2} className="mt-0.5 flex-shrink-0" style={{ color: "#F59E0B" }} />
        <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
          <strong>This cannot be changed</strong> without contacting support. Choose carefully.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-6">
        {CITIES.map(city => (
          <button
            key={city}
            onClick={() => setData({ ...data, city })}
            className="py-3 px-4 rounded-lg border text-sm font-medium transition-colors text-left"
            style={
              data.city === city
                ? { borderColor: "var(--brand-green)", background: "var(--brand-green-light)", color: "var(--brand-green)" }
                : { borderColor: "var(--border)", color: "var(--text-secondary)" }
            }
          >
            {city}
          </button>
        ))}
      </div>

      <button
        onClick={saveAndContinue}
        disabled={!data.city || saving}
        className="btn-primary w-full justify-center py-3 disabled:opacity-40"
      >
        {saving ? <Loader2 size={16} className="animate-spin" /> : null}
        Set {data.city || "City"} as My City <ChevronRight size={16} strokeWidth={2.5} />
      </button>
    </div>
  );
}
