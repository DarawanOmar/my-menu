"use client";

import { AnimatePresence, motion, useDragControls } from "motion/react";
import Image from "next/image";
import { useRef, useState } from "react";
import { useCart, useMenuUI } from "@/components/cart/cart-provider";
import { BagIcon, CloseIcon } from "@/components/icons";
import { Stepper } from "@/components/ui/stepper";
import { useDialog } from "@/components/ui/use-dialog";
import { useMediaQuery } from "@/components/ui/use-media-query";
import { formatPrice, priceOf } from "@/lib/cart";
import { dishImage } from "@/lib/dish-images";
import { DUR, EASE_IN, EASE_OUT, ENTER, EXIT } from "@/lib/motion";
import type { MenuItem } from "@/lib/types";

/**
 * Dish detail. A bottom sheet on phones (drag the handle down to dismiss), a
 * side panel from the right on wider screens. Adding closes the sheet — the
 * cart bar that appears underneath is the confirmation.
 */
export function ProductSheet() {
  const { sheetItem, closeSheet } = useMenuUI();
  const { add } = useCart();
  const isWide = useMediaQuery("(min-width: 48rem)");

  return (
    <AnimatePresence>
      {sheetItem && (
        <motion.div
          key="sheet-scrim"
          aria-hidden="true"
          onClick={closeSheet}
          className="fixed inset-0 z-(--z-modal) bg-ink/45"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: EXIT }}
          transition={{ duration: DUR.long * 0.75, ease: EASE_OUT }}
        />
      )}
      {sheetItem && (
        <SheetPanel
          key={sheetItem.id}
          item={sheetItem}
          isWide={isWide}
          onClose={closeSheet}
          onAdd={(qty) => {
            add(sheetItem, qty);
            closeSheet();
          }}
        />
      )}
    </AnimatePresence>
  );
}

function SheetPanel({
  item,
  isWide,
  onClose,
  onAdd,
}: {
  item: MenuItem;
  isWide: boolean;
  onClose: () => void;
  onAdd: (qty: number) => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const dragControls = useDragControls();
  const [qty, setQty] = useState(1);
  const price = priceOf(item);
  const titleId = `sheet-title-${item.id}`;

  useDialog(panelRef, onClose);

  const hidden = isWide ? { x: "100%" } : { y: "100%" };

  return (
    <motion.div
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      tabIndex={-1}
      className={
        isWide
          ? "fixed inset-y-0 right-0 z-(--z-modal) flex w-full max-w-[30rem] flex-col rounded-l-panel bg-paper shadow-float outline-none"
          : "fixed inset-x-0 bottom-0 z-(--z-modal) flex max-h-[92dvh] flex-col rounded-t-sheet bg-paper shadow-float outline-none"
      }
      initial={hidden}
      animate={{ x: 0, y: 0 }}
      exit={{ ...hidden, transition: { duration: DUR.long * 0.75, ease: EASE_IN } }}
      transition={ENTER}
      drag={isWide ? false : "y"}
      dragControls={dragControls}
      dragListener={false}
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={{ top: 0, bottom: 0.75 }}
      dragTransition={{ bounceStiffness: 400, bounceDamping: 40 }}
      onDragEnd={(_, info) => {
        if (info.offset.y > 110 || info.velocity.y > 500) onClose();
      }}
    >
      {/* Grab handle — the only drag surface, so the content still scrolls. */}
      {!isWide && (
        <div
          onPointerDown={(event) => dragControls.start(event)}
          className="flex shrink-0 cursor-grab touch-none justify-center pt-3 pb-1 active:cursor-grabbing"
        >
          <span className="h-1.5 w-12 rounded-pill bg-rule" />
        </div>
      )}

      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="icon-btn absolute top-3 right-3 z-(--z-raised) bg-paper-2 text-ink hover:bg-paper-3 sm:top-5 sm:right-5"
      >
        <CloseIcon className="size-5" />
      </button>

      <div className="min-h-0 flex-1 overflow-y-auto px-6 pt-4 pb-6 sm:px-8 sm:pt-14">
        <motion.figure
          className="mx-auto w-[min(58%,15rem)] sm:w-[16rem]"
          initial={{ opacity: 0, scale: 0.9, rotate: -10 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ delay: 0.08, duration: 0.5, ease: EASE_OUT }}
        >
          <span className="plate">
            <Image
              src={dishImage(item.id)}
              alt=""
              fill
              sizes="256px"
              className="object-cover"
            />
          </span>
        </motion.figure>

        <h2 id={titleId} className="mt-8 text-2xl font-semibold text-ink">
          {item.name}
        </h2>
        <p className="tabular mt-1 text-lg font-medium text-accent">
          {formatPrice(price)}
        </p>
        <p className="mt-4 max-w-[60ch] text-base text-ink-2">
          {item.description}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-3 border-t border-rule px-5 pt-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:px-8 sm:pb-6">
        <Stepper
          value={qty}
          onChange={setQty}
          label={`Quantity of ${item.name}`}
        />
        <button
          type="button"
          onClick={() => onAdd(qty)}
          className="btn btn-ink h-12 min-w-0 flex-1 justify-between px-5 text-base"
        >
          <span className="flex items-center gap-2">
            <BagIcon className="size-5" />
            Add to cart
          </span>
          <span className="tabular">{formatPrice(price * qty)}</span>
        </button>
      </div>
    </motion.div>
  );
}
