import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Creator Distribution Funnel | Real Rails Intelligence Library",
  description:
    "Production-style demo auditing the Distribution & Demand attention rail: funnel stages, cohort compare, platform split, content type filters, monetization overlays, and GDELT global media attention signals.",
  keywords: [
    "Real Rails",
    "Creator Distribution Funnel",
    "Distribution & Demand",
    "GDELT",
    "Funnel Stages",
    "Cohort Compare",
    "Platform Split",
    "Monetization Overlays",
    "Creator Economy",
    "Attention Yield",
  ],
  authors: [{ name: "Real Rails Intelligence Library" }],
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full dark`}>
      <body className="min-h-full bg-[#030712] text-gray-100 flex flex-col font-sans selection:bg-[#38BDF8] selection:text-black">
        {children}
      </body>
    </html>
  );
}
