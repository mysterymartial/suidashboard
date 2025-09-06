import React from "react";
import { Layout } from "../../components/layout/Layout";
import { useMarketData } from "../../hooks/useMarketData";
import { Table, Text, Button, Flex, Card } from "@radix-ui/themes";
import { Download, Loader2 } from "lucide-react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

function MarketDepth() {
  const { marketdata, loading, error } = useMarketData();

  const handleDownloadCSV = () => {
    if (!marketdata || marketdata.length === 0) return;

    const headers = [
      "Trading Pair",
      "Base/Quote",
      "Last Price",
      "24h Change %",
      "Highest Bid",
      "Lowest Ask",
      "24h High",
      "24h Low",
      "Base Volume",
      "Quote Volume",
    ];

    const rows = marketdata.map((row) => [
      row.trading_pairs,
      `${row.base_currency}/${row.quote_currency}`,
      row.last_price,
      row.price_change_percent_24h,
      row.highest_bid,
      row.lowest_ask,
      row.highest_price_24h,
      row.lowest_price_24h,
      row.base_volume,
      row.quote_volume,
    ]);

    const csvContent =
      [headers, ...rows].map((e) => e.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "market_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

if (loading)
    return (
      <Layout>
        <main className="flex items-center justify-center min-h-[70vh]">
          <Card className="flex items-center gap-3 p-6 bg-gray-900 rounded-xl shadow-md">
            <Loader2 className="animate-spin text-blue-500" />
            <Text color="gray">Loading market data...</Text>
          </Card>
        </main>
      </Layout>
    );

  if (error)
    return (
      <Layout>
        <main className="flex items-center justify-center min-h-[70vh]">
          <Card className="p-6 bg-red-900/50 rounded-xl shadow-md">
            <Text color="red" size="4" weight="bold">
              ⚠ Error: {error}
            </Text>
          </Card>
        </main>
      </Layout>
    );

  if (!marketdata || marketdata.length === 0)
    return (
      <Layout>
        <main className="flex items-center justify-center min-h-[70vh]">
          <Card className="p-6 bg-gray-800 rounded-xl shadow-md">
            <Text color="gray" size="4" weight="bold">
              No market data available
            </Text>
          </Card>
        </main>
      </Layout>
    );

  // 📊 Transform for charts
  const chartData = marketdata.map((row) => ({
    name: row.trading_pairs,
    baseVolume: Number(row.base_volume) || 0,
    quoteVolume: Number(row.quote_volume) || 0,
  }));

  // 📈 Stats
  const totalBase = chartData.reduce((sum, d) => sum + d.baseVolume, 0);
  const totalQuote = chartData.reduce((sum, d) => sum + d.quoteVolume, 0);
  const topGainer = marketdata.reduce((prev, curr) =>
    curr.price_change_percent_24h > prev.price_change_percent_24h ? curr : prev
  );
  const topLoser = marketdata.reduce((prev, curr) =>
    curr.price_change_percent_24h < prev.price_change_percent_24h ? curr : prev
  );

  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#A28CFF",
    "#FF6384",
    "#36A2EB",
    "#FFCE56",
    "#00A676",
    "#9C27B0",
  ];

  return (
    <Layout>
      <main className="p-6 space-y-8">
        {/* Header */}
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-sm">
          <h2 className="text-2xl font-semibold text-white">
            DeepBook - Market Summary
          </h2>
          <p className="text-gray-300 mt-1">
            Summary charts, stats and liquidity layers.
          </p>
        </div>

        {/* Stats Cards */}
        <Flex gap="4" wrap="wrap">
          <Card className="flex-1 p-4 shadow rounded-xl">
            <Flex>
              <Text weight="bold" size="2" className="text-gray-500">
              Total Base Volume
            </Text>
            <Text size="5" weight="bold">{totalBase.toLocaleString()}</Text>
            </Flex>
          </Card>

          <Card className="flex-1 p-4 shadow rounded-xl">
           <Flex>
             <Text weight="bold" size="2" className="text-gray-500">
              Total Quote Volume
            </Text>
            <Text size="5" weight="bold">{totalQuote.toLocaleString()}</Text>
           </Flex>
          </Card>

          <Card className="flex-1 p-4 shadow rounded-xl">
            <Flex>
              <Text weight="bold" size="2" className="text-gray-500">
              Top Gainer
            </Text>
            <Text size="5" weight="bold" className="text-green-600">
              {topGainer.trading_pairs} ({topGainer.price_change_percent_24h.toFixed(2)}%)
            </Text>
            </Flex>
          </Card>

          <Card className="flex-1 p-4 shadow rounded-xl">
            <Flex>
              <Text weight="bold" size="2" className="text-gray-500">
              Top Loser
            </Text>
            <Text size="5" weight="bold" className="text-red-600">
              {topLoser.trading_pairs} ({topLoser.price_change_percent_24h.toFixed(2)}%)
            </Text>
            </Flex>
          </Card>
        </Flex>

        {/* Charts */}
        <Flex gap="6" wrap="nowrap">
          {/* Bar Chart */}
          <Card className="w-full lg:w-1/2 h-[400px] p-4">
            <Text weight="bold" size="4">
              Base vs Quote Volume (Bar)
            </Text>
            <ResponsiveContainer width="100%" height="90%">
              <BarChart data={chartData} width={500}
                height={300}
                margin={{
                  top: 5,
                  right: 30,
                  left: 35,
                  bottom: 5,
                }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="baseVolume" fill="#8884d8" name="Base Volume" />
                <Bar dataKey="quoteVolume" fill="#82ca9d" name="Quote Volume" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Pie Chart */}
          <Card className="w-full lg:w-1/2 h-[400px] p-4">
            <Text weight="bold" size="4">
              Market Share (Base Volume)
            </Text>
            <ResponsiveContainer width="100%" height="90%">
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="baseVolume"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {chartData.map((_, index) => (
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
          </Card>
        </Flex>

        {/* Table */}
        <div className="space-y-4">
          <Flex justify="between" align="center">
            <Text weight="bold" size="4">
              Market Data
            </Text>
            <Button variant="soft" onClick={handleDownloadCSV}>
              <Download size={16} /> Download CSV
            </Button>
          </Flex>

          <Table.Root variant="surface" className="rounded-xl overflow-hidden">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell>Trading Pair</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Base/Quote</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Last Price</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>24h Change %</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Highest Bid</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Lowest Ask</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>24h High</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>24h Low</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Base Volume</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Quote Volume</Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {marketdata.map((row, idx) => (
                <Table.Row key={idx}>
                  <Table.Cell>{row.trading_pairs}</Table.Cell>
                  <Table.Cell>
                    {row.base_currency}/{row.quote_currency}
                  </Table.Cell>
                  <Table.Cell>{row.last_price}</Table.Cell>
                  <Table.Cell
                    className={
                      row.price_change_percent_24h > 0
                        ? "text-green-600"
                        : row.price_change_percent_24h < 0
                          ? "text-red-600"
                          : ""
                    }
                  >
                    {row.price_change_percent_24h.toFixed(2)}%
                  </Table.Cell>
                  <Table.Cell>{row.highest_bid}</Table.Cell>
                  <Table.Cell>{row.lowest_ask}</Table.Cell>
                  <Table.Cell>{row.highest_price_24h}</Table.Cell>
                  <Table.Cell>{row.lowest_price_24h}</Table.Cell>
                  <Table.Cell>{row.base_volume}</Table.Cell>
                  <Table.Cell>{row.quote_volume}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </div>
      </main>
    </Layout>
  );
}

export default MarketDepth;
