import Link from "next/link";
import type { CSSProperties } from "react";
import { CartButton } from "@/components/cart/cart-button";

/**
 * N9 · Edge-aligned minimal. Wordmark hard-left, one action hard-right, and
 * nothing in between — the menu has no other destinations.
 */
export function SiteHeader() {
  return (
    <header
      className="reveal mx-auto flex w-full max-w-(--page-max) items-center justify-between px-(--page-gutter) pt-5 pb-3"
      style={{ "--i": 0 } as CSSProperties}
    >
      <Link
        href="/"
        className="wordmark rounded-sm text-[1.75rem] leading-none text-ink"
      >
        Birga
      </Link>
      <CartButton />
    </header>
  );
}
