import React, { useRef, useState } from "react";
import { Layout } from "../../components/layout/Layout";
import {
  Table,
  Button,
  Flex,
  Text,
  IconButton,
  Spinner,
} from "@radix-ui/themes";
import CardComponent from "@/components/cards";
import { Copy, Check, Download } from "lucide-react";
import { Skeleton } from "../../components/ui/Skeleton";
import Spinner from "@/components/ui/Spinner";
import { useWalrusBlob } from "@/hooks/usewalrus/useWalrusBlob";
import { exportElementAsImage } from "@/utils/exportImage";

function Blobs() {
  const [page, setPage] = useState(0);
  const { blobData, loading, error } = useWalrusBlob(page);
  const [copied, setCopied] = useState<string | null>(null);
  const exportRef = useRef<HTMLDivElement | null>(null);
  const [downloading, setDownloading] = useState(false);

  const handleCopy = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(value);
      setTimeout(() => setCopied(null), 1000);
    } catch {
      alert("Failed to copy");
    }
  };

  // Download CSV
  const handleDownloadCSV = () => {
    if (!blobData?.content) return;

    const headers = [
      "Blob ID",
      "Blob ID Base64",
      "Object ID",
      "Status",
      "Start Epoch",
      "End Epoch",
      "Size",
      "Timestamp",
    ];
    const rows = blobData.content.map((blob) => [
      blob.blobId,
      blob.blobIdBase64,
      blob.objectId,
      blob.status,
      blob.startEpoch,
      blob.endEpoch,
      blob.size.toLocaleString(),
      new Date(blob.timestamp).toLocaleString(),
    ]);

    const csvContent = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blobFile = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blobFile);
    const link = document.createElement("a");
    link.href = url;
    link.download = `walrus_blobs_page_${page + 1}.csv`;
    link.click();
  };

  const handleDownloadImage = async () => {
    if (!exportRef.current) return;
    try {
      setDownloading(true);
      await exportElementAsImage(exportRef.current, {
        filename: `walrus_blobs_page_${page + 1}`,
        watermarkText: "suihub africa",
      });
    } finally {
      setDownloading(false);
    }
  };

  if (error)
    return (
      <Layout>
        <Text color="red">{error.message}</Text>
      </Layout>
    );
  if (!blobData?.content?.length)
    return (
      <Layout>
        <Text>No blobs found.</Text>
      </Layout>
    );

  return (
    <Layout>
      <main className="p-6 space-y-8">
        {loading && <Spinner />}
        <CardComponent>
          <h2 className="text-2xl font-semibold text-[#292929]">
            Walrus - Blobs
          </h2>
          <p className="text-[#292929] mt-1">
            Blob storage analytics and trends.
          </p>
        </CardComponent>

        <CardComponent>
          <Flex justify="between" align="center">
            <Text className="text-[#292929]" size="5" weight="bold">
              Walrus Blobs
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

          <div ref={exportRef}>
            <Table.Root
              className={`border border-[#e8e8e8] rounded-[10px] overflow-hidden text-[#292929] ${loading ? "opacity-50 transition-opacity duration-300" : ""}`}
            >
              <Table.Header>
                <Table.Row>
                  {[
                    "Blob ID",
                    "Blob ID Base64",
                    "Object ID",
                    "Status",
                    "Start Epoch",
                    "End Epoch",
                    "Size",
                    "Timestamp",
                  ].map((h) => (
                    <Table.ColumnHeaderCell key={h} className="text-[#292929]">
                      {h}
                    </Table.ColumnHeaderCell>
                  ))}
                </Table.Row>
              </Table.Header>

              <Table.Body>
                {blobData.content.map((blob) => (
                  <Table.Row key={blob.blobId}>
                    <Table.Cell className="text-[#292929]">
                      <Flex gap="2" align="center">
                        <Text className="truncate max-w-[220px]">
                          {blob.blobId}
                        </Text>
                        <IconButton
                          size="1"
                          onClick={() => handleCopy(blob.blobId)}
                        >
                          {copied === blob.blobId ? (
                            <Check size={14} color="green" />
                          ) : (
                            <Copy size={14} />
                          )}
                        </IconButton>
                      </Flex>
                    </Table.Cell>

                    <Table.Cell className="text-[#292929]">
                      {blob.blobIdBase64}
                    </Table.Cell>
                    <Table.Cell className="text-[#292929]">
                      <Flex gap="2" align="center">
                        <Text className="truncate max-w-[220px]">
                          {blob.objectId}
                        </Text>
                        <IconButton
                          size="1"
                          onClick={() => handleCopy(blob.objectId)}
                        >
                          {copied === blob.objectId ? (
                            <Check size={14} color="green" />
                          ) : (
                            <Copy size={14} />
                          )}
                        </IconButton>
                      </Flex>
                    </Table.Cell>

                    <Table.Cell className="text-[#292929]">
                      {blob.status}
                    </Table.Cell>
                    <Table.Cell className="text-[#292929]">
                      {blob.startEpoch}
                    </Table.Cell>
                    <Table.Cell className="text-[#292929]">
                      {blob.endEpoch}
                    </Table.Cell>
                    <Table.Cell className="text-[#292929]">
                      {blob.size.toLocaleString()}
                    </Table.Cell>
                    <Table.Cell>
                      {new Date(blob.timestamp).toLocaleString()}
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </div>

          {loading && (
            <Flex justify="center" mt="2" gap="2">
              <Skeleton height="1rem" width="120px" />
            </Flex>
          )}

          {/* <Flex gap="3" justify="end" mt="4">
            <Button
              disabled={page === 0 || loading}
              onClick={() => setPage((p) => p - 1)}
            >
              Previous
            </Button>
            <Text>Page {page + 1}</Text>
            <Button
              disabled={
                blobData.content.length < blobData.pageable.pageSize || loading
              }
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </Flex> */}
        </CardComponent>
      </main>
    </Layout>
  );
}

export default Blobs;
