import { Suspense } from "react";
import { Banner } from "@/components/banner";
import { CategoryBar } from "@/components/category-bar";
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
    <main className="flex flex-1 flex-col bg-cream">
      <Banner />
      <CategoryBar />

      <Suspense key={categoryId ?? "all"} fallback={<ProductGridSkeleton />}>
        <ProductGrid categoryId={categoryId} />
      </Suspense>

      <footer className="mt-auto border-t border-brand-100 bg-white">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-5 py-8 text-sm text-ink/60 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p className="font-display text-base font-semibold text-ink">
            Birga Restaurant
          </p>
          <p>Erbil — Shorsh · Open daily 11:00 — 23:00</p>
          <p>© 2026 Birga. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
