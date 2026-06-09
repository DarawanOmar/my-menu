import { cacheLife, cacheTag } from "next/cache";
import type { Category, MenuItem, MenuItemRaw } from "./types";

const API_BASE = "https://6a27c9544e1e783349a46174.mockapi.io/api/menu";

function normalizeItem(raw: MenuItemRaw): MenuItem {
  const { discription, ...rest } = raw;
  return { ...rest, description: discription };
}

/**
 * Menu categories. Cached with the `days` profile, so Next.js serves the
 * cached payload instantly and revalidates in the background once a day —
 * picking up any new categories without a redeploy.
 */
export async function getCategories(): Promise<Category[]> {
  "use cache";
  cacheLife("days"); // revalidate after 1 day
  cacheTag("categories");

  const res = await fetch(`${API_BASE}/category`);
  if (!res.ok) throw new Error(`Failed to load categories (${res.status})`);
  return res.json();
}

/**
 * Every menu item across all categories. Used by the "All" filter.
 */
export async function getAllItems(): Promise<MenuItem[]> {
  "use cache";
  cacheLife("days"); // revalidate after 1 day
  cacheTag("items");

  const res = await fetch(`${API_BASE}/items`);
  if (!res.ok) throw new Error(`Failed to load items (${res.status})`);
  const data: MenuItemRaw[] = await res.json();
  return data.map(normalizeItem);
}

/**
 * Items belonging to a single category. `categoryId` is a function argument,
 * so it becomes part of the cache key — each category gets its own entry,
 * each revalidating one day after it was first fetched.
 */
export async function getItemsByCategory(
  categoryId: string,
): Promise<MenuItem[]> {
  "use cache";
  cacheLife("days"); // revalidate after 1 day
  cacheTag("items", `category-${categoryId}`);

  const res = await fetch(`${API_BASE}/category/${categoryId}/items`);
  // The mock API 404s for categories that have no items collection yet —
  // treat that as "empty" so the page still prerenders (with an empty state)
  // instead of failing the whole build.
  if (res.status === 404) return [];
  if (!res.ok) {
    throw new Error(
      `Failed to load items for category ${categoryId} (${res.status})`,
    );
  }
  const data: MenuItemRaw[] = await res.json();
  return data.map(normalizeItem);
}
