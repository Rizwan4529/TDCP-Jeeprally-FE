import { describe, expect, it } from "vitest";
import {
  resolveChampionsCategoryKey,
  shouldShowChampionsEmpty,
} from "./championsSection.utils.js";

describe("shouldShowChampionsEmpty", () => {
  it("returns true when the champions query succeeds with no champions", () => {
    expect(
      shouldShowChampionsEmpty({
        eventId: "event-1",
        activeCategoryKey: "stock_prepaid",
        champions: [],
        championsSuccess: true,
      })
    ).toBe(true);
  });

  it("returns false when champions are present or still loading", () => {
    expect(
      shouldShowChampionsEmpty({
        eventId: "event-1",
        activeCategoryKey: "stock_prepaid",
        champions: [{ _id: "champion-1" }],
        championsSuccess: true,
      })
    ).toBe(false);

    expect(
      shouldShowChampionsEmpty({
        eventId: "event-1",
        activeCategoryKey: "stock_prepaid",
        champions: [],
        championsSuccess: false,
      })
    ).toBe(false);
  });
});

describe("resolveChampionsCategoryKey", () => {
  const categories = [
    { key: "stock_prepaid", title: "Stock & Prepaid" },
    { key: "quad_bike", title: "Quad Bike" },
  ];

  it("prefers the forced category key when provided", () => {
    expect(
      resolveChampionsCategoryKey({
        categories,
        activeCategoryKey: "quad_bike",
        forcedCategoryKey: "stock_prepaid",
      })
    ).toBe("stock_prepaid");
  });

  it("keeps the active category when it exists in the categories list", () => {
    expect(
      resolveChampionsCategoryKey({
        categories,
        activeCategoryKey: "quad_bike",
      })
    ).toBe("quad_bike");
  });

  it("falls back to the first available category", () => {
    expect(
      resolveChampionsCategoryKey({
        categories,
        activeCategoryKey: "truck_race",
      })
    ).toBe("stock_prepaid");
  });
});
