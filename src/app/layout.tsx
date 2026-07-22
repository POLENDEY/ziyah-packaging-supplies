import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ChatBot from "./components/ChatBot";
import { SITE } from "@/data/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: `${SITE.name} | Food Packaging Nationwide Philippines`,
    template: `%s | ${SITE.name}`,
  },
  description:
    "Food-grade packaging for restaurants, caterers, and home businesses nationwide across the Philippines. Bento boxes, trays, cups, and wrapping supplies.",
  keywords: [
    "food packaging Philippines",
    "bento boxes",
    "sushi trays",
    "disposable containers",
    "wholesale packaging Pasay",
    "Ziyah Packaging Supplies",
  ],
  icons: {
    icon: [{ url: "/logo.png", type: "image/png" }],
    apple: [{ url: "/logo.png" }],
    shortcut: ["/logo.png"],
  },
  openGraph: {
    type: "website",
    locale: "en_PH",
    siteName: SITE.name,
    title: `${SITE.name} | Food Packaging Nationwide`,
    description:
      "Premium food packaging supplies for businesses across the Philippines.",
    images: [{ url: "/logo.png", width: 512, height: 512, alt: SITE.name }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <Navbar />
        {children}
        <Footer />
        <ChatBot />
      </body>
    </html>
  );
}
