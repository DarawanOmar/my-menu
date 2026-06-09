import Image from "next/image";

/**
 * Hero banner for Birga Restaurant. Static content, so it lives in the
 * prerendered shell and renders instantly.
 */
export function Banner() {
  return (
    <section className="relative isolate overflow-hidden">
      {/* Restaurant photography */}
      <Image
        src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1920&q=80"
        alt="The warm, candle-lit dining room at Birga Restaurant"
        fill
        priority
        sizes="100vw"
        className="-z-10 object-cover"
      />
      {/* Readability gradient over the photo */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-t from-ink/90 via-ink/55 to-ink/30"
      />

      <div className="mx-auto flex min-h-[60vh] w-full max-w-6xl flex-col justify-end px-5 pb-12 pt-28 sm:min-h-[68vh] sm:px-8 sm:pb-16">
        <span className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-gold-400/40 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-gold-400 backdrop-blur">
          <LocationIcon className="h-3.5 w-3.5" />
          Erbil — Shorsh
        </span>

        <h1 className="font-display text-5xl font-bold leading-[1.05] text-white drop-shadow-sm sm:text-7xl">
          Birga Restaurant
        </h1>

        <p className="mt-4 max-w-xl text-base leading-7 text-white/85 sm:text-lg">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. A handcrafted
          menu of seasonal dishes, slow-cooked classics, and flavors that bring
          the whole table together — served with warm Kurdish hospitality in the
          heart of Shorsh.
        </p>

        <div className="mt-7 flex flex-wrap items-center gap-3">
          <InfoChip icon={<ClockIcon className="h-4 w-4" />}>
            Open daily · 11:00 — 23:00
          </InfoChip>
          <InfoChip icon={<StarIcon className="h-4 w-4" />}>
            4.8 · 1,200+ reviews
          </InfoChip>
          <InfoChip icon={<UtensilsIcon className="h-4 w-4" />}>
            Dine-in &amp; takeaway
          </InfoChip>
        </div>
      </div>
    </section>
  );
}

function InfoChip({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white/90 backdrop-blur ring-1 ring-white/15">
      <span className="text-gold-400">{icon}</span>
      {children}
    </span>
  );
}

function LocationIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

function StarIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="m12 17.27 5.18 3.12-1.37-5.9 4.58-3.97-6.03-.52L12 4.5 9.64 10l-6.03.52 4.58 3.97-1.37 5.9z" />
    </svg>
  );
}

function UtensilsIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M4 3v7a2 2 0 0 0 2 2h0a2 2 0 0 0 2-2V3M6 12v9M18 3c-1.66 0-3 2-3 5s1.34 4 3 4 0 0 0 0v9" />
    </svg>
  );
}
