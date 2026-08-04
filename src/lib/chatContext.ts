import { products, type Product } from "@/data/products";
import { SITE } from "@/data/site";

/** Compact catalog + business facts for the support chatbot. */
export function buildBusinessKnowledge(): string {
  const catalog = products
    .map((p) => {
      const color = p.color ? ` | Color: ${p.color}` : "";
      const tiers = p.priceTiers
        .slice(0, 2)
        .map((t) => `${t.quantity} ${t.price}`)
        .join("; ");
      return `- ${p.name}${color} | ${p.category} | ${p.dimensions} | from ${p.price}${p.unit} | ${tiers}`;
    })
    .join("\n");

  return `
BUSINESS: ${SITE.name}
Phone: ${SITE.phone} | Email: ${SITE.email}
Address: ${SITE.addressShort}
Hours: ${SITE.hoursSummary}
Service: ${SITE.serviceArea}
Shopee: ${SITE.social.shopee.href}
Pages: /products /contact /quote /about

CATALOG:
${catalog}
`.trim();
}

export const CHAT_SYSTEM_PROMPT = `You are Ziyah Support for ${SITE.name} (Pasay City, Philippines food packaging).

Style: warm, clear, ChatGPT-like. Answer in 2-5 short paragraphs or tight bullets. Match English/Tagalog to the user.

Rules:
1) Use ONLY the knowledge base / catalog below. Do not invent products, prices, or fees.
2) Stay on packaging, pricing, wholesale, delivery, store hours/location, and ordering help.
3) If asked something unrelated, briefly decline and offer packaging help.
4) NEVER repeat your previous answer. Each reply must be new and specific to the latest user message.
5) When recommending products, include name, key size/color, and starting price from the catalog.
6) End with one helpful next step (e.g. add to cart, /products, /quote, call ${SITE.phone}) — but vary the closing; do not reuse the same closing every time.
7) Do not dump the whole catalog. Pick the most relevant 1-4 items.

KNOWLEDGE BASE:
${buildBusinessKnowledge()}
`;

export type ChatTurn = { role: "user" | "assistant"; content: string };

const STOP = new Set([
  "the",
  "and",
  "for",
  "with",
  "have",
  "what",
  "how",
  "can",
  "you",
  "your",
  "our",
  "are",
  "is",
  "do",
  "does",
  "please",
  "about",
  "from",
  "this",
  "that",
  "want",
  "need",
  "help",
  "me",
  "a",
  "an",
  "to",
  "of",
  "in",
  "on",
]);

function tokens(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s"'.-]/gi, " ")
    .split(/\s+/)
    .filter((w) => w.length > 1 && !STOP.has(w));
}

