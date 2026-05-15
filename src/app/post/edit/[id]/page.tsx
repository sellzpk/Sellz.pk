"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, X, Loader2, Check, AlertCircle, Camera, FileImage } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { CONDITIONS, getSubcategoryFields } from "@/lib/categories";
import { getAreas } from "@/lib/locations";
import { BottomNav } from "@/components/BottomNav";
import { SelectWithOther } from "@/components/SelectWithOther";

async function compressImage(file: File, maxPx = 1400, quality = 0.82): Promise<File> {
  return new Promise(resolve => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      let { width, height } = img;
      if (width > maxPx || height > maxPx) {
        if (width >= height) { height = Math.round((height * maxPx) / width); width = maxPx; }
        else { width = Math.round((width * maxPx) / height); height = maxPx; }
      }
      const canvas = document.createElement("canvas");
      canvas.width = width; canvas.height = height;
      canvas.getContext("2d")!.drawImage(img, 0, 0, width, height);
      URL.revokeObjectURL(url);
      canvas.toBlob(
        blob => resolve(blob ? new File([blob], file.name.replace(/\.[^.]+$/, ".jpg"), { type: "image/jpeg" }) : file),
        "image/jpeg", quality
      );
    };
    img.onerror = () => { URL.revokeObjectURL(url); resolve(file); };
    img.src = url;
  });
}

type ExistingPhoto = { id: number; url: string; order_index: number };

type AdData = {
  id: number;
  title: string;
  description: string | null;
  price: number;
  condition: string | null;
  category: string;
  subcategory: string | null;
  city: string | null;
  area: string | null;
  details: Record<string, unknown> | null;
  edit_count: number;
  seller_id: string;
};

