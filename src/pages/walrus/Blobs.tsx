import React, { useState } from "react";
import { Layout } from "../../components/layout/Layout";
import { useWalrusBlob } from "../../hooks/useWalrus/useWalrusBlob";
import { Table, Button, Flex, Text, Card, IconButton, Spinner } from "@radix-ui/themes";
import { Copy, Check, Download } from "lucide-react";

function Blobs() {
  const [page, setPage] = useState(0);
  const { blobData, loading, error } = useWalrusBlob(page);
  const [copied, setCopied] = useState<string | null>(null);

  // Copy to clipboard
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

    const headers = ["Blob ID", "Blob ID Base64", "Object ID", "Status", "Start Epoch", "End Epoch", "Size", "Timestamp"];
    const rows = blobData.content.map(blob => [
      blob.blobId,
      blob.blobIdBase64,
      blob.objectId,
      blob.status,
      blob.startEpoch,
      blob.endEpoch,
      blob.size.toLocaleString(),
      new Date(blob.timestamp).toLocaleString(),
    ]);

    const csvContent = [headers, ...rows].map(r => r.join(",")).join("\n");
    const blobFile = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blobFile);
    const link = document.createElement("a");
    link.href = url;
    link.download = `walrus_blobs_page_${page + 1}.csv`;
    link.click();
  };

  if (error) return <Layout><Text color="red">{error.message}</Text></Layout>;
  if (!blobData?.content?.length) return <Layout><Text>No blobs found.</Text></Layout>;

  return (
    <Layout>
      <main className="p-6 space-y-8">
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-sm">
          <h2 className="text-2xl font-semibold text-white">Walrus - Blobs</h2>
          <p className="text-gray-300 mt-1">Blob storage analytics and trends.</p>
        </div>

        <Card className="p-6 space-y-4 border border-gray-700 shadow-sm">
          <Flex justify="between" align="center">
            <Text size="5" weight="bold">Walrus Blobs</Text>
            <Button variant="soft" onClick={handleDownloadCSV}><Download size={16} /> Download CSV</Button>
          </Flex>

          <Table.Root className={loading ? "opacity-50 transition-opacity duration-300" : ""}>
            <Table.Header>
              <Table.Row>
                {["Blob ID","Blob ID Base64","Object ID","Status","Start Epoch","End Epoch","Size","Timestamp"].map(h => (
                  <Table.ColumnHeaderCell key={h}>{h}</Table.ColumnHeaderCell>
                ))}
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {blobData.content.map(blob => (
                <Table.Row key={blob.blobId}>
                  <Table.Cell>
                    <Flex gap="2" align="center">
                      <Text className="truncate max-w-[220px]">{blob.blobId}</Text>
                      <IconButton size="1" onClick={() => handleCopy(blob.blobId)}>
                        {copied === blob.blobId ? <Check size={14} color="green" /> : <Copy size={14} />}
                      </IconButton>
                    </Flex>
                  </Table.Cell>

                  <Table.Cell>{blob.blobIdBase64}</Table.Cell>
                  <Table.Cell>
                    <Flex gap="2" align="center">
                      <Text className="truncate max-w-[220px]">{blob.objectId}</Text>
                      <IconButton size="1" onClick={() => handleCopy(blob.objectId)}>
                        {copied === blob.objectId ? <Check size={14} color="green" /> : <Copy size={14} />}
                      </IconButton>
                    </Flex>
                  </Table.Cell>

                  <Table.Cell>{blob.status}</Table.Cell>
                  <Table.Cell>{blob.startEpoch}</Table.Cell>
                  <Table.Cell>{blob.endEpoch}</Table.Cell>
                  <Table.Cell>{blob.size.toLocaleString()}</Table.Cell>
                  <Table.Cell>{new Date(blob.timestamp).toLocaleString()}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>

          {loading && (
            <Flex justify="center" mt="2">
              <Spinner size="2" />
              <Text size="3" color="gray" className="ml-2">Loading new page...</Text>
            </Flex>
          )}

          <Flex gap="3" justify="end" mt="4">
            <Button disabled={page === 0 || loading} onClick={() => setPage(p => p - 1)}>Previous</Button>
            <Text>Page {page + 1}</Text>
            <Button
              disabled={blobData.content.length < blobData.pageable.pageSize || loading}
              onClick={() => setPage(p => p + 1)}
            >
              Next
            </Button>
          </Flex>
        </Card>
      </main>
    </Layout>
  );
}

export default Blobs;
