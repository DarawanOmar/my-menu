/**
 * Shown as the `<Suspense>` fallback while the category's items are fetched.
 * Mirrors the real grid so nothing jumps when the cards arrive.
 */
export function ProductGridSkeleton() {
  return (
    <section
      aria-busy="true"
      aria-label="Loading dishes"
      className="mx-auto w-full max-w-(--page-max) px-(--page-gutter) pt-10 pb-16 sm:pt-14"
    >
      <div className="mb-8 flex items-baseline justify-between">
        <div className="skeleton h-9 w-44 rounded-input" />
        <div className="skeleton h-4 w-16 rounded-input" />
      </div>
      <ul className="grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 sm:gap-x-5 sm:gap-y-8 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <li
            key={i}
            className="flex flex-col rounded-card bg-paper-2 p-4 pt-5 sm:p-5 sm:pt-6"
          >
            <div className="skeleton mx-auto aspect-square w-[74%] rounded-full sm:w-[70%]" />
            <div className="skeleton mt-5 h-5 w-4/5 rounded-input" />
            <div className="mt-3 flex items-end justify-between pt-3">
              <div className="skeleton h-5 w-16 rounded-input" />
              <div className="skeleton size-11 rounded-full" />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
