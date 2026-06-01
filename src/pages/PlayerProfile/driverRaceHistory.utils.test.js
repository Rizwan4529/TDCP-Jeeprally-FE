import { describe, expect, it } from "vitest";
import {
  getOtherRaceEntries,
  getTdcpRaceEntries,
  hasOtherRacesData,
  hasTeamStandingData,
  mapOtherRacesToPanelItems,
  mapTdcpRacesToTeamStanding,
} from "./driverRaceHistory.utils.js";

const sampleTdcpRace = {
  _id: "reg-1",
  year: 2026,
  team_id: { team_name: "Balochistan Dunes", team_number: "T-3" },
  event_id: { name: "Cholistan Desert Rally 2026", date: "2026-06-12T00:00:00.000Z" },
  category_id: { title: "Stock Prepaid" },
  ranking: {
    after_stage: 1,
    position: 3,
    total_time: "2:33:19",
    points: 91,
  },
};

const sampleOtherRace = {
  _id: "other-1",
  team: "Dakar Regional 2023",
  position: "2nd",
  vehicle: "Jeep Wrangler Rubicon",
  year: 2023,
  role: "driver",
};

describe("driverRaceHistory utils", () => {
  it("reads tdcp_races from flat list or by_year groups", () => {
    expect(
      getTdcpRaceEntries({
        tdcp_races: [sampleTdcpRace],
      }),
    ).toHaveLength(1);

    expect(
      getTdcpRaceEntries({
        tdcp_races: [],
        tdcp_races_by_year: [{ year: 2026, items: [sampleTdcpRace] }],
      }),
    ).toHaveLength(1);
  });

  it("reads other_races from flat list or by_year groups", () => {
    expect(
      getOtherRaceEntries({
        other_races: [sampleOtherRace],
      }),
    ).toHaveLength(1);

    expect(
      getOtherRaceEntries({
        other_races: [],
        other_races_by_year: [{ year: 2023, items: [sampleOtherRace] }],
      }),
    ).toHaveLength(1);
  });

  it("detects empty vs populated race history", () => {
    expect(hasTeamStandingData(null)).toBe(false);
    expect(hasTeamStandingData({ tdcp_races: [] })).toBe(false);
    expect(hasTeamStandingData({ tdcp_races: [sampleTdcpRace] })).toBe(true);

    expect(hasOtherRacesData({ other_races: [] })).toBe(false);
    expect(hasOtherRacesData({ other_races: [sampleOtherRace] })).toBe(true);
  });

  it("maps TDCP registrations to team standing panel rows", () => {
    expect(mapTdcpRacesToTeamStanding({ tdcp_races: [sampleTdcpRace] })).toEqual([
      expect.objectContaining({
        id: "reg-1",
        year: "2026",
        stage: "Stage 1",
        rank: "3",
        role: "Driver",
        category: "Stock Prepaid",
        team: "Balochistan Dunes",
      }),
    ]);
  });

  it("uses challenge title when ranking stage is missing", () => {
    const race = {
      ...sampleTdcpRace,
      ranking: null,
      challenge_id: { title: "24hr Bike Race" },
    };

    expect(mapTdcpRacesToTeamStanding({ tdcp_races: [race] })[0]).toMatchObject({
      stage: "24hr Bike Race",
      rank: "—",
    });
  });

  it("maps other races to panel rows", () => {
    expect(mapOtherRacesToPanelItems({ other_races: [sampleOtherRace] })).toEqual([
      expect.objectContaining({
        id: "other-1",
        year: "2023",
        stage: "driver",
        rank: "2nd",
        event: "Dakar Regional 2023",
        vehicle: "Jeep Wrangler Rubicon",
      }),
    ]);
  });

  it("returns only the five most recent TDCP races for the profile panel", () => {
    const races = Array.from({ length: 7 }, (_, index) => ({
      _id: `reg-${index}`,
      year: 2020 + index,
      registered_at: `202${index}-06-01T00:00:00.000Z`,
      team_id: { team_name: `Team ${index}` },
      event_id: { date: `202${index}-06-12T00:00:00.000Z` },
    }));

    const rows = mapTdcpRacesToTeamStanding({ tdcp_races: races });

    expect(rows).toHaveLength(5);
    expect(rows.map((row) => row.id)).toEqual([
      "reg-6",
      "reg-5",
      "reg-4",
      "reg-3",
      "reg-2",
    ]);
  });

  it("returns only the five most recent other races for the profile panel", () => {
    const races = Array.from({ length: 6 }, (_, index) => ({
      _id: `other-${index}`,
      year: 2018 + index,
      team: `Event ${index}`,
      vehicle: "Jeep",
      role: "driver",
      created_at: `202${index}-01-01T00:00:00.000Z`,
    }));

    const rows = mapOtherRacesToPanelItems({ other_races: races });

    expect(rows).toHaveLength(5);
    expect(rows[0].id).toBe("other-5");
    expect(rows[4].id).toBe("other-1");
  });
});
