import type { Product, PriceTier, ProductFaq } from "@/data/products";
import { normalizeHex } from "./colorPresets";

export type PreviewFormInput = {
  id?: number;
  name: string;
  displayName: string;
  description: string;
  longDescription: string;
  aboutExtra: string;
  bestFor: string;
  type: "Disposable" | "Reusable";
  color: string;
  colorHex: string;
  colorHexSecondary: string;
  variantGroup: string;
  dimensions: string;
  unit: string;
  price: string;
  priceTiers: PriceTier[];
  specs: { label: string; value: string }[];
  faqs: ProductFaq[];
  images: string[];
};

const PLACEHOLDER_IMAGE = "/dummy-post-square-1.jpg";

export function formToPreviewProduct(
  form: PreviewFormInput,
  categoryName: string
): Product {
  const name = form.name.trim() || "Product title";
  const displayName = form.displayName.trim() || name;
  const secondary = form.colorHexSecondary.trim();
  const faqs = form.faqs.filter((f) => f.question.trim() && f.answer.trim());
  const specs = form.specs.filter((s) => s.label.trim() || s.value.trim());
  const tiers = form.priceTiers.filter((t) => t.quantity || t.price);

  return {
    id: form.id && form.id > 0 ? form.id : 0,
    name,
    displayName,
    category: categoryName || "Category",
    desc: form.description.trim() || "Short product description",
    longDesc:
      form.longDescription.trim() ||
      "About this product will appear here as you type.",
    type: form.type,
    price: form.price.trim() || "₱0.00",
    unit: form.unit.trim() || "/ piece",
    badge: form.type === "Reusable" ? "badgeReusable" : "badgeDisposable",
    images: form.images.length ? form.images : [PLACEHOLDER_IMAGE],
    specs: specs.length
      ? specs
      : [{ label: "Spec", value: "Add specs in the form" }],
    dimensions: form.dimensions.trim() || "—",
    priceTiers: tiers.length
      ? tiers
      : [{ quantity: "1 BOX", price: form.price || "₱0.00", perPiece: "" }],
    variantGroup: form.variantGroup.trim() || undefined,
    color: form.color.trim() || undefined,
    colorHex: form.colorHex.trim()
      ? normalizeHex(form.colorHex)
      : undefined,
    colorHexSecondary: secondary ? normalizeHex(secondary) : undefined,
    bestFor: form.bestFor.trim() || undefined,
    aboutExtra: form.aboutExtra.trim() || undefined,
    faqs: faqs.length ? faqs : undefined,
  };
}
