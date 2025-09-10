import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface Pool {
  pool_name: string;
  base_asset_symbol: string;
  quote_asset_symbol: string;
  min_size: number;
}

const COLORS = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff7f50",
  "#00c49f",
  "#0088fe",
];

export function PoolsPieChart({ pools }: { pools: Pool[] }) {
  const data = pools.map((p) => ({
    name: `${p.base_asset_symbol}/${p.quote_asset_symbol}`,
    value: p.min_size, // you can switch to lot_size or tick_size
  }));

  return (
    <div className="w-full h-[400px] bg-[#FAFAFA] p-4 rounded-xl">
      <h2 className="text-lg font-semibold text-[#292929] mb-2">
        Pools Distribution
      </h2>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            label
          >
            {data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
