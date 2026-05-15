"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface FavoriteButtonProps {
  adId: number;
  initialFavorited: boolean;
  size?: "small" | "large";
}

export function FavoriteButton({ adId, initialFavorited, size = "small" }: FavoriteButtonProps) {
  const router = useRouter();
  const [favorited, setFavorited] = useState(initialFavorited);
  const [loading, setLoading] = useState(false);

  async function toggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/auth/login"); return; }

    setLoading(true);
    if (favorited) {
      await supabase.from("favorites").delete().eq("user_id", user.id).eq("ad_id", adId);
      // fire-and-forget decrement via same-origin route
      fetch("/api/favorites/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adId, action: "remove" }),
      });
      setFavorited(false);
    } else {
      await supabase.from("favorites").insert({ user_id: user.id, ad_id: adId });
      fetch("/api/favorites/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adId, action: "add" }),
      });
      setFavorited(true);
    }
    setLoading(false);
  }

  if (size === "large") {
    return (
      <button
        onClick={toggle}
        disabled={loading}
        style={{
          display: "flex", alignItems: "center", gap: 6,
          padding: "8px 14px", border: "1px solid #E0E0E0",
          borderRadius: 8, background: "white", cursor: "pointer",
          opacity: loading ? 0.6 : 1, transition: "opacity 0.15s",
        }}
      >
        <Heart
          size={18}
          fill={favorited ? "#EF4444" : "none"}
          color={favorited ? "#EF4444" : "#666"}
        />
        <span style={{ fontSize: 14, color: favorited ? "#EF4444" : "#666", fontWeight: 500 }}>
          {favorited ? "Saved" : "Save"}
        </span>
      </button>
    );
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      style={{
        position: "absolute", top: 8, right: 8,
        width: 32, height: 32, borderRadius: "50%",
        background: "rgba(255,255,255,0.92)",
        border: "none", cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: "0 1px 4px rgba(0,0,0,0.15)",
        transform: loading ? "scale(0.85)" : "scale(1)",
        transition: "transform 0.15s",
      }}
    >
      <Heart
        size={15}
        fill={favorited ? "#EF4444" : "none"}
        color={favorited ? "#EF4444" : "#666"}
        strokeWidth={2}
      />
    </button>
  );
}
