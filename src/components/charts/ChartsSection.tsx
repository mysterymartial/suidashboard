import { Flex, Card, Heading, Box, Text } from "@radix-ui/themes";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

type Pool = {
  pool_name: string;
  base_asset_decimals: number;
  base_asset_symbol: string;
  tick_size: number; // Added to match usage in code
};

type ChartsSectionProps = {
  data?: Pool[];
};

const COLORS = ["#115aeb", "#1e40af", "#60a5fa", "#818cf8", "#fbbf24"];

export function ChartsSection({ data }: ChartsSectionProps) {
  // Use top 5 pools for the charts, use tick_size for chart value
  const chartData = (data || [])
    .filter((d) => typeof d.tick_size === "number" && !!d.pool_name)
    .slice(0, 5)
    .map((d) => ({
      name: d.pool_name,
      value: d.tick_size,
      symbol: d.base_asset_symbol,
    }));

  return (
    <Flex gap="6" mb="6">
      <Card style={{ flex: 2 }}>
        <Heading size="4" mb="2">
          Top Pools (by tick_size)
        </Heading>
        <Box
          style={{
            height: 180,
            background: "#f1f5f9",
            borderRadius: 8,
            display: "flex",
            alignItems: "center",
            justifyContent: chartData.length ? "flex-start" : "center",
            padding: 12,
            overflowX: "auto",
          }}
        >
          {chartData.length === 0 ? (
            <Text color="black">No data</Text>
          ) : (
            <ResponsiveContainer width="100%" height={140}>
              <BarChart data={chartData}>
                <XAxis dataKey="symbol" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#115aeb">
                  {chartData.map((entry, index) => (
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
      </Card>
      <Card style={{ flex: 1 }}>
        <Heading size="4" mb="2">
          Top Pools (Pie)
        </Heading>
        <Box
          style={{
            height: 180,
            background: "#f1f5f9",
            borderRadius: 8,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {chartData.length === 0 ? (
            <Text color="black">No data</Text>
          ) : (
            <ResponsiveContainer width="100%" height={140}>
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="symbol"
                  cx="50%"
                  cy="50%"
                  outerRadius={50}
                  fill="#115aeb"
                  label
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </Box>
      </Card>
    </Flex>
  );
}
