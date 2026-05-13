"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { BottomNav } from "@/components/BottomNav";
import { ArrowLeft, Camera, ChevronRight, Check, X, Upload, AlertCircle, Loader2, FileImage } from "lucide-react";
import { CATEGORIES, CONDITIONS } from "@/lib/categories";
import { getAreas } from "@/lib/locations";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

const STEPS = ["Category", "Ownership", "Details", "Photos", "Review"];

interface FormData {
  category: string;
  subcategory: string;
  ownershipDocFile: File | null;
  ownershipDocPreview: string;
  title: string;
  description: string;
  price: string;
  condition: string;
  city: string;
  area: string;
  address: string;
  // category-specific
  brand: string;
  model: string;
  storage: string;
  ptaApproved: boolean;
  vehicleMake: string;
  vehicleModel: string;
  vehicleYear: string;
  vehicleMileage: string;
  fuelType: string;
  transmission: string;
  propertyType: string;
  bedrooms: string;
  areaSize: string;
  purpose: string;
  // photos
  photoFiles: File[];
  photoPreviews: string[];
}

const EMPTY_FORM: FormData = {
  category: "", subcategory: "",
  ownershipDocFile: null, ownershipDocPreview: "",
  title: "", description: "", price: "", condition: "",
  city: "", area: "", address: "",
  brand: "", model: "", storage: "", ptaApproved: false,
  vehicleMake: "", vehicleModel: "", vehicleYear: "", vehicleMileage: "",
  fuelType: "", transmission: "",
  propertyType: "", bedrooms: "", areaSize: "", purpose: "",
  photoFiles: [], photoPreviews: [],
};

