"use client";

import { useState } from "react";
import { X, SlidersHorizontal } from "lucide-react";
import { CONDITIONS } from "@/lib/mockData";

interface FilterSheetProps {
  onApply?: (filters: Filters) => void;
}

interface Filters {
  priceMin: string;
  priceMax: string;
  condition: string;
  verifiedOnly: boolean;
  ownedOnly: boolean;
}

const DEFAULT_FILTERS: Filters = {
  priceMin: "", priceMax: "", condition: "", verifiedOnly: true, ownedOnly: false,
};

export function FilterSheet({ onApply }: FilterSheetProps) {
  const [open, setOpen] = useState(false);
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);

  const activeCount = [
    filters.priceMin, filters.priceMax, filters.condition,
    filters.ownedOnly ? "x" : "",
    !filters.verifiedOnly ? "x" : "",
  ].filter(Boolean).length;

  function handleApply() { onApply?.(filters); setOpen(false); }
  function handleReset() { setFilters(DEFAULT_FILTERS); }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg border bg-white text-sm font-medium transition-colors hover:border-[var(--brand-green)] hover:text-[var(--brand-green)]"
        style={{ borderColor: activeCount > 0 ? "var(--brand-green)" : "var(--border)", color: activeCount > 0 ? "var(--brand-green)" : "var(--text-secondary)" }}
      >
        <SlidersHorizontal size={16} strokeWidth={2} />
        Filters
        {activeCount > 0 && (
          <span className="w-4 h-4 rounded-full text-white text-[10px] font-bold flex items-center justify-center" style={{ background: "var(--brand-green)" }}>
            {activeCount}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="sheet-overlay" onClick={() => setOpen(false)} />
          <div className="sheet p-5">
            <div className="w-10 h-1 bg-[var(--border)] rounded-full mx-auto mb-5" />

            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-semibold text-[var(--text-primary)]">Filters</h3>
              <button onClick={() => setOpen(false)} className="p-1.5 rounded-lg hover:bg-[var(--bg)]">
                <X size={18} strokeWidth={2} />
              </button>
            </div>

            <div className="space-y-5">
              {/* Price range */}
              <div>
                <label className="text-sm font-semibold text-[var(--text-primary)] mb-2 block">Price Range (PKR)</label>
                <div className="flex gap-2 items-center">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.priceMin}
                    onChange={e => setFilters(f => ({ ...f, priceMin: e.target.value }))}
                    className="input-base"
                  />
                  <span className="text-[var(--text-muted)] text-sm flex-shrink-0">—</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.priceMax}
                    onChange={e => setFilters(f => ({ ...f, priceMax: e.target.value }))}
                    className="input-base"
                  />
                </div>
              </div>

              {/* Condition */}
              <div>
                <label className="text-sm font-semibold text-[var(--text-primary)] mb-2 block">Condition</label>
                <div className="grid grid-cols-2 gap-2">
                  {["", ...CONDITIONS].map(c => (
                    <button
                      key={c || "any"}
                      onClick={() => setFilters(f => ({ ...f, condition: c }))}
                      className={`px-3 py-2 rounded-lg border text-xs font-medium text-left transition-colors ${
                        filters.condition === c
                          ? "border-[var(--brand-green)] bg-[var(--brand-green-light)] text-[var(--brand-green)]"
                          : "border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--brand-green)]"
                      }`}
                    >
                      {c || "Any Condition"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Trust toggles */}
              <div className="space-y-3">
                <Toggle
                  label="Verified sellers only"
                  description="CNIC-verified accounts"
                  checked={filters.verifiedOnly}
                  onChange={v => setFilters(f => ({ ...f, verifiedOnly: v }))}
                />
                <Toggle
                  label="Ownership proof"
                  description="Invoice, registration, or title deed uploaded"
                  checked={filters.ownedOnly}
                  onChange={v => setFilters(f => ({ ...f, ownedOnly: v }))}
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleReset}
                className="flex-1 py-3 rounded-lg border border-[var(--border)] text-sm font-semibold text-[var(--text-secondary)] hover:bg-[var(--bg)] transition-colors"
              >
                Reset
              </button>
              <button onClick={handleApply} className="btn-primary flex-1 justify-center py-3 text-sm">
                Show Results
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}

function Toggle({ label, description, checked, onChange }: {
  label: string; description: string; checked: boolean; onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div>
        <p className="text-sm font-medium text-[var(--text-primary)]">{label}</p>
        <p className="text-xs text-[var(--text-muted)]">{description}</p>
      </div>
      <button
        role="switch" aria-checked={checked}
        onClick={() => onChange(!checked)}
        className="relative flex-shrink-0 w-11 h-6 rounded-full transition-colors"
        style={{ background: checked ? "var(--brand-green)" : "var(--border)" }}
      >
        <span
          className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform"
          style={{ transform: checked ? "translateX(20px)" : "translateX(0)" }}
        />
      </button>
    </div>
  );
}
