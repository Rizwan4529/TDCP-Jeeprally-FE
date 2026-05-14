import { describe, expect, it } from "vitest";
import {
  chunkSelectChallenges,
  getSelectChallengeColumns,
  shouldShowSelectChallengeCarouselControls,
} from "./selectChallenge.utils.js";

const makeChallenge = (id) => ({ _id: `challenge-${id}`, title: `Challenge ${id}` });

describe("selectChallenge utils", () => {
  it("chunks challenges into slides of three in api order", () => {
    const slides = chunkSelectChallenges([
      makeChallenge(1),
      makeChallenge(2),
      makeChallenge(3),
      makeChallenge(4),
    ]);

    expect(slides).toEqual([
      [makeChallenge(1), makeChallenge(2), makeChallenge(3)],
      [makeChallenge(4)],
    ]);
  });

  it("only shows carousel controls when more than three challenges exist", () => {
    expect(
      shouldShowSelectChallengeCarouselControls([
        makeChallenge(1),
        makeChallenge(2),
        makeChallenge(3),
      ])
    ).toBe(false);

    expect(
      shouldShowSelectChallengeCarouselControls([
        makeChallenge(1),
        makeChallenge(2),
        makeChallenge(3),
        makeChallenge(4),
      ])
    ).toBe(true);
  });

  it("returns small and large layout slots for one slide", () => {
    expect(
      getSelectChallengeColumns([
        makeChallenge(1),
        makeChallenge(2),
        makeChallenge(3),
      ])
    ).toEqual({
      smallCards: [makeChallenge(1), makeChallenge(2)],
      largeCard: makeChallenge(3),
    });
  });
});
