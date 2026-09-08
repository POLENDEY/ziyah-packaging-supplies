import type { Metadata } from "next";
import { getCategoryLanding } from "@/data/categories";
import { SITE } from "@/data/site";
import CategoryLandingView from "../CategoryLandingView";

const landing = getCategoryLanding("hard-bento-black")!;

export const metadata: Metadata = {
  title: { absolute: `${landing.title} | ${SITE.name}` },
  description: landing.description,
  keywords: [landing.name, landing.category, ...SITE.seoKeywords],
  alternates: { canonical: `/products/${landing.slug}` },
  openGraph: {
    title: `${landing.name} | ${SITE.name}`,
    description: landing.description,
    url: `/products/${landing.slug}`,
    images: [{ url: "/logo-512.png", alt: SITE.name }],
    locale: "en_PH",
    type: "website",
  },
};

export default function HardBentoBlackPage() {
  return <CategoryLandingView landing={landing} />;
}
