import { useRef, useState } from "react";
import { Layout } from "../../components/layout/Layout";
import { useHistoricalVolume } from "../../hooks/useDeep/useHisVol";
import { Table, Text, Button, Flex, TextField } from "@radix-ui/themes";
import { Download } from "lucide-react";
import { HistoricalVolumeCharts } from "../../components/charts/dbcharts/HisVolChart";
import { HistoricalVolumeStats } from "../../components/cards/DbhvStatsCard";
import CardComponent from "@/components/cards";
import { exportElementAsImage } from "@/utils/exportImage";

function TradeHistory() {
  const exportRef = useRef<HTMLDivElement | null>(null);
  const { allPools, volumeData, fetchByRange, loading, error } =
    useHistoricalVolume();

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
            typeof cell === "string" && cell.includes(",") ? `"${cell}"` : cell,
          )
          .join(","),
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

  const handleDownloadImage = async () => {
    if (!exportRef.current) return;
    await exportElementAsImage(exportRef.current, {
      filename: "historical_volume",
      watermarkText: "suihub africa",
    });
  };

  return (
    <Layout>
      <main className="p-6 space-y-8">
        <CardComponent>
          <h2 className="text-2xl font-semibold text-[#292929]">
            DeepBook - Historical Volume
          </h2>
          <p className="text-[#292929] mt-1">Historical Volume Data.</p>
        </CardComponent>
        <HistoricalVolumeStats volumeData={volumeData} />
        <div className="space-y-4" ref={exportRef}>
          <HistoricalVolumeCharts volumeData={volumeData} />
          <Flex justify="between" align="center">
            <Text weight="bold" size="3" className="text-[#292929]">
              Historical Volume
            </Text>
            <div className="flex gap-2">
              <Button onClick={downloadCSV}>
                <Download size={16} /> Download CSV
              </Button>
              <Button onClick={handleDownloadImage}>Download Image</Button>
            </div>
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
          <Table.Root className="rounded-xl border border-[#e8e8e8]">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell className="text-[#292929]">
                  Pool
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell className="text-[#292929]">
                  Volume
                </Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {Object.entries(volumeData).map(([pool, volume]) => (
                <Table.Row key={pool}>
                  <Table.Cell className="text-[#292929]">
                    <Text>{pool}</Text>
                  </Table.Cell>
                  <Table.Cell className="text-[#292929]">
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
