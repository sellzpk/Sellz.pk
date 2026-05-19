import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://www.sellz.pk"),
  title: {
    default: "Sellz.pk — Verified Classifieds Marketplace in Pakistan",
    template: "%s | Sellz.pk",
  },
  description: "Buy and sell safely in Pakistan. CNIC-verified sellers, ownership proof, and secure messaging. Mobiles, laptops, cars, property and more.",
  keywords: ["buy sell Pakistan", "online marketplace Pakistan", "verified classifieds", "used mobiles Pakistan", "sell car Pakistan", "buy laptop Pakistan", "sellz pk"],
  authors: [{ name: "Sellz.pk" }],
  creator: "Sellz.pk",
  publisher: "Sellz.pk",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  openGraph: {
    type: "website",
    locale: "en_PK",
    url: "https://www.sellz.pk",
    siteName: "Sellz.pk",
    title: "Sellz.pk — Pakistan's Verified Buy & Sell Marketplace",
    description: "Buy and sell safely in Pakistan. CNIC-verified sellers, ownership proof, and secure messaging.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Sellz.pk — Verified Marketplace" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sellz.pk — Pakistan's Verified Buy & Sell Marketplace",
    description: "Buy and sell safely in Pakistan. CNIC-verified sellers only.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "https://www.sellz.pk",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <head>
        <meta name="google-site-verification" content="yteSqKRpy3NR_L4aJoBZfSxdQh1wSC_b1xsfDIkNJN0" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-full flex flex-col antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
