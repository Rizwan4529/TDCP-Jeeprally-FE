import { describe, expect, it } from "vitest";
import {
  buildRankingsChartRows,
  getRankingsChartPresentation,
  hasRankingsParticipationData,
} from "./rankingsChart.utils.js";

describe("rankingsChart utils", () => {
  it("maps by_year rows for Recharts", () => {
    expect(
      buildRankingsChartRows([
        { year: 2023, tdcp: 2, other: 0 },
        { year: 2024, tdcp: 1, other: 3 },
      ]),
    ).toEqual([
      { name: "2023", year: 2023, tdcp: 2, other: 0 },
      { name: "2024", year: 2024, tdcp: 1, other: 3 },
    ]);
  });

  it("detects empty participation when totals and counts are zero", () => {
    expect(
      hasRankingsParticipationData({
        totals: { tdcp: 0, other: 0, all: 0 },
        by_year: [{ year: 2024, tdcp: 0, other: 0 }],
      }),
    ).toBe(false);

    expect(
      hasRankingsParticipationData({
        totals: { tdcp: 2, other: 1, all: 3 },
        by_year: [{ year: 2024, tdcp: 2, other: 1 }],
      }),
    ).toBe(true);
  });

  it("uses api series labels when present", () => {
    expect(
      getRankingsChartPresentation({
        chart: { title: "RANKING" },
        series: [
          { key: "tdcp", label: "TDCP Jeep Rally" },
          { key: "other", label: "Other Organizations" },
        ],
      }),
    ).toEqual({
      title: "RANKING",
      tdcpLabel: "TDCP Jeep Rally",
      otherLabel: "Other Organizations",
    });
  });
});
