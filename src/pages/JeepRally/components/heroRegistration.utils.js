export const REGISTRATION_PHASE = {
  BEFORE_OPEN: "before_open",
  OPEN: "open",
  CLOSED: "closed",
};

export function parseRallyDate(value) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function getRegistrationPhase(now, registrationStartDate, registrationEndDate) {
  const start = parseRallyDate(registrationStartDate);
  const end = parseRallyDate(registrationEndDate);

  if (!start || !end) return null;

  const nowMs = now.getTime();
  if (nowMs < start.getTime()) return REGISTRATION_PHASE.BEFORE_OPEN;
  if (nowMs >= end.getTime()) return REGISTRATION_PHASE.CLOSED;
  return REGISTRATION_PHASE.OPEN;
}

export function getRegistrationCountdownTarget(phase, registrationStartDate, registrationEndDate) {
  if (phase === REGISTRATION_PHASE.BEFORE_OPEN) {
    return parseRallyDate(registrationStartDate);
  }
  if (phase === REGISTRATION_PHASE.OPEN) {
    return parseRallyDate(registrationEndDate);
  }
  return null;
}

export function getTimeLeft(targetDate, now = new Date()) {
  if (!targetDate) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  const difference = targetDate.getTime() - now.getTime();

  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / (1000 * 60)) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };
}

export function formatHeroRegistrationDate(date) {
  if (!date) return "—";
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function formatHeroRegistrationDateShort(date) {
  if (!date) return "—";
  return date.toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });
}

export function getHeroRegistrationTiming(activeEvent, now = new Date()) {
  if (!activeEvent) return null;

  const phase = getRegistrationPhase(
    now,
    activeEvent.registration_start_date,
    activeEvent.registration_end_date,
  );

  const registrationStart = parseRallyDate(activeEvent.registration_start_date);
  const registrationEnd = parseRallyDate(activeEvent.registration_end_date);
  const rallyStart = parseRallyDate(activeEvent.rally_start_date);
  const targetDate = getRegistrationCountdownTarget(
    phase,
    activeEvent.registration_start_date,
    activeEvent.registration_end_date,
  );

  return {
    phase,
    registrationStart,
    registrationEnd,
    rallyStart,
    targetDate,
    timeLeft: getTimeLeft(targetDate, now),
    eventName: activeEvent.name ?? "this rally",
  };
}
