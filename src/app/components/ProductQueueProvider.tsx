"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  buildQueueInquireHref,
  buildQueueMessage,
  formatPeso,
  queueGrandTotal,
  queueItemCount,
  readQueueFromStorage,
  writeQueueToStorage,
  type QueueItem,
} from "@/lib/productQueue";

type AddInput = Omit<QueueItem, "quantity"> & { quantity?: number };

type ProductQueueContextValue = {
  items: QueueItem[];
  ready: boolean;
  itemCount: number;
  grandTotal: number;
  grandTotalLabel: string;
  inquireHref: string;
  inquireMessage: string;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addToQueue: (item: AddInput, options?: { openCart?: boolean }) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  removeItem: (productId: number) => void;
  clearQueue: () => void;
};

const ProductQueueContext = createContext<ProductQueueContextValue | null>(null);

export function ProductQueueProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<QueueItem[]>([]);
  const [ready, setReady] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    setItems(readQueueFromStorage());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    writeQueueToStorage(items);
  }, [items, ready]);

  useEffect(() => {
    if (!isCartOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsCartOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [isCartOpen]);

  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);
  const toggleCart = useCallback(() => setIsCartOpen((v) => !v), []);

  const addToQueue = useCallback(
    (item: AddInput, options?: { openCart?: boolean }) => {
      const qty = Math.max(1, Math.min(9999, item.quantity ?? 1));
      setItems((prev) => {
        const existing = prev.find((row) => row.productId === item.productId);
        if (existing) {
          return prev.map((row) =>
            row.productId === item.productId
              ? { ...row, quantity: Math.min(9999, row.quantity + qty) }
              : row
          );
        }
        return [
          ...prev,
          {
            productId: item.productId,
            name: item.name,
            displayName: item.displayName,
            color: item.color,
            category: item.category,
            unitPrice: item.unitPrice,
            unitPriceLabel: item.unitPriceLabel,
            quantity: qty,
            image: item.image,
          },
        ];
      });
      if (options?.openCart !== false) {
        setIsCartOpen(true);
      }
    },
    []
  );

  const updateQuantity = useCallback((productId: number, quantity: number) => {
    const next = Math.max(0, Math.min(9999, quantity));
    setItems((prev) => {
      if (next <= 0) return prev.filter((row) => row.productId !== productId);
      return prev.map((row) =>
        row.productId === productId ? { ...row, quantity: next } : row
      );
    });
  }, []);

  const removeItem = useCallback((productId: number) => {
    setItems((prev) => prev.filter((row) => row.productId !== productId));
  }, []);

  const clearQueue = useCallback(() => setItems([]), []);

  const value = useMemo<ProductQueueContextValue>(() => {
    const grandTotal = queueGrandTotal(items);
    return {
      items,
      ready,
      itemCount: queueItemCount(items),
      grandTotal,
      grandTotalLabel: formatPeso(grandTotal),
      inquireHref: buildQueueInquireHref(),
      inquireMessage: buildQueueMessage(items),
      isCartOpen,
      openCart,
      closeCart,
      toggleCart,
      addToQueue,
      updateQuantity,
      removeItem,
      clearQueue,
    };
  }, [
    items,
    ready,
    isCartOpen,
    openCart,
    closeCart,
    toggleCart,
    addToQueue,
    updateQuantity,
    removeItem,
    clearQueue,
  ]);

  return (
    <ProductQueueContext.Provider value={value}>
      {children}
    </ProductQueueContext.Provider>
  );
}

export function useProductQueue() {
  const ctx = useContext(ProductQueueContext);
  if (!ctx) {
    throw new Error("useProductQueue must be used within ProductQueueProvider");
  }
  return ctx;
}

export { formatPeso, lineTotal, parsePeso } from "@/lib/productQueue";
