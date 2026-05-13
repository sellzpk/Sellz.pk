"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(!isLoginPage);

  useEffect(() => {
    if (isLoginPage) return;

    const auth = sessionStorage.getItem("sellz_admin_auth");
    if (auth === "true") {
      setAuthorized(true);
      setChecking(false);
      return;
    }

    // Not authenticated — redirect. Timeout is a safety net only.
    const t = setTimeout(() => {
      setChecking(false);
      router.replace("/admin/login");
    }, 3000);

    setChecking(false);
    router.replace("/admin/login");

    return () => clearTimeout(t);
  }, [pathname]);

  if (isLoginPage) return <>{children}</>;

  if (checking) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center gap-3 bg-[#F0F0EE]">
        <Loader2 size={28} strokeWidth={2} className="animate-spin" style={{ color: "var(--brand-green)" }} />
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>Loading admin panel...</p>
      </div>
    );
  }

  if (!authorized) return null;

  return <>{children}</>;
}
