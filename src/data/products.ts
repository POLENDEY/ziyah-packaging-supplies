import { getSiteOrigin, SITE } from "@/data/site";

const IMG = "/dummy-post-square-1.jpg";
const SAMPLE_PRODUCT_VIDEO = "https://www.w3schools.com/html/movie.mp4";
const RST = "/round-sushi-tray";

export { getSiteOrigin };

/** Top view first (products grid), then flat view (detail gallery). */
function roundSushiImages(sizeKey: string, withDivision = false) {
  const div = withDivision ? "-with-division" : "";
  const top = `${RST}/Round-Sushi-tray_${sizeKey}${div}-top.png`;
  const flat = withDivision
    ? `${RST}/Round-Sushi-tray${sizeKey}${div}_flatview.png`
    : `${RST}/Round-Sushi-tray_${sizeKey}_flatview.png`;
  return [top, flat];
}

export type PriceTier = {
  quantity: string;
  price: string;
  perPiece: string;
};

export type ProductFaq = { question: string; answer: string };

export type Product = {
  id: number;
  name: string;
  category: string;
  desc: string;
  longDesc: string;
  type: "Disposable" | "Reusable";
  /** Estimated retail price per piece (box rate) */
  price: string;
  unit: string;
  badge: "badgeDisposable" | "badgeReusable" | "badgeNew";
  images: string[];
  video?: string;
  specs: { label: string; value: string }[];
  dimensions: string;
  priceTiers: PriceTier[];
  /** Shared key for color siblings (e.g. hard-bento-4div) */
  variantGroup?: string;
  /** Display color name (Clear, Black, …) */
  color?: string;
  /** Swatch hex for the color picker */
  colorHex?: string;
  /** Second hex for split/combined swatches (e.g. Red & Black) */
  colorHexSecondary?: string;
  /** Title without color suffix for PDP */
  displayName?: string;
  /** Optional “Best for” key-feature line (CMS) */
  bestFor?: string;
  /** Optional extra About paragraph below longDesc (CMS) */
  aboutExtra?: string;
  /** Optional CMS FAQs; falls back to generated FAQs when empty */
  faqs?: ProductFaq[];
};

type Draft = Omit<
  Product,
  "id" | "video" | "badge" | "type" | "unit" | "images" | "price"
> & {
  /** Per-piece price when buying by the box */
  boxPerPiece: string;
  /** Optional custom images; first image is used on listing cards */
  images?: string[];
};

/** Human, keyword-rich product story unique per SKU (SSG SEO body copy). */
function composeLongDesc(d: Draft): string {
  const title = d.displayName ?? d.name;
  const colorBit = d.color ? ` in ${d.color}` : "";
  const box = d.priceTiers.find((t) => /box/i.test(t.quantity));
  const pack = d.priceTiers.find((t) => /pack/i.test(t.quantity));
  const priceNote = box
    ? ` Box rate starts around ${box.perPiece} per piece${pack ? ` (packs from ${pack.price})` : ""}.`
    : "";

  if (d.category === "Hard Bento Clear") {
    return `Looking for a clear hard bento box with lid in the Philippines? The ${title}${colorBit} from ${SITE.name} is a food-grade takeout container built for meal prep, catering, and restaurant plating. Transparent walls make it easy to show off rice, proteins, and sides without mixing flavors — sized ${d.dimensions}. Ideal for cafés, cloud kitchens, and home food businesses that need reliable disposable meal packaging with wholesale options.${priceNote} Order online or pick up in Pasay City for nationwide delivery across the Philippines.`;
  }
  if (d.category === "Hard Bento Black") {
    return `Shop black hard bento boxes for premium takeout presentation. The ${title}${colorBit} from ${SITE.name} pairs a sleek black base with a clear lid so your plated meals look sharp on delivery apps and catering trays. Food-grade disposable packaging sized ${d.dimensions} — a favorite for restaurants, meal-prep brands, and event caterers nationwide.${priceNote} Available by piece, pack, or full box with pickup at our Pasay City store or delivery across the Philippines.`;
  }
  if (d.category === "Bento Boxes") {
    return `Everyday takeout packaging that customers recognize: the ${title} features a red exterior and black interior with a clear lid — classic Filipino meal-box style for silog sets, packed lunches, and delivery orders. From ${SITE.name} in Pasay City, this disposable bento (${d.dimensions}) is food-grade and sold with practical wholesale tiers for small kitchens and high-volume kitchens alike.${priceNote} Buy online or inquire for bulk food packaging delivery nationwide in the Philippines.`;
  }
  if (d.category === "Round Sushi Trays") {
    const div = /division/i.test(d.name)
      ? " Internal divisions help separate sushi, sashimi, and sides in one elegant round tray."
      : " The gold-pattern black tray with lid keeps rolls neat for retail and catering.";
    return `Buy round sushi trays with lids in the Philippines — the ${title} from ${SITE.name} is sized ${d.dimensions} for sushi sets, sashimi platters, and Japanese-inspired takeout.${div} Food-grade disposable packaging trusted by sushi bars, hotels, and home businesses.${priceNote} Wholesale packs and boxes available; pick up in Pasay City or request nationwide delivery.`;
  }
  // Rectangular sushi trays
  const model = d.specs.find((s) => s.label === "Model")?.value;
  return `Need rectangular sushi trays with lids for plated sets? The ${title}${model ? ` (${model})` : ""} from ${SITE.name} is a black gold-pattern disposable tray sized ${d.dimensions} — built for sushi rolls, nigiri lines, and party platters. Food packaging wholesalers and restaurants across the Philippines order these for consistent presentation and stackable storage.${priceNote} Available from our Pasay City store with nationwide delivery options.`;
}

