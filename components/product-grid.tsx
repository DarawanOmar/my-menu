import { getAllItems, getCategories, getItemsByCategory } from "@/lib/api";
import { ProductCard } from "./product-card";

/**
 * Fetches the dishes for the selected category. `categoryId` arrives from the
 * route param (statically generated at build), so each category's grid is
 * prerendered. The cached `getItems*` functions key on `categoryId` and
 * revalidate once a day.
 */
export async function ProductGrid({
  categoryId,
}: {
  categoryId?: string;
}) {
  const isAll = !categoryId;

  const [items, categories] = await Promise.all([
    isAll ? getAllItems() : getItemsByCategory(categoryId),
    getCategories(),
  ]);

  const activeCategory = isAll
    ? null
    : categories.find((c) => c.id === categoryId);

  return (
    <section className="mx-auto w-full max-w-6xl px-5 py-8 sm:px-8 sm:py-10">
      <header className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">
            {activeCategory ? activeCategory.name : "Full Menu"}
          </h2>
          <p className="mt-1 text-sm text-ink/55">
            {items.length} {items.length === 1 ? "dish" : "dishes"} available
          </p>
        </div>
      </header>

      {items.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <ProductCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </section>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-brand-200 bg-white/60 px-6 py-16 text-center">
      <p className="font-display text-lg font-semibold text-ink">
        No dishes here yet
      </p>
      <p className="mt-1 max-w-sm text-sm text-ink/55">
        Lorem ipsum — this category is still being plated. Try another category
        from the menu above.
      </p>
    </div>
  );
}
