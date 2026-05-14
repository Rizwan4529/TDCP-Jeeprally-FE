import { describe, expect, it } from "vitest";
import {
  chunkAdventureVideos,
  getAdventureVideoColumns,
  shouldShowAdventureCarouselControls,
} from "./adventureSection.utils.js";

const makeVideo = (id) => ({ _id: `video-${id}`, order: id });

describe("adventureSection utils", () => {
  it("chunks videos into slides of five without padding empty cards", () => {
    const slides = chunkAdventureVideos([
      makeVideo(1),
      makeVideo(2),
      makeVideo(3),
      makeVideo(4),
      makeVideo(5),
      makeVideo(6),
    ]);

    expect(slides).toHaveLength(2);
    expect(slides[0]).toHaveLength(5);
    expect(slides[1]).toEqual([makeVideo(6)]);
  });

  it("only shows carousel controls when more than five videos exist", () => {
    expect(
      shouldShowAdventureCarouselControls([
        makeVideo(1),
        makeVideo(2),
        makeVideo(3),
        makeVideo(4),
        makeVideo(5),
      ])
    ).toBe(false);

    expect(
      shouldShowAdventureCarouselControls([
        makeVideo(1),
        makeVideo(2),
        makeVideo(3),
        makeVideo(4),
        makeVideo(5),
        makeVideo(6),
      ])
    ).toBe(true);
  });

  it("returns only real cards for a partial slide", () => {
    expect(
      getAdventureVideoColumns([makeVideo(6)])
    ).toEqual({
      main: makeVideo(6),
      firstStack: [],
      secondStack: [],
    });
  });
});