function buildProducts(drafts: Draft[]): Product[] {
  return drafts.map((d, index) => ({
    id: index + 1,
    name: d.name,
    category: d.category,
    desc: d.desc,
    longDesc: composeLongDesc(d),
    type: "Disposable",
    price: d.boxPerPiece,
    unit: "/ piece",
    badge: "badgeDisposable",
    images: d.images?.length ? d.images : [IMG, IMG, IMG],
    video: SAMPLE_PRODUCT_VIDEO,
    specs: d.specs,
    dimensions: d.dimensions,
    priceTiers: d.priceTiers,
    variantGroup: d.variantGroup,
    color: d.color,
    colorHex: d.colorHex,
    displayName: d.displayName ?? d.name,
  }));
}

const drafts: Draft[] = [
  // Hard Bento Clear
  {
    name: "2 Division Hard Bento Box (Clear)",
    displayName: "2 Division Bento Box",
    variantGroup: "hard-bento-2div",
    color: "Clear",
    colorHex: "#dce8ef",
    category: "Hard Bento Clear",
    desc: "Clear hard bento with lid — 2 compartments, 1000ml.",
    longDesc:
      "Official Ziyah hard bento box with clear lid and 2 divisions. Food-grade packaging for meal prep and takeout with volume pricing from 10 pieces up to full boxes.",
    boxPerPiece: "₱7.86",
    dimensions: "1000ml · 21.1 × 14.5 × 4.5 cm",
    specs: [
      { label: "Style", value: "Hard bento with lid (clear)" },
      { label: "Color", value: "Clear" },
      { label: "Divisions", value: "2" },
      { label: "Capacity", value: "1000ml" },
    ],
    priceTiers: [
      { quantity: "1 BOX (150's)", price: "₱1,180.00", perPiece: "₱7.86" },
      { quantity: "1 PACK (50's)", price: "₱480.00", perPiece: "₱9.60" },
      { quantity: "25 PIECES", price: "₱250.00", perPiece: "₱10.00" },
      { quantity: "10 PIECES", price: "₱110.00", perPiece: "₱11.00" },
    ],
  },
  {
    name: "3 Division Hard Bento Box (Clear)",
    displayName: "3 Division Bento Box",
    variantGroup: "hard-bento-3div",
    color: "Clear",
    colorHex: "#dce8ef",
    category: "Hard Bento Clear",
    desc: "Clear hard bento with lid — 3 compartments, 1000ml.",
    longDesc:
      "Official Ziyah hard bento box with clear lid and 3 divisions. Ideal for set meals with separated sides.",
    boxPerPiece: "₱8.53",
    dimensions: "1000ml · 20.95 × 17.78 × 3.81 cm",
    specs: [
      { label: "Style", value: "Hard bento with lid (clear)" },
      { label: "Color", value: "Clear" },
      { label: "Divisions", value: "3" },
      { label: "Capacity", value: "1000ml" },
    ],
    priceTiers: [
      { quantity: "1 BOX (150's)", price: "₱1,280.00", perPiece: "₱8.53" },
      { quantity: "1 PACK (50's)", price: "₱530.00", perPiece: "₱10.60" },
      { quantity: "25 PIECES", price: "₱275.00", perPiece: "₱11.00" },
      { quantity: "10 PIECES", price: "₱120.00", perPiece: "₱12.00" },
    ],
  },
  {
    name: "4 Division Hard Bento Box (Clear)",
    displayName: "4 Division Bento Box",
    variantGroup: "hard-bento-4div",
    color: "Clear",
    colorHex: "#dce8ef",
    category: "Hard Bento Clear",
    desc: "Clear hard bento with lid — 4 compartments, 1000ml.",
    longDesc:
      "Official Ziyah hard bento box with clear lid and 4 divisions for flexible plating.",
    boxPerPiece: "₱8.86",
    dimensions: "1000ml · 20.95 × 17.78 × 3.81 cm",
    specs: [
      { label: "Style", value: "Hard bento with lid (clear)" },
      { label: "Color", value: "Clear" },
      { label: "Divisions", value: "4" },
      { label: "Capacity", value: "1000ml" },
    ],
    priceTiers: [
      { quantity: "1 BOX (150's)", price: "₱1,330.00", perPiece: "₱8.86" },
      { quantity: "1 PACK (50's)", price: "₱580.00", perPiece: "₱11.60" },
      { quantity: "25 PIECES", price: "₱300.00", perPiece: "₱12.00" },
      { quantity: "10 PIECES", price: "₱130.00", perPiece: "₱13.00" },
    ],
  },
  {
    name: "5 Division Hard Bento Box (Clear)",
    displayName: "5 Division Bento Box",
    variantGroup: "hard-bento-5div",
    color: "Clear",
    colorHex: "#dce8ef",
    category: "Hard Bento Clear",
    desc: "Clear hard bento with lid — 5 compartments, 1000ml.",
    longDesc:
      "Official Ziyah hard bento box with clear lid and 5 divisions for full meal sets.",
    boxPerPiece: "₱9.93",
    dimensions: "1000ml · 20.95 × 17.78 × 3.81 cm",
    specs: [
      { label: "Style", value: "Hard bento with lid (clear)" },
      { label: "Color", value: "Clear" },
      { label: "Divisions", value: "5" },
      { label: "Capacity", value: "1000ml" },
    ],
    priceTiers: [
      { quantity: "1 BOX (150's)", price: "₱1,490.00", perPiece: "₱9.93" },
      { quantity: "1 PACK (50's)", price: "₱600.00", perPiece: "₱12.00" },
      { quantity: "25 PIECES", price: "₱325.00", perPiece: "₱13.00" },
      { quantity: "10 PIECES", price: "₱140.00", perPiece: "₱14.00" },
    ],
  },

  // Soft bento — Red outside / Black inside
  {
    name: "1 Division Bento Box",
    displayName: "1 Division Bento Box",
    color: "Red & Black",
    colorHex: "#e53935",
    colorHexSecondary: "#1c141f",
    category: "Bento Boxes",
    desc: "Red outside, black inside bento with clear lid — 1 compartment.",
    longDesc:
      "Official Ziyah 1-division bento box with a red exterior and black interior, plus a clear lid. Volume pricing from 25 pieces to full boxes.",
    boxPerPiece: "₱6.20",
    dimensions: "20.5 × 13 × 5.5 cm",
    specs: [
      { label: "Style", value: "Bento box with lid" },
      { label: "Color", value: "Red outside / Black inside" },
      { label: "Divisions", value: "1" },
    ],
    priceTiers: [
      { quantity: "1 BOX (500's)", price: "₱3,100.00", perPiece: "₱6.20" },
      { quantity: "1 PACK (100's)", price: "₱650.00", perPiece: "₱6.50" },
      { quantity: "50 PIECES", price: "₱350.00", perPiece: "₱7.00" },
      { quantity: "25 PIECES", price: "₱188.00", perPiece: "₱7.50" },
    ],
  },
  {
    name: "2 Division Bento Box",
    displayName: "2 Division Bento Box",
    variantGroup: "hard-bento-2div",
    color: "Red & Black",
    colorHex: "#e53935",
    colorHexSecondary: "#1c141f",
    category: "Bento Boxes",
    desc: "Red outside, black inside bento with clear lid — 2 compartments.",
    longDesc:
      "Official Ziyah 2-division bento box with a red exterior and black interior, plus a clear lid for separated meals.",
    boxPerPiece: "₱5.90",
    dimensions: "22.5 × 14.5 × 5.5 cm",
    specs: [
      { label: "Style", value: "Bento box with lid" },
      { label: "Color", value: "Red outside / Black inside" },
      { label: "Divisions", value: "2" },
    ],
    priceTiers: [
      { quantity: "1 BOX (500's)", price: "₱2,950.00", perPiece: "₱5.90" },
      { quantity: "1 PACK (100's)", price: "₱650.00", perPiece: "₱6.50" },
      { quantity: "50 PIECES", price: "₱340.00", perPiece: "₱6.80" },
      { quantity: "25 PIECES", price: "₱175.00", perPiece: "₱7.00" },
    ],
  },
  {
    name: "3 Division Bento Box",
    displayName: "3 Division Bento Box",
    variantGroup: "hard-bento-3div",
    color: "Red & Black",
    colorHex: "#e53935",
    colorHexSecondary: "#1c141f",
    category: "Bento Boxes",
    desc: "Red outside, black inside bento with clear lid — 3 compartments.",
    longDesc:
      "Official Ziyah 3-division bento box with a red exterior and black interior, plus a clear lid.",
    boxPerPiece: "₱5.90",
    dimensions: "22.5 × 19.5 × 3.5 cm",
    specs: [
      { label: "Style", value: "Bento box with lid" },
      { label: "Color", value: "Red outside / Black inside" },
      { label: "Divisions", value: "3" },
    ],
    priceTiers: [
      { quantity: "1 BOX (950's)", price: "₱5,664.00", perPiece: "₱5.90" },
      { quantity: "1 PACK (100's)", price: "₱650.00", perPiece: "₱6.50" },
      { quantity: "50 PIECES", price: "₱340.00", perPiece: "₱6.80" },
      { quantity: "25 PIECES", price: "₱175.00", perPiece: "₱7.00" },
    ],
  },
  {
    name: "4 Division Bento Box",
    displayName: "4 Division Bento Box",
    variantGroup: "hard-bento-4div",
    color: "Red & Black",
    colorHex: "#e53935",
    colorHexSecondary: "#1c141f",
    category: "Bento Boxes",
    desc: "Red outside, black inside bento with clear lid — 4 compartments.",
    longDesc:
      "Official Ziyah 4-division bento box with a red exterior and black interior, plus a clear lid.",
    boxPerPiece: "₱5.98",
    dimensions: "22.5 × 19.5 × 3.5 cm",
    specs: [
      { label: "Style", value: "Bento box with lid" },
      { label: "Color", value: "Red outside / Black inside" },
      { label: "Divisions", value: "4" },
    ],
    priceTiers: [
      { quantity: "1 BOX (950's)", price: "₱5,740.00", perPiece: "₱5.98" },
      { quantity: "1 PACK (100's)", price: "₱658.00", perPiece: "₱6.58" },
      { quantity: "50 PIECES", price: "₱350.00", perPiece: "₱7.00" },
      { quantity: "25 PIECES", price: "₱188.00", perPiece: "₱7.50" },
    ],
  },
  {
    name: "5 Division Bento Box",
    displayName: "5 Division Bento Box",
    variantGroup: "hard-bento-5div",
    color: "Red & Black",
    colorHex: "#e53935",
    colorHexSecondary: "#1c141f",
    category: "Bento Boxes",
    desc: "Red outside, black inside bento with clear lid — 5 compartments.",
    longDesc:
      "Official Ziyah 5-division bento box with a red exterior and black interior, plus a clear lid for complete meal sets.",
    boxPerPiece: "₱6.00",
    dimensions: "22.5 × 19.5 × 3.5 cm",
    specs: [
      { label: "Style", value: "Bento box with lid" },
      { label: "Color", value: "Red outside / Black inside" },
      { label: "Divisions", value: "5" },
    ],
    priceTiers: [
      { quantity: "1 BOX (950's)", price: "₱5,700.00", perPiece: "₱6.00" },
      { quantity: "1 PACK (100's)", price: "₱650.00", perPiece: "₱6.50" },
      { quantity: "50 PIECES", price: "₱375.00", perPiece: "₱7.50" },
      { quantity: "25 PIECES", price: "₱200.00", perPiece: "₱8.00" },
    ],
  },

  // Hard Bento Black
  {
    name: "2 Division Hard Bento Box (Black)",
    displayName: "2 Division Bento Box",
    variantGroup: "hard-bento-2div",
    color: "Black",
    colorHex: "#1c141f",
    category: "Hard Bento Black",
    desc: "Black hard bento with clear lid — 2 compartments, 1000ml.",
    longDesc:
      "Official Ziyah hard bento box (black) with lid and 2 divisions.",
    boxPerPiece: "₱8.06",
    dimensions: "1000ml · 21.1 × 14.5 × 4.5 cm",
    specs: [
      { label: "Style", value: "Hard bento with lid (black)" },
      { label: "Divisions", value: "2" },
      { label: "Capacity", value: "1000ml" },
    ],
    priceTiers: [
      { quantity: "1 BOX (150's)", price: "₱1,210.00", perPiece: "₱8.06" },
      { quantity: "1 PACK (50's)", price: "₱498.00", perPiece: "₱9.96" },
      { quantity: "25 PIECES", price: "₱250.00", perPiece: "₱10.00" },
      { quantity: "10 PIECES", price: "₱110.00", perPiece: "₱11.00" },
    ],
  },
  {
    name: "3 Division Hard Bento Box (Black)",
    displayName: "3 Division Bento Box",
    variantGroup: "hard-bento-3div",
    color: "Black",
    colorHex: "#1c141f",
    category: "Hard Bento Black",
    desc: "Black hard bento with clear lid — 3 compartments, 1000ml.",
    longDesc:
      "Official Ziyah hard bento box (black) with lid and 3 divisions.",
    boxPerPiece: "₱8.80",
    dimensions: "1000ml · 20.95 × 17.78 × 3.81 cm",
    specs: [
      { label: "Style", value: "Hard bento with lid (black)" },
      { label: "Divisions", value: "3" },
      { label: "Capacity", value: "1000ml" },
    ],
    priceTiers: [
      { quantity: "1 BOX (150's)", price: "₱1,320.00", perPiece: "₱8.80" },
      { quantity: "1 PACK (50's)", price: "₱590.00", perPiece: "₱11.80" },
      { quantity: "25 PIECES", price: "₱295.00", perPiece: "₱11.80" },
      { quantity: "10 PIECES", price: "₱125.00", perPiece: "₱12.50" },
    ],
  },
  {
    name: "4 Division Hard Bento Box (Black)",
    displayName: "4 Division Bento Box",
    variantGroup: "hard-bento-4div",
    color: "Black",
    colorHex: "#1c141f",
    category: "Hard Bento Black",
    desc: "Black hard bento with clear lid — 4 compartments, 1000ml.",
    longDesc:
      "Official Ziyah hard bento box (black) with lid and 4 divisions.",
    boxPerPiece: "₱9.20",
    dimensions: "1000ml · 20.95 × 17.78 × 3.81 cm",
    specs: [
      { label: "Style", value: "Hard bento with lid (black)" },
      { label: "Divisions", value: "4" },
      { label: "Capacity", value: "1000ml" },
    ],
    priceTiers: [
      { quantity: "1 BOX (150's)", price: "₱1,380.00", perPiece: "₱9.20" },
      { quantity: "1 PACK (50's)", price: "₱550.00", perPiece: "₱11.00" },
      { quantity: "25 PIECES", price: "₱320.00", perPiece: "₱12.80" },
      { quantity: "10 PIECES", price: "₱138.00", perPiece: "₱13.80" },
    ],
  },
  {
    name: "5 Division Hard Bento Box (Black)",
    displayName: "5 Division Bento Box",
    variantGroup: "hard-bento-5div",
    color: "Black",
    colorHex: "#1c141f",
    category: "Hard Bento Black",
    desc: "Black hard bento with clear lid — 5 compartments, 1000ml.",
    longDesc:
      "Official Ziyah hard bento box (black) with lid and 5 divisions.",
    boxPerPiece: "₱10.26",
    dimensions: "1000ml · 20.95 × 17.78 × 3.81 cm",
    specs: [
      { label: "Style", value: "Hard bento with lid (black)" },
      { label: "Divisions", value: "5" },
      { label: "Capacity", value: "1000ml" },
    ],
    priceTiers: [
      { quantity: "1 BOX (150's)", price: "₱1,540.00", perPiece: "₱10.26" },
      { quantity: "1 PACK (50's)", price: "₱640.00", perPiece: "₱12.80" },
      { quantity: "25 PIECES", price: "₱345.00", perPiece: "₱13.80" },
      { quantity: "10 PIECES", price: "₱148.00", perPiece: "₱14.80" },
    ],
  },

  // Round sushi trays — images: [top, flat]
  {
    name: "8\" Round Sushi Tray with Lid",
    category: "Round Sushi Trays",
    desc: "Black round sushi tray with gold pattern and lid — 8\".",
    longDesc:
      "Official Ziyah round sushi tray with lid. Tray height 1\", lid height 1\".",
    boxPerPiece: "₱13.80",
    dimensions: "8\" diameter · Tray H 1\" · Lid H 1\"",
    images: roundSushiImages("8-inches"),
    specs: [
      { label: "Style", value: "Round sushi tray with lid" },
      { label: "Diameter", value: "8\"" },
    ],
    priceTiers: [
      { quantity: "1 BOX (300's)", price: "₱4,150.00", perPiece: "₱13.80" },
      { quantity: "1 PACK (50's)", price: "₱775.00", perPiece: "₱15.50" },
      { quantity: "25 PIECES", price: "₱450.00", perPiece: "₱18.00" },
      { quantity: "10 PIECES", price: "₱200.00", perPiece: "₱20.00" },
    ],
  },
  {
    name: "9.5\" Round Sushi Tray with Lid",
    category: "Round Sushi Trays",
    desc: "Black round sushi tray with gold pattern and lid — 9.5\".",
    longDesc: "Official Ziyah 9.5\" round sushi tray with lid.",
    boxPerPiece: "₱21.75",
    dimensions: "9.5\" diameter · Tray H 1\" · Lid H 1\"",
    images: roundSushiImages("9.5-inches"),
    specs: [
      { label: "Style", value: "Round sushi tray with lid" },
      { label: "Diameter", value: "9.5\"" },
    ],
    priceTiers: [
      { quantity: "1 BOX (200's)", price: "₱4,350.00", perPiece: "₱21.75" },
      { quantity: "1 PACK (50's)", price: "₱1,250.00", perPiece: "₱25.00" },
      { quantity: "25 PIECES", price: "₱700.00", perPiece: "₱28.00" },
      { quantity: "10 PIECES", price: "₱310.00", perPiece: "₱31.00" },
    ],
  },
  {
    name: "11\" Round Sushi Tray with Lid",
    category: "Round Sushi Trays",
    desc: "Black round sushi tray with gold pattern and lid — 11\".",
    longDesc: "Official Ziyah 11\" round sushi tray with lid.",
    boxPerPiece: "₱33.50",
    dimensions: "11\" diameter · Tray H 1\" · Lid H 1\"",
    images: roundSushiImages("11-inches"),
    specs: [
      { label: "Style", value: "Round sushi tray with lid" },
      { label: "Diameter", value: "11\"" },
    ],
    priceTiers: [
      { quantity: "1 BOX (100's)", price: "₱3,350.00", perPiece: "₱33.50" },
      { quantity: "1 PACK (50's)", price: "₱1,780.00", perPiece: "₱35.60" },
      { quantity: "25 PIECES", price: "₱900.00", perPiece: "₱36.00" },
      { quantity: "10 PIECES", price: "₱380.00", perPiece: "₱38.00" },
    ],
  },
  {
    name: "12\" Round Sushi Tray with Lid",
    category: "Round Sushi Trays",
    desc: "Black round sushi tray with gold pattern and lid — 12\".",
    longDesc: "Official Ziyah 12\" round sushi tray with lid.",
    boxPerPiece: "₱35.50",
    dimensions: "12\" diameter · Tray H 1\" · Lid H 1\"",
    images: roundSushiImages("12-inches"),
    specs: [
      { label: "Style", value: "Round sushi tray with lid" },
      { label: "Diameter", value: "12\"" },
    ],
    priceTiers: [
      { quantity: "1 BOX (100's)", price: "₱3,550.00", perPiece: "₱35.50" },
      { quantity: "1 PACK (50's)", price: "₱1,880.00", perPiece: "₱37.60" },
      { quantity: "25 PIECES", price: "₱1,000.00", perPiece: "₱40.00" },
      { quantity: "10 PIECES", price: "₱420.00", perPiece: "₱42.00" },
    ],
  },
  {
    name: "12.5\" Round Sushi Tray with Lid",
    category: "Round Sushi Trays",
    desc: "Black round sushi tray with gold pattern and lid — 12.5\".",
    longDesc: "Official Ziyah 12.5\" round sushi tray with lid.",
    boxPerPiece: "₱38.00",
    dimensions: "12.5\" diameter · Tray H 1\" · Lid H 1\"",
    images: roundSushiImages("12.5-inches"),
    specs: [
      { label: "Style", value: "Round sushi tray with lid" },
      { label: "Diameter", value: "12.5\"" },
    ],
    priceTiers: [
      { quantity: "1 BOX (100's)", price: "₱3,800.00", perPiece: "₱38.00" },
      { quantity: "1 PACK (50's)", price: "₱1,980.00", perPiece: "₱39.60" },
      { quantity: "25 PIECES", price: "₱1,075.00", perPiece: "₱43.00" },
      { quantity: "10 PIECES", price: "₱450.00", perPiece: "₱45.00" },
    ],
  },
  {
    name: "12.5\" Round Sushi Tray with Division",
    category: "Round Sushi Trays",
    desc: "12.5\" round sushi tray with internal divisions and lid.",
    longDesc: "Official Ziyah 12.5\" round sushi tray with division and lid.",
    boxPerPiece: "₱38.50",
    dimensions: "12.5\" diameter · with division · Tray H 1\" · Lid H 1\"",
    images: roundSushiImages("12.5-inches", true),
    specs: [
      { label: "Style", value: "Round sushi tray with division + lid" },
      { label: "Diameter", value: "12.5\"" },
    ],
    priceTiers: [
      { quantity: "1 BOX (100's)", price: "₱3,850.00", perPiece: "₱38.50" },
      { quantity: "1 PACK (50's)", price: "₱2,030.00", perPiece: "₱40.60" },
      { quantity: "25 PIECES", price: "₱1,125.00", perPiece: "₱45.00" },
      { quantity: "10 PIECES", price: "₱480.00", perPiece: "₱48.00" },
    ],
  },
  {
    name: "14\" Round Sushi Tray with Lid",
    category: "Round Sushi Trays",
    desc: "Black round sushi tray with gold pattern and lid — 14\".",
    longDesc: "Official Ziyah 14\" round sushi tray with lid.",
    boxPerPiece: "₱43.00",
    dimensions: "14\" diameter · Tray H 1\" · Lid H 1\"",
    images: roundSushiImages("14-inches"),
    specs: [
      { label: "Style", value: "Round sushi tray with lid" },
      { label: "Diameter", value: "14\"" },
    ],
    priceTiers: [
      { quantity: "1 BOX (100's)", price: "₱4,300.00", perPiece: "₱43.00" },
      { quantity: "1 PACK (50's)", price: "₱2,230.00", perPiece: "₱44.60" },
      { quantity: "25 PIECES", price: "₱1,175.00", perPiece: "₱47.00" },
      { quantity: "10 PIECES", price: "₱520.00", perPiece: "₱52.00" },
    ],
  },
  {
    name: "14\" Round Sushi Tray with Division",
    category: "Round Sushi Trays",
    desc: "14\" round sushi tray with internal divisions and lid.",
    longDesc: "Official Ziyah 14\" round sushi tray with division and lid.",
    boxPerPiece: "₱43.50",
    dimensions: "14\" diameter · with division · Tray H 1\" · Lid H 1\"",
    images: roundSushiImages("14-inches", true),
    specs: [
      { label: "Style", value: "Round sushi tray with division + lid" },
      { label: "Diameter", value: "14\"" },
    ],
    priceTiers: [
      { quantity: "1 BOX (100's)", price: "₱4,350.00", perPiece: "₱43.50" },
      { quantity: "1 PACK (50's)", price: "₱2,250.00", perPiece: "₱45.00" },
      { quantity: "25 PIECES", price: "₱1,225.00", perPiece: "₱49.00" },
      { quantity: "10 PIECES", price: "₱540.00", perPiece: "₱54.00" },
    ],
  },

  // Rectangular sushi trays
  {
    name: "RE-ST 01 Rectangular Sushi Tray",
    category: "Rectangular Sushi Trays",
    desc: "Black rectangular sushi tray with gold pattern and lid — RE-ST 01.",
    longDesc: "Official Ziyah RE-ST 01 rectangular sushi tray with lid.",
    boxPerPiece: "₱4.90",
    dimensions: "Tray 16.5 × 8.8 × 2 cm · Lid 17.2 × 9.5 × 2 cm",
    specs: [
      { label: "Model", value: "RE-ST 01" },
      { label: "Style", value: "Rectangular sushi tray with lid" },
    ],
    priceTiers: [
      { quantity: "1 BOX (600's)", price: "₱2,950.00", perPiece: "₱4.90" },
      { quantity: "1 PACK (50's)", price: "₱395.00", perPiece: "₱7.90" },
      { quantity: "25 PIECES", price: "₱223.00", perPiece: "₱8.90" },
      { quantity: "10 PIECES", price: "₱100.00", perPiece: "₱10.00" },
    ],
  },
  {
    name: "RE-ST 02 Rectangular Sushi Tray",
    category: "Rectangular Sushi Trays",
    desc: "Black rectangular sushi tray with gold pattern and lid — RE-ST 02.",
    longDesc: "Official Ziyah RE-ST 02 rectangular sushi tray with lid.",
    boxPerPiece: "₱6.60",
    dimensions: "Tray 22.2 × 9 × 2 cm · Lid 23 × 9.8 × 3.2 cm",
    specs: [
      { label: "Model", value: "RE-ST 02" },
      { label: "Style", value: "Rectangular sushi tray with lid" },
    ],
    priceTiers: [
      { quantity: "1 BOX (400's)", price: "₱2,650.00", perPiece: "₱6.60" },
      { quantity: "1 PACK (50's)", price: "₱457.00", perPiece: "₱9.10" },
      { quantity: "25 PIECES", price: "₱250.00", perPiece: "₱10.00" },
      { quantity: "10 PIECES", price: "₱110.00", perPiece: "₱11.00" },
    ],
  },
  {
    name: "RE-ST 03 Rectangular Sushi Tray",
    category: "Rectangular Sushi Trays",
    desc: "Black rectangular sushi tray with gold pattern and lid — RE-ST 03.",
    longDesc: "Official Ziyah RE-ST 03 rectangular sushi tray with lid.",
    boxPerPiece: "₱6.75",
    dimensions: "Tray 16.5 × 11.5 × 2 cm · Lid 17.2 × 12.2 × 2 cm",
    specs: [
      { label: "Model", value: "RE-ST 03" },
      { label: "Style", value: "Rectangular sushi tray with lid" },
    ],
    priceTiers: [
      { quantity: "1 BOX (400's)", price: "₱2,700.00", perPiece: "₱6.75" },
      { quantity: "1 PACK (50's)", price: "₱500.00", perPiece: "₱10.00" },
      { quantity: "25 PIECES", price: "₱275.00", perPiece: "₱11.00" },
      { quantity: "10 PIECES", price: "₱120.00", perPiece: "₱12.00" },
    ],
  },
  {
    name: "RE-ST 05 Rectangular Sushi Tray",
    category: "Rectangular Sushi Trays",
    desc: "Black rectangular sushi tray with gold pattern and lid — RE-ST 05.",
    longDesc: "Official Ziyah RE-ST 05 rectangular sushi tray with lid.",
    boxPerPiece: "₱7.80",
    dimensions: "Tray 18.5 × 13 × 2 cm · Lid 19.2 × 13.6 × 2 cm",
    specs: [
      { label: "Model", value: "RE-ST 05" },
      { label: "Style", value: "Rectangular sushi tray with lid" },
    ],
    priceTiers: [
      { quantity: "1 BOX (400's)", price: "₱3,130.00", perPiece: "₱7.80" },
      { quantity: "1 PACK (50's)", price: "₱550.00", perPiece: "₱11.00" },
      { quantity: "25 PIECES", price: "₱300.00", perPiece: "₱12.00" },
      { quantity: "10 PIECES", price: "₱130.00", perPiece: "₱13.00" },
    ],
  },
  {
    name: "RE-ST 07 Rectangular Sushi Tray",
    category: "Rectangular Sushi Trays",
    desc: "Black rectangular sushi tray with gold pattern and lid — RE-ST 07.",
    longDesc: "Official Ziyah RE-ST 07 rectangular sushi tray with lid.",
    boxPerPiece: "₱9.25",
    dimensions: "Tray 21.5 × 13.5 × 2 cm · Lid 22.4 × 14.1 × 3.2 cm",
    specs: [
      { label: "Model", value: "RE-ST 07" },
      { label: "Style", value: "Rectangular sushi tray with lid" },
    ],
    priceTiers: [
      { quantity: "1 BOX (400's)", price: "₱3,700.00", perPiece: "₱9.25" },
      { quantity: "1 PACK (50's)", price: "₱630.00", perPiece: "₱12.60" },
      { quantity: "25 PIECES", price: "₱340.00", perPiece: "₱13.60" },
      { quantity: "10 PIECES", price: "₱146.00", perPiece: "₱14.60" },
    ],
  },
  {
    name: "RE-ST 09 Rectangular Sushi Tray",
    category: "Rectangular Sushi Trays",
    desc: "Black rectangular sushi tray with gold pattern and lid — RE-ST 09.",
    longDesc: "Official Ziyah RE-ST 09 rectangular sushi tray with lid.",
    boxPerPiece: "₱11.56",
    dimensions: "Tray 23.7 × 13.5 × 2 cm · Lid 24.5 × 15 × 3.2 cm",
    specs: [
      { label: "Model", value: "RE-ST 09" },
      { label: "Style", value: "Rectangular sushi tray with lid" },
    ],
    priceTiers: [
      { quantity: "1 BOX (300's)", price: "₱3,470.00", perPiece: "₱11.56" },
      { quantity: "1 PACK (50's)", price: "₱680.00", perPiece: "₱13.60" },
      { quantity: "25 PIECES", price: "₱365.00", perPiece: "₱14.60" },
      { quantity: "10 PIECES", price: "₱156.00", perPiece: "₱15.60" },
    ],
  },
  {
    name: "RE-ST 11 Rectangular Sushi Tray",
    category: "Rectangular Sushi Trays",
    desc: "Black rectangular sushi tray with gold pattern and lid — RE-ST 11.",
    longDesc: "Official Ziyah RE-ST 11 rectangular sushi tray with lid.",
    boxPerPiece: "₱15.00",
    dimensions: "Tray 25.6 × 18.5 × 2 cm · Lid 26.3 × 19 × 3.2 cm",
    specs: [
      { label: "Model", value: "RE-ST 11" },
      { label: "Style", value: "Rectangular sushi tray with lid" },
    ],
    priceTiers: [
      { quantity: "1 BOX (200's)", price: "₱3,000.00", perPiece: "₱15.00" },
      { quantity: "1 PACK (50's)", price: "₱938.00", perPiece: "₱18.70" },
      { quantity: "25 PIECES", price: "₱493.00", perPiece: "₱19.70" },
      { quantity: "10 PIECES", price: "₱207.00", perPiece: "₱20.70" },
    ],
  },
];

