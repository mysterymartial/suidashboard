import React, { useState } from "react";
import { Layout } from "../../layout/Layout";
import { useWalrusValidators } from "../../../hooks/useWalrus/useWalrusValidators";
import {
  Table,
  Button,
  Flex,
  Text,
  Card,
  Avatar,
  IconButton,
} from "@radix-ui/themes";
import { Download, Copy, Check } from "lucide-react";

export default function Validators() {
  const [page, setPage] = useState(0);
  const { validatorsData, loading, error } = useWalrusValidators(page);
  const [copied, setCopied] = useState<string | null>(null);

  const totalPages =
    validatorsData?.totalPages ??
    validatorsData?.pageable?.totalPages ??
    undefined;

  const handleCopy = (val: string) => {
    if (!val) return;
    navigator.clipboard.writeText(val);
    setCopied(val);
    setTimeout(() => setCopied(null), 1500);
  };

  const handleDownloadCSV = () => {
    if (!validatorsData?.content) return;
    const headers = [
      "ValidatorName",
      "ValidatorHash",
      "Stake",
      "Commission",
      "NextCommission",
      "State",
      "PoolShare",
      "Weight",
      "PendingStake",
      "PreActiveWithdrawals",
      "PendingShareWithdrawals",
      "OperatorRewards",
      "Operator",
      "NodeCapacity",
      "StoragePrice",
      "WritePrice",
      "ProjectUrl",
      "CommissionReceiver",
      "GovernanceAuthorized",
      "Description",
      "ImageUrl",
    ];

    const rows = validatorsData.content.map((v: any) => [
      v.validatorName ?? "",
      v.validatorHash ?? "",
      v.stake ?? "",
      v.commissionRate ?? "",
      v.nextCommissionRate ?? "",
      v.state ?? "",
      v.poolShare ?? "",
      v.weight ?? "",
      v.pendingStake ?? "",
      v.preActiveWithdrawals ?? "",
      v.pendingShareWithdrawals ?? "",
      v.operatorRewards ?? "",
      v.operator ? "true" : "false",
      v.nodeCapacity ?? "",
      v.storagePrice ?? "",
      v.writePrice ?? "",
      v.projectUrl ?? "",
      v.commissionReceiver ?? "",
      v.governanceAuthorized ?? "",
      (v.description ?? "").replace(/\r?\n|\r/g, " "),
      v.imageUrl ?? "",
    ]);

    const csv = [headers, ...rows]
      .map((r) =>
        r.map((c) => (typeof c === "string" && c.includes(",") ? `"${c}"` : c)).join(",")
      )
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.setAttribute("download", `walrus_validators_page_${page + 1}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };


  if (error) return <Text color="red">{error.message}</Text>;

  if (!validatorsData?.content)
    return <Text>No validators found.</Text>;

  return (
    <main className="p-6 space-y-6">
      <Card className="p-6 space-y-4 border border-gray-700 shadow-sm">
        <Flex justify="between" align="center">
          <Text size="5" weight="bold">
            Walrus Validators
          </Text>

          <Flex gap="2" align="center">
            <Text size="2" color="gray">
              Page {page + 1}
              {typeof totalPages === "number" ? ` / ${totalPages}` : ""}
            </Text>
            <Button variant="soft" onClick={handleDownloadCSV}>
              <Download size={16} /> Download CSV
            </Button>
          </Flex>
        </Flex>

        {/* scroll wrapper (fix) */}
       <Table.Root className="min-w-[1400px]">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell>Validator</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Validator Hash</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Stake</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Commission</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Next Commission</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>State</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Pool Share</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Weight</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Pending Stake</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>PreActive Withdrawals</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Pending Share Withdrawals</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Operator Rewards</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Operator</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Node Capacity</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Storage Price</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Write Price</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Project URL</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Commission Receiver</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Governance Authorized</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Description</Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {validatorsData.content.map((val: any) => (
                <Table.Row key={val.validatorHash}>
                  <Table.Cell>
                    <Flex gap="2" align="center">
                      <Avatar src={val.imageUrl} fallback={val.validatorName?.[0]} />
                      <div>
                        <a
                          href={val.projectUrl || "#"}
                          target="_blank"
                          rel="noreferrer"
                          className="underline"
                        >
                          {val.validatorName}
                        </a>
                        <div className="text-xs text-gray-400">
                          {val.validatorHash?.slice(0, 12)
                            ? `${val.validatorHash?.slice(0, 12)}...`
                            : ""}
                        </div>
                      </div>
                    </Flex>
                  </Table.Cell>

                  <Table.Cell>
                    <Flex align="center" gap="2">
                      <Text className="truncate max-w-[260px]">
                        {val.validatorHash}
                      </Text>
                      <IconButton
                        size="1"
                        variant="soft"
                        onClick={() => handleCopy(val.validatorHash)}
                      >
                        {copied === val.validatorHash ? (
                          <Check size={14} />
                        ) : (
                          <Copy size={14} />
                        )}
                      </IconButton>
                    </Flex>
                  </Table.Cell>

                  <Table.Cell>
                    {Number(val.stake || 0).toLocaleString()}
                  </Table.Cell>
                  <Table.Cell>{val.commissionRate ?? "-"}%</Table.Cell>
                  <Table.Cell>
                    <Text
                      color={
                        val.nextCommissionRate > val.commissionRate
                          ? "red"
                          : val.nextCommissionRate < val.commissionRate
                          ? "green"
                          : "gray"
                      }
                    >
                      {val.nextCommissionRate ?? "-"}%
                    </Text>
                  </Table.Cell>

                  <Table.Cell>{val.state ?? "-"}</Table.Cell>
                  <Table.Cell>{val.poolShare ?? "-"}</Table.Cell>
                  <Table.Cell>{val.weight ?? "-"}</Table.Cell>

                  <Table.Cell>
                    {Number(val.pendingStake || 0).toLocaleString()}
                  </Table.Cell>
                  <Table.Cell>
                    {val.preActiveWithdrawals?.toLocaleString?.() ??
                      val.preActiveWithdrawals ??
                      "-"}
                  </Table.Cell>
                  <Table.Cell>
                    {val.pendingShareWithdrawals?.toLocaleString?.() ??
                      val.pendingShareWithdrawals ??
                      "-"}
                  </Table.Cell>

                  <Table.Cell>
                    {Number(val.operatorRewards || 0).toLocaleString()}
                  </Table.Cell>
                  <Table.Cell>{val.operator ? "Yes" : "No"}</Table.Cell>

                  <Table.Cell>
                    {val.nodeCapacity?.toLocaleString?.() ??
                      val.nodeCapacity ??
                      "-"}
                  </Table.Cell>
                  <Table.Cell>{val.storagePrice ?? "-"}</Table.Cell>
                  <Table.Cell>{val.writePrice ?? "-"}</Table.Cell>

                  <Table.Cell>
                    {val.projectUrl ? (
                      <a
                        href={val.projectUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="underline"
                      >
                        link
                      </a>
                    ) : (
                      "-"
                    )}
                  </Table.Cell>

                  <Table.Cell>
                    <Flex align="center" gap="2">
                      <Text className="truncate max-w-[180px]">
                        {val.commissionReceiver}
                      </Text>
                      {val.commissionReceiver && (
                        <IconButton
                          size="1"
                          variant="soft"
                          onClick={() => handleCopy(val.commissionReceiver)}
                        >
                          {copied === val.commissionReceiver ? (
                            <Check size={14} />
                          ) : (
                            <Copy size={14} />
                          )}
                        </IconButton>
                      )}
                    </Flex>
                  </Table.Cell>

                  <Table.Cell>
                    <Flex align="center" gap="2">
                      <Text className="truncate max-w-[180px]">
                        {val.governanceAuthorized}
                      </Text>
                      {val.governanceAuthorized && (
                        <IconButton
                          size="1"
                          variant="soft"
                          onClick={() => handleCopy(val.governanceAuthorized)}
                        >
                          {copied === val.governanceAuthorized ? (
                            <Check size={14} />
                          ) : (
                            <Copy size={14} />
                          )}
                        </IconButton>
                      )}
                    </Flex>
                  </Table.Cell>

                  <Table.Cell>
                    <Text className="max-w-[400px] block truncate">
                      {val.description ?? "-"}
                    </Text>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>

        {/* Pagination */}
        <Flex gap="3" justify="end" mt="4" align="center">
          <Button disabled={page === 0} onClick={() => setPage((p) => p - 1)}>
            Previous
          </Button>
          <Text>
            Page {page + 1}
            {typeof totalPages === "number" ? ` / ${totalPages}` : ""}
          </Text>
          <Button
            onClick={() => setPage((p) => p + 1)}
            disabled={
              typeof totalPages === "number"
                ? page >= totalPages - 1
                : validatorsData.content.length < 20
            }
          >
            Next
          </Button>
        </Flex>
      </Card>
    </main>
  );
}
