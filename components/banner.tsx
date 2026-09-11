import Image from "next/image";
import type { CSSProperties } from "react";
import { ArrowDownIcon, ClockIcon, UtensilsIcon } from "@/components/icons";
import { getAllItems, getCategories } from "@/lib/api";
import { HERO_PLATES } from "@/lib/dish-images";

/**
 * Hero — H2 split diptych (7/5). Copy left, a cluster of plates right, on a
 * single sage panel. The dish and category counts are real (cached API data),
 * so the headline is an honest inventory header rather than a slogan.
 */
export async function Banner() {
  const [items, categories] = await Promise.all([
    getAllItems(),
    getCategories(),
  ]);

  return (
    <section
      aria-labelledby="hero-title"
      className="mx-auto w-full max-w-(--page-max) px-(--page-gutter) pt-3 pb-10 sm:pb-14"
    >
      <div className="relative overflow-hidden rounded-panel bg-paper-3 px-6 pt-10 pb-8 sm:px-12 sm:pt-16 sm:pb-12 lg:grid lg:grid-cols-[7fr_5fr] lg:items-center lg:gap-16 lg:py-16">
        <div className="reveal max-w-[34rem]" style={{ "--i": 1 } as CSSProperties}>
          <h1
            id="hero-title"
            className="text-display font-semibold text-ink"
          >
            {items.length} dishes, one kitchen in Shorsh.
          </h1>
          <p className="mt-6 max-w-[42ch] text-md text-ink-2">
            Slow-cooked classics and seasonal plates from Birga in Erbil. Pick
            from {categories.length} categories below and build your cart.
          </p>
          <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
            <li className="flex items-center gap-2">
              <ClockIcon className="size-4 text-accent" />
              <span className="tabular">Open daily 11:00–23:00</span>
            </li>
            <li className="flex items-center gap-2">
              <UtensilsIcon className="size-4 text-accent" />
              Dine-in &amp; takeaway
            </li>
          </ul>
          <a
            href="#menu"
            className="link-arrow mt-8 inline-flex h-11 items-center gap-2 rounded-sm text-base font-medium text-ink"
          >
            Browse the menu
            <ArrowDownIcon className="arrow size-4" />
          </a>
        </div>

        <HeroPlates />
      </div>
    </section>
  );
}

/**
 * Three plates on a hand-drawn ribbon. Tier-B enrichment: the ribbon is one
 * SVG path, the plates are real (placeholder) photography clipped to circles.
 */
function HeroPlates() {
  return (
    <div
      aria-hidden="true"
      className="relative mt-10 h-56 sm:h-72 lg:mt-0 lg:h-[24rem]"
    >
      <svg
        viewBox="0 0 400 400"
        className="absolute inset-0 h-full w-full text-accent-soft"
        preserveAspectRatio="xMidYMid meet"
      >
        <path
          d="M 38 78 C 128 42, 214 118, 214 206 C 214 296, 300 344, 386 318"
          fill="none"
          stroke="currentColor"
          strokeWidth="36"
          strokeLinecap="round"
        />
      </svg>

      <figure
        className="reveal-plate absolute top-[8%] right-[4%] w-[56%] sm:w-[54%]"
        style={{ "--i": 2 } as CSSProperties}
      >
        <span className="plate">
          <Image
            src={HERO_PLATES[0]}
            alt=""
            fill
            priority
            sizes="(max-width: 64rem) 50vw, 300px"
            className="object-cover"
          />
        </span>
      </figure>

      <figure
        className="reveal-plate absolute top-[2%] left-[6%] w-[30%] sm:w-[28%]"
        style={{ "--i": 3 } as CSSProperties}
      >
        <span className="plate">
          <Image
            src={HERO_PLATES[1]}
            alt=""
            fill
            sizes="(max-width: 64rem) 25vw, 150px"
            className="object-cover"
          />
        </span>
      </figure>

      <figure
        className="reveal-plate absolute bottom-[2%] left-[22%] w-[26%] sm:w-[24%]"
        style={{ "--i": 4 } as CSSProperties}
      >
        <span className="plate">
          <Image
            src={HERO_PLATES[2]}
            alt=""
            fill
            sizes="(max-width: 64rem) 25vw, 130px"
            className="object-cover"
          />
        </span>
      </figure>
    </div>
  );
}
