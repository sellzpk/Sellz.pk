"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BottomNav } from "@/components/BottomNav";
import { ArrowLeft, Camera, ChevronRight, Check, X, Upload, AlertCircle, Smartphone, Car, Home, Tv, Sofa, Shirt, BookOpen, Baby, Wrench, PawPrint, Briefcase, Package } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { CONDITIONS } from "@/lib/mockData";
import Link from "next/link";

const STEPS = ["Category", "Photos", "Ownership", "Details", "Review"];

const CATEGORIES: { slug: string; label: string; Icon: LucideIcon; color: string; iconColor: string }[] = [
  { slug: "mobiles",      label: "Mobiles",       Icon: Smartphone, color: "#e8f5e9", iconColor: "#1D9E75" },
  { slug: "vehicles",     label: "Vehicles",       Icon: Car,        color: "#fde8e0", iconColor: "#E85D24" },
  { slug: "property",     label: "Property",       Icon: Home,       color: "#fff8e1", iconColor: "#F59E0B" },
  { slug: "electronics",  label: "Electronics",    Icon: Tv,         color: "#ede9fe", iconColor: "#6366F1" },
  { slug: "furniture",    label: "Furniture",      Icon: Sofa,       color: "#e0f2fe", iconColor: "#0EA5E9" },
  { slug: "fashion",      label: "Fashion",        Icon: Shirt,      color: "#fce7f3", iconColor: "#EC4899" },
  { slug: "books-sports", label: "Books & Sports", Icon: BookOpen,   color: "#d1fae5", iconColor: "#10B981" },
  { slug: "kids",         label: "Kids",           Icon: Baby,       color: "#fff3e0", iconColor: "#F97316" },
  { slug: "services",     label: "Services",       Icon: Wrench,     color: "#ede9fe", iconColor: "#8B5CF6" },
  { slug: "animals",      label: "Animals",        Icon: PawPrint,   color: "#ccfbf1", iconColor: "#14B8A6" },
  { slug: "jobs",         label: "Jobs",           Icon: Briefcase,  color: "#e2e8f0", iconColor: "#64748B" },
  { slug: "other",        label: "Other",          Icon: Package,    color: "#ede9fe", iconColor: "#A78BFA" },
];

interface FormData {
  category: string;
  subcategory: string;
  photos: string[];
  ownershipDoc: string;
  title: string;
  description: string;
  price: string;
  condition: string;
}

