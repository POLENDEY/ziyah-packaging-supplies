const IMG = "/dummy-post-square-1.jpg";

export type Product = {
  id: number;
  name: string;
  category: string;
  desc: string;
  longDesc: string;
  type: "Disposable" | "Reusable";
  price: string;
  unit: string;
  badge: "badgeDisposable" | "badgeReusable" | "badgeNew";
  images: string[];
  specs: { label: string; value: string }[];
  dimensions: string;
};

export const products: Product[] = [
  {
    id: 1,
    name: "3-Compartment Bento Box",
    category: "Bento Boxes",
    desc: "Black PP plastic bento with 3 compartments and clear lid — ideal for meal prep and takeout.",
    longDesc:
      "Serve complete meals with neat portion control. This food-grade PP bento keeps rice, proteins, and sides separated while the snap-on clear lid protects freshness during delivery.",
    type: "Disposable",
    price: "₱8",
    unit: "/ piece",
    badge: "badgeDisposable",
    images: [IMG, IMG, IMG],
    dimensions: "Approx. 22 × 15 × 5 cm",
    specs: [
      { label: "Material", value: "PP plastic + clear lid" },
      { label: "Compartments", value: "3" },
      { label: "Microwave", value: "Base microwave-safe (no lid)" },
      { label: "Best for", value: "Meal prep, delivery, catering" },
    ],
  },
  {
    id: 2,
    name: "5-Compartment Bento Box",
    category: "Bento Boxes",
    desc: "Large 5-section meal prep bento box with secure snap lid for bigger portions.",
    longDesc:
      "Perfect for hearty set meals and diet plans. Five compartments give you flexible plating without mixing flavors — a strong seller for restaurants and meal-prep brands.",
    type: "Disposable",
    price: "₱12",
    unit: "/ piece",
    badge: "badgeDisposable",
    images: [IMG, IMG, IMG],
    dimensions: "Approx. 25 × 18 × 5.5 cm",
    specs: [
      { label: "Material", value: "PP plastic + clear lid" },
      { label: "Compartments", value: "5" },
      { label: "Capacity", value: "Large / family-style meals" },
      { label: "Best for", value: "Diet meals, bento sets, delivery" },
    ],
  },
  {
    id: 3,
    name: "Kraft Paper Bento Box",
    category: "Bento Boxes",
    desc: "Eco-friendly kraft paper bento with microwave-safe inner coating.",
    longDesc:
      "Give your brand a natural, premium look. Kraft paper construction with a food-safe coating supports greener packaging goals without sacrificing strength.",
    type: "Disposable",
    price: "₱15",
    unit: "/ piece",
    badge: "badgeNew",
    images: [IMG, IMG, IMG],
    dimensions: "Approx. 20 × 14 × 5 cm",
    specs: [
      { label: "Material", value: "Kraft paper + food-safe coating" },
      { label: "Look", value: "Natural brown / eco aesthetic" },
      { label: "Microwave", value: "Yes (check coating limits)" },
      { label: "Best for", value: "Cafés, healthy brands, takeaway" },
    ],
  },
  {
    id: 4,
    name: "Sushi Tray w/ Clear Lid (Small)",
    category: "Sushi Trays",
    desc: "Crystal-clear OPS tray for 6–8 pcs sushi with anti-fog lid.",
    longDesc:
      "Showcase sushi beautifully for takeout and retail. The clear OPS body and anti-fog lid keep presentations sharp from counter to customer.",
    type: "Disposable",
    price: "₱10",
    unit: "/ piece",
    badge: "badgeDisposable",
    images: [IMG, IMG, IMG],
    dimensions: "Approx. 18 × 12 × 3.5 cm",
    specs: [
      { label: "Material", value: "OPS plastic" },
      { label: "Capacity", value: "6–8 pcs sushi" },
      { label: "Lid", value: "Anti-fog clear lid" },
      { label: "Best for", value: "Sushi bars, takeout, retail" },
    ],
  },
  {
    id: 5,
    name: "Sushi Tray w/ Clear Lid (Large)",
    category: "Sushi Trays",
    desc: "Wide-format tray fits 12–16 pcs sushi or rolls for family packs.",
    longDesc:
      "Upsell larger sushi sets with a wide tray that still looks premium under a clear lid — great for parties and weekend promotions.",
    type: "Disposable",
    price: "₱14",
    unit: "/ piece",
    badge: "badgeDisposable",
    images: [IMG, IMG, IMG],
    dimensions: "Approx. 24 × 15 × 4 cm",
    specs: [
      { label: "Material", value: "OPS plastic" },
      { label: "Capacity", value: "12–16 pcs / rolls" },
      { label: "Lid", value: "Clear snap lid" },
      { label: "Best for", value: "Family packs, catering trays" },
    ],
  },
  {
    id: 6,
    name: "Black Sushi Display Tray",
    category: "Sushi Trays",
    desc: "Premium matte-black tray ideal for display counters and plating.",
    longDesc:
      "Make colors pop on a matte-black base. Reusable display trays elevate counter presentation and photo-ready plating for premium sushi concepts.",
    type: "Reusable",
    price: "₱25",
    unit: "/ piece",
    badge: "badgeReusable",
    images: [IMG, IMG, IMG],
    dimensions: "Approx. 26 × 16 × 2.5 cm",
    specs: [
      { label: "Finish", value: "Matte black" },
      { label: "Use", value: "Display / reusable service" },
      { label: "Look", value: "Premium counter presentation" },
      { label: "Best for", value: "Sushi counters, tasting menus" },
    ],
  },
  {
    id: 7,
    name: "6-inch Clamshell (Clear)",
    category: "Clamshell Containers",
    desc: "Clear PET clamshell perfect for salads, fruits, and pastries.",
    longDesc:
      "Crystal clarity sells freshness. This hinged PET clamshell is a go-to for salads, cut fruit, and bakery items that need visibility and secure closure.",
    type: "Disposable",
    price: "₱7",
    unit: "/ piece",
    badge: "badgeDisposable",
    images: [IMG, IMG, IMG],
    dimensions: "Approx. 6-inch diameter / hinged",
    specs: [
      { label: "Material", value: "PET" },
      { label: "Closure", value: "Hinged clamshell" },
      { label: "Visibility", value: "Full clear body" },
      { label: "Best for", value: "Salads, fruits, pastries" },
    ],
  },
  {
    id: 8,
    name: "9-inch Clamshell (Black Base)",
    category: "Clamshell Containers",
    desc: "Black base with clear top lid — great for plated meal packaging.",
    longDesc:
      "Contrast that sells. A black base frames food nicely while the clear top shows off the meal — popular for ready-to-eat and delivery menus.",
    type: "Disposable",
    price: "₱11",
    unit: "/ piece",
    badge: "badgeDisposable",
    images: [IMG, IMG, IMG],
    dimensions: "Approx. 9-inch hinged container",
    specs: [
      { label: "Material", value: "PET / PP combo" },
      { label: "Style", value: "Black base + clear lid" },
      { label: "Size", value: "9-inch" },
      { label: "Best for", value: "Meals, delivery, catering" },
    ],
  },
  {
    id: 9,
    name: "Round Burger Clamshell",
    category: "Clamshell Containers",
    desc: "Round 5-inch clamshell designed for burgers and soft buns.",
    longDesc:
      "Keep burgers neat from grill to grab-and-go. The round profile hugs buns and helps prevent crushing during delivery.",
    type: "Disposable",
    price: "₱6",
    unit: "/ piece",
    badge: "badgeDisposable",
    images: [IMG, IMG, IMG],
    dimensions: "Approx. 5-inch round",
    specs: [
      { label: "Shape", value: "Round hinged" },
      { label: "Size", value: "5-inch" },
      { label: "Best for", value: "Burgers, sandwiches, buns" },
      { label: "Type", value: "Disposable" },
    ],
  },
  {
    id: 10,
    name: "Oval Foam Tray (White)",
    category: "Food Trays",
    desc: "Lightweight EPS foam tray for meats, poultry, and vegetables.",
    longDesc:
      "Economical trays for wet markets, butcher counters, and produce packaging. Lightweight foam with absorbent options for meats and seafood.",
    type: "Disposable",
    price: "₱4",
    unit: "/ piece",
    badge: "badgeDisposable",
    images: [IMG, IMG, IMG],
    dimensions: "Oval standard market size",
    specs: [
      { label: "Material", value: "EPS foam" },
      { label: "Color", value: "White" },
      { label: "Best for", value: "Meats, poultry, vegetables" },
      { label: "Type", value: "Disposable" },
    ],
  },
  {
    id: 11,
    name: "Rectangular PP Tray w/ Lid",
    category: "Food Trays",
    desc: "Durable PP tray with tight-fit lid — freezer safe and reusable.",
    longDesc:
      "A workhorse tray for kitchens that need durability. Freezer-safe PP with a tight lid supports storage, prep, and reusable service cycles.",
    type: "Reusable",
    price: "₱18",
    unit: "/ piece",
    badge: "badgeReusable",
    images: [IMG, IMG, IMG],
    dimensions: "Approx. 23 × 15 × 6 cm",
    specs: [
      { label: "Material", value: "PP plastic" },
      { label: "Lid", value: "Tight-fit included" },
      { label: "Freezer", value: "Yes" },
      { label: "Best for", value: "Prep, storage, reusable service" },
    ],
  },
  {
    id: 12,
    name: "Aluminum Foil Tray (Medium)",
    category: "Food Trays",
    desc: "Heat-resistant foil tray for oven baking and catering service.",
    longDesc:
      "From oven to table with less transfer mess. Medium foil trays handle heat well for baking, parties, and catering drops.",
    type: "Disposable",
    price: "₱9",
    unit: "/ piece",
    badge: "badgeDisposable",
    images: [IMG, IMG, IMG],
    dimensions: "Medium rectangular foil tray",
    specs: [
      { label: "Material", value: "Aluminum foil" },
      { label: "Heat", value: "Oven-safe" },
      { label: "Size", value: "Medium" },
      { label: "Best for", value: "Baking, catering, parties" },
    ],
  },
  {
    id: 13,
    name: "16oz Plastic Cup (Clear)",
    category: "Cups & Lids",
    desc: "Crystal-clear PET cold drink cup, 16oz — matching lids available.",
    longDesc:
      "Clear cups that show off juices, iced coffee, and soft drinks. Pair with matching lids for leak-resistant takeaway service.",
    type: "Disposable",
    price: "₱5",
    unit: "/ piece",
    badge: "badgeDisposable",
    images: [IMG, IMG, IMG],
    dimensions: "16oz / ~473 ml",
    specs: [
      { label: "Material", value: "PET" },
      { label: "Volume", value: "16oz" },
      { label: "Use", value: "Cold drinks" },
      { label: "Lids", value: "Compatible lids available" },
    ],
  },
  {
    id: 14,
    name: "22oz Disposable Tumbler",
    category: "Cups & Lids",
    desc: "Wide-mouth tumbler great for milk tea and iced specialty drinks.",
    longDesc:
      "Give milk-tea and smoothie brands the volume customers expect. Wide mouth for toppings and easy sealing with dome or flat lids.",
    type: "Disposable",
    price: "₱7",
    unit: "/ piece",
    badge: "badgeNew",
    images: [IMG, IMG, IMG],
    dimensions: "22oz / ~650 ml",
    specs: [
      { label: "Volume", value: "22oz" },
      { label: "Mouth", value: "Wide" },
      { label: "Best for", value: "Milk tea, smoothies, iced drinks" },
      { label: "Type", value: "Disposable" },
    ],
  },
  {
    id: 15,
    name: "Dome Lid (Medium)",
    category: "Cups & Lids",
    desc: "Dome-shaped lids with straw hole — fits 12–16oz cups.",
    longDesc:
      "Protect whipped cream and toppings with extra headroom. Straw hole included for quick service lines.",
    type: "Disposable",
    price: "₱2",
    unit: "/ piece",
    badge: "badgeDisposable",
    images: [IMG, IMG, IMG],
    dimensions: "Fits 12–16oz cups",
    specs: [
      { label: "Style", value: "Dome with straw hole" },
      { label: "Fit", value: "12–16oz cups" },
      { label: "Best for", value: "Frappe, iced coffee, toppings" },
      { label: "Type", value: "Disposable" },
    ],
  },
  {
    id: 16,
    name: "PVC Cling Wrap Roll (30cm)",
    category: "Wrapping & Film",
    desc: "Food-grade cling wrap, 30cm × 100m roll for kitchens and bakeries.",
    longDesc:
      "Stretchy, clingy protection for trays, bowls, and prep stations. A kitchen essential for bakeries, restaurants, and commissaries.",
    type: "Disposable",
    price: "₱120",
    unit: "/ roll",
    badge: "badgeDisposable",
    images: [IMG, IMG, IMG],
    dimensions: "30cm × 100m roll",
    specs: [
      { label: "Material", value: "Food-grade PVC" },
      { label: "Width", value: "30cm" },
      { label: "Length", value: "100m" },
      { label: "Best for", value: "Prep, storage, bakery wrapping" },
    ],
  },
  {
    id: 17,
    name: "Shrink Wrap Film",
    category: "Wrapping & Film",
    desc: "Heat-shrink film for sealing trays and finished product packs.",
    longDesc:
      "Create tight, professional seals for retail-ready trays and multipacks. Ideal when presentation and tamper-evident packaging matter.",
    type: "Disposable",
    price: "₱250",
    unit: "/ roll",
    badge: "badgeNew",
    images: [IMG, IMG, IMG],
    dimensions: "Industrial roll (confirm width on order)",
    specs: [
      { label: "Type", value: "Heat-shrink film" },
      { label: "Use", value: "Tray & product sealing" },
      { label: "Finish", value: "Tight retail seal" },
      { label: "Best for", value: "Retail packs, multipacks" },
    ],
  },
  {
    id: 18,
    name: "Greaseproof Baking Paper",
    category: "Wrapping & Film",
    desc: "Non-stick baking paper, 40cm × 50m roll for ovens and pastry work.",
    longDesc:
      "Reduce sticking and cleanup in baking lines. Greaseproof paper supports cookies, breads, and pastry production at scale.",
    type: "Disposable",
    price: "₱180",
    unit: "/ roll",
    badge: "badgeDisposable",
    images: [IMG, IMG, IMG],
    dimensions: "40cm × 50m roll",
    specs: [
      { label: "Type", value: "Greaseproof / non-stick" },
      { label: "Width", value: "40cm" },
      { label: "Length", value: "50m" },
      { label: "Best for", value: "Baking, pastry, lining trays" },
    ],
  },
];

export const productCategories = [
  "All",
  "Bento Boxes",
  "Sushi Trays",
  "Clamshell Containers",
  "Food Trays",
  "Cups & Lids",
  "Wrapping & Film",
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
