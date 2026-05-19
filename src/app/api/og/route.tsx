import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const title = searchParams.get("title") ?? "Sellz.pk";
  const sub =
    searchParams.get("sub") ?? "Pakistan's Verified Classifieds Marketplace";

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          background: "#ffffff",
          fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
        }}
      >
        {/* Left green accent bar */}
        <div
          style={{ display: "flex", width: "12px", background: "#1D9E75", flexShrink: 0 }}
        />

        {/* Main content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            padding: "64px 72px",
            justifyContent: "space-between",
          }}
        >
          {/* Logo row */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div
              style={{
                display: "flex",
                background: "#1D9E75",
                borderRadius: "10px",
                padding: "10px 22px",
              }}
            >
              <span style={{ color: "#fff", fontSize: "26px", fontWeight: 700 }}>
                Sellz.pk
              </span>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                background: "#f0faf5",
                border: "1.5px solid #1D9E75",
                borderRadius: "20px",
                padding: "6px 16px",
              }}
            >
              <span style={{ color: "#1D9E75", fontSize: "16px", fontWeight: 600 }}>
                ✓ CNIC Verified
              </span>
            </div>
          </div>

          {/* Title block */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div
              style={{
                fontSize: title.length > 55 ? "38px" : "48px",
                fontWeight: 700,
                color: "#111111",
                lineHeight: 1.25,
                maxWidth: "960px",
              }}
            >
              {title}
            </div>
            <div style={{ fontSize: "24px", color: "#555555", fontWeight: 500 }}>
              {sub}
            </div>
          </div>

          {/* Footer */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "32px",
              paddingTop: "20px",
              borderTop: "1.5px solid #f0f0ee",
            }}
          >
            <span style={{ color: "#888", fontSize: "17px" }}>🔒 Verified Sellers Only</span>
            <span style={{ color: "#888", fontSize: "17px" }}>📸 Real Photos</span>
            <span style={{ color: "#888", fontSize: "17px" }}>🇵🇰 Pakistan</span>
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
