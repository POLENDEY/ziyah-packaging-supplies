const IMG = "/dummy-post-square-1.jpg";
const SAMPLE_PRODUCT_VIDEO = "https://www.w3schools.com/html/movie.mp4";
const RST = "/round-sushi-tray";

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
};

type Draft = Omit<Product, "id" | "video" | "badge" | "type" | "unit" | "images" | "price"> & {
  /** Per-piece price when buying by the box */
  boxPerPiece: string;
  /** Optional custom images; first image is used on listing cards */
  images?: string[];
};

function buildProducts(drafts: Draft[]): Product[] {
  return drafts.map((d, index) => ({
    id: index + 1,
    name: d.name,
    category: d.category,
    desc: d.desc,
    longDesc: d.longDesc,
    type: "Disposable",
    price: d.boxPerPiece,
    unit: "/ piece",
    badge: "badgeDisposable",
    images: d.images?.length ? d.images : [IMG, IMG, IMG],
    video: SAMPLE_PRODUCT_VIDEO,
    specs: d.specs,
    dimensions: d.dimensions,
    priceTiers: d.priceTiers,
  }));
}

const drafts: Draft[] = [
  // Hard Bento Clear
  {
    name: "2 Division Hard Bento Box (Clear)",
    category: "Hard Bento Clear",
    desc: "Clear hard bento with lid — 2 compartments, 1000ml.",
    longDesc:
      "Official Ziyah hard bento box with clear lid and 2 divisions. Food-grade packaging for meal prep and takeout with volume pricing from 10 pieces up to full boxes.",
    boxPerPiece: "₱7.86",
    dimensions: "1000ml · 21.1 × 14.5 × 4.5 cm",
    specs: [
      { label: "Style", value: "Hard bento with lid (clear)" },
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
    category: "Hard Bento Clear",
    desc: "Clear hard bento with lid — 3 compartments, 1000ml.",
    longDesc:
      "Official Ziyah hard bento box with clear lid and 3 divisions. Ideal for set meals with separated sides.",
    boxPerPiece: "₱8.53",
    dimensions: "1000ml · 20.95 × 17.78 × 3.81 cm",
    specs: [
      { label: "Style", value: "Hard bento with lid (clear)" },
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
    category: "Hard Bento Clear",
    desc: "Clear hard bento with lid — 4 compartments, 1000ml.",
    longDesc:
      "Official Ziyah hard bento box with clear lid and 4 divisions for flexible plating.",
    boxPerPiece: "₱8.86",
    dimensions: "1000ml · 20.95 × 17.78 × 3.81 cm",
    specs: [
      { label: "Style", value: "Hard bento with lid (clear)" },
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
    category: "Hard Bento Clear",
    desc: "Clear hard bento with lid — 5 compartments, 1000ml.",
    longDesc:
      "Official Ziyah hard bento box with clear lid and 5 divisions for full meal sets.",
    boxPerPiece: "₱9.93",
    dimensions: "1000ml · 20.95 × 17.78 × 3.81 cm",
    specs: [
      { label: "Style", value: "Hard bento with lid (clear)" },
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

  // Soft / red-base bento
  {
    name: "1 Division Bento Box",
    category: "Bento Boxes",
    desc: "Red-base bento with clear lid — 1 compartment.",
    longDesc:
      "Official Ziyah 1-division bento box with red base and clear lid. Volume pricing from 25 pieces to full boxes.",
    boxPerPiece: "₱6.20",
    dimensions: "20.5 × 13 × 5.5 cm",
    specs: [
      { label: "Style", value: "Bento box with lid" },
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
    category: "Bento Boxes",
    desc: "Red-base bento with clear lid — 2 compartments.",
    longDesc:
      "Official Ziyah 2-division bento box with red base and clear lid for separated meals.",
    boxPerPiece: "₱5.90",
    dimensions: "22.5 × 14.5 × 5.5 cm",
    specs: [
      { label: "Style", value: "Bento box with lid" },
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
    category: "Bento Boxes",
    desc: "Red-base bento with clear lid — 3 compartments.",
    longDesc:
      "Official Ziyah 3-division bento box with red base and clear lid.",
    boxPerPiece: "₱5.90",
    dimensions: "22.5 × 19.5 × 3.5 cm",
    specs: [
      { label: "Style", value: "Bento box with lid" },
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
    category: "Bento Boxes",
    desc: "Red-base bento with clear lid — 4 compartments.",
    longDesc:
      "Official Ziyah 4-division bento box with red base and clear lid.",
    boxPerPiece: "₱5.98",
    dimensions: "22.5 × 19.5 × 3.5 cm",
    specs: [
      { label: "Style", value: "Bento box with lid" },
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
    category: "Bento Boxes",
    desc: "Red-base bento with clear lid — 5 compartments.",
    longDesc:
      "Official Ziyah 5-division bento box with red base and clear lid for complete meal sets.",
    boxPerPiece: "₱6.00",
    dimensions: "22.5 × 19.5 × 3.5 cm",
    specs: [
      { label: "Style", value: "Bento box with lid" },
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

export function getProductHref(product: Product | number) {
  const id = typeof product === "number" ? product : product.id;
  return `/products/${id}`;
}

export function buildInquireHref(product: Product) {
  const params = new URLSearchParams({
    product: product.name,
    category: product.category,
    price: `${product.price}${product.unit}`,
    subject: "product-inquiry",
  });
  return `/contact?${params.toString()}`;
}

export function getSiteOrigin() {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://ziyahpackagingsupplies.com"
  ).replace(/\/$/, "");
}

export function absoluteAssetUrl(path: string) {
  if (/^https?:\/\//i.test(path)) return path;
  return `${getSiteOrigin()}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Descriptive alt text for product photos (listing + gallery SEO). */
export function getProductImageAlt(
  productName: string,
  imageSrc: string,
  index = 0
) {
  const file = imageSrc.toLowerCase();
  let view = `product photo ${index + 1}`;
  if (file.includes("flatview") || file.includes("flat")) {
    view = "flat view";
  } else if (file.includes("top")) {
    view = "top view";
  }
  return `${productName} — ${view} | Ziyah Packaging Supplies food packaging Philippines`;
}
