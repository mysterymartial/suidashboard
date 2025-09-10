import { Heading, Box, Text } from "@radix-ui/themes";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import CardComponent from "../cards";

type ChartsSectionProps = {
  data?: any[];
  valueField?: string; // e.g. "liqUsd" or "tick_size"
  labelField?: string; // e.g. "pool" or "pool_name"
  symbolField?: string; // e.g. "symbol" or "base_asset_symbol"
};

const COLORS = ["#115aeb", "#1e40af", "#60a5fa", "#818cf8", "#fbbf24"];

export function ChartsSection({
  data,
  valueField = "liqUsd",
  labelField = "pool",
  symbolField = "symbol",
}: ChartsSectionProps) {
  // Defensive: only use items with a valid valueField and labelField
  const chartData = (Array.isArray(data) ? data : [])
    .filter((d) => d && typeof d[valueField] === "number" && !!d[labelField])
    .sort((a, b) => b[valueField] - a[valueField])
    .slice(0, 10)
    .map((d) => ({
      name: d[labelField],
      value: d[valueField],
      symbol:
        d[symbolField] ||
        (d.coinA && d.coinB
          ? d.coinA.split("::").pop() + "/" + d.coinB.split("::").pop()
          : d.base_asset_symbol || d.pool_name || d.pool || "-"),
    }));

  return (
    <div className="flex flex-col gap-[2rem]">
      <CardComponent>
        <Heading size="4" mb="2" className="text-[#292929]">
          Top Pools ({valueField})
        </Heading>
        <Box
          style={{
            height: 350,
            // background: "#111113",
            borderRadius: 8,
            display: "flex",
            alignItems: "center",
            justifyContent: chartData.length ? "flex-start" : "center",
            padding: 12,
            // overflowX: "",
          }}
        >
          {chartData.length === 0 ? (
            <Text className="text-[#292929]">No data</Text>
          ) : (
            <ResponsiveContainer width="100%" height={290}>
              <BarChart data={chartData}>
                <XAxis dataKey="symbol" />
                <YAxis />
                <Tooltip
                  formatter={(value: number) =>
                    typeof value === "number"
                      ? valueField === "liqUsd"
                        ? `$${Number(value).toLocaleString(undefined, {
                            maximumFractionDigits: 2,
                          })}`
                        : value.toLocaleString()
                      : value
                  }
                />
                <Bar dataKey="value" fill="#115aeb">
                  {chartData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </Box>
      </CardComponent>

      {/* <CardComponent>
        <Heading size="4" mb="2" className="text-[#292929]">
          Top Pools (Pie)
        </Heading>
        <Box
          style={{
            height: 350,
            // background: "#111113",
            borderRadius: 8,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {chartData.length === 0 ? (
            <Text className="text-[#292929]">No data</Text>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="symbol"
                  cx="50%"
                  cy="50%"
                  outerRadius={50}
                  fill="#115aeb"
                  label={({ name, percent }) =>
                    `${name.slice(0, 3) + "..." + name.slice(63)} ${(percent * 100).toFixed(1)}%`
                  }
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Legend />
                <Tooltip
                  formatter={(value: number) =>
                    typeof value === "number"
                      ? valueField === "liqUsd"
                        ? `$${Number(value).toLocaleString(undefined, {
                            maximumFractionDigits: 2,
                          })}`
                        : value.toLocaleString()
                      : value
                  }
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </Box>
      </CardComponent> */}
    </div>
  );
}
