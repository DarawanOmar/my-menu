# Birga Restaurant — Menu

A statically generated restaurant menu built with **Next.js 16** and **React 19**.
It fetches categories and dishes from a mock REST API, prerenders one page per
category at build time, and keeps the data fresh with Next.js **Cache Components**
(`use cache` + `cacheLife` + `cacheTag`).

- Live data source: `https://6a27c9544e1e783349a46174.mockapi.io/api/menu`
- One route per category, plus an `/` "All" route — every route is a static HTML page
- Background revalidation: cached payloads serve instantly and refresh once a day, no redeploy needed

---

## Versions

This project relies on features that are specific to these versions — **do not downgrade**:

| Package | Version | Why it matters |
| --- | --- | --- |
| `next` | **16.2.7** | Cache Components (`use cache`, `cacheLife`, `cacheTag`) and `cacheComponents` config |
| `react` / `react-dom` | **19.2.4** | Required by Next 16; enables the React Compiler |
| `babel-plugin-react-compiler` | **1.0.0** | Powers `reactCompiler: true` (auto-memoization) |
| `tailwindcss` | **4.x** | CSS-first Tailwind v4 (`@tailwindcss/postcss`) |
| `typescript` | **5.x** | — |

> ⚠️ This is **not** a stock Next.js setup. The caching APIs used here
> (`"use cache"`, `cacheLife`, `cacheTag`) only exist when `cacheComponents: true`
> is set in `next.config.ts`. The canonical reference for every API used below
> lives in `node_modules/next/dist/docs/` — read it before changing cache behavior.

---

## Getting Started

```bash
# install (pnpm is the lockfile in this repo)
pnpm install

# development (hot reload)
pnpm dev

# production build — this is where static pages are generated
pnpm build
pnpm start
```

