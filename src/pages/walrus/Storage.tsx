import React from "react";
import { Layout } from "../../components/layout/Layout";
import { useWalrusAnalytics } from "../../hooks/usewalrus/useWalrusAnalytics";
import {
  Card,
  Flex,
  Text,
  Spinner,
} from "@radix-ui/themes";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

function Storage() {
  const { analyticsData, accountCount, blobCount, loading, error } = useWalrusAnalytics();

  const formatChartData = (data: any) =>
    data?.chart?.map((item: any) => ({
      timestamp: new Date(item.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      value: item.value,
    }));

  if (loading) {
    return (
      <Layout>
        <Flex justify="center" mt="10">
          <Spinner size="4" />
          <Text className="ml-2">Loading data...</Text>
        </Flex>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <Text color="red" mt="10">{error.message}</Text>
      </Layout>
    );
  }

  return (
    <Layout>
      <main className="p-6 space-y-8">
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-sm">
          <h2 className="text-2xl font-semibold text-white">
            Walrus - Storage Analytics
          </h2>
          <p className="text-gray-300 mt-1">
            Storage usage and performance insights.
          </p>
        </div>

        {/* Average Blob Size Chart */}
        {analyticsData && (
          <Card className="p-4 border border-gray-700 shadow-sm">
            <Text size="5" weight="bold" className="mb-4">Average Blob Size (24H)</Text>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={formatChartData(analyticsData)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#8884d8" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        )}

        {/* Total Accounts Chart */}
        {accountCount && (
          <Card className="p-4 border border-gray-700 shadow-sm">
            <Text size="5" weight="bold" className="mb-4">Total Accounts (24H)</Text>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={formatChartData(accountCount)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#82ca9d" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        )}

        {/* Total Blobs Chart */}
        {blobCount && (
          <Card className="p-4 border border-gray-700 shadow-sm">
            <Text size="5" weight="bold" className="mb-4">Total Blobs (24H)</Text>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={formatChartData(blobCount)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#ff7300" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        )}
      </main>
    </Layout>
  );
}

export default Storage;
