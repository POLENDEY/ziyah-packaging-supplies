export type PromoSlide = {
  id: number;
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaHref: string;
  image: string;
  tone: "plum" | "coral" | "night";
};

export const promoSlides: PromoSlide[] = [
  {
    id: 1,
    title: "Nationwide packaging, ready when you are",
    subtitle: "Food-grade bento boxes, trays, and cups for restaurants across the Philippines.",
    ctaLabel: "Shop Products",
    ctaHref: "/products",
    image: "/dummy-post-square-1.jpg",
    tone: "plum",
  },
  {
    id: 2,
    title: "Wholesale rates for growing kitchens",
    subtitle: "Tell us your volume — we’ll prepare a clear bulk quote for your menu.",
    ctaLabel: "Get a Quote",
    ctaHref: "/quote",
    image: "/logo.png",
    tone: "coral",
  },
  {
    id: 3,
    title: "Fresh stock for takeout & meal prep",
    subtitle: "Clamshells, sushi trays, cups, and wraps — practical packaging that looks sharp.",
    ctaLabel: "Browse Categories",
    ctaHref: "/products",
    image: "/dummy-post-square-1.jpg",
    tone: "night",
  },
  {
    id: 4,
    title: "Visit us in Pasay City",
    subtitle: "Unit 103, Doña Adela Apartment, F.B. Harrison St — or message us anytime.",
    ctaLabel: "Contact Store",
    ctaHref: "/contact",
    image: "/logo.png",
    tone: "plum",
  },
];
