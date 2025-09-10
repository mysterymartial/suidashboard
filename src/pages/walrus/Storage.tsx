import React from "react";
import { Layout } from "../../components/layout/Layout";
import { Flex, Text, Spinner } from "@radix-ui/themes";
import CardComponent from "@/components/cards";
import {
  Skeleton,
  StatCardSkeleton,
  ChartSkeleton,
} from "../../components/ui/Skeleton";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { useWalrusAnalytics } from "@/hooks/usewalrus/useWalrusAnalytics";

function Storage() {
  const { analyticsData, accountCount, blobCount, loading, error } =
    useWalrusAnalytics();

  const formatChartData = (data: any) =>
    data?.chart?.map((item: any) => ({
      timestamp: new Date(item.timestamp).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      value: item.value,
    }));

  if (loading) {
    return (
      <Layout>
        <Spinner className="text-[#292929] m-auto mt-[20%]"/>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <Text color="red" mt="10">
          {error.message}
        </Text>
      </Layout>
    );
  }

  return (
    <Layout>
      <main className="p-6 space-y-8">
        <CardComponent>
          <h2 className="text-2xl font-semibold text-[#292929]">
            Walrus - Storage Analytics
          </h2>
          <p className="text-[#292929] mt-1">
            Storage usage and performance insights.
          </p>
        </CardComponent>

        {/* Average Blob Size Chart */}
        {analyticsData && (
          <CardComponent>
            <Text size="5" weight="bold" className="mb-4 text-[#292929]">
              Average Blob Size (24H)
            </Text>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={formatChartData(analyticsData)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#8884d8"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardComponent>
        )}

        {/* Total Accounts Chart */}
        {accountCount && (
          <CardComponent>
            <Text size="5" weight="bold" className="mb-4 text-[#292929]">
              Total Accounts (24H)
            </Text>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={formatChartData(accountCount)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#82ca9d"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardComponent>
        )}

        {/* Total Blobs Chart */}
        {blobCount && (
          <CardComponent>
            <Text size="5" weight="bold" className="mb-4 text-[#292929]">
              Total Blobs (24H)
            </Text>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={formatChartData(blobCount)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#ff7300"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardComponent>
        )}
      </main>
    </Layout>
  );
}

export default Storage;
