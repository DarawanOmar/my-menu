"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef } from "react";
import type { Category } from "@/lib/types";

const ALL = "all";

export function CategorySlider({ categories }: { categories: Category[] }) {
  const pathname = usePathname();
  // "/" → all; "/<id>" → that category id.
  const active =
    pathname === "/" ? ALL : decodeURIComponent(pathname.slice(1));
  const scrollerRef = useRef<HTMLUListElement>(null);

  function scrollBy(direction: 1 | -1) {
    scrollerRef.current?.scrollBy({
      left: direction * 280,
      behavior: "smooth",
    });
  }

  return (
    <div className="relative">
      {/* Arrow controls (hidden on touch-first small screens) */}
      <ScrollButton side="left" onClick={() => scrollBy(-1)} />
      <ScrollButton side="right" onClick={() => scrollBy(1)} />

      <ul
        ref={scrollerRef}
        className="no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth px-5 py-2 sm:px-8"
      >
        <li className="snap-start">
          <CategoryPill href="/" label="All" isActive={active === ALL} />
        </li>

        {categories.map((category) => (
          <li key={category.id} className="snap-start">
            <CategoryPill
              href={`/${category.id}`}
              label={category.name}
              avatar={category.avatar}
              isActive={active === category.id}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

function CategoryPill({
  href,
  label,
  avatar,
  isActive,
}: {
  href: string;
  label: string;
  avatar?: string;
  isActive: boolean;
}) {
  return (
    <Link
      href={href}
      scroll={false}
      aria-current={isActive ? "true" : undefined}
      className={`group flex shrink-0 cursor-pointer items-center gap-2.5 rounded-full border px-3.5 py-2 text-sm font-semibold transition-colors duration-200 ${
        isActive
          ? "border-brand-600 bg-brand-600 text-white shadow-sm shadow-brand-600/30"
          : "border-brand-100 bg-white text-ink/80 hover:border-brand-300 hover:bg-brand-50"
      }`}
    >
      {avatar ? (
        <span className="relative h-8 w-8 overflow-hidden rounded-full ring-2 ring-white/60">
          <Image
            src={avatar}
            alt=""
            fill
            sizes="32px"
            className="object-cover"
          />
        </span>
      ) : (
        <span
          className={`flex h-8 w-8 items-center justify-center rounded-full ${
            isActive ? "bg-white/20" : "bg-brand-50 text-brand-600"
          }`}
        >
          <GridIcon className="h-4 w-4" />
        </span>
      )}
      <span className="whitespace-nowrap pr-1">{label}</span>
    </Link>
  );
}

function ScrollButton({
  side,
  onClick,
}: {
  side: "left" | "right";
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={side === "left" ? "Scroll categories left" : "Scroll categories right"}
      className={`absolute top-1/2 z-10 hidden -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-brand-100 bg-white/90 p-2 text-brand-600 shadow-sm backdrop-blur transition-colors duration-200 hover:bg-brand-50 md:flex ${
        side === "left" ? "left-2" : "right-2"
      }`}
    >
      <ChevronIcon
        className={`h-5 w-5 ${side === "left" ? "rotate-180" : ""}`}
      />
    </button>
  );
}

function ChevronIcon({ className }: { className?: string }) {
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
      <path d="m9 6 6 6-6 6" />
    </svg>
  );
}

function GridIcon({ className }: { className?: string }) {
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
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  );
}
