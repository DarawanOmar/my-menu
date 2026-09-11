"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useCart, useMenuUI } from "@/components/cart/cart-provider";
import { CheckIcon, PlusIcon } from "@/components/icons";
import { formatPrice, priceOf } from "@/lib/cart";
import { dishImage } from "@/lib/dish-images";
import type { MenuItem } from "@/lib/types";

/**
 * F6 product card — round plate · name · price · one micro-action.
 * Tapping the plate or the name opens the detail sheet; the round button adds
 * one straight to the cart.
 */
export function ProductCard({
  item,
  index,
}: {
  item: MenuItem;
  index: number;
}) {
  const { openSheet } = useMenuUI();
  const price = priceOf(item);

  return (
    <li
      className="reveal min-w-0"
      // Cap the stagger so the 12th card onward arrives with the 12th — the
      // whole entrance settles in ~0.5 s no matter how long the menu is.
      style={{ "--i": Math.min(index, 11) } as CSSProperties}
    >
      <article className="card relative flex h-full flex-col rounded-card bg-paper-2 p-4 pt-5 sm:p-5 sm:pt-6">
        <button
          type="button"
          onClick={() => openSheet(item)}
          aria-label={`View ${item.name}`}
          className="plate-btn mx-auto block w-[74%] rounded-full sm:w-[70%]"
        >
          <span className="plate">
            <Image
              src={dishImage(item.id)}
              alt=""
              fill
              sizes="(max-width: 40rem) 40vw, (max-width: 64rem) 24vw, 220px"
              className="object-cover"
            />
          </span>
        </button>

        <h3 className="mt-5 text-md leading-snug font-semibold text-ink">
          <button
            type="button"
            onClick={() => openSheet(item)}
            className="rounded-sm text-left"
          >
            {item.name}
          </button>
        </h3>

        <div className="mt-auto flex items-end justify-between gap-3 pt-3">
          <p className="tabular text-base font-semibold text-ink">
            {formatPrice(price)}
          </p>
          <AddButton item={item} />
        </div>
      </article>
    </li>
  );
}

function AddButton({ item }: { item: MenuItem }) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  function handleAdd() {
    add(item, 1);
    setAdded(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setAdded(false), 1200);
  }

  return (
    <button
      type="button"
      onClick={handleAdd}
      aria-label={`Add ${item.name} to cart`}
      data-state={added ? "success" : undefined}
      className="icon-btn add-btn bg-ink text-paper hover:bg-ink-2"
    >
      <span className="ico ico-plus">
        <PlusIcon className="size-5" />
      </span>
      <span className="ico ico-check">
        <CheckIcon className="size-5" />
      </span>
      <span className="sr-only" aria-live="polite">
        {added ? "Added to cart" : ""}
      </span>
    </button>
  );
}