export const products: Product[] = buildProducts(drafts);

export const productCategories = [
  "All",
  "Hard Bento Clear",
  "Bento Boxes",
  "Hard Bento Black",
  "Round Sushi Trays",
  "Rectangular Sushi Trays",
] as const;

export function getProductById(id: number) {
  return products.find((p) => p.id === id);
}

const COLOR_ORDER = ["Clear", "Black", "Red & Black"];

export function getColorVariants(product: Product): Product[] {
  if (!product.variantGroup) return [product];
  return products
    .filter((p) => p.variantGroup === product.variantGroup)
    .sort((a, b) => {
      const ai = COLOR_ORDER.indexOf(a.color || "");
      const bi = COLOR_ORDER.indexOf(b.color || "");
      return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
    });
}

/** Same-category products for internal linking (SEO). */
export function getRelatedProducts(
  product: Product,
  limit = 4,
  catalog: Product[] = products
): Product[] {
  const sameCategory = catalog.filter(
    (p) => p.id !== product.id && p.category === product.category
  );
  if (sameCategory.length >= limit) return sameCategory.slice(0, limit);

  const rest = products.filter(
    (p) =>
      p.id !== product.id &&
      p.category !== product.category &&
      !sameCategory.some((s) => s.id === p.id)
  );
  return [...sameCategory, ...rest].slice(0, limit);
}

