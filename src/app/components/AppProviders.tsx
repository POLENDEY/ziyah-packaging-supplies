"use client";

import { ProductQueueProvider } from "./ProductQueueProvider";
import CartDrawer from "./CartDrawer";

export default function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ProductQueueProvider>
      {children}
      <CartDrawer />
    </ProductQueueProvider>
  );
}