export default function PostAdPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [whatsappStep, setWhatsappStep] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [whatsappAdded, setWhatsappAdded] = useState(false);
  const [form, setForm] = useState<FormData>({
    category: "", subcategory: "", photos: [],
    ownershipDoc: "", title: "", description: "",
    price: "", condition: "",
  });

  function next() { setStep(s => Math.min(STEPS.length - 1, s + 1)); }
  function back() { setStep(s => Math.max(0, s - 1)); }

  function handleSubmit() { setWhatsappStep(true); }

  function handleWhatsappDone(added: boolean) {
    setWhatsappAdded(added);
    setSubmitted(true);
  }

  if (whatsappStep && !submitted) {
    return <StepWhatsapp onDone={handleWhatsappDone} />;
  }

  if (submitted) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center px-6 text-center" style={{ background: "var(--bg)" }}>
        <div className="w-20 h-20 rounded-full bg-[var(--brand-green-light)] flex items-center justify-center mb-6">
          <Check size={36} strokeWidth={2.5} className="text-[var(--brand-green)]" />
        </div>
        <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">Ad Submitted!</h2>
        <p className="text-sm text-[var(--text-secondary)] mb-4 max-w-xs leading-relaxed">
          Your ad is under review. We&apos;ll notify you within <strong>24 hours</strong> once approved.
        </p>
        {!whatsappAdded && (
          <div className="card p-4 mb-6 max-w-xs w-full text-left">
            <p className="text-sm font-semibold text-[var(--text-primary)] mb-1">Get more responses</p>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-3">
              Buyers prefer sellers with WhatsApp — add yours now to respond faster.
            </p>
            <button className="btn-primary w-full justify-center py-2.5 text-sm">
              Add WhatsApp Number
            </button>
          </div>
        )}
        <Link href="/" className="btn-primary">Back to Home</Link>
      </div>
    );
  }

  return (
    <div className="min-h-dvh flex flex-col" style={{ background: "var(--bg)" }}>
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-[var(--border)]">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center gap-3">
          {step > 0 ? (
            <button onClick={back} className="p-1.5 -ml-1 rounded-lg hover:bg-[var(--bg)] transition-colors">
              <ArrowLeft size={20} strokeWidth={2} />
            </button>
          ) : (
            <Link href="/" className="p-1.5 -ml-1 rounded-lg hover:bg-[var(--bg)] transition-colors">
              <X size={20} strokeWidth={2} />
            </Link>
          )}
          <div className="flex-1">
            <p className="text-sm font-semibold text-[var(--text-primary)]">{STEPS[step]}</p>
            <p className="text-xs text-[var(--text-muted)]">Step {step + 1} of {STEPS.length}</p>
          </div>
        </div>
        {/* Progress bar */}
        <div className="h-1 bg-[var(--border)]">
          <div
            className="h-full transition-all duration-300"
            style={{ width: `${((step + 1) / STEPS.length) * 100}%`, background: "var(--brand-green)" }}
          />
        </div>
      </header>

      <main className="flex-1 pb-24">
        <div className="max-w-lg mx-auto px-4 py-6">
          {step === 0 && <StepCategory form={form} setForm={setForm} onNext={next} />}
          {step === 1 && <StepPhotos form={form} setForm={setForm} onNext={next} />}
          {step === 2 && <StepOwnership form={form} setForm={setForm} onNext={next} />}
          {step === 3 && <StepDetails form={form} setForm={setForm} onNext={next} />}
          {step === 4 && <StepReview form={form} onSubmit={handleSubmit} />}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}

