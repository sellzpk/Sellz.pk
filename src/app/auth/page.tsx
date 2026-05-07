"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Phone, Camera, Eye, Check, ChevronRight, AlertCircle, MapPin } from "lucide-react";

const STEPS = ["Phone", "CNIC Front", "CNIC Back", "Selfie", "City", "Done"];

const CITIES = [
  "Karachi", "Lahore", "Islamabad", "Rawalpindi", "Faisalabad",
  "Multan", "Gujranwala", "Peshawar", "Quetta", "Hyderabad",
  "Sialkot", "Bahawalpur", "Sargodha", "Abbottabad", "Sukkur",
  "Sahiwal", "Dera Ghazi Khan", "Mirpur Khas",
];

interface AuthData {
  phone: string;
  otp: string;
  cnicFront: string;
  cnicBack: string;
  selfie: string;
  city: string;
}

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

  function next() { setStep(s => Math.min(STEPS.length - 1, s + 1)); }

  if (step === STEPS.length - 1) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center px-6 text-center" style={{ background: "var(--bg)" }}>
        <div className="w-20 h-20 rounded-full bg-[var(--brand-green-light)] flex items-center justify-center mb-6">
          <Check size={36} strokeWidth={2.5} className="text-[var(--brand-green)]" />
        </div>
        <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">You&apos;re verified!</h2>
        <p className="text-sm text-[var(--text-secondary)] mb-8 max-w-xs leading-relaxed">
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
            <p className="text-sm font-bold text-[var(--text-primary)]">
              sellz<span style={{ color: "var(--brand-green)" }}>.pk</span>
            </p>
          </div>
          <button onClick={() => setMode("login")} className="text-sm font-medium text-[var(--brand-green)]">
            Login instead
          </button>
        </div>
        <div className="h-1 bg-[var(--border)]">
          <div
            className="h-full transition-all duration-300"
            style={{ width: `${((step + 1) / STEPS.length) * 100}%`, background: "var(--brand-green)" }}
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
  const router = useRouter();

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
          <h1 className="text-2xl font-black text-[var(--text-primary)] mb-1">Welcome back</h1>
          <p className="text-sm text-[var(--text-muted)]">Login with your Pakistani mobile number</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-[var(--text-primary)] mb-1.5 block">Mobile Number</label>
            <div className="flex items-center gap-0">
              <div className="flex items-center gap-2 px-3 py-2.5 border border-r-0 border-[var(--border)] rounded-l-lg bg-[var(--bg)] text-sm font-medium text-[var(--text-secondary)]">
                🇵🇰 +92
              </div>
              <input
                type="tel"
                placeholder="3001234567"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="input-base rounded-l-none border-l-0"
                maxLength={10}
              />
            </div>
          </div>

          {!otpSent ? (
            <button
              onClick={() => setOtpSent(true)}
              disabled={phone.length < 10}
              className="btn-primary w-full justify-center py-3 disabled:opacity-40"
            >
              <Phone size={16} strokeWidth={2} />
              Send OTP
            </button>
          ) : (
            <>
              <div>
                <label className="text-sm font-semibold text-[var(--text-primary)] mb-1.5 block">Enter OTP</label>
                <input
                  type="number"
                  placeholder="Enter 6-digit code"
                  value={otp}
                  onChange={e => setOtp(e.target.value)}
                  className="input-base text-center text-xl font-bold tracking-widest"
                  maxLength={6}
                />
                <p className="text-xs text-[var(--text-muted)] mt-1 text-center">
                  Sent to +92{phone} · <button className="text-[var(--brand-green)]">Resend</button>
                </p>
              </div>
              <button
                onClick={() => router.push("/")}
                disabled={otp.length < 6}
                className="btn-primary w-full justify-center py-3 disabled:opacity-40"
              >
                <Check size={16} strokeWidth={2.5} />
                Verify & Login
              </button>
            </>
          )}
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-[var(--text-muted)]">
            New to Sellz.pk?{" "}
            <button onClick={onSignup} className="font-semibold text-[var(--brand-green)]">
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

  return (
    <div>
      <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-[var(--brand-green-light)] mb-5">
        <Phone size={24} strokeWidth={2} className="text-[var(--brand-green)]" />
      </div>
      <h2 className="text-xl font-bold text-[var(--text-primary)] mb-1">Your mobile number</h2>
      <p className="text-sm text-[var(--text-muted)] mb-6">We&apos;ll send an OTP to verify it&apos;s you</p>

      <div className="space-y-4">
        <div>
          <div className="flex">
            <div className="flex items-center gap-2 px-3 py-2.5 border border-r-0 border-[var(--border)] rounded-l-lg bg-[var(--bg)] text-sm font-medium text-[var(--text-secondary)]">
              🇵🇰 +92
            </div>
            <input
              type="tel"
              placeholder="3001234567"
              value={data.phone}
              onChange={e => setData({ ...data, phone: e.target.value })}
              className="input-base rounded-l-none border-l-0"
              maxLength={10}
            />
          </div>
        </div>

        {!otpSent ? (
          <button onClick={() => setOtpSent(true)} disabled={data.phone.length < 10} className="btn-primary w-full justify-center py-3 disabled:opacity-40">
            Send OTP <ChevronRight size={16} strokeWidth={2.5} />
          </button>
        ) : (
          <>
            <input
              type="number"
              placeholder="Enter OTP"
              value={data.otp}
              onChange={e => setData({ ...data, otp: e.target.value })}
              className="input-base text-center text-xl font-bold tracking-widest"
            />
            <button onClick={onNext} disabled={data.otp.length < 6} className="btn-primary w-full justify-center py-3 disabled:opacity-40">
              Verify <ChevronRight size={16} strokeWidth={2.5} />
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function StepCNIC({ side, data, setData, onNext }: { side: "front" | "back"; data: AuthData; setData: (d: AuthData) => void; onNext: () => void }) {
  const captured = side === "front" ? data.cnicFront : data.cnicBack;
  const mockImg = "https://images.unsplash.com/photo-1568667256549-094345857637?w=400&h=250&fit=crop";

  function capture() {
    if (side === "front") setData({ ...data, cnicFront: mockImg });
    else setData({ ...data, cnicBack: mockImg });
  }

  return (
    <div>
      <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-[var(--brand-green-light)] mb-5">
        <Camera size={24} strokeWidth={2} className="text-[var(--brand-green)]" />
      </div>
      <h2 className="text-xl font-bold text-[var(--text-primary)] mb-1">CNIC {side === "front" ? "Front" : "Back"}</h2>
      <p className="text-sm text-[var(--text-muted)] mb-6">
        {side === "front" ? "Place the front of your CNIC in frame" : "Now flip and capture the back"}
      </p>

      {captured ? (
        <div className="relative rounded-xl overflow-hidden mb-5" style={{ aspectRatio: "16/10" }}>
          <img src={captured} alt="CNIC" className="w-full h-full object-cover" />
          <div className="absolute inset-0 border-2 border-[var(--brand-green)] rounded-xl pointer-events-none" />
          <div className="absolute bottom-3 left-3">
            <span className="badge-verified">Captured</span>
          </div>
        </div>
      ) : (
        <div
          onClick={capture}
          className="relative cursor-pointer rounded-xl overflow-hidden mb-5 bg-[#1a1a1a] flex items-center justify-center"
          style={{ aspectRatio: "16/10" }}
        >
          <div className="border-2 border-dashed border-white/30 rounded-lg absolute inset-4 flex items-center justify-center">
            <div className="text-center text-white/60">
              <Camera size={32} strokeWidth={1.5} className="mx-auto mb-2" />
              <p className="text-sm font-medium">Tap to capture</p>
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
  const mockSelfie = "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&crop=face";

  return (
    <div>
      <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-[var(--brand-green-light)] mb-5">
        <Eye size={24} strokeWidth={2} className="text-[var(--brand-green)]" />
      </div>
      <h2 className="text-xl font-bold text-[var(--text-primary)] mb-1">Liveness Check</h2>
      <p className="text-sm text-[var(--text-muted)] mb-2">Face the camera and blink when prompted</p>

      <div className="card p-3 mb-5 flex items-start gap-2">
        <AlertCircle size={14} strokeWidth={2} className="text-[var(--brand-green)] flex-shrink-0 mt-0.5" />
        <p className="text-xs text-[var(--text-secondary)]">
          Your selfie is matched against your CNIC photo using AI verification. This prevents fake accounts.
        </p>
      </div>

      {data.selfie ? (
        <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-[var(--brand-green)] mx-auto mb-5">
          <img src={data.selfie} alt="Selfie" className="w-full h-full object-cover" />
          <div className="absolute inset-0 flex items-end justify-center pb-2">
            <span className="badge-verified text-[10px]">Match: 98%</span>
          </div>
        </div>
      ) : (
        <div
          onClick={() => setData({ ...data, selfie: mockSelfie })}
          className="w-40 h-40 rounded-full bg-[#1a1a1a] mx-auto mb-5 cursor-pointer flex items-center justify-center border-4 border-dashed border-white/20"
        >
          <Camera size={32} strokeWidth={1.5} className="text-white/40" />
        </div>
      )}

      <button onClick={onNext} disabled={!data.selfie} className="btn-primary w-full justify-center py-3 disabled:opacity-40">
        Continue <ChevronRight size={16} strokeWidth={2.5} />
      </button>
    </div>
  );
}

function StepCity({ data, setData, onNext }: { data: AuthData; setData: (d: AuthData) => void; onNext: () => void }) {
  return (
    <div>
      <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-[var(--brand-green-light)] mb-5">
        <MapPin size={24} strokeWidth={2} className="text-[var(--brand-green)]" />
      </div>
      <h2 className="text-xl font-bold text-[var(--text-primary)] mb-1">Your City</h2>
      <p className="text-sm text-[var(--text-muted)] mb-2">This is set permanently and shown on all your listings</p>

      <div className="card p-3 mb-5 flex items-start gap-2">
        <AlertCircle size={14} strokeWidth={2} className="text-amber-500 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-[var(--text-secondary)]">
          <strong>This cannot be changed</strong> without contacting support. Choose carefully.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-6">
        {CITIES.map(city => (
          <button
            key={city}
            onClick={() => setData({ ...data, city })}
            className={`py-3 px-4 rounded-lg border text-sm font-medium transition-colors text-left ${
              data.city === city
                ? "border-[var(--brand-green)] bg-[var(--brand-green-light)] text-[var(--brand-green)]"
                : "border-[var(--border)] text-[var(--text-secondary)]"
            }`}
          >
            {city}
          </button>
        ))}
      </div>

      <button onClick={onNext} disabled={!data.city} className="btn-primary w-full justify-center py-3 disabled:opacity-40">
        Set {data.city || "City"} as My City <ChevronRight size={16} strokeWidth={2.5} />
      </button>
    </div>
  );
}
