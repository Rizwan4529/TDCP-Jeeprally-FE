import { useMemo } from "react";
import { normalizeCategories } from "../../utils/constants.js";

function getButtonClassName(isActive) {
  const base =
    "cursor-pointer rounded-[20px] border-0 px-6 py-2 text-sm capitalize whitespace-nowrap transition-colors duration-300";

  return isActive
    ? `${base} bg-primary text-white`
    : `${base} bg-transparent text-[#777] hover:text-[#555]`;
}

/**
 * Pill-style category filter (same UI as the Routes page).
 * Always centered horizontally with width fitting the tab labels.
 *
 * @param {{ key: string, title: string }[]} [tabs]
 * @param {object[]} [categories] - raw or normalized categories from API
 * @param {Record<string, string>} [categoryLabels] - optional label overrides by key
 */
const CategoryFilter = ({
  tabs,
  categories,
  categoryLabels,
  activeKey,
  onChange,
  className = "",
  ariaLabel = "Filter by category",
}) => {
  const items = useMemo(() => {
    if (Array.isArray(tabs) && tabs.length > 0) {
      return tabs;
    }

    return normalizeCategories(categories).map((category) => ({
      key: category.key,
      title: categoryLabels?.[category.key] ?? category.title,
    }));
  }, [tabs, categories, categoryLabels]);

  if (items.length === 0) {
    return null;
  }

  const outerClassName = ["flex w-full justify-center", className]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={outerClassName}>
      <div
        role="tablist"
        aria-label={ariaLabel}
        className="inline-flex w-fit max-w-full overflow-x-auto rounded-[30px] bg-[#eee] p-[5px] no-scrollbar"
      >
        {items.map((tab) => {
          const isActive = activeKey === tab.key;

          return (
            <button
              key={tab.key}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={getButtonClassName(isActive)}
              onClick={() => onChange(tab.key)}
            >
              {tab.title}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryFilter;