export default function PostAdPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [form, setForm] = useState<FormData>(EMPTY_FORM);

  // auth gate
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.replace("/"); return; }
      supabase.from("users").select("city").eq("id", user.id).single().then(({ data }) => {
        if (!data?.city) { router.replace("/onboarding"); return; }
        setForm(f => ({ ...f, city: data.city }));
      });
    });
  }, [router]);

  function next() { setStep(s => Math.min(STEPS.length - 1, s + 1)); }
  function back() { setStep(s => Math.max(0, s - 1)); }

  async function handleSubmit() {
    setSubmitting(true);
    setSubmitError("");
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setSubmitError("Not logged in.");
      setSubmitting(false);
      return;
    }

    if (!form.ownershipDocFile) {
      setSubmitError("Ownership proof is required.");
      setSubmitting(false);
      return;
    }

    // Upload ownership doc
    let ownershipUrl: string | null = null;
    if (form.ownershipDocFile) {
      const ext = form.ownershipDocFile.name.split(".").pop() ?? "jpg";
      const path = `${user.id}/ownership_${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("ad-photos")
        .upload(path, form.ownershipDocFile, { contentType: form.ownershipDocFile.type });
      if (!upErr) {
        const { data: urlData } = supabase.storage.from("ad-photos").getPublicUrl(path);
        ownershipUrl = urlData.publicUrl;
      }
    }

    // Insert ad
    const { data: adData, error: adError } = await supabase
      .from("ads")
      .insert({
        seller_id: user.id,
        title: form.title,
        description: form.description || null,
        price: Number(form.price),
        category: form.category,
        subcategory: form.subcategory || null,
        condition: form.condition || null,
        city: form.city || null,
        area: form.area || null,
        ownership_proof_url: ownershipUrl,
        status: "pending",
      })
      .select("id")
      .single();

    if (adError || !adData) {
      setSubmitError(adError?.message ?? "Failed to submit ad.");
      setSubmitting(false);
      return;
    }

    // Upload photos
    const photoUrls: string[] = [];
    for (let i = 0; i < form.photoFiles.length; i++) {
      const file = form.photoFiles[i];
      setUploadProgress(`Uploading photo ${i + 1} of ${form.photoFiles.length}...`);
      const ext = file.name.split(".").pop() ?? "jpg";
      const path = `${user.id}/${adData.id}_${i}_${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("ad-photos")
        .upload(path, file, { contentType: file.type });
      if (!upErr) {
        const { data: urlData } = supabase.storage.from("ad-photos").getPublicUrl(path);
        photoUrls.push(urlData.publicUrl);
      }
    }

    if (photoUrls.length > 0) {
      await supabase.from("ad_photos").insert(
        photoUrls.map((url, i) => ({ ad_id: adData.id, url, order_index: i }))
      );
    }

    setUploadProgress("");
    setSubmitting(false);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center px-6 text-center" style={{ background: "var(--bg)" }}>
        <div className="w-20 h-20 rounded-full bg-[var(--brand-green-light)] flex items-center justify-center mb-5">
          <Check size={36} strokeWidth={2.5} className="text-[var(--brand-green)]" />
        </div>
        <h2 className="text-xl font-bold text-[var(--text-primary)] mb-1">Ad Submitted for Review</h2>
        <p className="text-sm text-[var(--text-muted)] mb-5">Our team will review your listing shortly</p>

        <div className="card p-4 w-full max-w-sm text-left mb-6">
          <p className="text-xs font-semibold text-[var(--text-muted)] mb-3 uppercase tracking-wide">Our team will check:</p>
          {[
            "Your photos are clear and real",
            "Ownership proof is valid",
            "Price is realistic",
          ].map(item => (
            <div key={item} className="flex items-center gap-2.5 mb-2.5">
              <div className="w-5 h-5 rounded-full bg-[var(--brand-green-light)] flex items-center justify-center flex-shrink-0">
                <Check size={12} strokeWidth={2.5} className="text-[var(--brand-green)]" />
              </div>
              <p className="text-sm text-[var(--text-secondary)]">{item}</p>
            </div>
          ))}
          <p className="text-xs text-[var(--text-muted)] mt-3 pt-3 border-t border-[var(--border)]">
            You&apos;ll receive an email when your ad goes live — usually within 24 hours.
          </p>
        </div>

        <div className="flex gap-3 w-full max-w-sm">
          <Link href="/" className="flex-1 py-3 rounded-xl border border-[var(--border)] text-sm font-semibold text-[var(--text-primary)] text-center">
            Back to Home
          </Link>
          <button
            onClick={() => { setSubmitted(false); setStep(0); setForm(EMPTY_FORM); }}
            className="flex-1 py-3 rounded-xl text-sm font-semibold text-white"
            style={{ background: "var(--brand-green)" }}
          >
            Post Another Ad
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh flex flex-col" style={{ background: "var(--bg)" }}>
      <header className="sticky top-0 z-30 bg-white border-b border-[var(--border)]">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center gap-3">
          {step > 0 ? (
            <button onClick={back} className="p-1.5 -ml-1 rounded-lg hover:bg-[var(--bg)] transition-colors" style={{ minHeight: 44, minWidth: 44 }}>
              <ArrowLeft size={20} strokeWidth={2} />
            </button>
          ) : (
            <Link href="/" className="p-1.5 -ml-1 rounded-lg hover:bg-[var(--bg)] transition-colors flex items-center justify-center" style={{ minHeight: 44, minWidth: 44 }}>
              <X size={20} strokeWidth={2} />
            </Link>
          )}
          <div className="flex-1">
            <p className="text-sm font-semibold text-[var(--text-primary)]">{STEPS[step]}</p>
            <p className="text-xs text-[var(--text-muted)]">Step {step + 1} of {STEPS.length}</p>
          </div>
          {/* Step dots */}
          <div className="flex gap-1">
            {STEPS.map((_, i) => (
              <div
                key={i}
                className="rounded-full transition-all"
                style={{
                  width: i === step ? 16 : 6,
                  height: 6,
                  background: i <= step ? "var(--brand-green)" : "var(--border)",
                }}
              />
            ))}
          </div>
        </div>
        <div className="h-0.5 bg-[var(--border)]">
          <div
            className="h-full transition-all duration-300"
            style={{ width: `${((step + 1) / STEPS.length) * 100}%`, background: "var(--brand-green)" }}
          />
        </div>
      </header>

      <main className="flex-1 pb-24">
        <div className="max-w-lg mx-auto px-4 py-6">
          {step === 0 && <StepCategory form={form} setForm={setForm} onNext={next} />}
          {step === 1 && <StepOwnership form={form} setForm={setForm} onNext={next} />}
          {step === 2 && <StepDetails form={form} setForm={setForm} onNext={next} />}
          {step === 3 && <StepPhotos form={form} setForm={setForm} onNext={next} />}
          {step === 4 && (
            <StepReview
              form={form}
              onSubmit={handleSubmit}
              submitting={submitting}
              uploadProgress={uploadProgress}
              submitError={submitError}
            />
          )}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}

