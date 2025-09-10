import React, { useState } from "react";
import { useWalrusAccount } from "../../../hooks/useWalrus/useWalrusAccount";
import { Table, Button, Flex, Text, IconButton, Spinner } from "@radix-ui/themes";
import CardComponent from "../../cards";
import { Copy, Check, Download } from "lucide-react";

function Account() {
  const [page, setPage] = useState(0);
  const { accountData, loading, error } = useWalrusAccount(page);
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = async (addr: string) => {
    try {
      await navigator.clipboard.writeText(addr);
      setCopied(addr);
      setTimeout(() => setCopied(null), 1000);
    } catch {
      alert("Failed to copy");
    }
  };

  const handleDownloadCSV = () => {
    if (!accountData?.content) return;

    const headers = ["Address", "Balance", "Blobs", "Events", "First Seen", "Last Seen"];
    const rows = accountData.content.map((acc: any) => [
      acc.address,
      acc.balance,
      acc.blobs,
      acc.events,
      new Date(acc.firstSeen).toLocaleString(),
      new Date(acc.lastSeen).toLocaleString(),
    ]);

    const csvContent = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `walrus_accounts_page_${page + 1}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (error) return <Text color="red">{error.message}</Text>;
  if (!accountData?.content) return <Text>No accounts found.</Text>;

  return (
    <main className="p-6 space-y-6 -mb-15 text-[#292929]">
      <CardComponent>
        <Flex justify="between" className="mb-4" align="center">
          <Text size="5" weight="bold">
            Walrus Accounts
          </Text>
          <Button className="bg-[#292929] text-[#292929]" onClick={handleDownloadCSV}>
            <Download size={16} /> Download
          </Button>
        </Flex>

        {/* Table */}
        <Table.Root className={`border border-[#e8e8e8] rounded-[10px] text-[#292929] ${loading ? "opacity-50 transition-opacity duration-300" : ""}`}>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell className="text-[#292929]"  >Address</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell className="text-[#292929]">Balance</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell className="text-[#292929]">Blobs</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell className="text-[#292929]">Events</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell className="text-[#292929]">First Seen</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell className="text-[#292929]">Last Seen</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {accountData.content.map((acc: any, idx: number) => (
              <Table.Row key={idx}>
                <Table.Cell className="text-[#292929]">
                  <Flex gap="2" align="center">
                    <Text className="truncate max-w-[220px]">{acc.address}</Text>
                    <IconButton size="1" onClick={() => handleCopy(acc.address)}>
                      {copied === acc.address ? <Check size={14} color="green" /> : <Copy size={14} />}
                    </IconButton>
                  </Flex>
                </Table.Cell>
                <Table.Cell className="text-[#292929]">{Number(acc.balance).toLocaleString()}</Table.Cell>
                <Table.Cell className="text-[#292929]">{acc.blobs}</Table.Cell>
                <Table.Cell className="text-[#292929]">{acc.events}</Table.Cell>
                <Table.Cell className="text-[#292929]">{new Date(acc.firstSeen).toLocaleString()}</Table.Cell>
                <Table.Cell className="text-[#292929]">{new Date(acc.lastSeen).toLocaleString()}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>

        {/* Loading indicator */}
        {loading && (
          <Flex justify="center" mt="2">
            <Spinner size="2" />
            <Text size="3" className="text-[#292929]" className="ml-2 text-[#292929]">
              Loading new page...
            </Text>
          </Flex>
        )}

        {/* Pagination */}
        <Flex gap="3" justify="end" mt="4">
          <Button disabled={page === 0 || loading} onClick={() => setPage((p) => p - 1)}>
            Previous
          </Button>
          <Text>Page {page + 1}</Text>
          <Button
          className="bg-[#292929] text-[#292929]"
            onClick={() => setPage((p) => p + 1)}
            disabled={accountData.content.length < 20 || loading}
          >
            Next
          </Button>
        </Flex>
      </CardComponent>
    </main>
  );
}

export default Account;
