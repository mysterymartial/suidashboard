import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
    PieChart,
    Pie,
    Cell,
    Legend,
} from "recharts";
import { Flex, Text } from "@radix-ui/themes";

type HistoricalVolumeChartsProps = {
    volumeData: Record<string, number>;
};

const COLORS = [
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#ff7f50",
    "#a4de6c",
    "#d0ed57",
    "#8dd1e1",
    "#ffbb28",
    "#ff8042",
    "#0088FE",
    "#00C49F",
];

export function HistoricalVolumeCharts({ volumeData }: HistoricalVolumeChartsProps) {
    const data = Object.entries(volumeData).map(([pool, volume]) => ({
        pool,
        volume,
    }));

    return (
        <div className="space-y-4">
            <Text weight="bold" size="3">
                Historical Volume Charts
            </Text>

            <Flex gap="6" wrap="wrap">
                {/* Bar Chart */}
                <div style={{ flex: 1, minWidth: "400px", height: "400px" }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            width={500}
                            height={300}
                            data={data}
                            margin={{
                                top: 5,
                                right: 30,
                                left: 30,
                                bottom: 5,
                            }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="pool" hide />
                            <YAxis />
                            <Tooltip formatter={(val) => Number(val).toLocaleString()} />
                            <Bar dataKey="volume" fill="#8884d8" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Pie Chart */}
                <div style={{ flex: 1, minWidth: "400px", height: "400px" }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                dataKey="volume"
                                nameKey="pool"
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                label={({ name, percent }) =>
                                    `${name} ${(percent * 100).toFixed(1)}%`
                                }
                            >
                                {data.map((_, i) => (
                                    <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(val) => Number(val).toLocaleString()} />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </Flex >
        </div >
    );
}
