/**
 * Motion vocabulary shared by every animated component. These mirror the CSS
 * tokens in tokens.css (--ease-out / --ease-in / --dur-*) so JS-driven motion
 * and CSS transitions feel like one system.
 */
export const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];
export const EASE_IN: [number, number, number, number] = [0.7, 0, 0.84, 0];

export const DUR = {
  micro: 0.12,
  short: 0.22,
  long: 0.42,
} as const;

/** Enter with --ease-out; exits run ~75 % of the enter with --ease-in. */
export const ENTER = { duration: DUR.long, ease: EASE_OUT } as const;
export const EXIT = { duration: DUR.long * 0.75, ease: EASE_IN } as const;