// ─── Step Category ────────────────────────────────────────────────────────────

function StepCategory({ form, setForm, onNext }: { form: FormData; setForm: (f: FormData) => void; onNext: () => void }) {
  const [pickedCat, setPickedCat] = useState("");
  const selected = CATEGORIES.find(c => c.slug === pickedCat);

  if (pickedCat && selected) {
    return (
      <div>
        <button
          onClick={() => setPickedCat("")}
          className="flex items-center gap-1.5 text-sm mb-4 font-medium"
          style={{ color: "var(--brand-green)", minHeight: 44 }}
        >
          <ArrowLeft size={15} strokeWidth={2} /> {selected.label}
        </button>
        <h2 className="text-lg font-bold text-[var(--text-primary)] mb-1">Choose Subcategory</h2>
        <p className="text-sm text-[var(--text-muted)] mb-5">What type of {selected.label.toLowerCase()}?</p>
        <div className="space-y-2">
          {selected.subcategories.map(sub => (
            <button
              key={sub}
              onClick={() => { setForm({ ...form, category: pickedCat, subcategory: sub }); onNext(); }}
              className="w-full flex items-center justify-between px-4 rounded-xl border text-sm font-medium text-left transition-colors hover:border-[var(--brand-green)] hover:bg-[var(--brand-green-light)]"
              style={{ borderColor: "var(--border)", color: "var(--text-primary)", minHeight: 52 }}
            >
              {sub}
              <ChevronRight size={15} strokeWidth={2} style={{ color: "var(--text-muted)" }} />
            </button>
          ))}
          <button
            onClick={() => { setForm({ ...form, category: pickedCat, subcategory: "" }); onNext(); }}
            className="w-full px-4 rounded-xl text-sm text-center"
            style={{ color: "var(--text-muted)", minHeight: 44 }}
          >
            Skip subcategory
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-lg font-bold text-[var(--text-primary)] mb-1">Choose Category</h2>
      <p className="text-sm text-[var(--text-muted)] mb-5">What are you selling?</p>
      <div className="grid grid-cols-3 gap-3">
        {CATEGORIES.map(({ slug, label, Icon, color, iconColor }) => (
          <button
            key={slug}
            onClick={() => setPickedCat(slug)}
            className="card p-4 flex flex-col items-center gap-2 transition-all hover:border-[var(--brand-green)]"
            style={{ minHeight: 80 }}
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

// ─── Step Ownership ───────────────────────────────────────────────────────────

function StepOwnership({ form, setForm, onNext }: { form: FormData; setForm: (f: FormData) => void; onNext: () => void }) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const preview = URL.createObjectURL(file);
    setForm({ ...form, ownershipDocFile: file, ownershipDocPreview: preview });
  }

  return (
    <div>
      <h2 className="text-lg font-bold text-[var(--text-primary)] mb-1">Ownership Proof</h2>
      <p className="text-sm text-[var(--text-muted)] mb-5">Required — proves you own the item you&apos;re selling</p>

      <div className="card p-4 mb-5" style={{ background: "#fffbeb", borderColor: "#fde68a" }}>
        <p className="text-sm font-semibold text-[var(--text-primary)] mb-2">How to take this photo:</p>
        <ol className="space-y-1.5 list-decimal list-inside">
          {[
            "Write your full name on a piece of paper",
            "Place it next to your CNIC and the item",
            "Take a clear photo of all three together",
          ].map(step => (
            <li key={step} className="text-xs text-[var(--text-secondary)]">{step}</li>
          ))}
        </ol>
      </div>

      {form.ownershipDocPreview ? (
        <div className="relative rounded-xl overflow-hidden mb-5" style={{ aspectRatio: "4/3" }}>
          <img src={form.ownershipDocPreview} alt="Ownership doc" className="w-full h-full object-cover" />
          <button
            onClick={() => setForm({ ...form, ownershipDocFile: null, ownershipDocPreview: "" })}
            className="absolute top-2 right-2 w-9 h-9 bg-black/60 rounded-full flex items-center justify-center"
          >
            <X size={16} strokeWidth={2.5} className="text-white" />
          </button>
          <div className="absolute bottom-2 left-2">
            <span className="badge-owned">Document added</span>
          </div>
        </div>
      ) : (
        <button
          onClick={() => inputRef.current?.click()}
          className="w-full py-10 rounded-xl border-2 border-dashed border-[var(--border)] flex flex-col items-center gap-2 hover:border-[var(--brand-blue)] hover:bg-[var(--brand-blue-light)] transition-colors mb-5"
        >
          <Upload size={28} strokeWidth={1.5} className="text-[var(--text-muted)]" />
          <span className="text-sm font-medium text-[var(--text-secondary)]">Take photo of document</span>
          <span className="text-xs text-[var(--text-muted)]">Camera or gallery</span>
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFile}
      />

      <button
        onClick={onNext}
        disabled={!form.ownershipDocFile}
        className="btn-primary w-full justify-center py-3 disabled:opacity-40 disabled:cursor-not-allowed"
        style={{ minHeight: 48 }}
      >
        Continue with Ownership Proof
        <ChevronRight size={16} strokeWidth={2.5} />
      </button>
    </div>
  );
}

// ─── Step Details ─────────────────────────────────────────────────────────────

const MOBILE_BRANDS = ["Samsung", "Apple", "Xiaomi", "Oppo", "Vivo", "Realme", "Tecno", "Infinix", "Nokia", "Other"];
const FUEL_TYPES = ["Petrol", "Diesel", "CNG", "Hybrid", "Electric"];
const TRANSMISSIONS = ["Manual", "Automatic", "CVT"];
const PROPERTY_TYPES = ["Apartment", "House", "Plot", "Shop", "Office", "Warehouse", "Other"];
const ELECTRONICS_BRANDS = ["Samsung", "LG", "Sony", "Haier", "TCL", "Dawlance", "PEL", "Kenwood", "Gree", "Other"];

function StepDetails({ form, setForm, onNext }: { form: FormData; setForm: (f: FormData) => void; onNext: () => void }) {
  const areas = getAreas(form.city);
  const valid = form.title.trim().length >= 5 && form.price.trim().length > 0 && form.condition.length > 0;
  const cat = form.category;

  return (
    <div>
      <h2 className="text-lg font-bold text-[var(--text-primary)] mb-1">Ad Details</h2>
      <p className="text-sm text-[var(--text-muted)] mb-5">Tell buyers about your item</p>

      <div className="space-y-4">
        {/* Category-specific fields */}
        {cat === "mobiles" && (
          <>
            <SelectField label="Brand" value={form.brand} onChange={v => setForm({ ...form, brand: v })} options={MOBILE_BRANDS} placeholder="Select brand" />
            <TextField label="Model" value={form.model} onChange={v => setForm({ ...form, model: v })} placeholder="e.g. Galaxy A54" />
            <SelectField label="Storage" value={form.storage} onChange={v => setForm({ ...form, storage: v })} options={["16GB","32GB","64GB","128GB","256GB","512GB","1TB"]} placeholder="Select storage" />
            <ToggleField label="PTA Approved" value={form.ptaApproved} onChange={v => setForm({ ...form, ptaApproved: v })} />
          </>
        )}

        {cat === "vehicles" && (
          <>
            <TextField label="Make" value={form.vehicleMake} onChange={v => setForm({ ...form, vehicleMake: v })} placeholder="e.g. Toyota, Honda, Suzuki" />
            <TextField label="Model" value={form.vehicleModel} onChange={v => setForm({ ...form, vehicleModel: v })} placeholder="e.g. Corolla, Civic, Alto" />
            <TextField label="Year" value={form.vehicleYear} onChange={v => setForm({ ...form, vehicleYear: v })} placeholder="e.g. 2022" inputMode="numeric" />
            <TextField label="Mileage (km)" value={form.vehicleMileage} onChange={v => setForm({ ...form, vehicleMileage: v })} placeholder="e.g. 45000" inputMode="numeric" />
            <SelectField label="Fuel Type" value={form.fuelType} onChange={v => setForm({ ...form, fuelType: v })} options={FUEL_TYPES} placeholder="Select fuel type" />
            <SelectField label="Transmission" value={form.transmission} onChange={v => setForm({ ...form, transmission: v })} options={TRANSMISSIONS} placeholder="Select transmission" />
          </>
        )}

        {cat === "property" && (
          <>
            <SelectField label="Property Type" value={form.propertyType} onChange={v => setForm({ ...form, propertyType: v })} options={PROPERTY_TYPES} placeholder="Select type" />
            <SelectField label="Bedrooms" value={form.bedrooms} onChange={v => setForm({ ...form, bedrooms: v })} options={["Studio","1","2","3","4","5","6+"]} placeholder="Select bedrooms" />
            <TextField label="Area Size" value={form.areaSize} onChange={v => setForm({ ...form, areaSize: v })} placeholder="e.g. 240 sq yards, 5 marla" />
            <SelectField label="Purpose" value={form.purpose} onChange={v => setForm({ ...form, purpose: v })} options={["For Sale","For Rent"]} placeholder="Sale or Rent?" />
          </>
        )}

        {(cat === "electronics" || cat === "appliances") && (
          <>
            <SelectField label="Brand" value={form.brand} onChange={v => setForm({ ...form, brand: v })} options={ELECTRONICS_BRANDS} placeholder="Select brand" />
            <TextField label="Model" value={form.model} onChange={v => setForm({ ...form, model: v })} placeholder={'e.g. 55" QLED 4K'} />
          </>
        )}

        {/* Common fields */}
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
          <div className="flex items-center rounded-xl border border-[var(--border)] overflow-hidden focus-within:border-[var(--brand-green)] transition-colors" style={{ background: "white" }}>
            <span className="px-3 self-stretch flex items-center text-sm font-medium border-r border-[var(--border)] select-none flex-shrink-0" style={{ background: "var(--bg)", color: "var(--text-muted)" }}>Rs</span>
            <input
              type="number"
              inputMode="numeric"
              placeholder="0"
              value={form.price}
              onChange={e => setForm({ ...form, price: e.target.value.replace(/[^0-9]/g, "") })}
              onKeyDown={e => { if (["e", "E", "+", "-", ".", ","].includes(e.key)) e.preventDefault(); }}
              className="flex-1 px-3 py-3 text-sm outline-none bg-transparent min-w-0"
              min="0"
              style={{ appearance: "textfield" } as React.CSSProperties}
            />
          </div>
          {form.price && (
            <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>Rs {Number(form.price).toLocaleString("en-PK")}</p>
          )}
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
                style={{ minHeight: 44 }}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold text-[var(--text-primary)] mb-1.5 block">City</label>
          <div className="input-base flex items-center gap-2 opacity-70 cursor-not-allowed">
            <span>{form.city || "Not set"}</span>
            <span className="text-xs ml-auto" style={{ color: "var(--text-muted)" }}>from profile</span>
          </div>
        </div>

        {areas.length > 0 && (
          <div>
            <label className="text-sm font-semibold text-[var(--text-primary)] mb-1.5 block">Area</label>
            <select
              value={form.area}
              onChange={e => setForm({ ...form, area: e.target.value })}
              className="input-base"
            >
              <option value="">Select area</option>
              {areas.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>
        )}

        {form.area === "Other" && (
          <div>
            <label className="text-sm font-semibold text-[var(--text-primary)] mb-1.5 block">Enter area name</label>
            <input
              type="text"
              placeholder="e.g. Johar Block 9"
              value=""
              onChange={e => setForm({ ...form, area: e.target.value })}
              className="input-base"
            />
          </div>
        )}

        <div>
          <label className="text-sm font-semibold text-[var(--text-primary)] mb-1.5 block">
            Address detail <span className="font-normal text-[var(--text-muted)]">(optional)</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Near Masjid, Block 5 main road"
            value={form.address}
            onChange={e => setForm({ ...form, address: e.target.value })}
            className="input-base"
            maxLength={120}
          />
        </div>
      </div>

      <button
        onClick={onNext}
        disabled={!valid}
        className="btn-primary w-full justify-center py-3 mt-6 disabled:opacity-40 disabled:cursor-not-allowed"
        style={{ minHeight: 48 }}
      >
        Continue to Photos
        <ChevronRight size={16} strokeWidth={2.5} />
      </button>
    </div>
  );
}

// ─── Helper form controls ─────────────────────────────────────────────────────

function TextField({ label, value, onChange, placeholder, inputMode }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
}) {
  return (
    <div>
      <label className="text-sm font-semibold text-[var(--text-primary)] mb-1.5 block">{label}</label>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        className="input-base"
        inputMode={inputMode}
      />
    </div>
  );
}

function SelectField({ label, value, onChange, options, placeholder }: {
  label: string; value: string; onChange: (v: string) => void; options: string[]; placeholder?: string;
}) {
  return (
    <div>
      <label className="text-sm font-semibold text-[var(--text-primary)] mb-1.5 block">{label}</label>
      <select value={value} onChange={e => onChange(e.target.value)} className="input-base">
        <option value="">{placeholder ?? "Select..."}</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

function ToggleField({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className="w-full flex items-center justify-between p-3.5 rounded-xl border transition-colors"
      style={{ borderColor: value ? "var(--brand-green)" : "var(--border)", background: value ? "var(--brand-green-light)" : "var(--surface)", minHeight: 52 }}
    >
      <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{label}</span>
      <div
        className="w-11 h-6 rounded-full relative transition-colors flex-shrink-0"
        style={{ background: value ? "var(--brand-green)" : "var(--border)" }}
      >
        <div
          className="absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all"
          style={{ left: value ? "calc(100% - 20px)" : 4 }}
        />
      </div>
    </button>
  );
}

// ─── Step Photos ──────────────────────────────────────────────────────────────

function StepPhotos({ form, setForm, onNext }: { form: FormData; setForm: (f: FormData) => void; onNext: () => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const isMobile = typeof navigator !== "undefined" && /Mobi|Android/i.test(navigator.userAgent);

  function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    const remaining = 10 - form.photoFiles.length;
    const toAdd = files.slice(0, remaining);
    const newFiles = [...form.photoFiles, ...toAdd];
    const newPreviews = [...form.photoPreviews, ...toAdd.map(f => URL.createObjectURL(f))];
    setForm({ ...form, photoFiles: newFiles, photoPreviews: newPreviews });
    e.target.value = "";
  }

  function removePhoto(i: number) {
    URL.revokeObjectURL(form.photoPreviews[i]);
    const newFiles = form.photoFiles.filter((_, idx) => idx !== i);
    const newPreviews = form.photoPreviews.filter((_, idx) => idx !== i);
    setForm({ ...form, photoFiles: newFiles, photoPreviews: newPreviews });
  }

  return (
    <div>
      <h2 className="text-lg font-bold text-[var(--text-primary)] mb-1">Add Photos</h2>
      <p className="text-sm text-[var(--text-muted)] mb-3">Minimum 2, maximum 10 photos</p>

      <div className="card p-3 mb-5 flex items-start gap-2">
        <AlertCircle size={15} strokeWidth={2} className="text-[var(--brand-green)] flex-shrink-0 mt-0.5" />
        <p className="text-xs text-[var(--text-secondary)]">
          <strong>Take live photos</strong> of your actual item — no stock images or downloaded photos.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-5 sm:grid-cols-3">
        {form.photoPreviews.map((preview, i) => (
          <div key={i} className="aspect-square rounded-xl overflow-hidden relative">
            <img src={preview} alt="" className="w-full h-full object-cover" />
            <button
              onClick={() => removePhoto(i)}
              className="absolute top-1.5 right-1.5 w-7 h-7 bg-black/60 rounded-full flex items-center justify-center"
            >
              <X size={13} strokeWidth={2.5} className="text-white" />
            </button>
            {i === 0 && (
              <span className="absolute bottom-1.5 left-1.5 bg-[var(--brand-green)] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                Cover
              </span>
            )}
          </div>
        ))}

        {form.photoFiles.length < 10 && (
          <button
            onClick={() => inputRef.current?.click()}
            className="aspect-square rounded-xl border-2 border-dashed border-[var(--border)] flex flex-col items-center justify-center gap-1 hover:border-[var(--brand-green)] hover:bg-[var(--brand-green-light)] transition-colors"
          >
            {isMobile ? (
              <Camera size={24} strokeWidth={1.5} className="text-[var(--text-muted)]" />
            ) : (
              <FileImage size={24} strokeWidth={1.5} className="text-[var(--text-muted)]" />
            )}
            <span className="text-[10px] text-[var(--text-muted)]">{isMobile ? "Take photo" : "Add photo"}</span>
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture={isMobile ? "environment" : undefined}
        multiple={!isMobile}
        className="hidden"
        onChange={handleFiles}
      />

      <p className="text-xs text-[var(--text-muted)] mb-5 text-center">
        Photos are watermarked with &quot;sellz.pk&quot; automatically
      </p>

      <button
        onClick={onNext}
        disabled={form.photoFiles.length < 2}
        className="btn-primary w-full justify-center py-3 disabled:opacity-40 disabled:cursor-not-allowed"
        style={{ minHeight: 48 }}
      >
        Continue ({form.photoFiles.length}/2 min)
        <ChevronRight size={16} strokeWidth={2.5} />
      </button>
    </div>
  );
}

// ─── Step Review ──────────────────────────────────────────────────────────────

function StepReview({ form, onSubmit, submitting, uploadProgress, submitError }: {
  form: FormData;
  onSubmit: () => void;
  submitting: boolean;
  uploadProgress: string;
  submitError: string;
}) {
  return (
    <div>
      <h2 className="text-lg font-bold text-[var(--text-primary)] mb-1">Review Your Ad</h2>
      <p className="text-sm text-[var(--text-muted)] mb-5">Check everything before submitting</p>

      <div className="card p-4 mb-4">
        {form.photoPreviews[0] && (
          <img src={form.photoPreviews[0]} alt="" className="w-full aspect-video object-cover rounded-lg mb-3" />
        )}
        <div className="flex gap-2 mb-2 flex-wrap">
          <span className="badge-verified">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <circle cx="5" cy="5" r="5" fill="#1D9E75"/>
              <path d="M2.5 5l1.8 1.8L7.5 3.5" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Verified
          </span>
          {form.ownershipDocPreview && (
            <span className="badge-owned">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M5 1L6.2 3.6H9L6.9 5.4L7.7 8L5 6.4L2.3 8L3.1 5.4L1 3.6H3.8L5 1Z" fill="#185FA5"/>
              </svg>
              Owned
            </span>
          )}
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
        {form.city && (
          <p className="text-xs text-[var(--text-muted)] mt-1.5">{[form.city, form.area].filter(Boolean).join(", ")}</p>
        )}
        {form.description && (
          <p className="text-xs text-[var(--text-muted)] mt-2 line-clamp-3">{form.description}</p>
        )}
        <p className="text-xs text-[var(--text-muted)] mt-2">{form.photoPreviews.length} photo{form.photoPreviews.length !== 1 ? "s" : ""}</p>
      </div>

      <div className="card p-4 mb-5 flex items-start gap-2">
        <AlertCircle size={15} strokeWidth={2} className="text-[var(--brand-green)] flex-shrink-0 mt-0.5" />
        <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
          By submitting you confirm this is an accurate listing and you are the owner. Fake listings result in permanent CNIC-level bans.
        </p>
      </div>

      {submitError && (
        <p className="text-xs font-medium mb-3 text-center" style={{ color: "var(--danger)" }}>{submitError}</p>
      )}

      {uploadProgress && (
        <p className="text-xs font-medium mb-3 text-center text-[var(--brand-green)]">{uploadProgress}</p>
      )}

      <button
        onClick={onSubmit}
        disabled={submitting}
        className="btn-primary w-full justify-center py-3 disabled:opacity-60"
        style={{ minHeight: 48 }}
      >
        {submitting ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} strokeWidth={2.5} />}
        {submitting ? (uploadProgress || "Submitting...") : "Submit for Review"}
      </button>
    </div>
  );
}
