import type { MenuItem } from "./types";

export type CartLine = {
  item: MenuItem;
  qty: number;
};

/** localStorage key — bump the suffix if the stored shape ever changes. */
export const CART_STORAGE_KEY = "birga.cart.v1";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export function priceOf(item: MenuItem): number {
  const n = Number(item.price);
  return Number.isFinite(n) ? n : 0;
}

export function formatPrice(amount: number): string {
  return currency.format(amount);
}

export function countOf(lines: CartLine[]): number {
  return lines.reduce((sum, line) => sum + line.qty, 0);
}

export function subtotalOf(lines: CartLine[]): number {
  return lines.reduce((sum, line) => sum + priceOf(line.item) * line.qty, 0);
}
