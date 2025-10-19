// apps/web/app/layout.tsx
import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageShell from "@/components/PageShell";
import SessionProvider from "@/components/SessionProvider";
import { ToastProvider } from "@/components/ToastProvider"; // ⬅️ added

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LayerZero",
  description: "The foundation of safe AI",
  icons: { icon: "/logo-dark@3x.png" },
};

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
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body
        className={[
          inter.className,
          "min-h-screen antialiased",
          "bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100",
          "overflow-x-hidden",
          "selection:bg-cyan-500/20 selection:text-cyan-900",
        ].join(" ")}
      >
        {/* Accessibility skip link */}
        <a
          href="#content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50
                     focus:rounded-md focus:bg-black focus:text-white focus:px-3 focus:py-2
                     dark:focus:bg-white dark:focus:text-black"
        >
          Skip to content
        </a>

        {/* ⬇️ Toast provider wraps the app so notifications show globally */}
        <ToastProvider>
          <PageShell>
            <SessionProvider>
              <Navbar />
              <main id="content">{children}</main>
              <Footer />
            </SessionProvider>
          </PageShell>
        </ToastProvider>
      </body>
    </html>
  );
}