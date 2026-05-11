"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  MapPin, Phone, Shield, Check, ChevronRight, Camera,
  AlertCircle, Loader2, ArrowLeft, X,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { CITIES } from "@/lib/locations";

type Step = "welcome" | "city" | "phone" | "cnic-info" | "cnic-upload" | "done";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("welcome");
  const [city, setCity] = useState("");
  const [citySearch, setCitySearch] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [cnicFront, setCnicFront] = useState("");
  const [cnicBack, setCnicBack] = useState("");
  const [selfie, setSelfie] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.replace("/auth"); return; }
      setUserId(user.id);
      if (user.user_metadata?.full_name && !phone) {
        // pre-fill nothing, just note user exists
      }
    });
  }, []);

  const filteredCities = CITIES.filter(c =>
    !citySearch || c.toLowerCase().includes(citySearch.toLowerCase())
  );

  async function saveCity() {
    if (!city || !userId) return;
    setLoading(true);
    const supabase = createClient();
    await supabase.from("users").upsert({ id: userId, city });
    setLoading(false);
    setStep("phone");
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
    if (!error && userId) {
      await supabase.from("users").update({ phone: `+92${phone}` }).eq("id", userId);
    }
    setLoading(false);
    if (error) { setError(error.message); return; }
    setStep("cnic-info");
  }

  async function uploadCnic() {
    if (!userId) return;
    setLoading(true);
    const supabase = createClient();
    await supabase.from("users").update({
      cnic_front_url: cnicFront || null,
      cnic_back_url: cnicBack || null,
      selfie_url: selfie || null,
    }).eq("id", userId);
    setLoading(false);
    setStep("done");
  }

  async function skipCnic() {
    setStep("done");
  }

  const STEP_ORDER: Step[] = ["welcome", "city", "phone", "cnic-info", "cnic-upload", "done"];
  const stepIdx = STEP_ORDER.indexOf(step);
  const progress = ((stepIdx + 1) / STEP_ORDER.length) * 100;

  return (
    <div className="min-h-dvh flex flex-col" style={{ background: "var(--bg)" }}>
      {/* Header */}
      <header className="sticky top-0 z-20 bg-white border-b border-[var(--border)]">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center gap-3">
          {stepIdx > 0 && step !== "done" && (
            <button onClick={() => setStep(STEP_ORDER[stepIdx - 1])} className="p-1.5 -ml-1">
              <ArrowLeft size={20} strokeWidth={2} />
            </button>
          )}
          <span className="font-black text-base">
            sellz<span style={{ color: "var(--brand-green)" }}>.pk</span>
          </span>
        </div>
        <div className="h-1" style={{ background: "var(--border)" }}>
          <div
            className="h-full transition-all duration-300"
            style={{ width: `${progress}%`, background: "var(--brand-green)" }}
          />
        </div>
      </header>

      <main className="flex-1">
        <div className="max-w-lg mx-auto px-4 py-8">

          {/* WELCOME */}
          {step === "welcome" && (
            <div className="text-center">
              <div className="w-20 h-20 rounded-2xl mx-auto mb-6 flex items-center justify-center" style={{ background: "var(--brand-green)" }}>
                <span className="text-white font-black text-3xl">S</span>
              </div>
              <h1 className="text-2xl font-black mb-2" style={{ color: "var(--text-primary)" }}>Welcome to Sellz.pk!</h1>
              <p className="text-sm leading-relaxed mb-8 max-w-xs mx-auto" style={{ color: "var(--text-muted)" }}>
                Complete your profile to start buying and selling safely. Takes 2 minutes.
              </p>
              <div className="space-y-3 text-left mb-8">
                {[
                  { icon: <MapPin size={16} />, label: "Set your city" },
                  { icon: <Phone size={16} />, label: "Verify your number" },
                  { icon: <Shield size={16} />, label: "CNIC verification (optional, unlocks posting)" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm" style={{ color: "var(--text-secondary)" }}>
                    <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "var(--brand-green-light)", color: "var(--brand-green)" }}>
                      {item.icon}
                    </div>
                    {item.label}
                  </div>
                ))}
              </div>
              <button onClick={() => setStep("city")} className="btn-primary w-full justify-center py-3">
                Get Started <ChevronRight size={16} strokeWidth={2.5} />
              </button>
            </div>
          )}

          {/* CITY */}
          {step === "city" && (
            <div>
              <div className="w-14 h-14 rounded-2xl mb-5 flex items-center justify-center" style={{ background: "var(--brand-green-light)" }}>
                <MapPin size={24} strokeWidth={2} style={{ color: "var(--brand-green)" }} />
              </div>
              <h2 className="text-xl font-bold mb-1" style={{ color: "var(--text-primary)" }}>Your City</h2>
              <p className="text-sm mb-2" style={{ color: "var(--text-muted)" }}>Shown on all your listings</p>

              <div className="card p-3 mb-5 flex items-start gap-2">
                <AlertCircle size={14} strokeWidth={2} className="mt-0.5 flex-shrink-0" style={{ color: "#F59E0B" }} />
                <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                  <strong>Cannot be changed</strong> without contacting support. Choose carefully.
                </p>
              </div>

              <input
                type="text"
                placeholder="Search city..."
                value={citySearch}
                onChange={e => setCitySearch(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] text-sm outline-none focus:border-[var(--brand-green)] mb-3"
                style={{ background: "var(--bg)" }}
              />

              <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto mb-6">
                {filteredCities.map(c => (
                  <button
                    key={c}
                    onClick={() => setCity(c)}
                    className="py-3 px-4 rounded-lg border text-sm font-medium text-left transition-colors"
                    style={
                      city === c
                        ? { borderColor: "var(--brand-green)", background: "var(--brand-green-light)", color: "var(--brand-green)" }
                        : { borderColor: "var(--border)", color: "var(--text-secondary)" }
                    }
                  >
                    {c}
                  </button>
                ))}
              </div>

              <button
                onClick={saveCity}
                disabled={!city || loading}
                className="btn-primary w-full justify-center py-3 disabled:opacity-40"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : null}
                Set {city || "City"} <ChevronRight size={16} strokeWidth={2.5} />
              </button>
            </div>
          )}

          {/* PHONE */}
          {step === "phone" && (
            <div>
              <div className="w-14 h-14 rounded-2xl mb-5 flex items-center justify-center" style={{ background: "var(--brand-green-light)" }}>
                <Phone size={24} strokeWidth={2} style={{ color: "var(--brand-green)" }} />
              </div>
              <h2 className="text-xl font-bold mb-1" style={{ color: "var(--text-primary)" }}>Phone Number</h2>
              <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>We&apos;ll notify you about your ads</p>

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
                    className="flex-1 px-3 py-2.5 border border-[var(--border)] rounded-r-lg text-sm outline-none focus:border-[var(--brand-green)]"
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
                    className="btn-primary w-full justify-center py-3 disabled:opacity-40"
                  >
                    {loading ? <Loader2 size={15} className="animate-spin" /> : null}
                    Send OTP <ChevronRight size={16} strokeWidth={2.5} />
                  </button>
                ) : (
                  <button
                    onClick={verifyOtp}
                    disabled={otp.length < 6 || loading}
                    className="btn-primary w-full justify-center py-3 disabled:opacity-40"
                  >
                    {loading ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} strokeWidth={2.5} />}
                    Verify <ChevronRight size={16} strokeWidth={2.5} />
                  </button>
                )}

                <button
                  onClick={() => setStep("cnic-info")}
                  className="w-full py-2 text-sm text-center"
                  style={{ color: "var(--text-muted)" }}
                >
                  Skip for now
                </button>
              </div>
            </div>
          )}

          {/* CNIC INFO */}
          {step === "cnic-info" && (
            <div>
              <div className="w-14 h-14 rounded-2xl mb-5 flex items-center justify-center" style={{ background: "var(--brand-green-light)" }}>
                <Shield size={24} strokeWidth={2} style={{ color: "var(--brand-green)" }} />
              </div>
              <h2 className="text-xl font-bold mb-1" style={{ color: "var(--text-primary)" }}>CNIC Verification</h2>
              <p className="text-sm mb-5" style={{ color: "var(--text-muted)" }}>Required to post ads — keeps Sellz.pk scam-free</p>

              <div className="space-y-3 mb-6">
                {[
                  { icon: "📷", label: "CNIC Front photo" },
                  { icon: "📷", label: "CNIC Back photo" },
                  { icon: "🤳", label: "Selfie for liveness check" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl border" style={{ borderColor: "var(--border)", background: "white" }}>
                    <span className="text-xl">{item.icon}</span>
                    <span className="text-sm" style={{ color: "var(--text-secondary)" }}>{item.label}</span>
                  </div>
                ))}
              </div>

              <div className="card p-3 mb-6 flex items-start gap-2">
                <AlertCircle size={14} strokeWidth={2} className="mt-0.5 flex-shrink-0" style={{ color: "var(--brand-green)" }} />
                <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                  1 CNIC = 1 account. Documents stored securely. Admin verifies within 24 hours.
                </p>
              </div>

              <button
                onClick={() => setStep("cnic-upload")}
                className="btn-primary w-full justify-center py-3 mb-3"
              >
                <Shield size={16} strokeWidth={2} />
                Verify Now
              </button>
              <button
                onClick={skipCnic}
                className="w-full py-2.5 rounded-xl border text-sm font-medium transition-colors"
                style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
              >
                Skip — browse only (can&apos;t post ads)
              </button>
            </div>
          )}

          {/* CNIC UPLOAD */}
          {step === "cnic-upload" && (
            <div>
              <h2 className="text-xl font-bold mb-5" style={{ color: "var(--text-primary)" }}>Upload Documents</h2>

              <div className="space-y-4 mb-6">
                <CnicCapture
                  label="CNIC Front"
                  type="cnic-front"
                  userId={userId}
                  value={cnicFront}
                  onCapture={setCnicFront}
                />
                <CnicCapture
                  label="CNIC Back"
                  type="cnic-back"
                  userId={userId}
                  value={cnicBack}
                  onCapture={setCnicBack}
                />
                <CnicCapture
                  label="Selfie"
                  type="selfie"
                  userId={userId}
                  value={selfie}
                  onCapture={setSelfie}
                  circle
                />
              </div>

              <button
                onClick={uploadCnic}
                disabled={!cnicFront || !cnicBack || !selfie || loading}
                className="btn-primary w-full justify-center py-3 disabled:opacity-40"
              >
                {loading ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} strokeWidth={2.5} />}
                Submit for Review
              </button>
            </div>
          )}

          {/* DONE */}
          {step === "done" && (
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-[var(--brand-green-light)] flex items-center justify-center mx-auto mb-6">
                <Check size={36} strokeWidth={2.5} style={{ color: "var(--brand-green)" }} />
              </div>
              <h2 className="text-xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>You&apos;re all set!</h2>
              <p className="text-sm mb-2 max-w-xs mx-auto" style={{ color: "var(--text-muted)" }}>
                {cnicFront
                  ? "Your CNIC is under review. You can post ads once verified (usually within 24 hours)."
                  : `You can browse listings in ${city}. Complete CNIC verification to post ads.`}
              </p>
              <button
                onClick={() => router.push("/")}
                className="btn-primary justify-center py-3 px-8 mt-6"
              >
                Start Browsing
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function CnicCapture({
  label, type, userId, value, onCapture, circle = false,
}: {
  label: string;
  type: string;
  userId: string | null;
  value: string;
  onCapture: (path: string) => void;
  circle?: boolean;
}) {
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(!!value);
  const [uploadError, setUploadError] = useState(false);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !userId) return;

    // Show preview immediately from local file
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    setUploaded(false);
    setUploadError(false);
    setUploading(true);

    try {
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${userId}/${type}-${Date.now()}.${ext}`;
      const supabase = createClient();
      const { error } = await supabase.storage
        .from("cnic-documents")
        .upload(path, file, { upsert: true, contentType: file.type });
      if (error) throw error;
      onCapture(path); // store path, not URL
      setUploaded(true);
    } catch {
      setUploadError(true);
      setPreview(null);
    } finally {
      setUploading(false);
    }
  }

  const borderColor = uploadError
    ? "#e53e3e"
    : uploaded || preview
    ? "var(--brand-green)"
    : "var(--border)";

  return (
    <div>
      <p className="text-sm font-semibold mb-2" style={{ color: "var(--text-primary)" }}>{label}</p>
      <label
        className="block cursor-pointer"
        style={{ maxWidth: circle ? 160 : undefined, margin: circle ? "0 auto" : undefined, display: "block" }}
      >
        <input type="file" accept="image/*" capture="environment" onChange={handleFile} className="sr-only" />
        <div
          className="relative border-2 border-dashed overflow-hidden transition-colors"
          style={{
            aspectRatio: circle ? "1" : "16/7",
            borderRadius: circle ? 9999 : 12,
            borderColor,
            minHeight: circle ? 120 : 100,
          }}
        >
          {preview ? (
            <>
              <img src={preview} alt={label} className="w-full h-full object-cover" />
              {uploading && (
                <div className="absolute inset-0 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.45)" }}>
                  <Loader2 size={28} strokeWidth={2} className="animate-spin text-white" />
                </div>
              )}
              {uploaded && !uploading && (
                <div className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center" style={{ background: "var(--brand-green)" }}>
                  <Check size={13} strokeWidth={2.5} className="text-white" />
                </div>
              )}
            </>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-2" style={{ background: "var(--bg)" }}>
              {uploaded ? (
                <>
                  <Check size={24} strokeWidth={2} style={{ color: "var(--brand-green)" }} />
                  <span className="text-xs font-medium" style={{ color: "var(--brand-green)" }}>Uploaded ✓</span>
                  <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>Tap to replace</span>
                </>
              ) : (
                <>
                  <Camera size={24} strokeWidth={1.5} style={{ color: "var(--text-muted)" }} />
                  <span className="text-xs" style={{ color: "var(--text-muted)" }}>Tap to capture / upload</span>
                </>
              )}
            </div>
          )}
        </div>
      </label>
      {uploadError && (
        <p className="text-xs mt-1.5 font-medium" style={{ color: "#e53e3e" }}>
          Upload failed — tap to try again
        </p>
      )}
    </div>
  );
}
