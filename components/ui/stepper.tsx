"use client";

import { MinusIcon, PlusIcon } from "@/components/icons";

/**
 * Quantity stepper — an ink-outlined pill with − / count / +.
 * At `min` the minus button is disabled unless `onRemove` is supplied, in
 * which case stepping below `min` hands off to the caller (drawer lines
 * remove themselves).
 */
export function Stepper({
  value,
  onChange,
  min = 1,
  max = 99,
  size = "md",
  label,
}: {
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
  size?: "sm" | "md";
  label: string;
}) {
  const h = size === "sm" ? "h-9" : "h-12";
  const btn = size === "sm" ? "size-9" : "size-12";
  const icon = size === "sm" ? "size-4" : "size-5";

  return (
    <div
      role="group"
      aria-label={label}
      className={`tabular inline-flex items-center rounded-pill bg-paper-2 text-ink ${h}`}
    >
      <button
        type="button"
        onClick={() => onChange(value - 1)}
        disabled={value <= min}
        aria-label="Decrease quantity"
        className={`icon-btn rounded-pill hover:bg-paper-3 ${btn}`}
      >
        <MinusIcon className={icon} />
      </button>
      <output
        aria-live="polite"
        className={`min-w-6 text-center font-semibold ${size === "sm" ? "text-sm" : "text-base"}`}
      >
        {value}
      </output>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
        aria-label="Increase quantity"
        className={`icon-btn rounded-pill hover:bg-paper-3 ${btn}`}
      >
        <PlusIcon className={icon} />
      </button>
    </div>
  );
}
