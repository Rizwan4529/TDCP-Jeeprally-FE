import { describe, expect, it } from "vitest";
import {
  formatStageHeading,
  formatStageDate,
  formatStageDateReadable,
  formatStageLocationRoute,
  getStageRoutePath,
  isRoutesNavActive,
  isRoutesNavLink,
  sortStagesByNumber,
  splitStagesIntoColumns,
} from "./rallyStages.utils.js";

describe("rallyStages utils", () => {
  it("detects routes nav links", () => {
    expect(isRoutesNavLink({ title: "Routes", path: "/routes" })).toBe(true);
    expect(isRoutesNavLink({ title: "Home", path: "/" })).toBe(false);
  });

  it("builds stage route paths and detects active routes nav", () => {
    expect(getStageRoutePath("stage-1")).toBe("/routes/stage/stage-1");
    expect(isRoutesNavActive("/routes")).toBe(true);
    expect(isRoutesNavActive("/routes/stage/stage-1")).toBe(true);
    expect(isRoutesNavActive("/ranking")).toBe(false);
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

  it("formats stage location route for empty state heading", () => {
    expect(
      formatStageLocationRoute({
        starting_location: "Fort Abbas Gate",
        ending_location: "Cholistan Base Camp",
      }),
    ).toBe("FORT ABBAS GATE > CHOLISTAN BASE CAMP");
  });

  it("formats stage date from date field", () => {
    expect(formatStageDate({ date: "2026-06-12T00:00:00.000Z" })).toBe(
      "JUN 12, 2026",
    );
    expect(formatStageDateReadable({ date: "2026-06-12T00:00:00.000Z" })).toBe(
      "June 12, 2026",
    );
    expect(formatStageDate({})).toBe("—");
    expect(formatStageDate({ date: "invalid" })).toBe("—");
  });
});
