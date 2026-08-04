export type QueueItem = {
  productId: number;
  name: string;
  displayName: string;
  color?: string;
  category: string;
  unitPrice: number;
  unitPriceLabel: string;
  quantity: number;
  image: string;
};

export const QUEUE_STORAGE_KEY = "ziyah-product-queue-v1";

export function parsePeso(value: string): number {
  const n = Number(String(value).replace(/[^\d.]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

export function formatPeso(amount: number): string {
  return `₱${amount.toLocaleString("en-PH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function lineTotal(item: Pick<QueueItem, "unitPrice" | "quantity">): number {
  return item.unitPrice * item.quantity;
}

export function queueGrandTotal(items: QueueItem[]): number {
  return items.reduce((sum, item) => sum + lineTotal(item), 0);
}

export function queueItemCount(items: QueueItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

export function readQueueFromStorage(): QueueItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(QUEUE_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as QueueItem[];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item) =>
        item &&
        typeof item.productId === "number" &&
        typeof item.quantity === "number" &&
        item.quantity > 0
    );
  } catch {
    return [];
  }
}

export function writeQueueToStorage(items: QueueItem[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(items));
}

export function buildQueueMessage(items: QueueItem[]): string {
  if (items.length === 0) return "";
  const lines = items.map((item, i) => {
    const color = item.color ? ` (${item.color})` : "";
    return `${i + 1}. ${item.name}${color} × ${item.quantity} @ ${item.unitPriceLabel} = ${formatPeso(lineTotal(item))}`;
  });
  return [
    "Hi Ziyah Packaging,",
    "",
    "I'd like to inquire about this shopping cart:",
    "",
    ...lines,
    "",
    `Estimated subtotal: ${formatPeso(queueGrandTotal(items))} (${queueItemCount(items)} pieces)`,
    "",
    "Please share availability, bulk options, and delivery details. Thank you!",
  ].join("\n");
}

export function buildQueueInquireHref(): string {
  const params = new URLSearchParams({
    subject: "product-queue",
    from: "queue",
  });
  return `/contact?${params.toString()}`;
}
