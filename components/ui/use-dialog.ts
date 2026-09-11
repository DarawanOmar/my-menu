"use client";

import { useEffect, useRef, type RefObject } from "react";

/**
 * The two things every overlay owes the keyboard: Escape closes it, and focus
 * moves in on open and back to the opener on close. Scroll lock and `inert`
 * on the page behind are handled by <AppShell>.
 */
export function useDialog(
  ref: RefObject<HTMLElement | null>,
  onClose: () => void,
) {
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    ref.current?.focus({ preventScroll: true });

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onCloseRef.current();
      }
    }
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      opener?.focus?.({ preventScroll: true });
    };
  }, [ref]);
}
