"use client";

import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useRef, useState } from "react";
import { useCart, useMenuUI } from "@/components/cart/cart-provider";
import { BagIcon, CloseIcon, TrashIcon } from "@/components/icons";
import { Stepper } from "@/components/ui/stepper";
import { useDialog } from "@/components/ui/use-dialog";
import {
  countOf,
  formatPrice,
  priceOf,
  subtotalOf,
  type CartLine,
} from "@/lib/cart";
import { dishImage } from "@/lib/dish-images";
import { DUR, EASE_IN, EASE_OUT, ENTER, EXIT } from "@/lib/motion";

/**
 * The cart, as a drawer from the right. Removing a line is optimistic with a
 * six-second Undo; checkout isn't wired to anything yet and says so.
 */
export function CartDrawer() {
  const { drawerOpen, closeDrawer } = useMenuUI();

  return (
    <AnimatePresence>
      {drawerOpen && (
        <motion.div
          key="drawer-scrim"
          aria-hidden="true"
          onClick={closeDrawer}
          className="fixed inset-0 z-(--z-modal) bg-ink/45"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: EXIT }}
          transition={{ duration: DUR.long * 0.75, ease: EASE_OUT }}
        />
      )}
      {drawerOpen && <DrawerPanel key="drawer-panel" onClose={closeDrawer} />}
    </AnimatePresence>
  );
}

function DrawerPanel({ onClose }: { onClose: () => void }) {
  const panelRef = useRef<HTMLDivElement>(null);
  const { lines, setQty, remove, removed, undoRemove } = useCart();
  const [checkoutNote, setCheckoutNote] = useState(false);
  const count = countOf(lines);
  const subtotal = subtotalOf(lines);

  useDialog(panelRef, onClose);

  return (
    <motion.div
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="cart-title"
      tabIndex={-1}
      className="fixed inset-y-0 right-0 z-(--z-modal) flex w-full flex-col bg-paper shadow-float outline-none sm:max-w-[27rem] sm:rounded-l-panel"
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%", transition: { duration: DUR.long * 0.75, ease: EASE_IN } }}
      transition={ENTER}
    >
      <header className="flex items-center justify-between gap-4 px-5 pt-5 pb-4 sm:px-7 sm:pt-7">
        <h2 id="cart-title" className="flex items-baseline gap-3 text-2xl font-semibold text-ink">
          Your cart
          {count > 0 && (
            <span className="tabular text-sm font-medium text-muted">
              {count} {count === 1 ? "item" : "items"}
            </span>
          )}
        </h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close cart"
          className="icon-btn bg-paper-2 text-ink hover:bg-paper-3"
        >
          <CloseIcon className="size-5" />
        </button>
      </header>

      <div className="relative min-h-0 flex-1 overflow-y-auto px-5 sm:px-7">
        {lines.length === 0 ? (
          <EmptyCart onBrowse={onClose} />
        ) : (
          <ul className="divide-y divide-rule">
            <AnimatePresence initial={false}>
              {lines.map((line) => (
                <CartLineRow
                  key={line.item.id}
                  line={line}
                  onQty={(qty) => setQty(line.item.id, qty)}
                  onRemove={() => remove(line.item.id)}
                />
              ))}
            </AnimatePresence>
          </ul>
        )}

        <AnimatePresence>
          {removed && (
            <motion.div
              key="undo"
              role="status"
              className="sticky bottom-3 mt-4 flex items-center justify-between gap-4 rounded-pill bg-ink py-2 pr-2 pl-5 text-sm text-paper shadow-float"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12, transition: EXIT }}
              transition={{ duration: DUR.short, ease: EASE_OUT }}
            >
              <span className="truncate">Removed {removed.item.name}.</span>
              <button
                type="button"
                onClick={undoRemove}
                className="btn btn-paper h-9 shrink-0 px-4 text-sm"
              >
                Undo
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {lines.length > 0 && (
        <footer className="shrink-0 border-t border-rule px-5 pt-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:px-7 sm:pb-6">
          <div className="flex items-baseline justify-between text-base">
            <span className="text-ink-2">Subtotal</span>
            <span className="tabular text-lg font-semibold text-ink">
              {formatPrice(subtotal)}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setCheckoutNote(true)}
            className="btn btn-ink mt-4 h-12 w-full text-base"
          >
            <BagIcon className="size-5" />
            Checkout
          </button>
          <p
            aria-live="polite"
            className="mt-3 min-h-[1lh] text-sm text-muted"
          >
            {checkoutNote
              ? "Checkout isn’t connected yet. Your cart is saved on this device."
              : ""}
          </p>
        </footer>
      )}
    </motion.div>
  );
}

function CartLineRow({
  line,
  onQty,
  onRemove,
}: {
  line: CartLine;
  onQty: (qty: number) => void;
  onRemove: () => void;
}) {
  const { item, qty } = line;
  const unit = priceOf(item);

  return (
    <motion.li
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: EXIT }}
      transition={{ duration: DUR.short, ease: EASE_OUT }}
      className="grid grid-cols-[3.5rem_minmax(0,1fr)_auto] items-center gap-3 py-4 sm:gap-4"
    >
      <span className="plate w-14">
        <Image
          src={dishImage(item.id)}
          alt=""
          fill
          sizes="56px"
          className="object-cover"
        />
      </span>

      <div className="min-w-0">
        <p className="line-clamp-2 text-base leading-snug font-medium text-ink">
          {item.name}
        </p>
        <p className="tabular mt-0.5 text-sm text-muted">
          {formatPrice(unit)}
          {qty > 1 && (
            <>
              {" "}
              × {qty} ={" "}
              <span className="text-ink-2">{formatPrice(unit * qty)}</span>
            </>
          )}
        </p>
      </div>

      <div className="flex items-center gap-1">
        <Stepper
          size="sm"
          value={qty}
          onChange={(next) => (next < 1 ? onRemove() : onQty(next))}
          min={0}
          label={`Quantity of ${item.name}`}
        />
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove ${item.name}`}
          className="icon-btn size-9 text-muted hover:bg-paper-2 hover:text-danger"
        >
          <TrashIcon className="size-4" />
        </button>
      </div>
    </motion.li>
  );
}

function EmptyCart({ onBrowse }: { onBrowse: () => void }) {
  return (
    <div className="flex h-full flex-col items-start justify-center py-10">
      <span className="grid size-14 place-items-center rounded-pill bg-paper-2 text-muted">
        <BagIcon className="size-6" />
      </span>
      <p className="mt-5 text-lg font-semibold text-ink">Your cart is empty.</p>
      <p className="mt-1 max-w-[30ch] text-base text-ink-2">
        Dishes you add from the menu show up here.
      </p>
      <button
        type="button"
        onClick={onBrowse}
        className="btn btn-ghost mt-6"
      >
        Browse the menu
      </button>
    </div>
  );
}