export function getProductFaqs(product: Product): ProductFaq[] {
  if (product.faqs && product.faqs.length > 0) {
    return product.faqs.filter((f) => f.question.trim() && f.answer.trim());
  }

  const label = product.displayName || product.name;
  const brand = SITE.name;
  const color = product.color;
  const lowest = product.priceTiers.at(-1);
  const box = product.priceTiers.find((t) => /box/i.test(t.quantity));

  const faqs: ProductFaq[] = [
    {
      question: `Where can I buy ${label} in the Philippines?`,
      answer: `You can buy ${label} from ${brand} online, via Messenger/Shopee, or at our Pasay City store on F.B. Harrison St. We supply restaurants, caterers, and home food businesses nationwide — not Metro Manila only.`,
    },
    {
      question: `Is ${label} food-grade packaging for takeout and meal prep?`,
      answer: `Yes. ${label} is sold as food-service packaging for takeout, delivery, catering, and meal prep. Specs include ${product.specs
        .map((s) => `${s.label.toLowerCase()} ${s.value}`)
        .join(", ")}. Size: ${product.dimensions}.`,
    },
    {
      question: `Do you deliver ${label} nationwide?`,
      answer: `Yes — ${brand} offers nationwide delivery across the Philippines. Prefer same-day? Visit our Pasay City pickup point (${SITE.addressShort.split(",").slice(0, 2).join(",")}). Store hours: ${SITE.hoursSummary}.`,
    },
  ];

  if (product.category.includes("Bento") || product.category.includes("Hard Bento")) {
    faqs.push({
      question: `What meal types fit the ${label}${color ? ` (${color})` : ""}?`,
      answer: `This ${product.category.toLowerCase()} works well for silog sets, rice meals with sides, packed lunches, and catering trays${color ? ` — the ${color} finish helps your brand look consistent on delivery photos` : ""}. Need help matching divisions to your menu? Message us for free packaging guidance.`,
    });
  } else {
    faqs.push({
      question: `Is ${label} good for sushi shops and catering platters?`,
      answer: `Absolutely. ${label} is a disposable sushi tray with lid designed for sushi bars, hotels, and party platters. The black gold-pattern look photographs well for menus and online orders. Size reference: ${product.dimensions}.`,
    });
  }

  faqs.push({
    question: `How much does ${label} cost wholesale vs small orders?`,
    answer: `Pricing depends on quantity. Box rate is about ${product.price} per piece${box ? ` (${box.quantity} for ${box.price})` : ""}${
      lowest ? `. Smaller packs start around ${lowest.perPiece} per piece (${lowest.quantity} for ${lowest.price})` : ""
    }. Request a wholesale quote for larger monthly volume.`,
  });

  return faqs;
}

