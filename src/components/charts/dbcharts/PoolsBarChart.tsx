import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

interface Pool {
  pool_name: string;
  base_asset_symbol: string;
  quote_asset_symbol: string;
  min_size: number;
  lot_size: number;
  tick_size: number;
}

export function PoolsBarChart({ pools }: { pools: Pool[] }) {
  const data = pools.map((p) => ({
    name: `${p.base_asset_symbol}/${p.quote_asset_symbol}`,
    min_size: p.min_size,
    lot_size: p.lot_size,
    tick_size: p.tick_size,
  }));

  return (
    <div className="w-full h-[400px] bg-[#FAFAFA] p-4 rounded-xl">
      <h2 className="text-lg font-semibold text-[#292929] mb-2">
        Pools Overview
      </h2>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 35,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" stroke="#ccc" />
          <YAxis stroke="#ccc" />
          <Tooltip />
          <Legend />
          <Bar dataKey="min_size" fill="#8884d8" />
          <Bar dataKey="lot_size" fill="#82ca9d" />
          <Bar dataKey="tick_size" fill="#ffc658" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
