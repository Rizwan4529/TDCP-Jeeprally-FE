import { describe, expect, it } from "vitest";
import * as categoryUtils from "./constants.js";

const apiCategories = [
  {
    _id: "1",
    title: "Stock Prepaid",
    key: "stock_prepaid",
    image: "uploads/images/stock-prepaid.png",
    description: "Production-based vehicles for prepaid category",
  },
  {
    _id: "2",
    title: "Jeep",
    key: "jeep",
    image: "uploads/images/jeep.png",
    description: "Modified and prepared jeep category",
  },
  {
    _id: "3",
    title: "Buggy",
    key: "buggy",
    image: "uploads/images/buggy.png",
    description: "A newly added category from the API",
  },
];

describe("category utilities", () => {
  it("normalizes all API categories without hardcoded filtering", () => {
    expect(typeof categoryUtils.normalizeCategories).toBe("function");

    expect(categoryUtils.normalizeCategories(apiCategories)).toEqual([
      expect.objectContaining({ key: "stock_prepaid", title: "Stock Prepaid" }),
      expect.objectContaining({ key: "jeep", title: "Jeep" }),
      expect.objectContaining({ key: "buggy", title: "Buggy" }),
    ]);
  });

  it("returns the first available category key as the default selection", () => {
    expect(typeof categoryUtils.getDefaultCategoryKey).toBe("function");
    expect(categoryUtils.getDefaultCategoryKey(apiCategories)).toBe(
      "stock_prepaid"
    );
    expect(categoryUtils.getDefaultCategoryKey([])).toBe("");
  });

  it("builds a label map from the API response", () => {
    expect(typeof categoryUtils.getCategoryLabelMap).toBe("function");
    expect(categoryUtils.getCategoryLabelMap(apiCategories)).toEqual({
      stock_prepaid: "Stock Prepaid",
      jeep: "Jeep",
      buggy: "Buggy",
    });
  });

  it("builds filter tabs with API titles in front and keys for selection", () => {
    expect(typeof categoryUtils.getCategoryFilterTabs).toBe("function");
    expect(categoryUtils.getCategoryFilterTabs(apiCategories)).toEqual([
      { key: "stock_prepaid", title: "Stock Prepaid" },
      { key: "jeep", title: "Jeep" },
      { key: "buggy", title: "Buggy" },
    ]);
  });
});
