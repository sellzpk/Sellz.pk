"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SearchBar } from "./SearchBar";
import { AuthModal } from "./AuthModal";
import { Bell, Plus, User, LogOut, FileText, ChevronDown, Search } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";

export function Navbar() {
  const router = useRouter();
  const [authOpen, setAuthOpen] = useState(false);
  const [authTitle, setAuthTitle] = useState<string | undefined>(undefined);
  const [authSubtitle, setAuthSubtitle] = useState<string | undefined>(undefined);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userCity, setUserCity] = useState("Pakistan");
  const [userCitySet, setUserCitySet] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      if (user) {
        supabase.from("users").select("city, full_name").eq("id", user.id).single().then(({ data }) => {
          if (data?.city) { setUserCity(data.city); setUserCitySet(true); }
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

  const displayName = user?.user_metadata?.full_name ?? user?.email ?? "User";
  const initial = displayName[0]?.toUpperCase() ?? "U";

  return (
    <>
      <header className="sticky top-0 z-30 bg-white border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-4" style={{ height: 56 }}>
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
            <SearchBar city={userCity} />
          </div>

          {/* Right */}
          <div className="ml-auto flex items-center gap-2">
            {/* Mobile search icon */}
            <Link
              href="/search"
              className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg hover:bg-[var(--bg)] transition-colors"
              style={{ color: "var(--text-muted)" }}
            >
              <Search size={18} strokeWidth={2} />
            </Link>

            {user ? (
              <>
                <button className="hidden md:flex items-center p-2 text-[var(--text-muted)] hover:text-[var(--brand-green)] transition-colors">
                  <Bell size={18} strokeWidth={2} />
                </button>

                <div className="relative hidden md:block" ref={dropdownRef}>
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
                        <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>{userCity}</p>
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
                className="hidden md:flex items-center gap-1.5 text-sm font-medium px-3 py-2 transition-colors hover:text-[var(--brand-green)]"
                style={{ color: "var(--text-secondary)" }}
              >
                <User size={18} strokeWidth={2} />
                Login
              </button>
            )}

            <button
              onClick={handlePostAd}
              className="btn-primary text-sm"
              style={{ padding: "8px 14px", borderRadius: 8, minHeight: 36 }}
            >
              <Plus size={16} strokeWidth={2.5} />
              <span className="hidden sm:inline">Post Ad</span>
              <span className="sm:hidden sr-only">Post Ad</span>
            </button>
          </div>
        </div>
      </header>

      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        title={authTitle}
        subtitle={authSubtitle}
      />
    </>
  );
}
