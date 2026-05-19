import { describe, expect, it } from "vitest";
import {
  applyCheckpointMapPosition,
  buildCheckpointLightboxItems,
  buildMapCheckpointStyle,
  CHECKPOINT_DESCRIPTION_PREVIEW_LIMIT,
  computeCheckpointLayout,
  findCheckpointLightboxIndex,
  getCheckpointDescriptionPoints,
  shouldShowRoutesEmpty,
} from "./routes.utils.js";

describe("getCheckpointDescriptionPoints", () => {
  it("returns only non-empty string points", () => {
    expect(
      getCheckpointDescriptionPoints({
        description_points: ["A", "", "  ", "B"],
      }),
    ).toEqual(["A", "B"]);
  });

  it("exposes a preview limit of 2", () => {
    expect(CHECKPOINT_DESCRIPTION_PREVIEW_LIMIT).toBe(2);
  });
});

describe("checkpoint lightbox utils", () => {
  it("builds lightbox items only for checkpoints with resolvable images", () => {
    const items = buildCheckpointLightboxItems([
      { _id: "cp-1", title: "Start", image: "uploads/images/a.png" },
      { _id: "cp-2", title: "No image", image: null },
    ]);

    expect(items).toHaveLength(1);
    expect(items[0].checkpointId).toBe("cp-1");
    expect(items[0].src).toContain("uploads/images/a.png");
  });

  it("finds the lightbox index for a checkpoint id", () => {
    const items = buildCheckpointLightboxItems([
      { _id: "cp-1", title: "A", image: "uploads/images/a.png" },
      { _id: "cp-2", title: "B", image: "uploads/images/b.png" },
    ]);

    expect(findCheckpointLightboxIndex(items, "cp-2")).toBe(1);
    expect(findCheckpointLightboxIndex(items, "missing")).toBe(-1);
  });
});

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

describe("buildMapCheckpointStyle", () => {
  it("anchors left column with leftPct from the canvas left edge", () => {
    expect(
      buildMapCheckpointStyle({ topPct: 20, leftPct: 48, side: "left" }),
    ).toEqual({
      top: "20%",
      left: "48%",
      right: "auto",
      transform: "translateY(-50%)",
    });
  });

  it("anchors right column with rightPct from the canvas right edge", () => {
    expect(
      buildMapCheckpointStyle({
        topPct: 30,
        rightPct: 6,
        side: "right",
      }),
    ).toEqual({
      top: "30%",
      right: "6%",
      left: "auto",
      transform: "translateY(-50%)",
    });
  });

  it("only sets top when no anchor is provided", () => {
    expect(buildMapCheckpointStyle({ topPct: 40, side: "right" })).toEqual({
      top: "40%",
    });
  });
});

describe("computeCheckpointLayout", () => {
  const makeCheckpoints = (count) =>
    Array.from({ length: count }, (_, index) => ({
      _id: `cp-${index + 1}`,
      title: `Checkpoint ${index + 1}`,
      order: index + 1,
    }));

  it("returns an empty layout when there are no checkpoints", () => {
    const result = computeCheckpointLayout([]);
    expect(result.mode).toBe("empty");
    expect(result.inMap).toEqual([]);
    expect(result.overflow).toEqual([]);
  });

  it("centers a single checkpoint at 50% on the right side", () => {
    const [cp] = makeCheckpoints(1);
    const result = computeCheckpointLayout([cp]);

    expect(result.mode).toBe("zigzag");
    expect(result.inMap).toHaveLength(1);
    expect(result.inMap[0].topPct).toBe(50);
    expect(result.inMap[0].side).toBe("right");
    expect(result.overflow).toEqual([]);
  });

  it("lays four checkpoints out in zigzag alternating sides", () => {
    const checkpoints = makeCheckpoints(4);
    const result = computeCheckpointLayout(checkpoints);

    expect(result.mode).toBe("zigzag");
    expect(result.inMap).toHaveLength(4);
    expect(result.overflow).toEqual([]);
    expect(result.inMap.map((entry) => entry.side)).toEqual([
      "left",
      "right",
      "left",
      "right",
    ]);
    expect(result.inMap[0].topPct).toBeCloseTo(12);
    expect(result.inMap[3].topPct).toBeCloseTo(88);
  });

  it("switches to paired rows when there are 5 checkpoints", () => {
    const checkpoints = makeCheckpoints(5);
    const result = computeCheckpointLayout(checkpoints);

    expect(result.mode).toBe("paired");
    expect(result.inMap).toHaveLength(5);
    expect(result.overflow).toEqual([]);
    expect(result.inMap[0].side).toBe("left");
    expect(result.inMap[1].side).toBe("right");
    expect(result.inMap[0].topPct).toBe(result.inMap[1].topPct);
    expect(result.inMap[4].side).toBe("left");

    const uniqueTops = Array.from(
      new Set(result.inMap.map((entry) => entry.topPct))
    );
    expect(uniqueTops).toHaveLength(3);
  });

  it("fills three pair rows when there are 6 checkpoints", () => {
    const checkpoints = makeCheckpoints(6);
    const result = computeCheckpointLayout(checkpoints);

    expect(result.mode).toBe("paired");
    expect(result.inMap).toHaveLength(6);
    expect(result.overflow).toEqual([]);

    const uniqueTops = Array.from(
      new Set(result.inMap.map((entry) => entry.topPct))
    );
    expect(uniqueTops).toHaveLength(3);

    for (let row = 0; row < 3; row += 1) {
      expect(result.inMap[row * 2].side).toBe("left");
      expect(result.inMap[row * 2 + 1].side).toBe("right");
      expect(result.inMap[row * 2].topPct).toBe(
        result.inMap[row * 2 + 1].topPct
      );
    }
  });

  it("overflows when there are more than 6 checkpoints", () => {
    const checkpoints = makeCheckpoints(7);
    const result = computeCheckpointLayout(checkpoints);

    expect(result.inMap).toHaveLength(6);
    expect(result.overflow).toHaveLength(1);
    expect(result.overflow[0]._id).toBe("cp-7");
  });

  it("caps the map at 6 checkpoints and overflows the rest", () => {
    const checkpoints = makeCheckpoints(12);
    const result = computeCheckpointLayout(checkpoints);

    expect(result.mode).toBe("paired");
    expect(result.inMap).toHaveLength(6);
    expect(result.overflow).toHaveLength(6);
    expect(result.overflow.map((cp) => cp._id)).toEqual([
      "cp-7",
      "cp-8",
      "cp-9",
      "cp-10",
      "cp-11",
      "cp-12",
    ]);
  });
});