export function findRelevantProducts(query: string, limit = 4): Product[] {
  const toks = tokens(query);
  if (!toks.length) return [];

  const ranked = products
    .map((p) => {
      const hay = [p.name, p.category, p.desc, p.color || "", p.dimensions, p.longDesc]
        .join(" ")
        .toLowerCase();
      let score = 0;
      for (const t of toks) {
        if (hay.includes(t)) score += t.length > 3 ? 2 : 1;
      }
      if (/clear/i.test(query) && p.color === "Clear") score += 3;
      if (/black/i.test(query) && p.color === "Black") score += 3;
      if (/red/i.test(query) && p.color === "Red & Black") score += 3;
      return { p, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score);

  // Diversify colors/categories so replies don't look like a repeated list
  const picked: Product[] = [];
  const seenKey = new Set<string>();
  for (const row of ranked) {
    const key = `${row.p.category}|${row.p.color || "n/a"}|${row.p.displayName || row.p.name}`;
    const colorKey = `${row.p.category}|${row.p.color || row.p.name}`;
    if (seenKey.has(colorKey) && picked.length >= Math.min(2, limit)) continue;
    if (seenKey.has(key)) continue;
    seenKey.add(key);
    seenKey.add(colorKey);
    picked.push(row.p);
    if (picked.length >= limit) break;
  }

  if (picked.length < limit) {
    for (const row of ranked) {
      if (picked.some((p) => p.id === row.p.id)) continue;
      picked.push(row.p);
      if (picked.length >= limit) break;
    }
  }

  return picked;
}

function formatProductLine(p: Product): string {
  const nameHasColor = p.color && p.name.toLowerCase().includes(p.color.toLowerCase());
  const color = p.color && !nameHasColor ? ` (${p.color})` : "";
  const box = p.priceTiers.find((t) => /box/i.test(t.quantity));
  const pack = p.priceTiers.find((t) => /pack/i.test(t.quantity));
  const tierBit = box
    ? `Box ${box.price}${pack ? `; pack ${pack.price}` : ""}`
    : `from ${p.price}${p.unit}`;
  return `• ${p.name}${color} — ${p.dimensions}. ${tierBit}.`;
}

/** ChatGPT-like reply grounded only in site/catalog data (no external API). */
export function buildSiteReply(userText: string, history: ChatTurn[]): string {
  const q = userText.trim();
  const lower = q.toLowerCase();
  const relevant = findRelevantProducts(q, 4);
  const lastBot = [...history].reverse().find((m) => m.role === "assistant")?.content || "";

  const closings = [
    `Want me to compare sizes next, or help you inquire via /contact?`,
    `You can also call/Viber ${SITE.phone} or email ${SITE.email}.`,
    `Ready to order? Add items to your cart on a product page, or request a wholesale quote at /quote.`,
    `I can narrow it down further — tell me quantity and preferred color.`,
  ];
  let closing =
    closings.find((c) => !lastBot.includes(c.slice(0, 24))) || closings[0];
  if (/deliver|shipping|nationwide/i.test(lower)) {
    closing = `Tell me your city and product list and I’ll guide the inquiry.`;
  } else if (/location|address|hour/i.test(lower)) {
    closing = `Need product recommendations while you’re here? Just ask.`;
  } else if (/price|magkano|pricing/i.test(lower)) {
    closing = `Say a size or color (clear / black / red & black) if you want a tighter match.`;
  }

  if (/^(hi|hello|hey|good (morning|afternoon|evening)|kumusta|musta)\b/i.test(q)) {
    return `Hello! I'm Ziyah Support for ${SITE.name}. I can help with bento boxes, sushi trays, wholesale pricing, nationwide delivery, and our Pasay store hours.\n\nWhat are you packaging today?\n\n${closing}`;
  }

  if (/deliver|shipping|nationwide|ship|delivery|padala/i.test(lower)) {
    return `Yes — we serve ${SITE.serviceArea.toLowerCase()}. Many customers pick up at our Pasay store (${SITE.addressShort}) or arrange delivery for their kitchen.\n\nShare your city/province and the products you need, and I can point you to the right next step (cart inquiry or /quote).\n\n${closing}`;
  }

  if (/location|address|where|pasay|store|map|open|hour|oras/i.test(lower)) {
    return `Our store is at ${SITE.addressShort}.\n\nHours: ${SITE.hoursSummary}.\n\nPhone/Viber/SMS: ${SITE.phone}. Maps plus code: ${SITE.plusCode}.\n\n${closing}`;
  }

  if (/bulk|wholesale|quote|volume|marami|dosena|box rate/i.test(lower)) {
    const sample = (relevant.length ? relevant : products.slice(0, 3))
      .map(formatProductLine)
      .join("\n");
    return `We do wholesale and bulk — pack and box tiers are listed per product.\n\nExamples from our catalog:\n${sample}\n\nFor a custom volume quote, list SKUs + quantities on /quote or /contact, or tell me them here.\n\n${closing}`;
  }

  if (/price|magkano|cost|how much|pricing|presyo/i.test(lower)) {
    if (relevant.length) {
      return `Here's pricing from our site for what you asked about:\n${relevant
        .map(formatProductLine)
        .join("\n")}\n\nThose are listed piece/pack/box rates on /products. Large monthly volume can be quoted separately.\n\n${closing}`;
    }
    return `Product prices are on /products (piece, pack, and box). Hard bentos often start near ₱7.86–₱10+/pc by the box depending on divisions/color; sushi trays vary by size.\n\nTell me a product name or size (e.g. "11 inch round sushi tray") and I'll pull the exact listed rates.\n\n${closing}`;
  }

  if (/shopee|facebook|messenger|social/i.test(lower)) {
    return `You can also reach us here:\n• Shopee: ${SITE.social.shopee.href}\n• Facebook: ${SITE.social.facebook.href}\n• Messenger: ${SITE.social.messenger.href}\n\nOr keep chatting with me for product recommendations from this website.\n\n${closing}`;
  }

  if (/thank|salamat|thanks/i.test(lower)) {
    return `You're welcome! If you need help choosing packaging or building a cart list, just ask.\n\n${closing}`;
  }

  if (relevant.length) {
    const intro = /bento/i.test(lower)
      ? `For bento packaging, these options from our catalog fit best:`
      : /sushi/i.test(lower)
        ? `For sushi trays, here are the closest matches from our site:`
        : `Based on your question, here are the most relevant items from our catalog:`;

    return `${intro}\n${relevant.map(formatProductLine).join("\n")}\n\n${
      relevant[0].longDesc.split(". ").slice(0, 2).join(". ")
    }.\n\n${closing}`;
  }

  return `I can help with anything on the ${SITE.name} website — product picks, listed prices, wholesale, delivery, and store info in Pasay.\n\nTry asking like: "4 division clear hard bento price" or "12 inch round sushi tray".\n\n${closing}`;
}
