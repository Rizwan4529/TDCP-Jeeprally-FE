export const ROUTES_NAV_PATH = "/routes";

export function isRoutesNavLink(link) {
  if (!link) return false;
  const path = String(link.path ?? "").split("#")[0];
  return path === ROUTES_NAV_PATH || link.title?.toLowerCase?.() === "routes";
}

export function sortStagesByNumber(stages = []) {
  return [...stages].sort(
    (a, b) => Number(a.stage_number ?? 0) - Number(b.stage_number ?? 0),
  );
}

export function splitStagesIntoColumns(stages = []) {
  const sorted = sortStagesByNumber(stages);
  const midpoint = Math.ceil(sorted.length / 2);

  return {
    left: sorted.slice(0, midpoint),
    right: sorted.slice(midpoint),
  };
}

export function formatStageHeading(stage) {
  const number = Number(stage?.stage_number);
  if (!Number.isFinite(number)) return "STAGE";
  if (number === 0) return "PROLOGUE";
  return `STAGE ${number}`;
}

export function formatStageRouteLine(stage) {
  const location = stage?.location?.trim();
  if (!location) return "—";
  return location.toUpperCase();
}

export function formatStageSchedule(stage) {
  const start = stage?.time_start?.trim();
  const end = stage?.time_end?.trim();
  if (start && end) return `${start} – ${end}`;
  return start || end || null;
}
