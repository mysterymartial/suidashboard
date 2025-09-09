import React, {useState} from "react";
import { Layout } from "../../components/layout/Layout";
import { useDeepAssets } from "../../hooks/useDeep/useDeepAssets";
import { Flex, Card, Text, Table, Button, IconButton } from "@radix-ui/themes";
import { Loader2, Download, Copy, Check } from "lucide-react";
import { Skeleton, StatCardSkeleton, ChartSkeleton, TableRowSkeleton } from "../../components/ui/Skeleton";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  CartesianGrid,
} from "recharts";

function Liquidity() {
  const { assets, tickers, loading, error } = useDeepAssets();
  const [copied, setCopied] = useState<string | null>(null);

  const handleDownload = (data: any, filename: string) => {
    const rows = [Object.keys(data[0]).join(",")];
    data.forEach((row: any) => {
      rows.push(Object.values(row).join(","));
    });
    const blob = new Blob([rows.join("\n")], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleCopy = (value: string) => {
    navigator.clipboard.writeText(value);
    setCopied(value);
    setTimeout(() => setCopied(null), 1500);
  };

  if (loading)
    return (
      <Layout>
        <main className="p-6 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartSkeleton />
            <ChartSkeleton />
          </div>
          
          <Card className="bg-gray-800 border-gray-700">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <Skeleton height="1.5rem" width="200px" />
                <Skeleton height="2.5rem" width="120px" />
              </div>
              <Table.Root>
                <Table.Header>
                  <Table.Row>
                    <Table.ColumnHeaderCell>Asset</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Contract Address</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Actions</Table.ColumnHeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {Array.from({ length: 8 }).map((_, index) => (
                    <TableRowSkeleton key={index} columns={4} />
                  ))}
                </Table.Body>
              </Table.Root>
            </div>
          </Card>
        </main>
      </Layout>
    );

  if (error)
    return (
      <Layout>
        <Flex justify="center" align="center" className="min-h-[70vh]">
          <Card className="p-6 bg-red-900/50 rounded-xl shadow-md">
            <Text color="red">⚠ Error: {error}</Text>
          </Card>
        </Flex>
      </Layout>
    );

  const assetsData = Object.entries(assets).map(([symbol, a]) => ({
    symbol,
    name: a.name,
    contract: a.contractAddress,
    deposit: a.can_deposit,
    withdraw: a.can_withdraw,
  }));

  const tickersData = Object.entries(tickers).map(([pair, t]) => ({
    pair,
    last_price: t.last_price,
    base_volume: t.base_volume,
    quote_volume: t.quote_volume,
    status: t.isFrozen === 0 ? "Active" : "Frozen",
  }));

  // ✅ Stats from tickers
  const totalVolume = tickersData.reduce(
    (sum, t) => sum + (Number(t.base_volume) || 0),
    0
  );
  const minVolume = Math.min(...tickersData.map((t) => t.base_volume));
  const maxVolume = Math.max(...tickersData.map((t) => t.base_volume));

  return (
    <Layout>
      <main className="p-6 space-y-8">
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-sm">
          <h2 className="text-2xl font-semibold text-white">
            DeepBook - Assets & Tickers
          </h2>
          <p className="text-gray-300 mt-1">
            Liquidity availability and utilization metrics.
          </p>
        </div>
        <div className="space-y-8">
          {/* Stats Cards */}
          <Flex gap="6" wrap="wrap">
            <Card className="min-w-[180px] p-4 display-flex flex-col items-center">
              <Text size="2" color="gray">
                Total Pairs
              </Text>
              <Text weight="bold" size="5">
                {tickersData.length}
              </Text>
            </Card>
            <Card className="min-w-[180px] p-4">
              <Text size="2" color="gray">
                Total Volume
              </Text>
              <Text weight="bold" size="5">
                {totalVolume.toLocaleString()}
              </Text>
            </Card>
            <Card className="min-w-[180px] p-4">
              <Text size="2" color="gray">
                Min Volume
              </Text>
              <Text weight="bold" size="5">
                {minVolume.toLocaleString()}
              </Text>
            </Card>
            <Card className="min-w-[180px] p-4">
              <Text size="2" color="gray">
                Max Volume
              </Text>
              <Text weight="bold" size="5">
                {maxVolume.toLocaleString()}
              </Text>
            </Card>
          </Flex>

          {/* Charts */}
          <Flex gap="6" className="h-[400px]">
            <ResponsiveContainer width="50%" height="100%">
              <BarChart
                data={tickersData}
                margin={{ top: 5, right: 30, left: 35, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="pair" hide />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="base_volume" fill="#3b82f6" name="Base Volume" />
                <Bar dataKey="quote_volume" fill="#10b981" name="Quote Volume" />
              </BarChart>
            </ResponsiveContainer>

            <ResponsiveContainer width="50%" height="100%">
              <PieChart>
                <Pie
                  data={tickersData}
                  dataKey="base_volume"
                  nameKey="pair"
                  outerRadius={80}
                  fill="#3b82f6"
                  label
                >
                  {tickersData.map((_, i) => (
                    <Cell
                      key={i}
                      fill={`hsl(${(i * 40) % 360}, 70%, 50%)`}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Flex>

          {/* Assets Table */}
          <Card className="p-6">
            <Flex justify="between" align="center" mb="4">
              <Text weight="bold" size="4">
                Assets
              </Text>
              <Button
                variant="soft"
                onClick={() => handleDownload(assetsData, "assets.csv")}
              >
                <Download className="w-4 h-4 mr-2" /> Download CSV
              </Button>
            </Flex>
            <Table.Root variant="surface" className="rounded-xl overflow-hidden">
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeaderCell>Symbol</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Contract</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Deposit</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Withdraw</Table.ColumnHeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {assetsData.map((a) => (
                  <Table.Row key={a.symbol}>
                    <Table.Cell>{a.symbol}</Table.Cell>
                    <Table.Cell>{a.name}</Table.Cell>
                    <Table.Cell>
                      <Flex align="center" gap="2">
                        <span>{a.contract.slice(0, 8)}...</span>
                        <button
                          onClick={() => handleCopy(a.contract)}
                          className="p-1 hover:bg-gray-700 rounded"
                        >
                          {copied === a.contract ? (
                            <Check className="w-4 h-4 text-green-500" /> // ✅ shows check when copied
                          ) : (
                            <Copy className="w-4 h-4 text-gray-400" />
                          )}
                        </button>
                      </Flex>
                    </Table.Cell>
                    <Table.Cell>{a.deposit ? "Yes" : "No"}</Table.Cell>
                    <Table.Cell>{a.withdraw ? "Yes" : "No"}</Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </Card>

          {/* Tickers Table */}
          <Card className="p-6">
            <Flex justify="between" align="center" mb="4">
              <Text weight="bold" size="4">
                Tickers
              </Text>
              <Button
                variant="soft"
                onClick={() => handleDownload(tickersData, "tickers.csv")}
              >
                <Download className="w-4 h-4 mr-2" /> Download CSV
              </Button>
            </Flex>
            <Table.Root variant="surface" className="rounded-xl overflow-hidden">
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeaderCell>Pair</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Last Price</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Base Volume</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Quote Volume</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {tickersData.map((t) => (
                  <Table.Row key={t.pair}>
                    <Table.Cell>{t.pair}</Table.Cell>
                    <Table.Cell>{t.last_price}</Table.Cell>
                    <Table.Cell>{t.base_volume}</Table.Cell>
                    <Table.Cell>{t.quote_volume}</Table.Cell>
                    <Table.Cell>{t.status}</Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </Card>
        </div>
      </main>
    </Layout>
  );
}

export default Liquidity;
