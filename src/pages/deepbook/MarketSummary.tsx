import { Layout } from "../../components/layout/Layout";
import { useMarketData } from "../../hooks/useDeep/useMarketData";
import { Table, Text, Button, Flex } from "@radix-ui/themes";
import { Spinner } from "../../components/ui/Spinner";
import CardComponent from "@/components/cards";
// @ts-ignore
import { Download, Loader2 } from "lucide-react";
// @ts-ignore
import {
  Skeleton,
  StatCardSkeleton,
  ChartSkeleton,
  TableRowSkeleton,
} from "../../components/ui/Skeleton";
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
import { useRef, useState } from "react";
import { exportElementAsImage } from "@/utils/exportImage";

function MarketDepth() {
  const { marketdata, loading, error } = useMarketData();
  const marketTableRef = useRef<HTMLDivElement | null>(null);
  const [downloading, setDownloading] = useState(false);

  // @ts-ignore
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

    const csvContent = [headers, ...rows].map((e) => e.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "market_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadImage = async () => {
    if (!marketTableRef.current) return;
    try {
      setDownloading(true);
      await exportElementAsImage(marketTableRef.current, {
        filename: "market_data",
        watermarkText: "suihub africa",
      });
    } finally {
      setDownloading(false);
    }
  };

  if (loading)
    return (
      <Layout>
        <main className="p-6">
          <Spinner />
        </main>
      </Layout>
    );

  if (error)
    return (
      <Layout>
        <main className="flex items-center justify-center min-h-[70vh]">
          <CardComponent>
            <Text color="red" size="4" weight="bold">
              ⚠ Error: {error}
            </Text>
          </CardComponent>
        </main>
      </Layout>
    );

  if (!marketdata || marketdata.length === 0)
    return (
      <Layout>
        <main className="flex items-center justify-center min-h-[70vh]">
          <CardComponent>
            <div className="p-6 bg-gray-800 rounded-xl shadow-md"></div>
            <Text className="text-[#292929]" size="4" weight="bold">
              No market data available
            </Text>
          </CardComponent>
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
    curr.price_change_percent_24h > prev.price_change_percent_24h ? curr : prev,
  );
  const topLoser = marketdata.reduce((prev, curr) =>
    curr.price_change_percent_24h < prev.price_change_percent_24h ? curr : prev,
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
        <CardComponent>
          <h2 className="text-2xl font-semibold text-[#292929]">
            DeepBook - Market Summary
          </h2>
          <p className="text-[#292929] mt-1">
            Summary charts, stats and liquidity layers.
          </p>
        </CardComponent>

        {/* Stats Cards */}
        <Flex gap="4" wrap="wrap">
          <CardComponent>
            <div className="flex flex-col items-center g-full justify-center">
              <Text weight="bold" size="2" className="text-[#292929]">
                Total Base Volume
              </Text>
              <Text className="text-[#292929]" size="5" weight="bold">
                {totalBase.toLocaleString()}
              </Text>
            </div>
          </CardComponent>

          <CardComponent>
            <div className="flex flex-col items-center g-full justify-center">
              <Text weight="bold" size="2" className="text-[#292929]">
                Total Quote Volume
              </Text>
              <Text className="text-[#292929]" size="5" weight="bold">
                {totalQuote.toLocaleString()}
              </Text>
            </div>
          </CardComponent>

          <CardComponent>
            <div className="flex flex-col items-center g-full justify-center">
              <Text weight="bold" size="2" className="text-[#292929]">
                Top Gainer
              </Text>
              <Text size="5" weight="bold" className="text-green-600">
                {topGainer.trading_pairs} (
                {topGainer.price_change_percent_24h.toFixed(2)}%)
              </Text>
            </div>
          </CardComponent>

          <CardComponent>
            <div className="flex flex-col items-center g-full justify-center">
              <Text weight="bold" size="2" className="text-[#292929]">
                Top Loser
              </Text>
              <Text size="5" weight="bold" className="text-red-600">
                {topLoser.trading_pairs} (
                {topLoser.price_change_percent_24h.toFixed(2)}%)
              </Text>
            </div>
          </CardComponent>
        </Flex>

        {/* Charts */}
        <Flex gap="6" wrap="nowrap">
          {/* Bar Chart */}
          <CardComponent>
            <Text className="text-[#292929]" weight="bold" size="4">
              Base vs Quote Volume (Bar)
            </Text>
            <ResponsiveContainer width="100%" height="90%">
              <BarChart
                data={chartData}
                width={500}
                height={300}
                margin={{
                  top: 5,
                  right: 30,
                  left: 35,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="baseVolume" fill="#8884d8" name="Base Volume" />
                <Bar dataKey="quoteVolume" fill="#82ca9d" name="Quote Volume" />
              </BarChart>
            </ResponsiveContainer>
          </CardComponent>

          {/* Pie Chart */}
          <CardComponent>
            <Text className="text-[#292929]" weight="bold" size="4">
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
          </CardComponent>
        </Flex>

        {/* Table */}
        <div className="space-y-4" ref={marketTableRef}>
          <Flex justify="between" align="center">
            <Text className="text-[#292929]" weight="bold" size="4">
              Market Data
            </Text>
            <div className="flex gap-2">
              <Button onClick={handleDownloadImage} disabled={downloading}>
                {downloading ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
                    Downloading...
                  </span>
                ) : (
                  "Download Data"
                )}
              </Button>
            </div>
          </Flex>

          <Table.Root className="border border-[#e8e8e8] rounded-[10px] overflow-hidden">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell className="text-[#292929]">
                  Trading Pair
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell className="text-[#292929]">
                  Base/Quote
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell className="text-[#292929]">
                  Last Price
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell className="text-[#292929]">
                  24h Change %
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell className="text-[#292929]">
                  Highest Bid
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell className="text-[#292929]">
                  Lowest Ask
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell className="text-[#292929]">
                  24h High
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell className="text-[#292929]">
                  24h Low
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell className="text-[#292929]">
                  Base Volume
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell className="text-[#292929]">
                  Quote Volume
                </Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {marketdata.map((row, idx) => (
                <Table.Row key={idx}>
                  <Table.Cell className="text-[#292929]">
                    {row.trading_pairs}
                  </Table.Cell>
                  <Table.Cell className="text-[#292929]">
                    {row.base_currency}/{row.quote_currency}
                  </Table.Cell>
                  <Table.Cell className="text-[#292929]">
                    {row.last_price}
                  </Table.Cell>
                  <Table.Cell
                    className={
                      row.price_change_percent_24h > 0
                        ? "text-green-600"
                        : row.price_change_percent_24h < 0
                          ? "text-red-600"
                          : "text-[#292929]"
                    }
                  >
                    {row.price_change_percent_24h.toFixed(2)}%
                  </Table.Cell>
                  <Table.Cell className="text-[#292929]">
                    {row.highest_bid}
                  </Table.Cell>
                  <Table.Cell className="text-[#292929]">
                    {row.lowest_ask}
                  </Table.Cell>
                  <Table.Cell className="text-[#292929]">
                    {row.highest_price_24h}
                  </Table.Cell>
                  <Table.Cell className="text-[#292929]">
                    {row.lowest_price_24h}
                  </Table.Cell>
                  <Table.Cell className="text-[#292929]">
                    {row.base_volume}
                  </Table.Cell>
                  <Table.Cell className="text-[#292929]">
                    {row.quote_volume}
                  </Table.Cell>
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
