import { describe, expect, it } from "vitest";
import {
  getCategoryTabsWithChampions,
  getTopChampionsByPosition,
  mapChampionsToPodium,
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

describe("getTopChampionsByPosition", () => {
  it("sorts by position ascending and returns only the first three", () => {
    const champions = [
      { _id: "c3", position: 3, driver_name: "Third" },
      { _id: "c1", position: 1, driver_name: "First" },
      { _id: "c4", position: 4, driver_name: "Fourth" },
      { _id: "c2", position: 2, driver_name: "Second" },
    ];

    expect(getTopChampionsByPosition(champions).map((c) => c.position)).toEqual([
      1, 2, 3,
    ]);
  });
});

describe("mapChampionsToPodium", () => {
  it("maps podium layout using each champion position", () => {
    const podium = mapChampionsToPodium(
      [
        { _id: "c2", position: 2, driver_name: "Second", team_id: { team_name: "B" } },
        { _id: "c1", position: 1, driver_name: "First", team_id: { team_name: "A" } },
        { _id: "c3", position: 3, driver_name: "Third", team_id: { team_name: "C" } },
      ],
      () => "/img.png",
    );

    expect(podium.map((entry) => entry.podiumOrder)).toEqual([1, 2, 3]);
    expect(podium.map((entry) => entry.order)).toEqual([
      "order-2",
      "order-1",
      "order-3",
    ]);
    expect(podium.map((entry) => entry.name)).toEqual([
      "First",
      "Second",
      "Third",
    ]);
  });
});

describe("getCategoryTabsWithChampions", () => {
  const tabs = [
    { key: "stock_prepaid", title: "Stock Prepaid" },
    { key: "jeep", title: "Jeep" },
    { key: "buggy", title: "Buggy" },
  ];

  it("returns only tabs that have at least one champion", () => {
    expect(
      getCategoryTabsWithChampions(tabs, [
        { category: "stock_prepaid" },
        { category: "jeep" },
      ]),
    ).toEqual([
      { key: "stock_prepaid", title: "Stock Prepaid" },
      { key: "jeep", title: "Jeep" },
    ]);
  });

  it("returns an empty list when no champions exist", () => {
    expect(getCategoryTabsWithChampions(tabs, [])).toEqual([]);
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
