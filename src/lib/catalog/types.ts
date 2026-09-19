import type { PriceTier, Product, ProductFaq } from "@/data/products";

export type DbCategory = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
};

export type DbPriceTier = {
  quantity: string;
  price: string;
  perPiece?: string;
  per_piece?: string;
};

export type DbProductRow = {
  id: number;
  name: string;
  display_name: string | null;
  description: string;
  long_description: string;
  category_id: number;
  type: "Disposable" | "Reusable";
  color: string | null;
  color_hex: string | null;
  color_hex_secondary: string | null;
  dimensions: string;
  unit: string;
  badge: string;
  price: string;
  price_tiers: DbPriceTier[] | PriceTier[];
  images: string[] | null;
  video_url: string | null;
  variant_group: string | null;
  specs: { label: string; value: string }[] | null;
  best_for: string | null;
  about_extra: string | null;
  faqs: ProductFaq[] | null;
  is_published: boolean;
  categories?: { name: string; slug: string } | null;
};

export type ProductWriteInput = {
  id?: number;
  name: string;
  displayName?: string | null;
  description: string;
  longDescription: string;
  categoryId: number;
  type: "Disposable" | "Reusable";
  color?: string | null;
  colorHex?: string | null;
  colorHexSecondary?: string | null;
  dimensions: string;
  unit?: string;
  badge?: Product["badge"];
  price: string;
  priceTiers: PriceTier[];
  images?: string[];
  videoUrl?: string | null;
  variantGroup?: string | null;
  specs?: { label: string; value: string }[];
  bestFor?: string | null;
  aboutExtra?: string | null;
  faqs?: ProductFaq[];
  isPublished?: boolean;
};
