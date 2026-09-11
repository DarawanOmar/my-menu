import { CART_STORAGE_KEY, type CartLine } from "./cart";
import type { MenuItem } from "./types";

/**
 * The cart lives outside React as a tiny external store, read through
 * `useSyncExternalStore`. Reasons:
 *   - the server snapshot is always empty, so prerendered HTML and the first
 *     client render match, and the saved cart appears right after hydration;
 *   - persistence happens inside the mutations, so there is no effect that
 *     could write an empty cart over a saved one;
 *   - a `storage` event keeps two tabs in step.
 */
export type CartState = {
  lines: CartLine[];
  /** The most recently removed line, while it can still be undone. */
  removed: CartLine | null;
};

const EMPTY: CartState = { lines: [], removed: null };
const UNDO_WINDOW_MS = 6000;

let state: CartState = EMPTY;
let loaded = false;
let undoTimer: number | undefined;
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

function persist() {
  try {
    window.localStorage.setItem(
      CART_STORAGE_KEY,
      JSON.stringify({ lines: state.lines }),
    );
  } catch {
    // Storage full or blocked — the in-memory cart still works.
  }
}

function readStorage(): CartLine[] | null {
  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { lines?: unknown };
    return Array.isArray(parsed.lines) ? (parsed.lines as CartLine[]) : null;
  } catch {
    return null;
  }
}

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  const lines = readStorage();
  if (lines) state = { ...state, lines };
}

function update(patch: Partial<CartState>) {
  state = { ...state, ...patch };
  emit();
  persist();
}

export const cartStore = {
  subscribe(listener: () => void) {
    listeners.add(listener);

    // Another tab changed the cart — pick it up.
    function onStorage(event: StorageEvent) {
      if (event.key !== CART_STORAGE_KEY) return;
      const lines = readStorage();
      state = { ...state, lines: lines ?? [] };
      emit();
    }
    window.addEventListener("storage", onStorage);

    return () => {
      listeners.delete(listener);
      window.removeEventListener("storage", onStorage);
    };
  },

  getSnapshot(): CartState {
    load();
    return state;
  },

  getServerSnapshot(): CartState {
    return EMPTY;
  },

  add(item: MenuItem, qty = 1) {
    const existing = state.lines.find((l) => l.item.id === item.id);
    const lines = existing
      ? state.lines.map((l) =>
          l.item.id === item.id ? { ...l, qty: l.qty + qty } : l,
        )
      : [...state.lines, { item, qty }];
    update({ lines });
  },

  setQty(id: string, qty: number) {
    if (qty <= 0) {
      cartStore.remove(id);
      return;
    }
    update({
      lines: state.lines.map((l) => (l.item.id === id ? { ...l, qty } : l)),
    });
  },

  remove(id: string) {
    const line = state.lines.find((l) => l.item.id === id) ?? null;
    if (!line) return;
    window.clearTimeout(undoTimer);
    undoTimer = window.setTimeout(() => update({ removed: null }), UNDO_WINDOW_MS);
    update({ lines: state.lines.filter((l) => l.item.id !== id), removed: line });
  },

  undoRemove() {
    const line = state.removed;
    if (!line) return;
    window.clearTimeout(undoTimer);
    const alreadyBack = state.lines.some((l) => l.item.id === line.item.id);
    update({
      lines: alreadyBack ? state.lines : [...state.lines, line],
      removed: null,
    });
  },

  clear() {
    window.clearTimeout(undoTimer);
    update({ lines: [], removed: null });
  },
};
