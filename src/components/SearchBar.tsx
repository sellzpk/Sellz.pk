"use client";

import { useState } from "react";
import { Search, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";

interface SearchBarProps {
  city?: string;
  large?: boolean;
  defaultValue?: string;
}

export function SearchBar({ city = "Karachi", large = false, defaultValue = "" }: SearchBarProps) {
  const [query, setQuery] = useState(defaultValue);
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-stretch gap-0 w-full">
      <div className={`flex-1 flex items-center gap-2 bg-white border-1.5 border-[var(--border)] ${large ? "rounded-l-12 px-4 py-3" : "rounded-l-lg px-3 py-2.5"} border border-[var(--border)] focus-within:border-[var(--brand-green)] focus-within:shadow-[0_0_0_3px_rgba(29,158,117,0.1)] transition-all`}>
        <Search size={large ? 20 : 16} strokeWidth={2} className="text-[var(--text-muted)] flex-shrink-0" />
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search mobiles, cars, property..."
          className="flex-1 bg-transparent outline-none text-[var(--text-primary)] placeholder:text-[var(--text-muted)] font-medium"
          style={{ fontSize: large ? 16 : 14 }}
        />
      </div>
      <div className="flex items-center gap-1.5 px-3 py-2.5 border-t border-b border-[var(--border)] bg-white text-xs font-medium text-[var(--text-secondary)] border-x-0">
        <MapPin size={13} strokeWidth={2} className="text-[var(--brand-green)]" />
        <span>{city}</span>
      </div>
      <button
        type="submit"
        className="btn-primary rounded-l-none"
        style={{ borderRadius: "0 8px 8px 0", paddingLeft: 16, paddingRight: 16 }}
      >
        Search
      </button>
    </form>
  );
}
