import { describe, expect, it } from "vitest";
import {
  buildPlayerProfile,
  formatChampionNumber,
  resolveDriverUserIdFromProfileRecord,
} from "./playerProfile.utils.js";

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
      event_id: {
        location: "Cholistan Desert, Bahawalpur",
      },
      team_id: {
        team_name: "Sahiwal Sand Runners mp2relsq",
        team_number: "T-mp2relsq-8",
        category: "stock_prepaid",
        driver_id: "69faf874cfae8d80f4ad3542",
      },
      driver: {
        name: "Muhammad Rizwan",
        profile_image: null,
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
        heroImage: "static-hero.png",
        driverImage: "",
        navigatorImage: "",
        hasDriverImage: false,
        hasNavigatorImage: false,
        hasNavigator: false,
        navigatorName: "",
      }),
    );
    expect(profile.driverDetails).toEqual([
      { label: "TEAM", value: "Sahiwal Sand Runners mp2relsq" },
    ]);
  });

  it("omits the location row when driver has no address", () => {
    const profile = buildPlayerProfile(
      {
        _id: "champion-3",
        team_id: {
          team_name: "Iron Beast",
        },
        driver: {
          name: "Tariq Mehmood",
          occupation: "Automotive Workshop Owner",
          address: "",
          location: null,
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
      driver_image: "uploads/images/driver.png",
      navigator_image: "uploads/images/navigator.png",
      team_id: {
        team_name: "Rally Masters",
        team_number: "RM-06",
      },
      driver: {
        name: "Umar Farooq",
        age: 30,
        occupation: "Rally Driver",
        address: "Lahore",
        date_of_birth: "1992-04-20T00:00:00.000Z",
      },
      navigator: {
        _id: "nav-1",
        name: "Zubair Khan",
        profile_image: "uploads/images/navigator-profile.png",
        occupation: "Navigator",
        location: "Islamabad",
        date_of_birth: "1991-03-22T00:00:00.000Z",
      },
    };

    const profile = buildPlayerProfile(champion, fallbackProfile);

    expect(profile.hasNavigator).toBe(true);
    expect(profile.navigatorName).toBe("Zubair Khan");
    expect(profile.hasNavigatorImage).toBe(true);
    expect(profile.hasDriverImage).toBe(false);
    expect(profile.driverImage).toBe("");
    expect(profile.navigatorImage).toBe(
      "uploads/images/navigator-profile.png",
    );
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
      driverImage: "",
      navigatorImage: "",
      hasDriverImage: false,
      hasNavigatorImage: false,
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

  it("resolves driver user id from populated driver, not registration id", () => {
    expect(
      resolveDriverUserIdFromProfileRecord({
        _id: "6a0339507bdb4b17c30579f2",
        team_id: { driver_id: "69faf874cfae8d80f4ad3542" },
        driver: { _id: "69f988d447844ddd29331289", name: "Hassan Malik" },
      }),
    ).toBe("69f988d447844ddd29331289");
  });

  it("builds profile from populated champions api records", () => {
    const profile = buildPlayerProfile(
      {
        _id: "6a0339507bdb4b17c30579f2",
        category: null,
        image: null,
        team_id: {
          team_name: "Rizwan team",
          team_number: "#22",
          category: "stock_prepaid",
        },
        driver: {
          _id: "69faf874cfae8d80f4ad3542",
          name: "Hassan Malik",
          age: 31,
          location: "Lahore",
          occupation: "Driver",
          profile_image: null,
        },
        navigator: null,
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
        details: [],
      },
    );

    expect(profile).toMatchObject({
      id: "6a0339507bdb4b17c30579f2",
      driverName: "Hassan Malik",
      teamName: "Rizwan team",
      number: "#22",
      hasNavigator: false,
      driverUserId: "69faf874cfae8d80f4ad3542",
    });
    expect(profile.driverDetails).toEqual(
      expect.arrayContaining([
        { label: "AGE", value: "31" },
        { label: "OCCUPATION", value: "Driver" },
        { label: "LOCATION", value: "Lahore" },
        { label: "TEAM", value: "Rizwan team" },
      ]),
    );
  });
});