function StepCategory({ form, setForm, onNext }: { form: FormData; setForm: (f: FormData) => void; onNext: () => void }) {
  return (
    <div>
      <h2 className="text-lg font-bold text-[var(--text-primary)] mb-1">Choose Category</h2>
      <p className="text-sm text-[var(--text-muted)] mb-5">What are you selling?</p>
      <div className="grid grid-cols-3 gap-3">
        {CATEGORIES.map(({ slug, label, Icon, color, iconColor }) => (
          <button
            key={slug}
            onClick={() => { setForm({ ...form, category: slug }); onNext(); }}
            className={`card p-4 flex flex-col items-center gap-2 transition-all ${form.category === slug ? "border-[var(--brand-green)] bg-[var(--brand-green-light)]" : ""}`}
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: color }}>
              <Icon size={22} strokeWidth={1.75} style={{ color: iconColor }} />
            </div>
            <span className="text-xs font-medium text-[var(--text-secondary)] text-center leading-tight">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function StepPhotos({ form, setForm, onNext }: { form: FormData; setForm: (f: FormData) => void; onNext: () => void }) {
  const mockPhotos = [
    "https://images.unsplash.com/photo-1695048132640-a67d1cc2e9c0?w=200&h=200&fit=crop",
    "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=200&h=200&fit=crop",
  ];

  function addPhoto() {
    if (form.photos.length < 10) {
      const url = mockPhotos[form.photos.length % mockPhotos.length];
      setForm({ ...form, photos: [...form.photos, url] });
    }
  }

  function removePhoto(i: number) {
    setForm({ ...form, photos: form.photos.filter((_, idx) => idx !== i) });
  }

  return (
    <div>
      <h2 className="text-lg font-bold text-[var(--text-primary)] mb-1">Add Photos</h2>
      <p className="text-sm text-[var(--text-muted)] mb-1">Minimum 2, maximum 10 photos</p>

      <div className="card p-3 mb-5 flex items-start gap-2">
        <AlertCircle size={15} strokeWidth={2} className="text-[var(--brand-green)] flex-shrink-0 mt-0.5" />
        <p className="text-xs text-[var(--text-secondary)]">
          <strong>Camera only.</strong> Photos are taken live to prevent fake listings. Gallery access is not permitted.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-5">
        {form.photos.map((photo, i) => (
          <div key={i} className="aspect-square rounded-xl overflow-hidden relative">
            <img src={photo} alt="" className="w-full h-full object-cover" />
            <button
              onClick={() => removePhoto(i)}
              className="absolute top-1 right-1 w-6 h-6 bg-black/60 rounded-full flex items-center justify-center"
            >
              <X size={12} strokeWidth={2.5} className="text-white" />
            </button>
            {i === 0 && (
              <span className="absolute bottom-1 left-1 bg-[var(--brand-green)] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                Cover
              </span>
            )}
          </div>
        ))}
        {form.photos.length < 10 && (
          <button
            onClick={addPhoto}
            className="aspect-square rounded-xl border-2 border-dashed border-[var(--border)] flex flex-col items-center justify-center gap-1 hover:border-[var(--brand-green)] hover:bg-[var(--brand-green-light)] transition-colors"
          >
            <Camera size={22} strokeWidth={1.5} className="text-[var(--text-muted)]" />
            <span className="text-[10px] text-[var(--text-muted)]">Take photo</span>
          </button>
        )}
      </div>

      <p className="text-xs text-[var(--text-muted)] mb-5 text-center">
        Photos will be watermarked with &quot;sellz.pk&quot; automatically
      </p>

      <button
        onClick={onNext}
        disabled={form.photos.length < 2}
        className="btn-primary w-full justify-center py-3 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Continue ({form.photos.length}/2 min)
        <ChevronRight size={16} strokeWidth={2.5} />
      </button>
    </div>
  );
}

function StepOwnership({ form, setForm, onNext }: { form: FormData; setForm: (f: FormData) => void; onNext: () => void }) {
  function addDoc() {
    setForm({ ...form, ownershipDoc: "https://images.unsplash.com/photo-1568667256549-094345857637?w=400&h=300&fit=crop" });
  }

  return (
    <div>
      <h2 className="text-lg font-bold text-[var(--text-primary)] mb-1">Ownership Proof</h2>
      <p className="text-sm text-[var(--text-muted)] mb-5">Optional — adds a blue Owned badge to your listing</p>

      <div className="card p-4 mb-5">
        <p className="text-sm font-semibold text-[var(--text-primary)] mb-2">Accepted documents:</p>
        <ul className="space-y-1.5">
          {["Purchase invoice / receipt", "Vehicle registration (book)", "Property title deed", "Warranty card"].map(doc => (
            <li key={doc} className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand-blue)] flex-shrink-0" />
              {doc}
            </li>
          ))}
        </ul>
      </div>

      {form.ownershipDoc ? (
        <div className="relative rounded-xl overflow-hidden mb-5" style={{ aspectRatio: "4/3" }}>
          <img src={form.ownershipDoc} alt="Ownership doc" className="w-full h-full object-cover" />
          <button
            onClick={() => setForm({ ...form, ownershipDoc: "" })}
            className="absolute top-2 right-2 w-8 h-8 bg-black/60 rounded-full flex items-center justify-center"
          >
            <X size={15} strokeWidth={2.5} className="text-white" />
          </button>
          <div className="absolute bottom-2 left-2">
            <span className="badge-owned">Document uploaded</span>
          </div>
        </div>
      ) : (
        <button
          onClick={addDoc}
          className="w-full py-10 rounded-xl border-2 border-dashed border-[var(--border)] flex flex-col items-center gap-2 hover:border-[var(--brand-blue)] hover:bg-[var(--brand-blue-light)] transition-colors mb-5"
        >
          <Upload size={28} strokeWidth={1.5} className="text-[var(--text-muted)]" />
          <span className="text-sm font-medium text-[var(--text-secondary)]">Take photo of document</span>
          <span className="text-xs text-[var(--text-muted)]">Camera only</span>
        </button>
      )}

      <button onClick={onNext} className="btn-primary w-full justify-center py-3">
        {form.ownershipDoc ? "Continue with Ownership Proof" : "Skip — No Ownership Proof"}
        <ChevronRight size={16} strokeWidth={2.5} />
      </button>
    </div>
  );
}

function StepDetails({ form, setForm, onNext }: { form: FormData; setForm: (f: FormData) => void; onNext: () => void }) {
  const valid = form.title.trim().length >= 5 && form.price.trim().length > 0;

  return (
    <div>
      <h2 className="text-lg font-bold text-[var(--text-primary)] mb-1">Ad Details</h2>
      <p className="text-sm text-[var(--text-muted)] mb-5">Tell buyers about your item</p>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-semibold text-[var(--text-primary)] mb-1.5 block">Title *</label>
          <input
            type="text"
            placeholder="e.g. Samsung A54 8/128 — Box Pack — PTA Approved"
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
            className="input-base"
            maxLength={80}
          />
          <p className="text-xs text-[var(--text-muted)] mt-1 text-right">{form.title.length}/80</p>
        </div>

        <div>
          <label className="text-sm font-semibold text-[var(--text-primary)] mb-1.5 block">Description</label>
          <textarea
            placeholder="Describe the condition, age, reason for selling, and any known defects..."
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
            className="input-base resize-none"
            rows={4}
            maxLength={1000}
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-[var(--text-primary)] mb-1.5 block">Price (PKR) *</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-[var(--text-muted)]">Rs</span>
            <input
              type="number"
              placeholder="0"
              value={form.price}
              onChange={e => setForm({ ...form, price: e.target.value })}
              className="input-base pl-9"
              min="0"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold text-[var(--text-primary)] mb-2 block">Condition *</label>
          <div className="grid grid-cols-2 gap-2">
            {CONDITIONS.map(c => (
              <button
                key={c}
                onClick={() => setForm({ ...form, condition: c })}
                className={`py-2.5 px-3 rounded-lg border text-xs font-medium text-left transition-colors ${
                  form.condition === c
                    ? "border-[var(--brand-green)] bg-[var(--brand-green-light)] text-[var(--brand-green)]"
                    : "border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--brand-green)]"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={onNext}
        disabled={!valid}
        className="btn-primary w-full justify-center py-3 mt-6 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Review Ad
        <ChevronRight size={16} strokeWidth={2.5} />
      </button>
    </div>
  );
}

function StepReview({ form, onSubmit }: { form: FormData; onSubmit: () => void }) {
  return (
    <div>
      <h2 className="text-lg font-bold text-[var(--text-primary)] mb-1">Review Your Ad</h2>
      <p className="text-sm text-[var(--text-muted)] mb-5">Check everything before submitting</p>

      <div className="card p-4 mb-4">
        {form.photos[0] && (
          <img src={form.photos[0]} alt="" className="w-full aspect-video object-cover rounded-lg mb-3" />
        )}
        <div className="flex gap-2 mb-2">
          <span className="badge-verified"><svg width="10" height="10" viewBox="0 0 10 10" fill="none"><circle cx="5" cy="5" r="5" fill="#1D9E75"/><path d="M2.5 5l1.8 1.8L7.5 3.5" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>Verified</span>
          {form.ownershipDoc && <span className="badge-owned"><svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M5 1L6.2 3.6H9L6.9 5.4L7.7 8L5 6.4L2.3 8L3.1 5.4L1 3.6H3.8L5 1Z" fill="#185FA5"/></svg>Owned</span>}
        </div>
        <p className="text-lg font-bold text-[var(--text-primary)] mb-1">
          {form.price ? `Rs ${Number(form.price).toLocaleString()}` : "—"}
        </p>
        <p className="text-sm font-medium text-[var(--text-primary)] mb-2">{form.title || "—"}</p>
        {form.condition && (
          <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-[var(--bg)] text-[var(--text-secondary)]">
            {form.condition}
          </span>
        )}
        {form.description && (
          <p className="text-xs text-[var(--text-muted)] mt-2 line-clamp-3">{form.description}</p>
        )}
      </div>

      <div className="card p-4 mb-5 flex items-start gap-2">
        <AlertCircle size={15} strokeWidth={2} className="text-[var(--brand-green)] flex-shrink-0 mt-0.5" />
        <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
          By submitting, you confirm this is an accurate listing and you are the owner or authorized seller. Fake listings result in permanent CNIC-level bans.
        </p>
      </div>

      <button onClick={onSubmit} className="btn-primary w-full justify-center py-3">
        Submit for Review
        <Check size={16} strokeWidth={2.5} />
      </button>
    </div>
  );
}

function StepWhatsapp({ onDone }: { onDone: (added: boolean) => void }) {
  const [number, setNumber] = useState("");
  const [chatOnly, setChatOnly] = useState(true);
  const [error, setError] = useState("");

  const valid = /^03\d{9}$/.test(number.replace(/\s/g, ""));

  function save() {
    const cleaned = number.replace(/\s/g, "");
    if (!valid) { setError("Enter valid Pakistani number (03XXXXXXXXX)"); return; }
    onDone(true);
  }

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-6" style={{ background: "var(--bg)" }}>
      <div className="w-full max-w-sm">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mb-5 mx-auto" style={{ background: "rgba(37,211,102,0.12)" }}>
          <svg viewBox="0 0 24 24" fill="#25D366" width="28" height="28">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.49" />
          </svg>
        </div>

        <h2 className="text-xl font-bold text-center mb-1" style={{ color: "var(--text-primary)" }}>
          Add Your WhatsApp
        </h2>
        <p className="text-sm text-center mb-6 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          Buyers respond faster when they can reach you on WhatsApp. Your number stays hidden until you approve it.
        </p>

        <div className="mb-4">
          <label className="text-sm font-semibold block mb-1.5" style={{ color: "var(--text-primary)" }}>
            WhatsApp Number
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium" style={{ color: "var(--text-muted)" }}>
              +92
            </span>
            <input
              type="tel"
              placeholder="03XXXXXXXXX"
              value={number}
              onChange={e => { setNumber(e.target.value); setError(""); }}
              className="input-base pl-12"
              maxLength={11}
            />
          </div>
          {error && <p className="text-xs mt-1" style={{ color: "var(--danger)" }}>{error}</p>}
        </div>

        <button
          onClick={() => setChatOnly(v => !v)}
          className="w-full flex items-center justify-between p-3.5 rounded-xl border mb-5 transition-colors"
          style={{ borderColor: "var(--border)", background: "var(--surface)" }}
        >
          <div className="text-left">
            <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>Show number after chat only</p>
            <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
              Buyer must message first before seeing your number
            </p>
          </div>
          <div
            className="w-11 h-6 rounded-full flex-shrink-0 ml-3 relative transition-colors"
            style={{ background: chatOnly ? "var(--brand-green)" : "var(--border)" }}
          >
            <div
              className="absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all"
              style={{ left: chatOnly ? "calc(100% - 20px)" : 4 }}
            />
          </div>
        </button>

        <button
          onClick={save}
          className="btn-primary w-full justify-center py-3 mb-3"
        >
          Save & Continue
          <Check size={16} strokeWidth={2.5} />
        </button>

        <button
          onClick={() => onDone(false)}
          className="w-full py-2.5 text-sm font-medium text-center transition-colors"
          style={{ color: "var(--text-muted)" }}
        >
          Skip for now
        </button>
      </div>
    </div>
  );
}
