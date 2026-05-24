"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, LayoutList, Plus, MessageCircle, User } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { AuthModal } from "./AuthModal";
import type { User as SupabaseUser } from "@supabase/supabase-js";

export function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [citySet, setCitySet] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      if (user) {
        supabase.from("users").select("city").eq("id", user.id).single().then(({ data }) => {
          setCitySet(!!data?.city);
        });
      }
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  function handlePost() {
    if (!user) { setAuthOpen(true); return; }
    if (!citySet) { router.push("/onboarding"); return; }
    router.push("/post");
  }

  const links = [
    { href: "/",                                    icon: Home,          label: "Home" },
    { href: user ? "/my-ads" : "/auth/login",       icon: LayoutList,    label: "My Ads" },
    { href: user ? "/chats" : "/auth/login",         icon: MessageCircle, label: "Chats" },
    { href: user ? "/profile/me" : "/auth/login",   icon: User,          label: "Profile" },
  ];

  return (
    <>
      <nav
        className="fixed bottom-0 left-0 right-0 z-30 md:hidden bg-white border-t border-[var(--border)]"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      >
        <div className="flex items-center h-14">
          {/* Home + My Ads */}
          {links.slice(0, 2).map(item => {
            const active = pathname === item.href || (item.label === "My Ads" && pathname.startsWith("/my-ads"));
            return (
              <Link
                key={item.label}
                href={item.href}
                className="flex-1 flex flex-col items-center justify-center py-2 gap-0.5 transition-colors"
                style={{ color: active ? "var(--brand-green)" : "var(--text-muted)" }}
              >
                <item.icon size={20} strokeWidth={active ? 2.5 : 2} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            );
          })}

          {/* Sell button — center, raised */}
          <div className="flex-1 flex flex-col items-center justify-center" style={{ gap: 3 }}>
            <button
              onClick={handlePost}
              aria-label="Sell"
              className="flex items-center justify-center rounded-full transition-transform active:scale-95"
              style={{
                width: 52,
                height: 52,
                background: "linear-gradient(135deg, #1D9E75, #157A5A)",
                border: "3px solid #fff",
                boxShadow: "0 4px 12px rgba(29,158,117,0.4)",
                marginTop: -20,
              }}
            >
              <Plus size={24} strokeWidth={2.5} color="white" />
            </button>
            <span className="text-[10px] font-medium" style={{ color: "var(--text-muted)" }}>Sell</span>
          </div>

          {/* Chats + Profile */}
          {links.slice(2).map(item => {
            const active = pathname === item.href || (item.label === "Profile" && pathname.startsWith("/profile"));
            return (
              <Link
                key={item.label}
                href={item.href}
                className="flex-1 flex flex-col items-center justify-center py-2 gap-0.5 transition-colors"
                style={{ color: active ? "var(--brand-green)" : "var(--text-muted)" }}
              >
                <item.icon size={20} strokeWidth={active ? 2.5 : 2} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        title="Sign in to post your ad"
        subtitle="Verified sellers get more trust and faster responses."
      />
    </>
  );
}
