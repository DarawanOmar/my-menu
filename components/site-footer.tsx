/**
 * Ft5 · Statement. One closing line, then the wordmark, place and copyright in
 * quiet small type. No sitemap — the page has one destination.
 */
export function SiteFooter() {
  return (
    <footer className="mx-auto w-full max-w-(--page-max) px-(--page-gutter) pt-16 pb-10 sm:pt-24">
      <p className="statement max-w-[20ch] text-[clamp(1.9rem,4.5vw,3.25rem)] leading-[1.05] text-ink">
        Open daily, eleven to eleven, in Shorsh.
      </p>
      <div className="mt-10 flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2 border-t border-rule pt-4 text-sm text-muted">
        <span className="wordmark text-lg text-ink">Birga</span>
        <span>Erbil — Shorsh</span>
        <span>© 2026 Birga Restaurant</span>
      </div>
    </footer>
  );
}
