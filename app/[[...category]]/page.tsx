import { Suspense } from "react";
import { ProductGrid } from "@/components/product-grid";
import { ProductGridSkeleton } from "@/components/product-grid-skeleton";
import { getCategories } from "@/lib/api";

/**
 * Build-time static generation.
 *
 * At `next build` this fetches every category id and emits one statically
 * prerendered route per category, plus the index ("All") route:
 *   - /            → all dishes
 *   - /<id>        → one page per category
 *
 * NOTE: `generateStaticParams` populates route *params*, not `searchParams`
 * (Next.js has no mechanism to pre-generate searchParams). Because Cache
 * Components is enabled, this MUST return at least one entry — it does (the
 * index route is always included).
 *
 * The header, hero, category tabs and footer live in `app/layout.tsx`, so a
 * page is just the grid for its category.
 */
export async function generateStaticParams() {
  const categories = await getCategories();

  return [
    { category: [] as string[] }, // the index route "/" → All
    ...categories.map((c) => ({ category: [c.id] })),
  ];
}

export default async function Home({
  params,
}: {
  // Optional catch-all → `category` is a string[] (or undefined at "/").
  params: Promise<{ category?: string[] }>;
}) {
  const { category } = await params;
  const categoryId = category?.[0]; // undefined ⇒ show all dishes

  return (
    <Suspense key={categoryId ?? "all"} fallback={<ProductGridSkeleton />}>
      <ProductGrid categoryId={categoryId} />
    </Suspense>
  );
}
