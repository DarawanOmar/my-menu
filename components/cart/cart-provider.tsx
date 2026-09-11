"use client";

import { MotionConfig } from "motion/react";
import {
  createContext,
  useContext,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import type { CartLine } from "@/lib/cart";
import { cartStore } from "@/lib/cart-store";
import { ENTER } from "@/lib/motion";
import type { MenuItem } from "@/lib/types";

/* ------------------------------------------------------------------ */
/* Cart — lines, persistence, optimistic remove + undo                 */
/* ------------------------------------------------------------------ */

type CartContextValue = {
  lines: CartLine[];
  /** False during server render and hydration; true once the client owns the cart. */
  hydrated: boolean;
  add: (item: MenuItem, qty?: number) => void;
  setQty: (id: string, qty: number) => void;
  remove: (id: string) => void;
  /** The most recently removed line, while it can still be undone. */
  removed: CartLine | null;
  undoRemove: () => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

/* ------------------------------------------------------------------ */
/* UI — which overlay is open                                          */
/* ------------------------------------------------------------------ */

type MenuUIContextValue = {
  sheetItem: MenuItem | null;
  openSheet: (item: MenuItem) => void;
  closeSheet: () => void;
  drawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
};

const MenuUIContext = createContext<MenuUIContextValue | null>(null);

const noopSubscribe = () => () => {};

export function CartProvider({ children }: { children: ReactNode }) {
  const { lines, removed } = useSyncExternalStore(
    cartStore.subscribe,
    cartStore.getSnapshot,
    cartStore.getServerSnapshot,
  );
  const hydrated = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );

  const [sheetItem, setSheetItem] = useState<MenuItem | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const cart: CartContextValue = {
    lines,
    hydrated,
    removed,
    add: cartStore.add,
    setQty: cartStore.setQty,
    remove: cartStore.remove,
    undoRemove: cartStore.undoRemove,
    clear: cartStore.clear,
  };

  const ui: MenuUIContextValue = {
    sheetItem,
    openSheet: (item) => setSheetItem(item),
    closeSheet: () => setSheetItem(null),
    drawerOpen,
    openDrawer: () => setDrawerOpen(true),
    closeDrawer: () => setDrawerOpen(false),
  };

  return (
    <CartContext.Provider value={cart}>
      <MenuUIContext.Provider value={ui}>
        {/* reducedMotion="user": transforms collapse to opacity for users who ask. */}
        <MotionConfig reducedMotion="user" transition={ENTER}>
          {children}
        </MotionConfig>
      </MenuUIContext.Provider>
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}

export function useMenuUI(): MenuUIContextValue {
  const ctx = useContext(MenuUIContext);
  if (!ctx) throw new Error("useMenuUI must be used inside <CartProvider>");
  return ctx;
}
