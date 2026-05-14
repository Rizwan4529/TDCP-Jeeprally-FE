import { describe, expect, it } from "vitest";
import { shouldShowRoutesEmpty } from "./map.utils.js";

describe("shouldShowRoutesEmpty", () => {
  it("returns true when an enabled routes query succeeds with no routes", () => {
    expect(
      shouldShowRoutesEmpty({
        eventId: "event-1",
        activeCategory: "stock_prepaid",
        routes: [],
        routesSuccess: true,
      })
    ).toBe(true);
  });

  it("returns false when routes are still unavailable or not loaded", () => {
    expect(
      shouldShowRoutesEmpty({
        eventId: "event-1",
        activeCategory: "stock_prepaid",
        routes: [{ _id: "route-1" }],
        routesSuccess: true,
      })
    ).toBe(false);

    expect(
      shouldShowRoutesEmpty({
        eventId: "event-1",
        activeCategory: "stock_prepaid",
        routes: [],
        routesSuccess: false,
      })
    ).toBe(false);
  });
});
