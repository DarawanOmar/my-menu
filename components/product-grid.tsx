import Link from "next/link";
import { ArrowRightIcon } from "@/components/icons";
import { getAllItems, getCategories, getItemsByCategory } from "@/lib/api";
import { ProductCard } from "./product-card";

/**
 * Fetches the dishes for the selected category. `categoryId` arrives from the
 * route param (statically generated at build), so each category's grid is
 * prerendered. The cached `getItems*` functions key on `categoryId` and
 * revalidate once a day.
 */
export async function ProductGrid({ categoryId }: { categoryId?: string }) {
  const isAll = !categoryId;

  const [items, categories] = await Promise.all([
    isAll ? getAllItems() : getItemsByCategory(categoryId),
    getCategories(),
  ]);

  const activeCategory = isAll
    ? null
    : categories.find((c) => c.id === categoryId);

  return (
    <section
      aria-labelledby="menu-title"
      className="mx-auto w-full max-w-(--page-max) px-(--page-gutter) pt-10 pb-16 sm:pt-14"
    >
      <header className="mb-8 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <h2
          id="menu-title"
          className="text-2xl font-semibold text-ink sm:text-3xl"
        >
          {activeCategory ? activeCategory.name : "Everything"}
        </h2>
        <p className="tabular text-sm text-muted">
          {items.length} {items.length === 1 ? "dish" : "dishes"}
        </p>
      </header>

      {items.length === 0 ? (
        <EmptyState />
      ) : (
        <ul className="grid  grid-cols-1 gap-x-3 gap-y-6 sm:grid-cols-2  sm:gap-x-5 sm:gap-y-8 md:grid-cols-3 lg:grid-cols-4">
          {items.map((item, index) => (
            <ProductCard key={item.id} item={item} index={index} />
          ))}
        </ul>
      )}
    </section>
  );
}

function EmptyState() {
  return (
    <div className="max-w-[34rem] rounded-card bg-paper-2 px-6 py-10 sm:px-8">
      <p className="text-lg font-semibold text-ink">
        Nothing in this category yet.
      </p>
      <p className="mt-2 text-base text-ink-2">
        The kitchen hasn’t added dishes here. Everything on the menu is one tap
        away.
      </p>
      <Link href="/" scroll={false} className="btn btn-ink mt-6 inline-flex">
        See everything
        <ArrowRightIcon className="size-4" />
      </Link>
    </div>
  );
}