Open [http://localhost:3000](http://localhost:3000).

---

## How the app works

```
app/
  layout.tsx              ← fonts, metadata, persistent shell (header · hero · tabs · footer · overlays)
  globals.css             ← base rules + component classes (imports ../tokens.css)
  [[...category]]/
    page.tsx              ← optional catch-all route + generateStaticParams → renders the grid only
tokens.css                ← design tokens (colours, type, radii, easings) — Tailwind @theme + :root
components/
  app-shell.tsx           ← "use client" — goes `inert` + locks scroll while an overlay is open
  site-header.tsx         ← wordmark + cart button
  banner.tsx              ← hero: headline with live dish/category counts + plate cluster
  category-bar.tsx        ← server component, reads cached categories
  category-slider.tsx     ← "use client" — sticky tabs; ink pill slides to the active category
  product-grid.tsx        ← server component, fetches dishes for the route
  product-card.tsx        ← "use client" — round plate · name · price · quick-add
  product-sheet.tsx       ← "use client" — dish detail: bottom sheet (phone) / side panel (desktop)
  product-grid-skeleton.tsx ← Suspense fallback
  site-footer.tsx         ← closing statement + meta
  cart/
    cart-provider.tsx     ← cart + overlay state contexts (useCart / useMenuUI)
    cart-button.tsx       ← header button with count badge
    cart-drawer.tsx       ← right-hand drawer: lines, steppers, remove + undo, subtotal
    cart-bar.tsx          ← floating "N items · $total — View cart" bar
  ui/                     ← stepper, dialog a11y hook, media-query hook
  icons.tsx               ← one stroke-voice icon set
lib/
  api.ts                  ← all data fetching + caching lives here
  cart.ts                 ← cart types + price helpers
  cart-store.ts           ← external store (useSyncExternalStore) persisted to localStorage
  dish-images.ts          ← placeholder plate photography mapped by item id
  motion.ts               ← shared easings/durations for motion/react
  types.ts                ← Category / MenuItem types
```

### Cart

The cart is client-only state persisted to `localStorage` (`birga.cart.v1`) and
synced across tabs. There is **no checkout backend** — the Checkout button says
so inline. Animations use [`motion`](https://motion.dev) (`motion/react`) and
honour `prefers-reduced-motion`.

The mock API's `avatar` field holds person portraits, so `lib/dish-images.ts`
maps each item to a placeholder plate photo. Swap it for `item.avatar` once the
API serves real dish photography.

### Routing — one optional catch-all

The single route `app/[[...category]]/page.tsx` handles **every** page:

- `/` → all dishes (the `category` param is `undefined`)
- `/<categoryId>` → only that category's dishes

`generateStaticParams()` runs at build time, fetches every category id, and emits
one static page per category **plus** the index route:

```ts
return [
  { category: [] },                                  // "/"  → All
  ...categories.map((c) => ({ category: [c.id] })),  // "/<id>"
];
```

> Because Cache Components is enabled, `generateStaticParams` **must** return at
> least one entry. The index route (`{ category: [] }`) guarantees that.

### Data flow

1. `page.tsx` (server) reads the route param and renders `<ProductGrid categoryId={...}>`
   inside `<Suspense>` with a skeleton fallback.
2. `ProductGrid` (server) calls the cached fetchers in `lib/api.ts`.
3. `CategoryBar` (server) passes the cached category list to `CategorySlider`
   (client), which highlights the active pill using `usePathname()`.

---

## Caching strategy (the important part)

All caching is centralized in **`lib/api.ts`**. Each fetcher opts into the cache
with the `"use cache"` directive and configures it with `cacheLife` and `cacheTag`.

```ts
export async function getCategories(): Promise<Category[]> {
  "use cache";
  cacheLife("days");      // revalidate ~once a day
  cacheTag("categories"); // tag for targeted invalidation

  const res = await fetch(`${API_BASE}/category`);
  if (!res.ok) throw new Error(`Failed to load categories (${res.status})`);
  return res.json();
}
```

### 1. `"use cache"` — what gets cached

The directive marks a function's output as cacheable. The **cache key** is derived
from the function and **its arguments**, so:

- `getCategories()` and `getAllItems()` → one cache entry each
- `getItemsByCategory(categoryId)` → **one entry per `categoryId`**
  (e.g. `category-1`, `category-2` … each cached and revalidated independently)

### 2. `cacheLife("days")` — how long the cache lives

This project uses the built-in **`days`** preset everywhere. The preset has three
timing windows:

| Window | `days` value | Meaning |
| --- | --- | --- |
| `stale` | **5 minutes** | Client router serves cached content instantly without re-checking the server |
| `revalidate` | **1 day** | After this, the next request serves stale content **and** triggers a background refresh |
| `expire` | **1 week** | If a page goes a full week with no traffic, the next request **waits** for fresh data |

In plain terms: visitors always get an instant page; the data silently refreshes
about once a day; new categories/dishes appear **without a redeploy**.

> Want a different cadence? Swap the preset: `"seconds"`, `"minutes"`, `"hours"`,
> `"days"`, `"weeks"`, `"max"` — or pass a custom object, e.g.
> `cacheLife({ stale: 60, revalidate: 3600, expire: 86400 })`.

### 3. `cacheTag(...)` — targeted invalidation

Tags let you purge specific entries on demand instead of waiting for the daily
revalidate. Tags used here:

| Fetcher | Tags |
| --- | --- |
| `getCategories` | `categories` |
| `getAllItems` | `items` |
| `getItemsByCategory(id)` | `items`, `category-${id}` |

To invalidate after the menu changes (e.g. in a Server Action or Route Handler):

```ts
import { revalidateTag } from "next/cache";

revalidateTag("items");       // refresh every dish list
revalidateTag("category-1");  // refresh just category 1
```

### Resilience

`getItemsByCategory` treats a `404` from the mock API as an **empty category**
(returns `[]`) rather than throwing — so a category with no items collection still
prerenders cleanly (with an empty state) instead of failing the whole build.

---

## Configuration

`next.config.ts` enables the features this app depends on:

```ts
const nextConfig: NextConfig = {
  cacheComponents: true,  // unlocks "use cache" / cacheLife / cacheTag
  reactCompiler: true,    // automatic memoization via babel-plugin-react-compiler
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "cdn.jsdelivr.net" },
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
    ],
  },
};
```

Remote image hosts must be allow-listed here — add a new `remotePatterns` entry
before using `<Image>` with any other domain.

---

## Notes for contributors

- **Read the bundled docs first.** This is a non-standard Next.js build; APIs may
  differ from older Next.js you know. The relevant guides are in
  `node_modules/next/dist/docs/` (start with the `use-cache`, `cacheLife`, and
  `cacheTag` references and `migrating-to-cache-components.md`).
- The mock API misspells the description field as `discription`. `lib/api.ts`
  normalizes it to `description` via `normalizeItem` — keep the raw type
  (`MenuItemRaw`) spelled as the API sends it.
- All data access goes through `lib/api.ts`. Add new fetchers there so the cache
  directives stay in one place and easy to reason about.
