import { products, productCategories } from "@/data/products";

export type CategoryLanding = {
  /** Clean URL segment used in /products/category/[slug] and pretty aliases */
  slug: string;
  /** Exact product.category value */
  category: (typeof productCategories)[number];
  /** Short sitelink label Google may show */
  name: string;
  /** Browser / SERP title (kept concise for sitelinks) */
  title: string;
  description: string;
  h1: string;
  intro: string;
};

/** Dedicated category landings — preferred over ?category= for Google sitelinks. */
export const CATEGORY_LANDINGS: CategoryLanding[] = [
  {
    slug: "bento-boxes",
    category: "Bento Boxes",
    name: "Bento Boxes",
    title: "Bento Boxes | Food Packaging Philippines",
    description:
      "Shop red-and-black meal bento boxes with clear lids for takeout and meal prep. Wholesale food packaging from Ziyah Packaging Supplies in Pasay City, nationwide PH.",
    h1: "Bento Boxes for Takeout & Meal Prep",
    intro:
      "Everyday red-outside, black-inside bento boxes with clear lids — sized for cafés, restaurants, and home food businesses across the Philippines.",
  },
  {
    slug: "hard-bento-clear",
    category: "Hard Bento Clear",
    name: "Hard Bento Clear",
    title: "Hard Bento Clear Boxes | Food Packaging PH",
    description:
      "Buy clear hard bento boxes with lids — 2 to 5 divisions, food-grade. Wholesale rates and nationwide delivery from Ziyah Packaging Supplies, Pasay City.",
    h1: "Hard Bento Clear Boxes with Lids",
    intro:
      "Crystal-clear hard bento boxes that show off your menu. Choose divisions and pack or box wholesale pricing for kitchens nationwide.",
  },
  {
    slug: "hard-bento-black",
    category: "Hard Bento Black",
    name: "Hard Bento Black",
    title: "Hard Bento Black Boxes | Premium Takeout PH",
    description:
      "Shop black hard bento boxes with lids for premium meal presentation. Food-grade packaging wholesale from Ziyah Packaging Supplies, Pasay City.",
    h1: "Hard Bento Black Boxes",
    intro:
      "Matte black hard bentos for premium takeout presentation — food-grade, lid-ready, and available in bulk for growing brands.",
  },
  {
    slug: "round-sushi-trays",
    category: "Round Sushi Trays",
    name: "Round Sushi Trays",
    title: "Round Sushi Trays with Lids | Packaging PH",
    description:
      "Shop round black sushi trays with gold pattern and lids — multiple sizes. Wholesale sushi packaging from Ziyah Packaging Supplies, nationwide Philippines.",
    h1: "Round Sushi Trays with Lids",
    intro:
      "Round sushi trays with lids for stalls, restaurants, and catering — multiple sizes with clear wholesale piece, pack, and box rates.",
  },
  {
    slug: "rectangular-sushi-trays",
    category: "Rectangular Sushi Trays",
    name: "Rectangular Sushi Trays",
    title: "Rectangular Sushi Trays | RE-ST Series PH",
    description:
      "Shop RE-ST rectangular sushi trays with lids for plated sets. Food-grade sushi packaging wholesale from Ziyah Packaging Supplies in Pasay City.",
    h1: "Rectangular Sushi Trays (RE-ST)",
    intro:
      "Rectangular sushi trays with lids for plated sets and party packs — practical sizes for sushi stalls and catering menus nationwide.",
  },
];

export function getCategoryLanding(slug: string) {
  return CATEGORY_LANDINGS.find((c) => c.slug === slug);
}

export function getCategoryLandingByCategory(category: string) {
  return CATEGORY_LANDINGS.find(
    (c) => c.category.toLowerCase() === category.toLowerCase()
  );
}

export function getCategoryHref(categoryOrSlug: string) {
  const bySlug = getCategoryLanding(categoryOrSlug);
  if (bySlug) return `/products/${bySlug.slug}`;
  const byCat = getCategoryLandingByCategory(categoryOrSlug);
  if (byCat) return `/products/${byCat.slug}`;
  return `/products?category=${encodeURIComponent(categoryOrSlug)}`;
}

export function countProductsInCategory(
  category: string,
  catalog: { category: string }[] = products
) {
  return catalog.filter((p) => p.category === category).length;
}
