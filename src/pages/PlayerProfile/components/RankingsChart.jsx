import { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { usePlayerProfileContext } from "../PlayerProfileContext.jsx";
import {
  buildRankingsChartRows,
  buildRankingsYAxisTicks,
  computeRankingsYAxisMax,
  getRankingsChartPresentation,
} from "../rankingsChart.utils.js";

const RankingChart = () => {
  const { rankingsQuery, showRankingsSection } = usePlayerProfileContext();

  const chartRows = useMemo(
    () => buildRankingsChartRows(rankingsQuery.data?.by_year),
    [rankingsQuery.data?.by_year],
  );

  const presentation = useMemo(
    () => getRankingsChartPresentation(rankingsQuery.data),
    [rankingsQuery.data],
  );

  const yMax = useMemo(() => computeRankingsYAxisMax(chartRows), [chartRows]);
  const yTicks = useMemo(() => buildRankingsYAxisTicks(yMax), [yMax]);

  if (!showRankingsSection) {
    return null;
  }

  return (
    <section className="bg-white py-16 md:py-20">
      <div className="container mx-auto px-4 lg:px-20">
        <h2 className="mb-10 text-center font-gilda text-[34px] text-black md:mb-14 md:text-[40px]">
          {presentation.title}
        </h2>

        <div className="mx-auto w-full max-w-5xl">
          <div className="h-[280px] md:h-[360px]">
            {rankingsQuery.isLoading ? (
              <div className="flex h-full items-center justify-center text-sm text-[#6B7280]">
                Loading chart…
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartRows}
                  margin={{
                    top: 8,
                    right: 8,
                    left: -12,
                    bottom: 8,
                  }}
                >
                  <CartesianGrid
                    vertical={false}
                    strokeDasharray="0"
                    stroke="#ececec"
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#6b7280", fontSize: 12 }}
                    dy={14}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#6b7280", fontSize: 12 }}
                    domain={[0, yMax]}
                    ticks={yTicks}
                    allowDecimals={false}
                    dx={-10}
                  />
                  <Tooltip
                    content={
                      <RankingsTooltip
                        tdcpLabel={presentation.tdcpLabel}
                        otherLabel={presentation.otherLabel}
                      />
                    }
                    cursor={{ stroke: "#efefef", strokeWidth: 1 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="other"
                    name={presentation.otherLabel}
                    stroke="#F9DA4A"
                    strokeWidth={4}
                    dot={false}
                    activeDot={{ r: 6, stroke: "#fff", strokeWidth: 2 }}
                    animationDuration={1500}
                  />
                  <Line
                    type="monotone"
                    dataKey="tdcp"
                    name={presentation.tdcpLabel}
                    stroke="#B44423"
                    strokeWidth={4}
                    dot={false}
                    activeDot={{ r: 6, stroke: "#fff", strokeWidth: 2 }}
                    animationDuration={1500}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>

          {!rankingsQuery.isLoading ? (
            <RankingsLegend
              tdcpLabel={presentation.tdcpLabel}
              otherLabel={presentation.otherLabel}
            />
          ) : null}
        </div>
      </div>
    </section>
  );
};

function RankingsLegend({ tdcpLabel, otherLabel }) {
  return (
    <div
      className="mt-8 flex flex-wrap items-center justify-center gap-6 md:gap-10"
      role="list"
      aria-label="Chart legend"
    >
      <div className="flex items-center gap-2.5" role="listitem">
        <span
          className="h-1 w-10 shrink-0 rounded-full bg-[#B44423]"
          aria-hidden
        />
        <span className="text-sm text-[#4B4B4B]">{tdcpLabel}</span>
      </div>
      <div className="flex items-center gap-2.5" role="listitem">
        <span
          className="h-1 w-10 shrink-0 rounded-full bg-[#F9DA4A]"
          aria-hidden
        />
        <span className="text-sm text-[#4B4B4B]">{otherLabel}</span>
      </div>
    </div>
  );
}

function RankingsTooltip({ active, payload, label, tdcpLabel, otherLabel }) {
  if (!active || !payload?.length) return null;

  const tdcp = payload.find((p) => p.dataKey === "tdcp")?.value ?? 0;
  const other = payload.find((p) => p.dataKey === "other")?.value ?? 0;

  return (
    <div className="relative group">
      <div className="flex flex-col items-center rounded-lg border border-gray-100 bg-white px-3 py-2 shadow-xl">
        <span className="text-[11px] font-semibold text-gray-500">{label}</span>
        <span className="text-[12px] text-[#B44423]">
          {tdcpLabel}: {tdcp}
        </span>
        <span className="text-[12px] text-[#CA8A04]">
          {otherLabel}: {other}
        </span>
      </div>
    </div>
  );
}

export default RankingChart;
