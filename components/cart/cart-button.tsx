"use client";

import { motion } from "motion/react";
import { useCart, useMenuUI } from "@/components/cart/cart-provider";
import { BagIcon } from "@/components/icons";
import { countOf } from "@/lib/cart";
import { DUR, EASE_OUT } from "@/lib/motion";

export function CartButton() {
  const { lines } = useCart();
  const { openDrawer } = useMenuUI();
  const count = countOf(lines);
  const label =
    count === 0
      ? "Open cart"
      : `Open cart, ${count} ${count === 1 ? "item" : "items"}`;

  return (
    <button
      type="button"
      onClick={openDrawer}
      aria-label={label}
      className="btn btn-ghost relative h-11 gap-2 px-4"
    >
      <BagIcon className="size-5" />
      <span className="hidden sm:inline">Cart</span>
      {count > 0 && (
        <span className="tabular absolute -top-1.5 -right-1.5 grid h-5 min-w-5 place-items-center rounded-pill bg-accent px-1 text-xs font-medium text-accent-ink">
          {/* Re-keyed on change so the new number pops in. */}
          <motion.span
            key={count}
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ duration: DUR.short, ease: EASE_OUT }}
          >
            {count}
          </motion.span>
        </span>
      )}
    </button>
  );
}
