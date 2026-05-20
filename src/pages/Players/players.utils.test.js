import { describe, expect, it } from "vitest";
import {
  formatCompetitorNumber,
  getCompetitorProfilePath,
  getPlayerSkeletonCards,
  mapCompetitorsToPlayers,
} from "./players.utils.js";

describe("players utils", () => {
  it("prefixes the team number with #", () => {
    expect(formatCompetitorNumber("T-001")).toBe("#T-001");
    expect(formatCompetitorNumber("#T-001")).toBe("#T-001");
  });

  it("maps competitor records to player cards", () => {
    const players = mapCompetitorsToPlayers(
      [
        {
          _id: "registration-1",
          team_id: {
            team_number: "T-001",
            driver_id: {
              name: "Muhammad Rizwan",
              profile_image: "uploads/images/profile.png",
            },
          },
        },
      ],
      (image, fallback) => (image ? `resolved:${image}` : fallback)
    );

    expect(players).toEqual([
      {
        id: "registration-1",
        number: "#T-001",
        name: "Muhammad Rizwan",
        image: "resolved:uploads/images/profile.png",
        imageFallback: "/assets/images/pl1.png",
      },
    ]);
  });

  it("prefers a driver_image field when the API provides one", () => {
    const players = mapCompetitorsToPlayers(
      [
        {
          _id: "registration-2",
          driver_image: "uploads/images/driver-image.png",
          team_id: {
            team_number: "T-002",
            driver_id: {
              name: "Ali Khan",
              profile_image: "uploads/images/profile-fallback.png",
            },
          },
        },
      ],
      (image, fallback) => (image ? `resolved:${image}` : fallback)
    );

    expect(players[0]).toEqual({
      id: "registration-2",
      number: "#T-002",
      name: "Ali Khan",
      image: "resolved:uploads/images/driver-image.png",
      imageFallback: "/assets/images/pl1.png",
    });
  });

  it("builds the player profile path with competitor source", () => {
    expect(
      getCompetitorProfilePath({
        playerId: "registration-1",
        category: "jeep",
        eventId: "event-1",
      }),
    ).toBe("/player/registration-1?category=jeep&source=competitor&eventId=event-1");
  });

  it("returns a stable list of skeleton cards", () => {
    expect(getPlayerSkeletonCards(3)).toEqual([
      { id: "player-skeleton-0" },
      { id: "player-skeleton-1" },
      { id: "player-skeleton-2" },
    ]);
  });
});
