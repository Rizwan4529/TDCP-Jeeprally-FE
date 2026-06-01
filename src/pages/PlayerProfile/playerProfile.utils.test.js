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

    const profile = buildPlayerProfile(champion, fallbackProfile);

    expect(profile).toEqual(
      expect.objectContaining({
        id: "champion-1",
        number: "#T-mp2relsq-8",
        driverName: "Muhammad Rizwan",
        teamName: "Sahiwal Sand Runners mp2relsq",
        teamNumber: "T-mp2relsq-8",
        heroImage: "uploads\\images\\hero.png",
        driverImage: "uploads\\images\\hero.png",
        navigatorImage: "",
        hasNavigator: false,
        navigatorName: "",
      }),
    );
    expect(profile.driverDetails).toEqual([
      { label: "TEAM", value: "Sahiwal Sand Runners mp2relsq" },
    ]);
  });

  it("omits the location row when driver_id has no address", () => {
    const profile = buildPlayerProfile(
      {
        _id: "champion-3",
        team_id: {
          team_name: "Iron Beast",
          driver_id: {
            name: "Tariq Mehmood",
            occupation: "Automotive Workshop Owner",
            address: "",
            location: null,
          },
        },
      },
      {
        id: "fallback",
        number: "#1",
        driverName: "Fallback",
        teamName: "Team",
        teamNumber: "1",
        heroImage: "",
        driverImage: "",
        navigatorImage: "",
        details: [{ label: "LOCATION", value: "Fallback Location" }],
      },
    );

    expect(profile.driverDetails).toEqual([
      { label: "OCCUPATION", value: "Automotive Workshop Owner" },
      { label: "TEAM", value: "Iron Beast" },
    ]);
  });

  it("maps navigator fields from navigator_id when present", () => {
    const fallbackProfile = {
      id: "fallback",
      number: "#1",
      driverName: "Fallback Driver",
      navigatorName: "Fallback Navigator",
      teamName: "Fallback Team",
      teamNumber: "1",
      heroImage: "fallback-hero.png",
      driverImage: "fallback-driver.png",
      navigatorImage: "fallback-navigator.png",
      details: [
        { label: "AGE", value: "—" },
        { label: "OCCUPATION", value: "—" },
        { label: "DATE OF BIRTH", value: "—" },
        { label: "LOCATION", value: "—" },
        { label: "TEAM", value: "—" },
      ],
    };

    const champion = {
      _id: "champion-2",
      driver_name: "Umar Farooq",
      driver_image: "uploads/images/driver.png",
      navigator_name: "Zubair Khan",
      navigator_image: "uploads/images/navigator.png",
      navigator_occupation: "IT Consultant",
      team_id: {
        team_name: "Rally Masters",
        team_number: "RM-06",
        driver_id: {
          name: "Umar Farooq",
          age: 30,
          occupation: "Rally Driver",
          address: "Lahore",
          date_of_birth: "1992-04-20T00:00:00.000Z",
        },
        navigator_id: {
          _id: "nav-1",
          name: "Zubair Khan",
          profile_image: "uploads/images/navigator-profile.png",
          occupation: "Navigator",
          location: "Islamabad",
          date_of_birth: "1991-03-22T00:00:00.000Z",
        },
      },
    };

    const profile = buildPlayerProfile(champion, fallbackProfile);

    expect(profile.hasNavigator).toBe(true);
    expect(profile.navigatorName).toBe("Zubair Khan");
    expect(profile.navigatorImage).toBe("uploads/images/navigator.png");
    expect(profile.driverDetails).toEqual(
      expect.arrayContaining([
        { label: "AGE", value: "30" },
        { label: "OCCUPATION", value: "Rally Driver" },
        { label: "LOCATION", value: "Lahore" },
      ]),
    );
    expect(profile.navigatorDetails).toEqual(
      expect.arrayContaining([
        { label: "OCCUPATION", value: "Navigator" },
        { label: "LOCATION", value: "Islamabad" },
      ]),
    );
  });

  it("normalizes fallback profile details when champion record is missing", () => {
    const fallbackProfile = {
      id: "fallback-1",
      driverName: "Fallback Driver",
      details: [{ label: "TEAM", value: "Fallback Team" }],
    };

    expect(buildPlayerProfile(null, fallbackProfile)).toEqual({
      id: "fallback-1",
      driverName: "Fallback Driver",
      details: [{ label: "TEAM", value: "Fallback Team" }],
      hasNavigator: false,
      navigatorName: "",
      driverDetails: [{ label: "TEAM", value: "Fallback Team" }],
      navigatorDetails: [],
    });
  });

  it("formats champion numbers consistently", () => {
    expect(formatChampionNumber("50")).toBe("#50");
    expect(formatChampionNumber("#22")).toBe("#22");
    expect(formatChampionNumber("")).toBe("—");
  });
});
