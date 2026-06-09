import Image from "next/image";
import type { MenuItem } from "@/lib/types";

const priceFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function ProductCard({ item }: { item: MenuItem }) {
  const price = Number(item.price);

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-brand-100 bg-white shadow-sm transition-colors duration-200 hover:border-brand-300">
      <div className="relative aspect-[4/3] overflow-hidden bg-brand-50">
        <Image
          src={"/food.jpg"}
          // src={item.avatar}
          alt={item.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 320px"
          className="object-cover"
        />
        <span className="absolute right-3 top-3 rounded-full bg-gold-600 px-3 py-1 text-sm font-bold text-white shadow-sm">
          {Number.isFinite(price)
            ? `$${priceFormatter.format(price)}`
            : item.price}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="font-display text-lg font-semibold leading-snug text-ink">
          {item.name}
        </h3>
        <p className="line-clamp-2 text-sm leading-6 text-ink/60">
          {item.description}
        </p>

        <button
          type="button"
          className="mt-auto flex h-11 cursor-pointer items-center justify-center gap-2 rounded-full bg-brand-600 px-4 text-sm font-semibold text-white transition-colors duration-200 hover:bg-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
        >
          <PlusIcon className="h-4 w-4" />
          Add to order
        </button>
      </div>
    </article>
  );
}

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}
