import { describe, expect, it } from "vitest";
import { buildPlayerProfile, formatChampionNumber } from "./playerProfile.utils.js";

describe("playerProfile utils", () => {
  it("prefers champion api fields and falls back for missing values", () => {
    const fallbackProfile = {
      id: "champion-1",
      number: "#22",
      driverName: "Static Name",
      teamName: "Static Team",
      teamNumber: "22",
      heroImage: "static-hero.png",
      driverImage: "static-driver.png",
      navigatorImage: "static-navigator.png",
      details: [
        { label: "AGE", value: "26" },
        { label: "OCCUPATION", value: "Driver" },
        { label: "DATE OF BIRTH", value: "Born on 30/08/1994" },
        { label: "LOCATION", value: "Static Location" },
        { label: "TEAM", value: "Static Team" },
      ],
    };

    const champion = {
      _id: "champion-1",
      image: "uploads\\images\\hero.png",
      driver_name: "Muhammad Rizwan",
      driver_image: null,
      event_id: {
        location: "Cholistan Desert, Bahawalpur",
      },
      team_id: {
        team_name: "Sahiwal Sand Runners mp2relsq",
        team_number: "T-mp2relsq-8",
        driver_id: {
          name: "Muhammad Rizwan",
          profile_image: null,
        },
      },
    };

    expect(buildPlayerProfile(champion, fallbackProfile)).toEqual(
      expect.objectContaining({
        id: "champion-1",
        number: "#T-mp2relsq-8",
        driverName: "Muhammad Rizwan",
        teamName: "Sahiwal Sand Runners mp2relsq",
        teamNumber: "T-mp2relsq-8",
        heroImage: "uploads\\images\\hero.png",
        driverImage: "uploads\\images\\hero.png",
        navigatorImage: "static-navigator.png",
        details: [
          { label: "AGE", value: "26" },
          { label: "OCCUPATION", value: "Driver" },
          { label: "DATE OF BIRTH", value: "Born on 30/08/1994" },
          { label: "LOCATION", value: "Cholistan Desert, Bahawalpur" },
          { label: "TEAM", value: "Sahiwal Sand Runners mp2relsq" },
        ],
      }),
    );
  });

  it("formats champion numbers consistently", () => {
    expect(formatChampionNumber("50")).toBe("#50");
    expect(formatChampionNumber("#22")).toBe("#22");
    expect(formatChampionNumber("")).toBe("—");
  });
});
