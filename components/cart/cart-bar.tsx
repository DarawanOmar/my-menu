"use client";

import { AnimatePresence, motion } from "motion/react";
import { useCart, useMenuUI } from "@/components/cart/cart-provider";
import { ArrowRightIcon } from "@/components/icons";
import { countOf, formatPrice, subtotalOf } from "@/lib/cart";
import { ENTER, EXIT } from "@/lib/motion";

/**
 * C4 · Sticky bottom bar. Appears once the cart has something in it and stays
 * reachable while browsing; hides whenever an overlay is open.
 */
export function CartBar() {
  const { lines, hydrated } = useCart();
  const { drawerOpen, sheetItem, openDrawer } = useMenuUI();
  const count = countOf(lines);
  const show = hydrated && count > 0 && !drawerOpen && sheetItem === null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="cart-bar"
          className="pointer-events-none fixed inset-x-0 bottom-0 z-(--z-float) px-(--page-gutter) pb-[max(1rem,env(safe-area-inset-bottom))]"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24, transition: EXIT }}
          transition={ENTER}
        >
          <button
            type="button"
            onClick={openDrawer}
            className="pointer-events-auto mx-auto flex h-14 w-full max-w-[28rem] items-center justify-between gap-4 rounded-pill bg-ink pr-2 pl-6 text-paper shadow-float"
          >
            <span className="tabular flex items-center gap-2 text-sm">
              <span className="font-medium">
                {count} {count === 1 ? "item" : "items"}
              </span>
              <span aria-hidden="true" className="text-paper/50">
                ·
              </span>
              <span className="font-medium">{formatPrice(subtotalOf(lines))}</span>
            </span>
            <span className="btn btn-paper h-10 px-4 text-sm">
              View cart
              <ArrowRightIcon className="size-4" />
            </span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
