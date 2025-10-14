// apps/web/app/layout.tsx
import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageShell from "@/components/PageShell";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LayerZero",
  description: "The foundation of safe AI",
  icons: { icon: "/logo-dark@3x.png" },
};

// Real mobile viewport and theme color in the right place
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0b0f19" },
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body
        className={[
          inter.className,
          "min-h-screen antialiased",
          // sane defaults for both themes
          "bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100",
          // avoid sideways scroll on small screens
          "overflow-x-hidden",
          // nice selection
          "selection:bg-cyan-500/20 selection:text-cyan-900",
        ].join(" ")}
      >
        {/* Skip link for keyboard users */}
        <a
          href="#content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50
                     focus:rounded-md focus:bg-black focus:text-white focus:px-3 focus:py-2
                     dark:focus:bg-white dark:focus:text-black"
        >
          Skip to content
        </a>

        <PageShell>
          <Navbar />
          {/* Do NOT constrain width globally. Let each page/section decide:
              - full-bleed backgrounds at section level
              - inner content capped with max-w-6xl mx-auto px-4 sm:px-6 */}
          <main id="content">{children}</main>
          <Footer />
        </PageShell>
      </body>
    </html>
  );
}