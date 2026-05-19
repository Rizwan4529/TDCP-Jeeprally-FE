import { describe, expect, it } from "vitest";
import {
  REGISTRATION_PHASE,
  getHeroRegistrationTiming,
  getRegistrationPhase,
  getTimeLeft,
} from "./heroRegistration.utils.js";

const activeEvent = {
  name: "Cholistan Desert Rally 2026",
  registration_start_date: "2026-06-15T00:00:00.000Z",
  registration_end_date: "2026-06-30T00:00:00.000Z",
  rally_start_date: "2026-06-02T00:00:00.000Z",
};

describe("heroRegistration utils", () => {
  it("returns before_open when now is before registration start", () => {
    expect(
      getRegistrationPhase(
        new Date("2026-06-10T12:00:00.000Z"),
        activeEvent.registration_start_date,
        activeEvent.registration_end_date,
      ),
    ).toBe(REGISTRATION_PHASE.BEFORE_OPEN);
  });

  it("returns open when now is between registration start and end", () => {
    expect(
      getRegistrationPhase(
        new Date("2026-06-20T12:00:00.000Z"),
        activeEvent.registration_start_date,
        activeEvent.registration_end_date,
      ),
    ).toBe(REGISTRATION_PHASE.OPEN);
  });

  it("returns closed when now is on or after registration end", () => {
    expect(
      getRegistrationPhase(
        new Date("2026-06-30T00:00:00.000Z"),
        activeEvent.registration_start_date,
        activeEvent.registration_end_date,
      ),
    ).toBe(REGISTRATION_PHASE.CLOSED);
  });

  it("counts down to registration start before open", () => {
    const timing = getHeroRegistrationTiming(
      activeEvent,
      new Date("2026-06-10T00:00:00.000Z"),
    );

    expect(timing.phase).toBe(REGISTRATION_PHASE.BEFORE_OPEN);
    expect(timing.targetDate?.toISOString()).toBe(activeEvent.registration_start_date);
    expect(timing.timeLeft.days).toBeGreaterThan(0);
  });

  it("counts down to registration end while open", () => {
    const timing = getHeroRegistrationTiming(
      activeEvent,
      new Date("2026-06-20T00:00:00.000Z"),
    );

    expect(timing.phase).toBe(REGISTRATION_PHASE.OPEN);
    expect(timing.targetDate?.toISOString()).toBe(activeEvent.registration_end_date);
  });

  it("returns closed timing with rally start date and no countdown target", () => {
    const timing = getHeroRegistrationTiming(
      activeEvent,
      new Date("2026-07-01T00:00:00.000Z"),
    );

    expect(timing.phase).toBe(REGISTRATION_PHASE.CLOSED);
    expect(timing.targetDate).toBeNull();
    expect(timing.rallyStart?.toISOString()).toBe(activeEvent.rally_start_date);
    expect(getTimeLeft(timing.targetDate, new Date("2026-07-01T00:00:00.000Z"))).toEqual({
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    });
  });
});
