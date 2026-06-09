/**
 * Shown as the `<Suspense>` fallback while the category's items are fetched.
 * Reserves the same layout to avoid content jumping.
 */
export function ProductGridSkeleton() {
  return (
    <section className="mx-auto w-full max-w-6xl px-5 py-8 sm:px-8 sm:py-10">
      <div className="mb-6">
        <div className="h-8 w-48 animate-pulse rounded-lg bg-brand-100" />
        <div className="mt-2 h-4 w-24 animate-pulse rounded bg-brand-100/70" />
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="overflow-hidden rounded-2xl border border-brand-100 bg-white"
          >
            <div className="aspect-[4/3] animate-pulse bg-brand-100" />
            <div className="space-y-3 p-4">
              <div className="h-5 w-3/4 animate-pulse rounded bg-brand-100" />
              <div className="h-4 w-full animate-pulse rounded bg-brand-100/70" />
              <div className="h-11 w-full animate-pulse rounded-full bg-brand-100/70" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
