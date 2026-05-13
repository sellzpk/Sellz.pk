"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, Search, Plus, MessageCircle, User } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { AuthModal } from "./AuthModal";
import type { User as SupabaseUser } from "@supabase/supabase-js";

export function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [cnicVerified, setCnicVerified] = useState(false);
  const [citySet, setCitySet] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      if (user) {
        supabase.from("users").select("cnic_verified, city").eq("id", user.id).single().then(({ data }) => {
          setCnicVerified(data?.cnic_verified ?? false);
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
    { href: "/", icon: Home, label: "Home" },
    { href: "/search", icon: Search, label: "Search" },
    { href: "/chats", icon: MessageCircle, label: "Chats" },
    { href: user ? "/profile/me" : "/auth/login", icon: User, label: "Profile" },
  ];

  return (
    <>
      <nav
        className="fixed bottom-0 left-0 right-0 z-30 md:hidden bg-white border-t border-[var(--border)]"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      >
        <div className="flex items-center h-14">
          {/* Home + Search */}
          {links.slice(0, 2).map(item => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex-1 flex flex-col items-center justify-center py-2 gap-0.5 transition-colors"
                style={{ color: active ? "var(--brand-green)" : "var(--text-muted)" }}
              >
                <item.icon size={20} strokeWidth={active ? 2.5 : 2} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            );
          })}

          {/* Post button — center, raised */}
          <div className="flex-1 flex items-center justify-center" style={{ marginTop: -16 }}>
            <button
              onClick={handlePost}
              aria-label="Post Ad"
              className="flex items-center justify-center rounded-full shadow-lg transition-transform active:scale-95"
              style={{
                width: 52,
                height: 52,
                background: "var(--brand-green)",
                border: "3px solid #fff",
              }}
            >
              <Plus size={24} strokeWidth={2.5} className="text-white" />
            </button>
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
