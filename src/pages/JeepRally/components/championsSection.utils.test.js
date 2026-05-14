import { describe, expect, it } from "vitest";
import { shouldShowChampionsEmpty } from "./championsSection.utils.js";

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
