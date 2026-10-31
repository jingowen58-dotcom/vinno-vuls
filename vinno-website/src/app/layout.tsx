import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { siteOrigin } from "@/lib/site";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], display: "swap", variable: "--font-inter" });
const space = Space_Grotesk({ subsets: ["latin"], display: "swap", variable: "--font-space" });

export const metadata: Metadata = {
  metadataBase: new URL(siteOrigin),
  title: "VINNO | Global Life Science Network",
  description:
    "VINNO is building an open life science infrastructure connecting standardized biological data, research databases, AI research intelligence and scientific collaboration.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${space.variable}`} suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
