import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const data = [
  { name: '1', green: 28, yellow: 36 },
  { name: '2', green: 40, yellow: 48 },
  { name: '3', green: 32, yellow: 39 },
  { name: '4', green: 36, yellow: 41 },
  { name: '5', green: 38, yellow: 43 },
  { name: '6', green: 45, yellow: 52 },
  { name: '7', green: 39, yellow: 28 },
  { name: '8', green: 52, yellow: 46 },
  { name: '9', green: 46, yellow: 40 },
  { name: '10', green: 62, yellow: 58 },
  { name: '11', green: 50, yellow: 28 },
];

const RankingChart = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 lg:px-20">
        <h2 className="font-gilda text-[36px] md:text-[42px] text-primary text-center mb-16">
          Rankings
        </h2>

        <div className="h-[400px] md:h-[500px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{
                top: 20,
                right: 0,
                left: -25,
                bottom: 20,
              }}
            >
              <CartesianGrid
                vertical={false}
                strokeDasharray="0"
                stroke="#f0f0f0"
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#9ca3af', fontSize: 14 }}
                dy={20}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#9ca3af', fontSize: 14 }}
                domain={[0, 80]}
                ticks={[0, 20, 40, 60, 80]}
                dx={-10}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ stroke: '#f0f0f0', strokeWidth: 1 }}
              />
              <Line
                type="monotone"
                dataKey="yellow"
                stroke="#F9DA4A"
                strokeWidth={4}
                dot={false}
                activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2 }}
                animationDuration={1500}
              />
              <Line
                type="monotone"
                dataKey="green"
                stroke="#B44423"
                strokeWidth={4}
                dot={false}
                activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2 }}
                animationDuration={1500}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="relative group">
        <div className="bg-white px-3 py-1 rounded-lg border border-gray-100 shadow-xl flex flex-col items-center">
          <span className="text-[12px] font-bold text-gray-800">{payload[0].value}</span>
          <div className="w-2 h-2 rounded-full bg-primary mt-1"></div>
        </div>
        <div className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-white"></div>
      </div>
    );
  }
  return null;
};

export default RankingChart;
