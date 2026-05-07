"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Plus, MessageCircle, User } from "lucide-react";

const navItems = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/search", icon: Search, label: "Search" },
  { href: "/post", icon: Plus, label: "Post", special: true },
  { href: "/chats", icon: MessageCircle, label: "Chats" },
  { href: "/profile/me", icon: User, label: "Profile" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 md:hidden bg-white border-t border-[var(--border)]"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}>
      <div className="flex items-center">
        {navItems.map(item => {
          const active = pathname === item.href;
          if (item.special) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex-1 flex flex-col items-center justify-center py-2 gap-0.5"
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-transform hover:scale-105 active:scale-95"
                  style={{ background: "var(--brand-green)" }}
                >
                  <item.icon size={20} strokeWidth={2.5} className="text-white" />
                </div>
              </Link>
            );
          }
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
      </div>
    </nav>
  );
}
