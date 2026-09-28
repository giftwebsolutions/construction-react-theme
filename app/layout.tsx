import type { Metadata, Viewport } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { Toaster } from "@/components/ui/Toast";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import "swiper/css/thumbs";
import "swiper/css/zoom";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta", weight: ["500", "600", "700", "800"], display: "swap" });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "BuildMart — Construction Materials Online | Cement, Steel, Tiles & More",
    template: "%s | BuildMart",
  },
  description:
    "Buy genuine cement, TMT steel, bricks, sand, tiles, paints, plumbing and electrical materials online with VAT invoice, bulk pricing and site delivery across the UAE.",
  applicationName: "BuildMart",
  keywords: ["construction materials", "cement price", "TMT bars", "AAC blocks", "M-Sand", "tiles", "building materials online UAE", "Dubai building materials"],
  openGraph: {
    type: "website",
    siteName: "BuildMart",
    locale: "en_AE",
    images: [{ url: "/images/og-default.svg", width: 1200, height: 630, alt: "BuildMart" }],
  },
  twitter: { card: "summary_large_image" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#0A1F44" },
    { media: "(prefers-color-scheme: dark)", color: "#07142e" },
  ],
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

/** Applies a saved theme before paint to avoid a flash. Light is the default. */
const themeScript = `try{if(localStorage.getItem('bm-theme')==='dark')document.documentElement.classList.add('dark')}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jakarta.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-dvh">
        <a href="#main" className="sr-only z-[100] rounded-lg bg-accent-500 px-4 py-2 font-semibold text-neutral-900 focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
          Skip to content
        </a>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
