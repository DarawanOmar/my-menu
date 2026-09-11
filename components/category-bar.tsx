import { getCategories } from "@/lib/api";
import { CategorySlider } from "./category-slider";

/**
 * Server component: pulls the cached category list (static, prerendered) and
 * hands it to the client slider, which highlights the active category from the
 * current pathname and slides the indicator between tabs.
 */
export async function CategoryBar() {
  const categories = await getCategories();
  return <CategorySlider categories={categories} />;
}
