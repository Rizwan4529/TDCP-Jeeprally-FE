import { describe, expect, it } from "vitest";
import {
  formatStageHeading,
  isRoutesNavLink,
  sortStagesByNumber,
  splitStagesIntoColumns,
} from "./rallyStages.utils.js";

describe("rallyStages utils", () => {
  it("detects routes nav links", () => {
    expect(isRoutesNavLink({ title: "Routes", path: "/routes" })).toBe(true);
    expect(isRoutesNavLink({ title: "Home", path: "/" })).toBe(false);
  });

  it("sorts stages by stage_number ascending", () => {
    expect(
      sortStagesByNumber([
        { stage_number: 3 },
        { stage_number: 1 },
        { stage_number: 2 },
      ]).map((stage) => stage.stage_number),
    ).toEqual([1, 2, 3]);
  });

  it("splits sorted stages into two columns", () => {
    const columns = splitStagesIntoColumns([
      { stage_number: 1 },
      { stage_number: 2 },
      { stage_number: 3 },
    ]);

    expect(columns.left).toHaveLength(2);
    expect(columns.right).toHaveLength(1);
    expect(columns.left[0].stage_number).toBe(1);
    expect(columns.right[0].stage_number).toBe(3);
  });

  it("formats stage headings", () => {
    expect(formatStageHeading({ stage_number: 0 })).toBe("PROLOGUE");
    expect(formatStageHeading({ stage_number: 4 })).toBe("STAGE 4");
  });
});
