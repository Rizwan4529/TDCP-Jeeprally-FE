import { describe, expect, it } from "vitest";
import {
  canNavigateSlidingWindow,
  getWindowDirection,
  getWindowItems,
  normalizeWindowOffset,
} from "./slidingWindowCarousel.utils.js";

const makeItem = (id) => ({ _id: `item-${id}`, order: id });

describe("slidingWindowCarousel utils", () => {
  const eightItems = Array.from({ length: 8 }, (_, index) =>
    makeItem(index + 1),
  );

  it("builds a sliding window from a start index", () => {
    expect(getWindowItems(eightItems, 0).map((item) => item.order)).toEqual([
      1, 2, 3, 4, 5,
    ]);
    expect(getWindowItems(eightItems, 1).map((item) => item.order)).toEqual([
      2, 3, 4, 5, 6,
    ]);
    expect(getWindowItems(eightItems, 4).map((item) => item.order)).toEqual([
      5, 6, 7, 8, 1,
    ]);
  });

  it("wraps offsets and picks shortest direction around the loop", () => {
    expect(normalizeWindowOffset(8, 8)).toBe(0);
    expect(normalizeWindowOffset(-1, 8)).toBe(7);
    expect(getWindowDirection(0, 1, 8)).toBe(1);
    expect(getWindowDirection(7, 0, 8)).toBe(1);
    expect(getWindowDirection(0, 7, 8)).toBe(-1);
  });

  it("only allows navigation when items exceed window size", () => {
    expect(canNavigateSlidingWindow(Array.from({ length: 5 }, (_, i) => makeItem(i)))).toBe(
      false,
    );
    expect(canNavigateSlidingWindow(eightItems)).toBe(true);
  });
});
