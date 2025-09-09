import React, { useMemo, useState } from "react";
import { Layout } from "../../components/layout/Layout";
import { useOrderBook } from "../../hooks/useDeep/useOrderBook";
import { Table, Card, Text, Flex, Select, Button } from "@radix-ui/themes";
import { Loader2 } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function OrderBook() {
  const PAIRS = [
    "DEEP_SUI",
    "DEEP_USDC",
    "SUI_USDC",
    "BWETH_USDC",
    "WUSDC_USDC",
    "WUSDT_USDC",
    "NS_SUI",
    "NS_USDC",
    "TYPUS_SUI",
    "SUI_AUSD",
    "AUSD_USDC",
    "SEND_USDC",
    "WAL_USDC",
    "WAL_SUI",
    "XBTC_USDC",
    "DRF_SUI",
  ];

  const [selectedPair, setSelectedPair] = useState("DEEP_SUI");
  const { data, loading, error } = useOrderBook(selectedPair);

  // -------- Stats --------
  const bestBid = data?.bids?.[0]?.[0] ?? "-";
  const bestAsk = data?.asks?.[0]?.[0] ?? "-";
  const spread =
    bestBid !== "-" && bestAsk !== "-"
      ? (Number(bestAsk) - Number(bestBid)).toFixed(6)
      : "-";

  const totalBidsQty =
    data?.bids?.reduce((acc, [, qty]) => acc + Number(qty), 0) ?? 0;
  const totalAsksQty =
    data?.asks?.reduce((acc, [, qty]) => acc + Number(qty), 0) ?? 0;

  // -------- Depth chart data (cumulative) --------
  const chartData = useMemo(() => {
    if (!data) return [];

    const bids = data.bids
      .map(([p, q]) => ({ price: Number(p), qty: Number(q) }))
      .sort((a, b) => b.price - a.price) // high -> low
      .slice(0, 50);
    const asks = data.asks
      .map(([p, q]) => ({ price: Number(p), qty: Number(q) }))
      .sort((a, b) => a.price - b.price) // low -> high
      .slice(0, 50);

    // cumulative depth
    let cum = 0;
    const bidDepth = bids.map((l) => {
      cum += l.qty;
      return { price: l.price, bidDepth: cum };
    });

    cum = 0;
    const askDepth = asks.map((l) => {
      cum += l.qty;
      return { price: l.price, askDepth: cum };
    });

    // merge by price to single array
    const map = new Map<number, { price: number; bidDepth?: number; askDepth?: number }>();
    for (const b of bidDepth) {
      map.set(b.price, { price: b.price, bidDepth: b.bidDepth, askDepth: 0 });
    }
    for (const a of askDepth) {
      const exist = map.get(a.price);
      if (exist) map.set(a.price, { ...exist, askDepth: a.askDepth });
      else map.set(a.price, { price: a.price, askDepth: a.askDepth, bidDepth: 0 });
    }

    return Array.from(map.values()).sort((x, y) => x.price - y.price);
  }, [data]);

  // -------- CSV Download --------
  const handleDownloadCSV = () => {
    if (!data) return;

    const headers = ["Side", "Price", "Quantity"];
    const bidRows = data.bids.map(([price, qty]) => ["Bid", price, qty]);
    const askRows = data.asks.map(([price, qty]) => ["Ask", price, qty]);
    const csv = [headers, ...bidRows, ...askRows].map((r) => r.join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", `${selectedPair}_orderbook.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Layout>
      <main className="p-6 space-y-8">
        {/* Header + Download */}
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-sm flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-white">DeepBook - Order Book</h2>
            <p className="text-gray-300 mt-1">Order book level details and listings.</p>
          </div>

          <div className="flex items-center gap-3">
            <Select.Root value={selectedPair} onValueChange={setSelectedPair}>
              <Select.Trigger className="min-w-[180px]" />
              <Select.Content>
                {PAIRS.map((p) => (
                  <Select.Item key={p} value={p}>
                    {p}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>

            <Button color="blue" onClick={handleDownloadCSV}>
              Download CSV
            </Button>
          </div>
        </div>

        {/* Loading / Error states centered while Layout remains */}
        {loading && (
          <Card className="p-10 rounded-xl">
            <div className="min-h-[220px] flex items-center justify-center gap-3">
              <Loader2 className="animate-spin text-blue-500" />
              <Text color="gray">Fetching {selectedPair}...</Text>
            </div>
          </Card>
        )}
        {error && (
          <Card className="p-6 bg-red-900/40 rounded-xl">
            <Text color="red" align="center">
              ⚠ {error}
            </Text>
          </Card>
        )}

        {/* Content */}
        {data && !loading && !error && (
          <Card className="p-6 space-y-6">
            {/* Stats Cards */}
            <Flex gap="4" wrap="wrap">
              <Card className="p-4 flex-1 text-center">
                <Text color="gray">Best Bid</Text>
                <Text weight="bold" color="green">
                  {bestBid}
                </Text>
              </Card>
              <Card className="p-4 flex-1 text-center">
                <Text color="gray">Best Ask</Text>
                <Text weight="bold" color="red">
                  {bestAsk}
                </Text>
              </Card>
              <Card className="p-4 flex-1 text-center">
                <Text color="gray">Spread</Text>
                <Text weight="bold">{spread}</Text>
              </Card>
              <Card className="p-4 flex-1 text-center">
                <Text color="gray">Total Bids (Qty)</Text>
                <Text weight="bold" color="green">
                  {totalBidsQty.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </Text>
              </Card>
              <Card className="p-4 flex-1 text-center">
                <Text color="gray">Total Asks (Qty)</Text>
                <Text weight="bold" color="red">
                  {totalAsksQty.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </Text>
              </Card>
            </Flex>

            {/* Depth Chart */}
            <Card className="p-6">
              <Text size="3" weight="bold" mb="4">
                Order Book Depth
              </Text>
              <div className="w-full h-[340px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="price" tickFormatter={(v) => String(v)} />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="bidDepth"
                      name="Bids (cum qty)"
                      stroke="#10B981"
                      dot={false}
                      strokeWidth={2}
                      isAnimationActive={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="askDepth"
                      name="Asks (cum qty)"
                      stroke="#EF4444"
                      dot={false}
                      strokeWidth={2}
                      isAnimationActive={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Tables */}
            <Flex gap="6" wrap="wrap">
              {/* Bids */}
              <Card className="flex-1 p-4">
                <Text size="3" weight="bold" color="green" mb="3">
                  Bids
                </Text>
                <Table.Root variant="surface" className="rounded-xl overflow-hidden">
                  <Table.Header>
                    <Table.Row>
                      <Table.ColumnHeaderCell>Price</Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell>Quantity</Table.ColumnHeaderCell>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {data.bids.slice(0, 25).map(([price, qty], i) => (
                      <Table.Row key={`bid-${i}`}>
                        <Table.Cell>{price}</Table.Cell>
                        <Table.Cell>{qty}</Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table.Root>
              </Card>

              {/* Asks */}
              <Card className="flex-1 p-4">
                <Text size="3" weight="bold" color="red" mb="3">
                  Asks
                </Text>
                <Table.Root variant="surface" className="rounded-xl overflow-hidden">
                  <Table.Header>
                    <Table.Row>
                      <Table.ColumnHeaderCell>Price</Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell>Quantity</Table.ColumnHeaderCell>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {data.asks.slice(0, 25).map(([price, qty], i) => (
                      <Table.Row key={`ask-${i}`}>
                        <Table.Cell>{price}</Table.Cell>
                        <Table.Cell>{qty}</Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table.Root>
              </Card>
            </Flex>
          </Card>
        )}
      </main>
    </Layout>
  );
}

export default OrderBook;
