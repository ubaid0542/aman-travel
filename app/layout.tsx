import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://amantraveller.com"),
  title: "Aman Traveller | Delhi to Manali Mountain & Couple Getaway",
  description:
    "Curated Delhi to Manali romantic getaways, luxury Volvo & private doorstep cabs, valley-view boutique stays, candlelight dinners, and snow adventures.",
  keywords: [
    "Aman Traveller",
    "Delhi to Manali",
    "Manali Couple Package",
    "Manali Honeymoon",
    "Delhi Manali Volvo",
    "Solang Valley",
    "Atal Tunnel Sissu",
  ],
  authors: [{ name: "Aman Traveller" }],
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/apple-icon.svg", type: "image/svg+xml" },
    ],
  },
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "Aman Traveller | Delhi to Manali Mountain & Couple Getaway",
    description:
      "Curated Delhi to Manali romantic getaways, luxury Volvo & private cabs, valley-view stays, and 24/7 trip support.",
    type: "website",
    locale: "en_IN",
  },
};

export const viewport: Viewport = {
  themeColor: "#062847",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className="min-h-screen bg-[#f4f9fc] font-sans text-[#173246] antialiased overflow-x-hidden w-full max-w-full"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
