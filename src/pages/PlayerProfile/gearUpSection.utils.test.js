import { describe, expect, it } from "vitest";
import {
  getRallyEventDescription,
  getRallyEventTitle,
  getRallyTeamId,
  mapVehicleToGearUpSpecs,
  resolveGearUpEvent,
  resolveGearUpEventId,
} from "./gearUpSection.utils.js";

describe("gearUpSection utils", () => {
  it("extracts team id from populated team_id", () => {
    expect(
      getRallyTeamId({
        team_id: { _id: "69fb05cbcfae8d80f4ad3544" },
      }),
    ).toBe("69fb05cbcfae8d80f4ad3544");
  });

  it("resolves event id from query, active event, or profile record", () => {
    expect(
      resolveGearUpEventId({
        eventIdFromQuery: "event-query",
        activeEventId: "event-active",
        profileRecord: { event_id: { _id: "event-record" } },
      }),
    ).toBe("event-query");

    expect(
      resolveGearUpEventId({
        profileRecord: { event_id: { _id: "event-record" } },
      }),
    ).toBe("event-record");
  });

  it("reads event title and description from rally records", () => {
    const rally = {
      name: "Cholistan Challenge",
      description: "Desert rally across the dunes.",
    };

    expect(getRallyEventTitle(rally)).toBe("Cholistan Challenge");
    expect(getRallyEventDescription(rally)).toBe("Desert rally across the dunes.");
  });

  it("resolves gear up event from active, past, or profile sources", () => {
    const activeEvent = {
      _id: "active-1",
      name: "Active Rally",
      description: "Active description",
    };
    const pastRallies = [
      { _id: "past-1", name: "Past Rally", description: "Past description" },
    ];

    expect(
      resolveGearUpEvent({
        eventId: "past-1",
        activeEvent,
        pastRallies,
      }),
    ).toEqual(pastRallies[0]);

    expect(
      resolveGearUpEvent({
        eventId: "active-1",
        activeEvent,
        pastRallies,
      }),
    ).toEqual(activeEvent);
  });

  it("maps vehicle api fields to gear up callouts", () => {
    const specs = mapVehicleToGearUpSpecs({
      model: "450 Rally",
      engine: "MONOCILINDRICO DE 449.5cc",
      frame: "ACERO CROMO MOLIBDENO",
      power: 45,
      weight: 140,
      length: 220,
      tank_capacity: 35,
      class: "Rally GP",
    });

    expect(specs.left.find((item) => item.label === "Model")?.value).toBe(
      "450 Rally",
    );
    expect(specs.left.find((item) => item.label === "Engine")?.value).toBe(
      "MONOCILINDRICO DE 449.5cc",
    );
    expect(specs.right.find((item) => item.label === "Tank capacity")?.value).toBe(
      "35",
    );
    expect(specs.right.find((item) => item.label === "Class")?.value).toBe(
      "Rally GP",
    );
  });
});
