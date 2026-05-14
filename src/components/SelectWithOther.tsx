"use client";

import { useState } from "react";

export function SelectWithOther({
  label,
  value,
  onChange,
  options,
  placeholder = "Select...",
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder?: string;
  required?: boolean;
}) {
  const isOther = !!value && !options.includes(value);
  const [showCustom, setShowCustom] = useState(isOther);
  const [customValue, setCustomValue] = useState(isOther ? value : "");

  function handleSelect(e: React.ChangeEvent<HTMLSelectElement>) {
    const val = e.target.value;
    if (val === "__other__") {
      setShowCustom(true);
      onChange(customValue || "");
    } else {
      setShowCustom(false);
      setCustomValue("");
      onChange(val);
    }
  }

  return (
    <div>
      <label className="text-sm font-semibold text-[var(--text-primary)] mb-1.5 block">
        {label}{required ? " *" : ""}
      </label>
      <select
        value={showCustom ? "__other__" : value}
        onChange={handleSelect}
        className="input-base"
      >
        <option value="">{placeholder}</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
        <option value="__other__">Other (specify)</option>
      </select>
      {showCustom && (
        <input
          value={customValue}
          onChange={e => { setCustomValue(e.target.value); onChange(e.target.value); }}
          placeholder={`Enter ${label.toLowerCase()}...`}
          autoFocus
          className="input-base mt-2"
        />
      )}
    </div>
  );
}
