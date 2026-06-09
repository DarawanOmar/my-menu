import { getCategories } from "@/lib/api";
import { CategorySlider } from "./category-slider";

/**
 * Server component: pulls the cached category list (static, prerendered) and
 * hands it to the client slider, which highlights the active category from the
 * current pathname.
 */
export async function CategoryBar() {
  const categories = await getCategories();

  return (
    <nav
      aria-label="Menu categories"
      className="sticky top-0 z-20 border-b border-brand-100 bg-cream/85 py-3 backdrop-blur-md"
    >
      <div className="mx-auto w-full max-w-6xl">
        <CategorySlider categories={categories} />
      </div>
    </nav>
  );
}
