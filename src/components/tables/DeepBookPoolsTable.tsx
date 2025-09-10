import React, { useRef, useState } from "react";
import { Table, Text, TextField, Button, Flex } from "@radix-ui/themes";
import { Copy, Check, Download } from "lucide-react";
import { exportElementAsImage } from "@/utils/exportImage";

interface Pool {
  pool_id: string;
  pool_name: string;
  base_asset_id: string;
  base_asset_symbol: string;
  base_asset_name: string;
  quote_asset_id: string;
  quote_asset_symbol: string;
  quote_asset_name: string;
  min_size: number;
  lot_size: number;
  tick_size: number;
}

export function DeepBookPoolsTable({ pools }: { pools: Pool[] }) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const exportRef = useRef<HTMLDivElement | null>(null);

  const handleCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const shortenId = (id: string) =>
    id.length > 12 ? `${id.slice(0, 6)}...${id.slice(-6)}` : id;

  const downloadCSV = () => {
    const headers = [
      "Pool Name",
      "Pair",
      "Base Asset",
      "Quote Asset",
      "Min Size",
      "Lot Size",
      "Tick Size",
      "Pool ID",
    ];

    const rows = pools.map((p) => [
      p.pool_name,
      `${p.base_asset_symbol}/${p.quote_asset_symbol}`,
      `${p.base_asset_symbol} – ${p.base_asset_name}`,
      `${p.quote_asset_symbol} – ${p.quote_asset_name}`,
      p.min_size,
      p.lot_size,
      p.tick_size,
      p.pool_id,
    ]);

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
    link.setAttribute("download", "deepbook_pools.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadImage = async () => {
    if (!exportRef.current) return;
    await exportElementAsImage(exportRef.current, {
      filename: "deepbook_pools",
      watermarkText: "suihub africa",
    });
  };

  return (
    <div className="space-y-4" ref={exportRef}>
      <Flex justify="between" align="center">
        <Text className="text-[#292929]" as="div" weight="bold" size="3">
          DeepBook Pools
        </Text>
        <div className="flex gap-2">
          <Button variant="soft" onClick={downloadCSV}>
            <Download size={16} /> Download CSV
          </Button>
          <Button onClick={handleDownloadImage}>Download Image</Button>
        </div>
      </Flex>

      <Table.Root className="border border-[#e8e8e8] rounded-[10px]">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell className="text-[#292929]">
              Pool
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="text-[#292929]">
              Pair
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="text-[#292929]">
              Base Asset
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="text-[#292929]">
              Quote Asset
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="text-[#292929]">
              Min Size
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="text-[#292929]">
              Lot Size
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="text-[#292929]">
              Tick Size
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="text-[#292929]">
              Pool ID
            </Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {pools.map((pool) => (
            <Table.Row key={pool.pool_id}>
              <Table.Cell className="text-[#292929]">
                <Text>{pool.pool_name}</Text>
              </Table.Cell>
              <Table.Cell className="text-[#292929]">
                <Text>
                  {pool.base_asset_symbol}/{pool.quote_asset_symbol}
                </Text>
              </Table.Cell>
              <Table.Cell className="text-[#292929]">
                <Flex align="center" gap="2">
                  <Text>
                    {pool.base_asset_symbol} – {pool.base_asset_name}
                  </Text>
                  <Button
                    variant="soft"
                    size="1"
                    color={copiedId === pool.base_asset_id ? "green" : "gray"}
                    onClick={() => handleCopy(pool.base_asset_id)}
                    title="Copy Base Asset ID"
                  >
                    {copiedId === pool.base_asset_id ? (
                      <Check size={14} />
                    ) : (
                      <Copy size={14} />
                    )}
                  </Button>
                </Flex>
              </Table.Cell>
              <Table.Cell className="text-[#292929]">
                <Flex align="center" gap="2">
                  <Text>
                    {pool.quote_asset_symbol} – {pool.quote_asset_name}
                  </Text>
                  <Button
                    variant="soft"
                    size="1"
                    color={copiedId === pool.quote_asset_id ? "green" : "gray"}
                    onClick={() => handleCopy(pool.quote_asset_id)}
                    title="Copy Quote Asset ID"
                  >
                    {copiedId === pool.quote_asset_id ? (
                      <Check size={14} />
                    ) : (
                      <Copy size={14} />
                    )}
                  </Button>
                </Flex>
              </Table.Cell>
              <Table.Cell className="text-[#292929]">
                <Text>{pool.min_size.toLocaleString()}</Text>
              </Table.Cell>
              <Table.Cell className="text-[#292929]">
                <Text>{pool.lot_size.toLocaleString()}</Text>
              </Table.Cell>
              <Table.Cell className="text-[#292929]">
                <Text>{pool.tick_size.toLocaleString()}</Text>
              </Table.Cell>
              <Table.Cell className="text-[#292929]">
                <Flex align="center" gap="2">
                  <TextField.Root
                    readOnly
                    value={shortenId(pool.pool_id)}
                    size="1"
                    style={{ width: "140px" }}
                  />
                  <Button
                    size="1"
                    color={copiedId === pool.pool_id ? "green" : "gray"}
                    onClick={() => handleCopy(pool.pool_id)}
                    title="Copy Pool ID"
                  >
                    {copiedId === pool.pool_id ? (
                      <Check size={14} />
                    ) : (
                      <Copy size={14} />
                    )}
                  </Button>
                </Flex>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </div>
  );
}
