import React, { useState, useMemo } from "react";
import { Layout } from "../../components/layout/Layout";
import { useStablecoinData } from "../../hooks/useStablecoins/useStable";
import { 
  Table, 
  Card, 
  Heading, 
  Text, 
  Flex, 
  Button, 
  Badge,
  Spinner
} from "@radix-ui/themes";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from "recharts";

function Supply() {
  const { data, loading, error } = useStablecoinData();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Calculate pagination
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = data.slice(startIndex, endIndex);

  // Get top 5 entries for chart (sorted by total circulating USD)
  const top5Data = useMemo(() => {
    return data
      .sort((a, b) => b.totalCirculatingUSD.peggedUSD - a.totalCirculatingUSD.peggedUSD)
      .slice(0, 5)
      .map(item => ({
        date: new Date(parseInt(item.date) * 1000).toLocaleDateString(),
        totalCirculating: item.totalCirculating.peggedUSD,
        totalCirculatingUSD: item.totalCirculatingUSD.peggedUSD,
        totalMintedUSD: item.totalMintedUSD.peggedUSD
      }));
  }, [data]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(parseInt(dateString) * 1000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <Layout>
        <main className="p-6 space-y-8">
          <Card>
            <Flex align="center" justify="center" p="9">
              <Spinner size="3" />
              <Text ml="3">Loading stablecoin data...</Text>
            </Flex>
          </Card>
        </main>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <main className="p-6 space-y-8">
          <Card>
            <Flex align="center" justify="center" p="9">
              <Badge color="red">Error: {error}</Badge>
            </Flex>
          </Card>
        </main>
      </Layout>
    );
  }

  return (
    <Layout>
      <main className="p-6 space-y-8">
        {/* Header */}
        <Card>
          <Heading size="6" mb="2">
            Stablecoins - Supply
          </Heading>
          <Text color="gray">
            Supply over time for major stablecoins on Sui network.
          </Text>
        </Card>

        {/* Chart Section - Top 5 */}
        <Card>
          <Heading size="4" mb="4">
            Top 5 Stablecoins by Total Circulating USD
          </Heading>
          <div style={{ width: '100%', height: '400px' }}>
            <ResponsiveContainer>
              <LineChart data={top5Data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="date" 
                  stroke="#9CA3AF"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#9CA3AF"
                  fontSize={12}
                  tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#F9FAFB'
                  }}
                  formatter={(value: number, name: string) => [
                    formatCurrency(value),
                    name === 'totalCirculating' ? 'Total Circulating' :
                    name === 'totalCirculatingUSD' ? 'Total Circulating USD' :
                    'Total Minted USD'
                  ]}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="totalCirculatingUSD" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  name="Total Circulating USD"
                />
                <Line 
                  type="monotone" 
                  dataKey="totalMintedUSD" 
                  stroke="#10B981" 
                  strokeWidth={2}
                  name="Total Minted USD"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Table Section - Paginated */}
        <Card>
          <Flex justify="between" align="center" mb="4">
            <Heading size="4">
              All Stablecoin Data
            </Heading>
            <Badge variant="soft">
              {data.length} total entries
            </Badge>
          </Flex>
          
          <Table.Root>
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell>Date</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Total Circulating</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Total Circulating USD</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Total Minted USD</Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {currentData.map((item, index) => (
                <Table.Row key={`${item.date}-${index}`}>
                  <Table.Cell>
                    <Text size="2">{formatDate(item.date)}</Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text size="2">{item.totalCirculating.peggedUSD.toLocaleString()}</Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text size="2" weight="medium">
                      {formatCurrency(item.totalCirculatingUSD.peggedUSD)}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text size="2">
                      {formatCurrency(item.totalMintedUSD.peggedUSD)}
                    </Text>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>

          {/* Pagination Controls */}
          <Flex justify="between" align="center" mt="4">
            <Text size="2" color="gray">
              Showing {startIndex + 1}-{Math.min(endIndex, data.length)} of {data.length} entries
            </Text>
            <Flex gap="2">
              <Button 
                variant="soft" 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              >
                Previous
              </Button>
              <Flex gap="1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = Math.max(1, Math.min(currentPage - 2 + i, totalPages - 4 + i));
                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "solid" : "soft"}
                      size="1"
                      onClick={() => setCurrentPage(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </Flex>
              <Button 
                variant="soft" 
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              >
                Next
              </Button>
            </Flex>
          </Flex>
        </Card>
      </main>
    </Layout>
  );
}

export default Supply;
