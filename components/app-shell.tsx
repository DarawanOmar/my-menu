"use client";

import { useEffect, type ReactNode } from "react";
import { useCart, useMenuUI } from "@/components/cart/cart-provider";

/**
 * Wraps everything that is *not* an overlay. While the product sheet or the
 * cart drawer is open the shell goes `inert` (no tab-order leaks, no clicks)
 * and body scrolling is locked.
 */
export function AppShell({ children }: { children: ReactNode }) {
  const { sheetItem, drawerOpen } = useMenuUI();
  const { lines, hydrated } = useCart();
  const locked = sheetItem !== null || drawerOpen;
  const hasCart = hydrated && lines.length > 0;

  useEffect(() => {
    document.body.style.overflow = locked ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [locked]);

  useEffect(() => {
    document.body.dataset.cartBar = hasCart ? "true" : "false";
  }, [hasCart]);

  return (
    <div
      id="app-shell"
      className="flex min-h-full flex-1 flex-col"
      inert={locked || undefined}
    >
      {children}
    </div>
  );
}
