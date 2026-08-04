import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ChatBot from "./components/ChatBot";
import AppProviders from "./components/AppProviders";
import { getSiteOrigin, SITE } from "@/data/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteOrigin = getSiteOrigin();

export const metadata: Metadata = {
  metadataBase: new URL(siteOrigin),
  title: {
    default: `${SITE.name} | Buy Food Packaging Philippines Nationwide`,
    template: `%s | ${SITE.name}`,
  },
  description:
    "Buy food-grade packaging in the Philippines — bento boxes, sushi trays, and wholesale takeout containers from Ziyah Packaging Supplies in Pasay City. Nationwide delivery.",
  keywords: [...SITE.seoKeywords],
  authors: [{ name: SITE.name }],
  creator: SITE.name,
  publisher: SITE.name,
  category: "shopping",
  icons: {
    icon: [{ url: "/logo.png", type: "image/png" }],
    apple: [{ url: "/logo.png" }],
    shortcut: ["/logo.png"],
  },
  openGraph: {
    type: "website",
    locale: "en_PH",
    siteName: SITE.name,
    title: `${SITE.name} | Food Packaging Philippines`,
    description:
      "Shop bento boxes, sushi trays, and wholesale food packaging. Pickup in Pasay City or delivery nationwide across the Philippines.",
    images: [{ url: "/logo.png", width: 512, height: 512, alt: SITE.name }],
    url: siteOrigin,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} | Food Packaging Philippines`,
    description:
      "Food-grade bento boxes and sushi trays for restaurants and home businesses nationwide.",
    images: ["/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  verification: {
    google: "riyTtpzpBOMqz5YzeQoRNOcOY0Q1BBgaetaFDkuVm-s",
  },
};

const orgJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteOrigin}/#organization`,
      name: SITE.name,
      url: siteOrigin,
      logo: `${siteOrigin}/logo.png`,
      email: SITE.email,
      telephone: SITE.phone,
      sameAs: [
        SITE.social.facebook.href,
        SITE.social.messenger.href,
        SITE.social.shopee.href,
      ],
      address: {
        "@type": "PostalAddress",
        streetAddress: "Unit 103, Doña Adela Apartment, 2247 F.B. Harrison St",
        addressLocality: "Pasay City",
        addressRegion: "Metro Manila",
        addressCountry: "PH",
      },
    },
    {
      "@type": "WebSite",
      "@id": `${siteOrigin}/#website`,
      url: siteOrigin,
      name: SITE.name,
      description: SITE.tagline,
      publisher: { "@id": `${siteOrigin}/#organization` },
      inLanguage: "en-PH",
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${siteOrigin}/products?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-PH" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <AppProviders>
          <Navbar />
          {children}
          <Footer />
          <ChatBot />
        </AppProviders>
      </body>
    </html>
  );
}