export default function EditAdPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const isMobile = typeof navigator !== "undefined" && /Mobi|Android/i.test(navigator.userAgent);

  const [ad, setAd] = useState<AdData | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [userId, setUserId] = useState("");

  const [form, setForm] = useState({
    title: "", description: "", price: "", condition: "", area: "",
    details: {} as Record<string, string | boolean>,
  });
  const [existingPhotos, setExistingPhotos] = useState<ExistingPhoto[]>([]);
  const [removedPhotoIds, setRemovedPhotoIds] = useState<number[]>([]);
  const [newPhotoFiles, setNewPhotoFiles] = useState<File[]>([]);
  const [newPhotoPreviews, setNewPhotoPreviews] = useState<string[]>([]);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.replace("/auth/login"); return; }
      setUserId(user.id);

      const { data } = await supabase
        .from("ads")
        .select("id, title, description, price, condition, category, subcategory, city, area, details, edit_count, seller_id, ad_photos(id, url, order_index)")
        .eq("id", Number(id))
        .eq("seller_id", user.id)
        .single();

      if (!data) { router.replace("/profile/me"); return; }

      setAd(data as AdData);
      setForm({
        title: data.title,
        description: data.description ?? "",
        price: String(data.price),
        condition: data.condition ?? "",
        area: data.area ?? "",
        details: (data.details as Record<string, string | boolean>) ?? {},
      });

      const sorted = [...((data as { ad_photos: ExistingPhoto[] }).ad_photos ?? [])].sort((a, b) => a.order_index - b.order_index);
      setExistingPhotos(sorted);
      setLoading(false);
    }
    if (id) load();
  }, [id, router]);

  function removeExistingPhoto(photoId: number) {
    setRemovedPhotoIds(prev => [...prev, photoId]);
    setExistingPhotos(prev => prev.filter(p => p.id !== photoId));
  }

  async function handleNewPhotos(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    const remaining = 10 - existingPhotos.length - newPhotoFiles.length;
    const toAdd = files.slice(0, remaining);
    const compressed = await Promise.all(toAdd.map(f => compressImage(f)));
    setNewPhotoFiles(prev => [...prev, ...compressed]);
    setNewPhotoPreviews(prev => [...prev, ...compressed.map(f => URL.createObjectURL(f))]);
    e.target.value = "";
  }

  function removeNewPhoto(i: number) {
    URL.revokeObjectURL(newPhotoPreviews[i]);
    setNewPhotoFiles(prev => prev.filter((_, idx) => idx !== i));
    setNewPhotoPreviews(prev => prev.filter((_, idx) => idx !== i));
  }

  function setDetail(key: string, val: string | boolean) {
    setForm(f => ({ ...f, details: { ...f.details, [key]: val } }));
  }

  async function handleSave() {
    setSubmitError("");
    if (form.title.trim().length < 5) return setSubmitError("Title must be at least 5 characters");
    if (!form.price || Number(form.price) <= 0) return setSubmitError("Enter a valid price");
    if (!form.condition) return setSubmitError("Select a condition");
    const totalPhotos = existingPhotos.length + newPhotoFiles.length;
    if (totalPhotos < 2) return setSubmitError("Minimum 2 photos required");

    setSubmitting(true);

    try {
      const supabase = createClient();

      // Use raw POST + X-HTTP-Method-Override: PATCH to bypass iOS Safari PATCH failure
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Session expired — sign in again");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/ads?id=eq.${Number(id)}&seller_id=eq.${encodeURIComponent(userId)}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "apikey": process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            "Authorization": `Bearer ${session.access_token}`,
            "X-HTTP-Method-Override": "PATCH",
            "Prefer": "return=minimal",
          },
          body: JSON.stringify({
            title: form.title.trim(),
            description: form.description || null,
            price: Number(form.price),
            condition: form.condition,
            area: form.area || null,
            details: Object.keys(form.details).length > 0 ? form.details : null,
            status: "pending",
            rejection_reason: null,
            edited_at: new Date().toISOString(),
            edit_count: (ad?.edit_count ?? 0) + 1,
          }),
        }
      );

      if (!res.ok) {
        const errText = await res.text().catch(() => res.statusText);
        throw new Error(`Save failed (${res.status}): ${errText}`);
      }

      if (removedPhotoIds.length > 0) {
        await supabase.from("ad_photos").delete().in("id", removedPhotoIds);
      }

      for (let i = 0; i < newPhotoFiles.length; i++) {
        setUploadProgress(`Uploading photo ${i + 1} of ${newPhotoFiles.length}…`);
        const file = newPhotoFiles[i];
        const path = `${userId}/${id}_edit_${Date.now()}_${i}.jpg`;
        if (file.size > 10 * 1024 * 1024) throw new Error(`Photo ${i + 1} is too large — max 10MB`);
        const buf = await new Promise<ArrayBuffer>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as ArrayBuffer);
          reader.onerror = () => reject(new Error("Failed to read photo"));
          reader.readAsArrayBuffer(file);
        });
        const { error: upErr } = await supabase.storage.from("ad-photos").upload(path, buf, { contentType: "image/jpeg", upsert: true });
        if (upErr) throw new Error(`Failed to upload photo ${i + 1}: ${upErr.message}`);
        const { data: urlData } = supabase.storage.from("ad-photos").getPublicUrl(path);
        await supabase.from("ad_photos").insert({ ad_id: Number(id), url: urlData.publicUrl, order_index: existingPhotos.length + i });
      }

      router.push("/my-ads?updated=true");
    } catch (err: unknown) {
      setSubmitError(err instanceof Error ? err.message : "Save failed — please try again");
    } finally {
      setSubmitting(false);
      setUploadProgress("");
    }
  }

  if (loading) {
    return (
      <div className="min-h-dvh flex items-center justify-center" style={{ background: "var(--bg)" }}>
        <Loader2 size={28} className="animate-spin" style={{ color: "var(--brand-green)" }} />
      </div>
    );
  }

  if (!ad) return null;

  const catFields = getSubcategoryFields(ad.category, ad.subcategory ?? "");
  const areas = getAreas(ad.city ?? "");
  const totalPhotos = existingPhotos.length + newPhotoFiles.length;

  return (
    <div className="min-h-dvh flex flex-col" style={{ background: "var(--bg)" }}>
      <header className="sticky top-0 z-30 bg-white border-b border-[var(--border)]">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center gap-3">
          <Link href="/profile/me" className="p-1.5 -ml-1 rounded-lg hover:bg-[var(--bg)] transition-colors flex items-center justify-center" style={{ minHeight: 44, minWidth: 44 }}>
            <ArrowLeft size={20} strokeWidth={2} />
          </Link>
          <p className="text-sm font-semibold text-[var(--text-primary)] flex-1">Edit Ad</p>
          <span className="text-xs capitalize px-2.5 py-1 rounded-full" style={{ background: "var(--bg)", color: "var(--text-muted)" }}>{ad.subcategory ?? ad.category}</span>
        </div>
      </header>

      <main className="flex-1 pb-24">
        <div className="max-w-lg mx-auto px-4 py-6 space-y-4">

          {/* Notice */}
          <div className="p-4 rounded-xl flex gap-3 items-start" style={{ background: "#FFF8E6", border: "1px solid #FDE68A" }}>
            <span className="text-lg flex-shrink-0">✏️</span>
            <div>
              <p className="text-sm font-semibold" style={{ color: "#92400E" }}>Editing your ad</p>
              <p className="text-xs mt-0.5 leading-relaxed" style={{ color: "#92640A" }}>After saving, your ad goes back for review and will be live again within 24 hours.</p>
            </div>
          </div>

          {/* Category-specific fields */}
          {catFields.length > 0 && (
            <div className="space-y-4">
              {catFields.map(field => {
                if (field.type === "boolean") {
                  const val = !!form.details[field.key];
                  return (
                    <button
                      key={field.key}
                      type="button"
                      onClick={() => setDetail(field.key, !val)}
                      className="w-full flex items-center justify-between p-3.5 rounded-xl border transition-colors"
                      style={{ borderColor: val ? "var(--brand-green)" : "var(--border)", background: val ? "var(--brand-green-light)" : "var(--surface)", minHeight: 52 }}
                    >
                      <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{field.label}</span>
                      <div className="w-11 h-6 rounded-full relative transition-colors flex-shrink-0" style={{ background: val ? "var(--brand-green)" : "var(--border)" }}>
                        <div className="absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all" style={{ left: val ? "calc(100% - 20px)" : 4 }} />
                      </div>
                    </button>
                  );
                }
                if (field.type === "select") {
                  return (
                    <SelectWithOther
                      key={field.key}
                      label={field.label}
                      value={(form.details[field.key] as string) ?? ""}
                      onChange={v => setDetail(field.key, v)}
                      options={field.options!}
                      placeholder={`Select ${field.label.toLowerCase()}`}
                    />
                  );
                }
                return (
                  <div key={field.key}>
                    <label className="text-sm font-semibold block mb-1.5" style={{ color: "var(--text-primary)" }}>{field.label}</label>
                    <input
                      type="text"
                      value={(form.details[field.key] as string) ?? ""}
                      onChange={e => setDetail(field.key, e.target.value)}
                      placeholder={field.placeholder}
                      className="input-base"
                      inputMode={field.type === "number" ? "numeric" : undefined}
                    />
                  </div>
                );
              })}
            </div>
          )}

          {/* Title */}
          <div>
            <label className="text-sm font-semibold block mb-1.5" style={{ color: "var(--text-primary)" }}>Title *</label>
            <input type="text" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className="input-base" maxLength={80} />
            <p className="text-xs text-right mt-1" style={{ color: "var(--text-muted)" }}>{form.title.length}/80</p>
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-semibold block mb-1.5" style={{ color: "var(--text-primary)" }}>Description</label>
            <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="input-base resize-none" rows={4} maxLength={1000} />
          </div>

          {/* Price */}
          <div>
            <label className="text-sm font-semibold block mb-1.5" style={{ color: "var(--text-primary)" }}>Price (PKR) *</label>
            <div className="flex items-center rounded-xl border border-[var(--border)] overflow-hidden focus-within:border-[var(--brand-green)] transition-colors" style={{ background: "white" }}>
              <span className="px-3 self-stretch flex items-center text-sm font-medium border-r border-[var(--border)] select-none flex-shrink-0" style={{ background: "var(--bg)", color: "var(--text-muted)" }}>Rs</span>
              <input
                type="number"
                inputMode="numeric"
                value={form.price}
                onChange={e => setForm(f => ({ ...f, price: e.target.value.replace(/[^0-9]/g, "") }))}
                onKeyDown={e => { if (["e","E","+","-",".",","].includes(e.key)) e.preventDefault(); }}
                className="flex-1 px-3 py-3 text-sm outline-none bg-transparent min-w-0"
                style={{ appearance: "textfield" } as React.CSSProperties}
              />
            </div>
          </div>

          {/* Condition */}
          <div>
            <label className="text-sm font-semibold block mb-2" style={{ color: "var(--text-primary)" }}>Condition *</label>
            <div className="grid grid-cols-2 gap-2">
              {CONDITIONS.map(c => (
                <button
                  key={c}
                  onClick={() => setForm(f => ({ ...f, condition: c }))}
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

          {/* Area */}
          {areas.length > 0 && (
            <div>
              <label className="text-sm font-semibold block mb-1.5" style={{ color: "var(--text-primary)" }}>Area</label>
              <select value={form.area} onChange={e => setForm(f => ({ ...f, area: e.target.value }))} className="input-base">
                <option value="">Select area</option>
                {areas.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
          )}

          {/* Photos */}
          <div>
            <label className="text-sm font-semibold block mb-2" style={{ color: "var(--text-primary)" }}>Photos ({totalPhotos}/10, min 2)</label>

            <div className="grid grid-cols-3 gap-2 mb-3 sm:grid-cols-4">
              {existingPhotos.map((p, i) => (
                <div key={p.id} className="aspect-square rounded-xl overflow-hidden relative">
                  <img src={p.url} alt="" className="w-full h-full object-cover" />
                  <button
                    onClick={() => removeExistingPhoto(p.id)}
                    className="absolute top-1.5 right-1.5 w-7 h-7 bg-black/60 rounded-full flex items-center justify-center"
                  >
                    <X size={13} strokeWidth={2.5} className="text-white" />
                  </button>
                  {i === 0 && existingPhotos.length > 0 && (
                    <span className="absolute bottom-1.5 left-1.5 bg-[var(--brand-green)] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">Cover</span>
                  )}
                </div>
              ))}

              {newPhotoPreviews.map((preview, i) => (
                <div key={`new-${i}`} className="aspect-square rounded-xl overflow-hidden relative">
                  <img src={preview} alt="" className="w-full h-full object-cover" />
                  <button
                    onClick={() => removeNewPhoto(i)}
                    className="absolute top-1.5 right-1.5 w-7 h-7 bg-black/60 rounded-full flex items-center justify-center"
                  >
                    <X size={13} strokeWidth={2.5} className="text-white" />
                  </button>
                </div>
              ))}

              {totalPhotos < 10 && (
                <button
                  onClick={() => inputRef.current?.click()}
                  className="aspect-square rounded-xl border-2 border-dashed border-[var(--border)] flex flex-col items-center justify-center gap-1 hover:border-[var(--brand-green)] hover:bg-[var(--brand-green-light)] transition-colors"
                >
                  {isMobile ? <Camera size={22} strokeWidth={1.5} className="text-[var(--text-muted)]" /> : <FileImage size={22} strokeWidth={1.5} className="text-[var(--text-muted)]" />}
                  <span className="text-[10px] text-[var(--text-muted)]">Add photo</span>
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
              onChange={handleNewPhotos}
            />

            <div className="flex items-start gap-2 p-3 rounded-lg" style={{ background: "var(--bg)" }}>
              <AlertCircle size={13} strokeWidth={2} className="text-[var(--brand-green)] flex-shrink-0 mt-0.5" />
              <p className="text-xs" style={{ color: "var(--text-secondary)" }}>Removing photos from active listings or adding new ones requires re-review.</p>
            </div>
          </div>

          {submitError && (
            <p className="text-xs font-medium text-center" style={{ color: "var(--danger)" }}>{submitError}</p>
          )}
          {uploadProgress && (
            <p className="text-xs font-medium text-center" style={{ color: "var(--brand-green)" }}>{uploadProgress}</p>
          )}

          <button
            onClick={handleSave}
            disabled={submitting}
            className="btn-primary w-full justify-center py-3 disabled:opacity-60"
            style={{ minHeight: 48 }}
          >
            {submitting ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} strokeWidth={2.5} />}
            {submitting ? (uploadProgress || "Saving…") : "Save Changes"}
          </button>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
