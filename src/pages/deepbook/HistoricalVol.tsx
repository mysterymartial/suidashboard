import React, { useState } from "react";
import { Layout } from "../../components/layout/Layout";
import { useHistoricalVolume } from "../../hooks/useDeep/useHisVol";
import { Table, Text, Button, Flex, TextField } from "@radix-ui/themes";
import { Download } from "lucide-react";
import { HistoricalVolumeCharts } from "../../components/charts/dbcharts/HisVolChart";
import { HistoricalVolumeStats } from "../../components/cards/DbhvStatsCard";

function TradeHistory() {
  const { allPools, volumeData, fetchByRange, loading, error } = useHistoricalVolume();

  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const toUnix = (date: string) =>
    date ? Math.floor(new Date(date).getTime() / 1000) : 0;

  const handleFetch = () => {
    if (startDate && endDate) {
      fetchByRange(toUnix(startDate), toUnix(endDate), false);
    }
  };

  const downloadCSV = () => {
    const headers = ["Pool", "Volume"];
    const rows = Object.entries(volumeData);

    const csvContent = [headers, ...rows]
      .map((row) =>
        row
          .map((cell) =>
            typeof cell === "string" && cell.includes(",")
              ? `"${cell}"`
              : cell
          )
          .join(",")
      )
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "historical_volume.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Layout>
      <main className="p-6 space-y-8">
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-sm">
          <h2 className="text-2xl font-semibold text-white">
            DeepBook - Historical Volume
          </h2>
          <p className="text-gray-300 mt-1">
            Historical Volume Data.
          </p>
        </div>
        <HistoricalVolumeStats volumeData={volumeData} />
        <div className="space-y-4">
          <HistoricalVolumeCharts volumeData={volumeData} />
          <Flex justify="between" align="center">
            <Text weight="bold" size="3">
              Historical Volume
            </Text>
            <Button variant="soft" onClick={downloadCSV}>
              <Download size={16} /> Download CSV
            </Button>
          </Flex>
          {/* Date Filters */}
          <Flex gap="3" align="center">
            <TextField.Root
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <TextField.Root
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
            <Button onClick={handleFetch} disabled={loading}>
              {loading ? "Loading..." : "Fetch"}
            </Button>
          </Flex>

          {error && (
            <Text color="red" size="2">
              {error}
            </Text>
          )}

          {/* Table */}
          <Table.Root variant="surface" className="rounded-xl overflow-hidden">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell className="text-white">Pool</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell className="text-white">Volume</Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {Object.entries(volumeData).map(([pool, volume]) => (
                <Table.Row key={pool}>
                  <Table.Cell>
                    <Text>{pool}</Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text>{volume.toLocaleString()}</Text>
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

export default TradeHistory;
