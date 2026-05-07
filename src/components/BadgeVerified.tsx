"use client";

import { BadgeCheck, Star } from "lucide-react";

interface BadgeVerifiedProps {
  type?: "verified" | "owned";
}

const base: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 500,
  padding: "3px 8px",
  borderRadius: 6,
  display: "inline-flex",
  alignItems: "center",
  gap: 3,
  whiteSpace: "nowrap",
  lineHeight: 1.4,
};

export function BadgeVerified({ type = "verified" }: BadgeVerifiedProps) {
  if (type === "verified") {
    return (
      <span style={{ ...base, background: "#1D9E75", color: "#fff" }}>
        <BadgeCheck size={12} strokeWidth={2.5} />
        Verified
      </span>
    );
  }
  return (
    <span style={{ ...base, background: "#185FA5", color: "#fff" }}>
      <Star size={12} strokeWidth={2.5} />
      Owned
    </span>
  );
}
