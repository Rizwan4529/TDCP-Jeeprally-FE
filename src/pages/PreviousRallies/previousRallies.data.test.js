import { describe, expect, it } from "vitest";
import {
  DEFAULT_PREVIOUS_RALLY_ID,
  PREVIOUS_RALLIES_LIST,
  getPreviousRallyDetail,
} from "./previousRallies.data.js";

describe("previousRallies data", () => {
  it("returns the configured default rally detail", () => {
    const detail = getPreviousRallyDetail(DEFAULT_PREVIOUS_RALLY_ID);

    expect(detail?.id).toBe(DEFAULT_PREVIOUS_RALLY_ID);
    expect(detail?.heroContent?.title).toContain("Where Speed Meets");
    expect(detail?.mainContent?.title).toBe("Cholistan Desert Rally");
    expect(detail?.summaryCardContent?.items).toHaveLength(4);
    expect(detail?.championsCategoryKey).toBe("stock_prepaid");
  });

  it("keeps a rally-specific champions category key", () => {
    const detail = getPreviousRallyDetail("previous-rally-1");

    expect(detail?.categoryKey).toBe("dirt_bike");
    expect(detail?.championsCategoryKey).toBe("dirt_bike");
  });

  it("exposes listing cards with a detail route target", () => {
    expect(PREVIOUS_RALLIES_LIST).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: "previous-rally-2",
          variant: "featured",
          detailPath: "/previous/previous-rally-2",
        }),
      ])
    );
  });

  it("returns null for unknown rally ids", () => {
    expect(getPreviousRallyDetail("missing-rally")).toBeNull();
  });
});
