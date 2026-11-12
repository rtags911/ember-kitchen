import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { site } from "@/content/site";
import "./globals.css";

// Hanken Grotesk latin subset (OFL), self-hosted.
const hanken = localFont({ src: "../fonts/hanken-grotesk-latin.woff2", weight: "400 600", variable: "--font-hanken" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: `${site.name} — ${site.tagline}`,
  description: site.description,
  openGraph: { title: `${site.name} — ${site.tagline}`, description: site.description, type: "website" },
  // Fictional demo: keep it out of search results.
  robots: { index: false, follow: false },
};

export const viewport: Viewport = { themeColor: "#f5eee3" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={hanken.variable}>
      <body>
        {/* SplitText hides its text until JS splits it; without JS, show it. */}
        <noscript>
          <style>{".split-parent{visibility:visible!important}"}</style>
        </noscript>
        {children}
      </body>
    </html>
  );
}
