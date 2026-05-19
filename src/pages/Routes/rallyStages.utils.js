export const ROUTES_NAV_PATH = "/routes";
export const STAGE_ROUTE_PREFIX = `${ROUTES_NAV_PATH}/stage`;

export function getStageRoutePath(stageId) {
  if (!stageId) return ROUTES_NAV_PATH;
  return `${STAGE_ROUTE_PREFIX}/${stageId}`;
}

export function isStageRoutePath(pathname = "") {
  return String(pathname).startsWith(`${STAGE_ROUTE_PREFIX}/`);
}

export function isRoutesNavLink(link) {
  if (!link) return false;
  const path = String(link.path ?? "").split("#")[0];
  return path === ROUTES_NAV_PATH || link.title?.toLowerCase?.() === "routes";
}

export function isRoutesNavActive(pathname = "") {
  const path = String(pathname).split("#")[0];
  return path === ROUTES_NAV_PATH || isStageRoutePath(path);
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

function parseStageCalendarDate(stage) {
  const value = stage?.date;
  if (!value) return null;

  const isoDate = String(value).slice(0, 10);
  const [year, month, day] = isoDate.split("-").map(Number);

  const date =
    year && month && day
      ? new Date(year, month - 1, day)
      : new Date(value);

  return Number.isNaN(date.getTime()) ? null : date;
}

export function formatStageDate(stage) {
  const date = parseStageCalendarDate(stage);
  if (!date) return "—";

  return date
    .toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
    .toUpperCase();
}

export function formatStageDateReadable(stage) {
  const date = parseStageCalendarDate(stage);
  if (!date) return "—";

  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function formatStageLocationRoute(stage) {
  const start = stage?.starting_location?.trim();
  const end = stage?.ending_location?.trim();

  if (start && end) {
    return `${start.toUpperCase()} > ${end.toUpperCase()}`;
  }
  if (start) return start.toUpperCase();
  if (end) return end.toUpperCase();
  return "—";
}

export function formatStageSchedule(stage) {
  const start = stage?.time_start?.trim();
  const end = stage?.time_end?.trim();
  if (start && end) return `${start} – ${end}`;
  return start || end || null;
}
