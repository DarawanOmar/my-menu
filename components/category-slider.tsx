"use client";

import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, type CSSProperties } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/icons";
import { EASE_OUT } from "@/lib/motion";
import type { Category } from "@/lib/types";

const ALL = "all";

export function CategorySlider({ categories }: { categories: Category[] }) {
  const pathname = usePathname();
  // "/" → all; "/<id>" → that category id.
  const active = pathname === "/" ? ALL : decodeURIComponent(pathname.slice(1));
  const navRef = useRef<HTMLElement>(null);
  const scrollerRef = useRef<HTMLUListElement>(null);
  // Set when the user picks a tab; consumed once the new route has committed.
  const pendingReveal = useRef(false);
  const reduced = useReducedMotion();

  // After the active tab changes: centre it in the strip, and — if the change
  // came from a tap while the user was still up in the hero — bring the grid
  // into view. Back/forward navigation leaves the scroll position alone.
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const reveal = pendingReveal.current;
    pendingReveal.current = false;

    const el = scroller.querySelector<HTMLElement>('[aria-current="page"]');
    if (el) {
      const left = el.offsetLeft - (scroller.clientWidth - el.offsetWidth) / 2;
      // Snap the strip instantly when the page itself is about to scroll, so
      // the two smooth scrolls never fight.
      scroller.scrollTo({ left, behavior: reduced || reveal ? "auto" : "smooth" });
    }

    if (!reveal) return;
    const menu = document.getElementById("menu");
    if (!menu) return;
    const barHeight = navRef.current?.offsetHeight ?? 64;
    const top = menu.getBoundingClientRect().top;
    if (top > barHeight + 8) {
      window.scrollTo({
        top: window.scrollY + top - barHeight,
        behavior: reduced ? "auto" : "smooth",
      });
    }
  }, [active, reduced]);

  function scrollBy(direction: 1 | -1) {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    scroller.scrollBy({
      left: direction * scroller.clientWidth * 0.6,
      behavior: reduced ? "auto" : "smooth",
    });
  }

  function revealMenu() {
    pendingReveal.current = true;
  }

  return (
    <nav
      ref={navRef}
      aria-label="Menu categories"
      className="reveal sticky top-0 z-(--z-sticky) border-b border-rule bg-paper"
      style={{ "--i": 2 } as CSSProperties}
    >
      <div className="relative mx-auto w-full max-w-(--page-max)">
        <ScrollButton side="left" onClick={() => scrollBy(-1)} />
        <ScrollButton side="right" onClick={() => scrollBy(1)} />

        <ul
          ref={scrollerRef}
          // On md+ the strip starts after the arrow buttons; the edge fade follows.
          className="no-scrollbar fade-x flex gap-1.5 overflow-x-auto px-(--page-gutter) py-3 md:px-16 md:[--fade-edge:4rem]"
        >
          <Tab
            href="/"
            label="All"
            isActive={active === ALL}
            onNavigate={revealMenu}
          />
          {categories.map((category) => (
            <Tab
              key={category.id}
              href={`/${category.id}`}
              label={category.name}
              isActive={active === category.id}
              onNavigate={revealMenu}
            />
          ))}
        </ul>
      </div>
    </nav>
  );
}

function Tab({
  href,
  label,
  isActive,
  onNavigate,
}: {
  href: string;
  label: string;
  isActive: boolean;
  onNavigate: () => void;
}) {
  return (
    <li className="shrink-0">
      <Link
        href={href}
        scroll={false}
        onNavigate={onNavigate}
        aria-current={isActive ? "page" : undefined}
        className={`relative isolate inline-flex h-10 items-center rounded-pill px-4 text-sm font-medium whitespace-nowrap transition-colors duration-220 ease-out ${
          isActive ? "text-paper" : "text-ink-2 hover:bg-paper-2 hover:text-ink"
        }`}
      >
        {isActive && (
          // Shared layout id: the ink pill slides from the old tab to the new one.
          <motion.span
            layoutId="category-active"
            className="absolute inset-0 -z-10 rounded-pill bg-ink"
            transition={{ duration: 0.35, ease: EASE_OUT }}
          />
        )}
        {label}
      </Link>
    </li>
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
      aria-label={
        side === "left" ? "Scroll categories left" : "Scroll categories right"
      }
      className={`icon-btn absolute top-1/2 z-(--z-raised) hidden -translate-y-1/2 bg-paper-2 text-ink hover:bg-paper-3 md:inline-grid ${
        side === "left" ? "left-3" : "right-3"
      }`}
    >
      {side === "left" ? (
        <ChevronLeftIcon className="size-5" />
      ) : (
        <ChevronRightIcon className="size-5" />
      )}
    </button>
  );
}
