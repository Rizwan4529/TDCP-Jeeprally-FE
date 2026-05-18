import { describe, expect, it } from "vitest";
import {
  getAdventureVideoColumns,
  getAdventureWindowDirection,
  getAdventureWindowVideos,
  normalizeAdventureWindowOffset,
  shouldShowAdventureCarouselControls,
  shouldShowAdventureSection,
} from "./adventureSection.utils.js";

const makeVideo = (id) => ({ _id: `video-${id}`, order: id });

describe("adventureSection utils", () => {
  const eightVideos = Array.from({ length: 8 }, (_, index) =>
    makeVideo(index + 1),
  );

  it("builds a five-video sliding window from a start index", () => {
    expect(getAdventureWindowVideos(eightVideos, 0).map((video) => video.order)).toEqual(
      [1, 2, 3, 4, 5],
    );
    expect(getAdventureWindowVideos(eightVideos, 1).map((video) => video.order)).toEqual(
      [2, 3, 4, 5, 6],
    );
    expect(getAdventureWindowVideos(eightVideos, 3).map((video) => video.order)).toEqual(
      [4, 5, 6, 7, 8],
    );
    expect(getAdventureWindowVideos(eightVideos, 4).map((video) => video.order)).toEqual(
      [5, 6, 7, 8, 1],
    );
    expect(getAdventureWindowVideos(eightVideos, 7).map((video) => video.order)).toEqual(
      [8, 1, 2, 3, 4],
    );
  });

  it("wraps window offsets for circular navigation", () => {
    expect(normalizeAdventureWindowOffset(8, 8)).toBe(0);
    expect(normalizeAdventureWindowOffset(-1, 8)).toBe(7);
  });

  it("picks the shortest direction around the loop", () => {
    expect(getAdventureWindowDirection(0, 1, 8)).toBe(1);
    expect(getAdventureWindowDirection(1, 0, 8)).toBe(-1);
    expect(getAdventureWindowDirection(7, 0, 8)).toBe(1);
    expect(getAdventureWindowDirection(0, 7, 8)).toBe(-1);
  });

  it("only shows the section when at least five videos exist", () => {
    expect(
      shouldShowAdventureSection([
        makeVideo(1),
        makeVideo(2),
        makeVideo(3),
        makeVideo(4),
      ]),
    ).toBe(false);

    expect(
      shouldShowAdventureSection([
        makeVideo(1),
        makeVideo(2),
        makeVideo(3),
        makeVideo(4),
        makeVideo(5),
      ]),
    ).toBe(true);
  });

  it("only shows carousel controls when more than five videos exist", () => {
    expect(
      shouldShowAdventureCarouselControls([
        makeVideo(1),
        makeVideo(2),
        makeVideo(3),
        makeVideo(4),
        makeVideo(5),
      ]),
    ).toBe(false);

    expect(
      shouldShowAdventureCarouselControls([
        makeVideo(1),
        makeVideo(2),
        makeVideo(3),
        makeVideo(4),
        makeVideo(5),
        makeVideo(6),
      ]),
    ).toBe(true);
  });

  it("returns only real cards for a partial window", () => {
    expect(getAdventureWindowVideos([makeVideo(6)])).toEqual([makeVideo(6)]);
    expect(getAdventureVideoColumns([makeVideo(6)])).toEqual({
      main: makeVideo(6),
      firstStack: [],
      secondStack: [],
    });
  });
});
