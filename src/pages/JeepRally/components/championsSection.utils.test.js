import { describe, expect, it } from "vitest";
import {
  getCategoryTabsWithChampions,
  getTopChampionsByPosition,
  hasChampionNavigator,
  mapChampionsToPodium,
  resolveChampionDriverImageSource,
  resolveChampionNavigatorImageSource,
  resolveChampionsCategoryKey,
  shouldHideChampionsSection,
  shouldShowChampionsEmpty,
} from "./championsSection.utils.js";

describe("shouldHideChampionsSection", () => {
  it("hides while loading or when the event is missing", () => {
    expect(shouldHideChampionsSection({ isLoading: true, hasEvent: true })).toBe(
      true,
    );
    expect(shouldHideChampionsSection({ hasEvent: false })).toBe(true);
  });

  it("hides when all-champions gate has no champions or tabs", () => {
    expect(
      shouldHideChampionsSection({
        hasEvent: true,
        usesAllChampionsGate: true,
        allChampionsReady: true,
        allChampionsCount: 0,
        visibleTabCount: 0,
      }),
    ).toBe(true);

    expect(
      shouldHideChampionsSection({
        hasEvent: true,
        usesAllChampionsGate: true,
        allChampionsReady: true,
        allChampionsCount: 2,
        visibleTabCount: 1,
      }),
    ).toBe(false);
  });

  it("hides per-category mode when the active category has no champions", () => {
    expect(
      shouldHideChampionsSection({
        hasEvent: true,
        usesCategoryQuery: true,
        categoryChampionsReady: true,
        categoryChampionsCount: 0,
      }),
    ).toBe(true);

    expect(
      shouldHideChampionsSection({
        hasEvent: true,
        usesCategoryQuery: true,
        categoryChampionsReady: true,
        categoryChampionsCount: 2,
      }),
    ).toBe(false);
  });
});

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

describe("champion image helpers", () => {
  it("detects navigator presence and resolves image sources", () => {
    const withNavigator = {
      driver_image: "uploads/driver.png",
      navigator_image: null,
      team_id: {
        navigator_id: {
          _id: "nav-1",
          name: "Zubair Khan",
          profile_image: "uploads/navigator.png",
        },
      },
    };
    const withoutNavigator = {
      driver_image: "uploads/driver-only.png",
      team_id: { navigator_id: null },
    };

    expect(hasChampionNavigator(withNavigator)).toBe(true);
    expect(resolveChampionNavigatorImageSource(withNavigator)).toBe(
      "uploads/navigator.png",
    );
    expect(hasChampionNavigator(withoutNavigator)).toBe(false);
    expect(resolveChampionNavigatorImageSource(withoutNavigator)).toBeNull();
    expect(resolveChampionDriverImageSource(withoutNavigator)).toBe(
      "uploads/driver-only.png",
    );
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

    const [first, second, third] = podium;
    expect(first.cardHeight).not.toBe(second.cardHeight);
    expect(second.cardHeight).toBe(third.cardHeight);
    expect(second.footerHeight).toBe(third.footerHeight);
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
