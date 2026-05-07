import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sellz.pk — Pakistan's Verified P2P Marketplace",
  description: "Buy and sell safely on Pakistan's first fully verified classifieds marketplace. CNIC-verified sellers only.",
  keywords: "buy sell pakistan, olx alternative, verified classifieds, sellz pk",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
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
