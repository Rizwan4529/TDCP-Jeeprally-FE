export function buildRankingsChartRows(byYear = []) {
  return (byYear ?? []).map((row) => ({
    name: String(row.year),
    year: row.year,
    tdcp: row.tdcp ?? 0,
    other: row.other ?? 0,
  }));
}

export function computeRankingsYAxisMax(rows = []) {
  const maxCount = rows.reduce(
    (max, row) => Math.max(max, row.tdcp, row.other),
    0,
  );
  if (maxCount <= 0) return 4;
  const padded = Math.ceil(maxCount * 1.2);
  return Math.max(4, padded);
}

export function buildRankingsYAxisTicks(max) {
  if (max <= 4) return [0, 1, 2, 3, 4];
  const step = max <= 10 ? 2 : max <= 20 ? 5 : 10;
  const ticks = [];
  for (let v = 0; v <= max; v += step) ticks.push(v);
  if (ticks[ticks.length - 1] !== max) ticks.push(max);
  return ticks;
}

/** True when the rankings participation API has at least one recorded race. */
export function hasRankingsParticipationData(participationData) {
  if (!participationData) return false;

  const totals = participationData.totals;
  if (totals != null && typeof totals.all === "number") {
    return totals.all > 0;
  }

  const byYear = participationData.by_year ?? [];
  if (!byYear.length) return false;

  return byYear.some((row) => (row.tdcp ?? 0) > 0 || (row.other ?? 0) > 0);
}

export function getRankingsChartPresentation(participationData) {
  const series = participationData?.series ?? [];
  const tdcpSeries = series.find((item) => item.key === "tdcp");
  const otherSeries = series.find((item) => item.key === "other");

  return {
    title: participationData?.chart?.title || "Rankings",
    tdcpLabel: tdcpSeries?.label || "TDCP Jeep Rally",
    otherLabel: otherSeries?.label || "Other Organizations",
  };
}
