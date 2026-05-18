import { describe, expect, it } from "vitest";
import {
  getRulesCardSlotStyle,
  normalizeRallyDocuments,
  shouldShowRulesDotPagination,
} from "./rallyRules.utils.js";

describe("rallyRules utils", () => {
  it("normalizes document file and background image fields", () => {
    expect(
      normalizeRallyDocuments([
        {
          _id: "1",
          fileUrl: "uploads/doc.pdf",
          bgImage: "uploads/images/hero.jpg",
          is_public: true,
        },
      ]),
    ).toEqual([
      expect.objectContaining({
        _id: "1",
        file_url: "uploads/doc.pdf",
        bg_image: "uploads/images/hero.jpg",
      }),
    ]);
  });

  it("shows dot pagination only when there are more than two documents", () => {
    expect(shouldShowRulesDotPagination(2)).toBe(false);
    expect(shouldShowRulesDotPagination(3)).toBe(true);
  });

  it("uses bg-primary for the first slot and bg-secondary for the second", () => {
    expect(getRulesCardSlotStyle(0).bgClass).toBe("bg-primary");
    expect(getRulesCardSlotStyle(1).bgClass).toBe("bg-secondary");
  });
});
