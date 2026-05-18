function getRallyEndTimestamp(rally) {
  const endDate = rally?.end_date ?? rally?.date;
  if (!endDate) return 0;

  const timestamp = new Date(endDate).getTime();
  return Number.isNaN(timestamp) ? 0 : timestamp;
}

/** Picks the completed rally with the latest end_date (falls back to date). */
export function getMostRecentCompletedRally(rallies = []) {
  if (!Array.isArray(rallies) || rallies.length === 0) {
    return null;
  }

  return [...rallies].sort(
    (a, b) => getRallyEndTimestamp(b) - getRallyEndTimestamp(a),
  )[0];
}
