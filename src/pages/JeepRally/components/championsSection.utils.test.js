import { describe, expect, it } from "vitest";
import {
  getCategoryTabsWithChampions,
  getTopChampionsByPosition,
  hasChampionNavigator,
  mapChampionsToPodium,
  resolveChampionCategory,
  resolveChampionCardImageSource,
  resolveChampionDriverProfileImageSource,
  resolveChampionNavigatorProfileImageSource,
  resolveChampionsCategoryKey,
  shouldHideChampionsSection,
  shouldShowChampionsEmpty,
} from "./championsSection.utils.js";

const API_CHAMPION_SAMPLE = {
  _id: "6a0339507bdb4b17c30579f2",
  event_id: {
    _id: "69f9948147844ddd2933128a",
    name: "Cholistan Desert Rally 2026",
  },
  team_id: {
    _id: "69fb05cbcfae8d80f4ad3544",
    team_name: "Rizwan team",
    team_number: "#22",
    category: "stock_prepaid",
    driver_id: "69faf874cfae8d80f4ad3542",
    navigator_id: null,
  },
  position: 1,
  category: null,
  image: null,
  driver: {
    _id: "69faf874cfae8d80f4ad3542",
    name: "Hassan Malik",
    age: 31,
    location: "Lahore",
    occupation: "Driver",
    profile_image: null,
  },
  navigator: null,
};

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
  it("uses top-level image for podium cards only", () => {
    expect(
      resolveChampionCardImageSource({
        image: "uploads/images/champion-1.png",
        driver: { profile_image: "uploads/images/driver.png" },
      }),
    ).toBe("uploads/images/champion-1.png");

    expect(
      resolveChampionCardImageSource({
        image: null,
        driver: { profile_image: "uploads/images/driver.png" },
      }),
    ).toBeNull();
  });

  it("uses profile_image for player profile pages only", () => {
    const withNavigator = {
      image: "uploads/card.png",
      driver: { profile_image: "uploads/driver-profile.png" },
      navigator: {
        _id: "nav-1",
        name: "Zubair Khan",
        profile_image: "uploads/navigator-profile.png",
      },
    };
    const withoutNavigator = {
      image: "uploads/card-only.png",
      driver: { profile_image: "uploads/driver-profile.png" },
      team_id: { navigator_id: null },
    };

    expect(hasChampionNavigator(withNavigator)).toBe(true);
    expect(resolveChampionDriverProfileImageSource(withNavigator)).toBe(
      "uploads/driver-profile.png",
    );
    expect(resolveChampionNavigatorProfileImageSource(withNavigator)).toBe(
      "uploads/navigator-profile.png",
    );
    expect(hasChampionNavigator(withoutNavigator)).toBe(false);
    expect(resolveChampionNavigatorProfileImageSource(withoutNavigator)).toBeNull();
    expect(resolveChampionDriverProfileImageSource(withoutNavigator)).toBe(
      "uploads/driver-profile.png",
    );
    expect(resolveChampionCardImageSource(withNavigator)).toBe("uploads/card.png");
  });
});

describe("resolveChampionCategory", () => {
  it("reads category from team when champion.category is null", () => {
    expect(resolveChampionCategory(API_CHAMPION_SAMPLE)).toBe("stock_prepaid");
  });
});

describe("mapChampionsToPodium", () => {
  it("maps podium layout using each champion position", () => {
    const podium = mapChampionsToPodium(
      [
        {
          _id: "c2",
          position: 2,
          driver: { name: "Second" },
          team_id: { team_name: "B", category: "jeep" },
        },
        {
          _id: "c1",
          position: 1,
          driver: { name: "First" },
          team_id: { team_name: "A", category: "jeep" },
        },
        {
          _id: "c3",
          position: 3,
          driver: { name: "Third" },
          team_id: { team_name: "C", category: "jeep" },
        },
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

  it("maps the populated champions api shape to podium cards", () => {
    const podium = mapChampionsToPodium([API_CHAMPION_SAMPLE], () => "/img.png");

    expect(podium).toHaveLength(1);
    expect(podium[0]).toMatchObject({
      id: API_CHAMPION_SAMPLE._id,
      name: "Hassan Malik",
      team: "Rizwan team",
      category: "stock_prepaid",
      rank: "1",
    });
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
        API_CHAMPION_SAMPLE,
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
