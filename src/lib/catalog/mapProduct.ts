import type { PriceTier, Product, ProductFaq } from "@/data/products";
import type { DbProductRow, ProductWriteInput } from "./types";

function mapTiers(
  tiers: DbProductRow["price_tiers"] | null | undefined
): PriceTier[] {
  if (!Array.isArray(tiers)) return [];
  return tiers.map((t) => ({
    quantity: String(t.quantity ?? ""),
    price: String(t.price ?? ""),
    perPiece: String(
      (t as PriceTier).perPiece ??
        (t as { per_piece?: string }).per_piece ??
        ""
    ),
  }));
}

function mapBadge(badge: string | null | undefined): Product["badge"] {
  if (badge === "badgeReusable" || badge === "badgeNew") return badge;
  return "badgeDisposable";
}

function mapFaqs(faqs: DbProductRow["faqs"]): ProductFaq[] | undefined {
  if (!Array.isArray(faqs) || faqs.length === 0) return undefined;
  const cleaned = faqs
    .map((f) => ({
      question: String(f?.question ?? "").trim(),
      answer: String(f?.answer ?? "").trim(),
    }))
    .filter((f) => f.question && f.answer);
  return cleaned.length ? cleaned : undefined;
}

/** Map a Supabase product row (with optional categories join) to storefront Product. */
export function mapDbProductToProduct(row: DbProductRow): Product {
  const categoryName = row.categories?.name ?? "";
  return {
    id: Number(row.id),
    name: row.name,
    category: categoryName,
    desc: row.description ?? "",
    longDesc: row.long_description ?? "",
    type: row.type === "Reusable" ? "Reusable" : "Disposable",
    price: row.price ?? "",
    unit: row.unit || "/ piece",
    badge: mapBadge(row.badge),
    images: Array.isArray(row.images) ? row.images.filter(Boolean) : [],
    // Product video disabled for now — keep DB column, do not expose on storefront
    video: undefined,
    specs: Array.isArray(row.specs) ? row.specs : [],
    dimensions: row.dimensions ?? "",
    priceTiers: mapTiers(row.price_tiers),
    variantGroup: row.variant_group || undefined,
    color: row.color || undefined,
    colorHex: row.color_hex || undefined,
    colorHexSecondary: row.color_hex_secondary || undefined,
    displayName: row.display_name || row.name,
    bestFor: row.best_for?.trim() || undefined,
    aboutExtra: row.about_extra?.trim() || undefined,
    faqs: mapFaqs(row.faqs),
  };
}

export function toDbProductPayload(input: ProductWriteInput) {
  return {
    ...(input.id != null ? { id: input.id } : {}),
    name: input.name.trim(),
    display_name: input.displayName?.trim() || null,
    description: input.description.trim(),
    long_description: input.longDescription.trim(),
    category_id: input.categoryId,
    type: input.type,
    color: input.color?.trim() || null,
    color_hex: input.colorHex?.trim() || null,
    color_hex_secondary: input.colorHexSecondary?.trim() || null,
    dimensions: input.dimensions.trim(),
    unit: input.unit?.trim() || "/ piece",
    badge: input.badge || "badgeDisposable",
    price: input.price.trim(),
    price_tiers: input.priceTiers ?? [],
    images: input.images ?? [],
    video_url: null,
    variant_group: input.variantGroup?.trim() || null,
    specs: input.specs ?? [],
    best_for: input.bestFor?.trim() || "",
    about_extra: input.aboutExtra?.trim() || "",
    faqs: (input.faqs ?? []).filter((f) => f.question.trim() && f.answer.trim()),
    is_published: input.isPublished ?? true,
    updated_at: new Date().toISOString(),
  };
}
