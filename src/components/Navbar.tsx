"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SearchBar } from "./SearchBar";
import { AuthModal } from "./AuthModal";
import {
  Bell, Plus, User, LogOut, FileText, ChevronDown,
  Search, MapPin, X, Check,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { CITY_DATA, CITIES, getAreas } from "@/lib/locations";
import type { User as SupabaseUser } from "@supabase/supabase-js";

type SavedLocation = { city: string; area: string; display: string };

function readSavedLocation(): SavedLocation | null {
  try {
    const raw = localStorage.getItem("sellz_location");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveLocation(loc: SavedLocation) {
  localStorage.setItem("sellz_location", JSON.stringify(loc));
  window.dispatchEvent(new Event("sellz:location"));
}

export function Navbar() {
  const router = useRouter();
  const [authOpen, setAuthOpen] = useState(false);
  const [authTitle, setAuthTitle] = useState<string | undefined>(undefined);
  const [authSubtitle, setAuthSubtitle] = useState<string | undefined>(undefined);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userCitySet, setUserCitySet] = useState(false);
  const [displayName, setDisplayName] = useState("User");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Location selector
  const [locModal, setLocModal] = useState(false);
  const [locCity, setLocCity] = useState("");
  const [locArea, setLocArea] = useState("");
  const [savedLoc, setSavedLoc] = useState<SavedLocation | null>(null);

  useEffect(() => {
    const saved = readSavedLocation();
    if (saved) setSavedLoc(saved);

    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      if (user) {
        const name = user.user_metadata?.full_name ?? user.user_metadata?.name ?? user.email ?? "User";
        setDisplayName(name);
        supabase.from("users").select("city").eq("id", user.id).single().then(({ data }) => {
          if (data?.city) {
            setUserCitySet(true);
            if (!readSavedLocation()) {
              const loc = { city: data.city, area: "", display: data.city };
              setSavedLoc(loc);
              saveLocation(loc);
            }
          }
        });
      }
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    setDropdownOpen(false);
    router.push("/");
    router.refresh();
  }

  function handlePostAd() {
    if (!user) {
      setAuthTitle("Sign in to post your ad");
      setAuthSubtitle("Verified sellers get more trust and faster responses.");
      setAuthOpen(true);
      return;
    }
    if (!userCitySet) {
      router.push("/onboarding");
      return;
    }
    router.push("/post");
  }

  function openLocModal() {
    setLocCity(savedLoc?.city ?? "");
    setLocArea(savedLoc?.area ?? "");
    setLocModal(true);
  }

  function confirmLocation() {
    if (!locCity) return;
    const area = locArea && locArea !== "Other" ? locArea : "";
    const display = area ? `${locCity}, ${area}` : locCity;
    const loc = { city: locCity, area, display };
    setSavedLoc(loc);
    saveLocation(loc);
    setLocModal(false);
  }

  const locLabel = savedLoc?.display ?? "Select City";
  const initial = displayName[0]?.toUpperCase() ?? "U";
  const areas = locCity ? getAreas(locCity) : [];

  return (
    <>
      <header className="sticky top-0 z-30 bg-white border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-2 md:gap-4" style={{ height: 56 }}>
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center gap-1.5">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "var(--brand-green)" }}>
              <span className="text-white font-black text-sm">S</span>
            </div>
            <span className="font-black text-base tracking-tight text-[var(--text-primary)]">
              sellz<span style={{ color: "var(--brand-green)" }}>.pk</span>
            </span>
          </Link>

          {/* Search — desktop only */}
          <div className="hidden md:flex flex-1 max-w-xl">
            <SearchBar city={savedLoc?.city ?? ""} />
          </div>

          {/* Location button — both mobile and desktop */}
          <button
            onClick={openLocModal}
            className="flex items-center gap-1 rounded-lg border px-2 py-1.5 transition-colors hover:border-[var(--brand-green)] flex-shrink-0"
            style={{
              borderColor: "var(--border)",
              background: "var(--bg)",
              color: "var(--text-secondary)",
              fontSize: 12,
              maxWidth: 100,
            }}
          >
            <MapPin size={13} strokeWidth={2} style={{ color: "var(--brand-green)", flexShrink: 0 }} />
            <span className="truncate" style={{ maxWidth: 72 }}>{savedLoc?.city ?? "City"}</span>
          </button>

          {/* Mobile search icon */}
          <Link
            href="/search"
            className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg hover:bg-[var(--bg)] transition-colors ml-auto"
            style={{ color: "var(--text-muted)" }}
          >
            <Search size={18} strokeWidth={2} />
          </Link>

          {/* Right — desktop */}
          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <>
                <button className="flex items-center p-2 text-[var(--text-muted)] hover:text-[var(--brand-green)] transition-colors">
                  <Bell size={18} strokeWidth={2} />
                </button>

                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(v => !v)}
                    className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg hover:bg-[var(--bg)] transition-colors"
                  >
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                      style={{ background: "var(--brand-green)" }}
                    >
                      {initial}
                    </div>
                    <ChevronDown size={14} strokeWidth={2.5} style={{ color: "var(--text-muted)" }} />
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-[var(--border)] rounded-xl shadow-lg py-1 z-50">
                      <div className="px-3 py-2 border-b border-[var(--border)]">
                        <p className="text-xs font-semibold truncate" style={{ color: "var(--text-primary)" }}>{displayName}</p>
                        <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>{savedLoc?.city ?? "—"}</p>
                      </div>
                      <Link
                        href={`/profile/${user.id}`}
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2.5 text-sm hover:bg-[var(--bg)] transition-colors"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        <User size={15} strokeWidth={2} /> My Profile
                      </Link>
                      <Link
                        href="/chats"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2.5 text-sm hover:bg-[var(--bg)] transition-colors"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        <FileText size={15} strokeWidth={2} /> My Ads
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2.5 text-sm hover:bg-red-50 transition-colors text-red-600"
                      >
                        <LogOut size={15} strokeWidth={2} /> Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <button
                onClick={() => { setAuthTitle(undefined); setAuthSubtitle(undefined); setAuthOpen(true); }}
                className="flex items-center gap-1.5 text-sm font-medium px-3 py-2 transition-colors hover:text-[var(--brand-green)]"
                style={{ color: "var(--text-secondary)" }}
              >
                <User size={18} strokeWidth={2} />
                Login
              </button>
            )}
          </div>

          {/* Post Ad button */}
          <button
            onClick={handlePostAd}
            className="btn-primary text-sm flex-shrink-0"
            style={{ padding: "8px 12px", borderRadius: 8, minHeight: 36 }}
          >
            <Plus size={16} strokeWidth={2.5} />
            <span className="hidden sm:inline">Post Ad</span>
          </button>
        </div>
      </header>

      {/* Location modal */}
      {locModal && (
        <>
          <div className="sheet-overlay" onClick={() => setLocModal(false)} />
          <div className="sheet" style={{ maxHeight: "80dvh" }}>
            <div className="flex items-center justify-between px-5 pt-5 pb-3">
              <h3 className="text-base font-bold" style={{ color: "var(--text-primary)" }}>Select Location</h3>
              <button onClick={() => setLocModal(false)} className="p-1 rounded-lg hover:bg-[var(--bg)]">
                <X size={18} strokeWidth={2} style={{ color: "var(--text-muted)" }} />
              </button>
            </div>

            <div className="overflow-y-auto" style={{ maxHeight: "calc(80dvh - 120px)" }}>
              {/* City list */}
              <div className="px-4 pb-2">
                <p className="text-xs font-semibold mb-2 uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>City</p>
                <div className="grid grid-cols-2 gap-2">
                  {CITIES.map(city => (
                    <button
                      key={city}
                      onClick={() => { setLocCity(city); setLocArea(""); }}
                      className="flex items-center justify-between px-3 py-2.5 rounded-xl border text-sm transition-colors"
                      style={{
                        borderColor: locCity === city ? "var(--brand-green)" : "var(--border)",
                        background: locCity === city ? "var(--brand-green-light)" : "var(--bg)",
                        color: locCity === city ? "var(--brand-green)" : "var(--text-secondary)",
                        fontWeight: locCity === city ? 600 : 400,
                      }}
                    >
                      {city}
                      {locCity === city && <Check size={14} strokeWidth={2.5} />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Area list */}
              {locCity && areas.length > 1 && (
                <div className="px-4 pb-4 mt-3">
                  <p className="text-xs font-semibold mb-2 uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>Area (optional)</p>
                  <div className="grid grid-cols-2 gap-2">
                    {areas.map(area => (
                      <button
                        key={area}
                        onClick={() => setLocArea(area === locArea ? "" : area)}
                        className="flex items-center justify-between px-3 py-2 rounded-xl border text-sm transition-colors"
                        style={{
                          borderColor: locArea === area ? "var(--brand-green)" : "var(--border)",
                          background: locArea === area ? "var(--brand-green-light)" : "var(--bg)",
                          color: locArea === area ? "var(--brand-green)" : "var(--text-secondary)",
                          fontWeight: locArea === area ? 600 : 400,
                        }}
                      >
                        {area}
                        {locArea === area && <Check size={14} strokeWidth={2.5} />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="px-5 py-4 border-t border-[var(--border)]">
              <button
                onClick={confirmLocation}
                disabled={!locCity}
                className="btn-primary w-full justify-center"
                style={{ opacity: locCity ? 1 : 0.4 }}
              >
                Confirm Location
              </button>
            </div>
          </div>
        </>
      )}

      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        title={authTitle}
        subtitle={authSubtitle}
      />
    </>
  );
}