export function getProductHref(product: Product | number) {
  const id = typeof product === "number" ? product : product.id;
  return `/products/${id}`;
}

export function buildInquireHref(
  product: Product,
  options?: { quantity?: number }
) {
  const qty = options?.quantity && options.quantity > 1 ? options.quantity : undefined;
  const params = new URLSearchParams({
    product: product.name,
    category: product.category,
    price: `${product.price}${product.unit}`,
    subject: "product-inquiry",
  });
  if (product.color) params.set("color", product.color);
  if (qty) params.set("quantity", String(qty));
  return `/contact?${params.toString()}`;
}

export function absoluteAssetUrl(path: string) {
  if (/^https?:\/\//i.test(path)) return path;
  return `${getSiteOrigin()}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Descriptive alt text for product photos (listing + gallery SEO). */
export function getProductImageAlt(
  productName: string,
  imageSrc: string,
  index = 0,
  meta?: {
    category?: string;
    color?: string;
    dimensions?: string;
  }
) {
  const file = imageSrc.toLowerCase();
  let view = `product photo ${index + 1}`;
  if (file.includes("flatview") || file.includes("flat")) {
    view = "flat view";
  } else if (file.includes("top")) {
    view = "top view";
  } else if (file.includes("side")) {
    view = "side view";
  }

  const details = [
    meta?.category,
    meta?.color ? `${meta.color} color` : null,
    meta?.dimensions ? `size ${meta.dimensions}` : null,
  ]
    .filter(Boolean)
    .join(", ");

  const detailPart = details ? ` (${details})` : "";
  return `${productName}${detailPart} — ${view}. Food-grade packaging for sale in the Philippines | ${SITE.name}`;
}

/** Absolute image URLs for sitemap / schema. */
export function getProductImageUrls(product: Product): string[] {
  return product.images.map((src) => absoluteAssetUrl(src));
}

/** Meta description helper (human + searchable, ~155 chars). */
export function getProductMetaDescription(product: Product) {
  const title = product.displayName || product.name;
  const base = `Buy ${title} from ${SITE.name}. ${product.desc} Size ${product.dimensions}. Wholesale & nationwide delivery from Pasay City, Philippines.`;
  return base.length > 160 ? `${base.slice(0, 157)}…` : base;
}
