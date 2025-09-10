import { Layout } from "../../components/layout/Layout";
import { useSuiBlocks } from "../../hooks/useSui/useSuiBlocks";
import { Table, Text, Spinner, Badge } from "@radix-ui/themes";
import CardComponent from "@/components/cards";

function BlockProduction() {
  const { checkpoint, transactionBlock, loading, error } = useSuiBlocks();

  if (loading) {
    return (
      <Layout>
        <main className="p-6 space-y-8">
          <CardComponent>
            <h2 className="text-2xl font-semibold text-[#292929]">
              Sui - Block Production
            </h2>
            <p className="text-[#292929] mt-1">
              Block times, production rates and related metrics.
            </p>
          </CardComponent>
          <div className="flex justify-center items-center py-12">
            <Spinner size="3" />
          </div>
        </main>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <main className="p-6 space-y-8">
          <CardComponent>
            <h2 className="text-2xl font-semibold text-[#292929]">
              Sui - Block Production
            </h2>
            <p className="text-[#292929] mt-1">
              Block times, production rates and related metrics.
            </p>
          </CardComponent>
          <CardComponent>
            <Text color="red">
              Error loading checkpoint data: {error.message}
            </Text>
          </CardComponent>
        </main>
      </Layout>
    );
  }

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const formatDigest = (digest: string) => {
    return `${digest.slice(0, 8)}...${digest.slice(-8)}`;
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-6)}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "SUCCESS":
        return "green";
      case "FAILURE":
        return "red";
      case "ABORT":
        return "orange";
      default:
        return "gray";
    }
  };

  return (
    <Layout>
      <main className="p-6 space-y-8">
        <CardComponent>
          <h2 className="text-2xl font-semibold text-[#292929]">
            Sui - Block Production
          </h2>
          <p className="text-[#292929] mt-1">
            Block times, production rates and related metrics.
          </p>
        </CardComponent>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <CardComponent>
            <div className="p-4 sm:p-6">
              <div className="text-center">
                <p className="text-sm font-medium text-[#292929] mb-2">
                  Total Checkpoints
                </p>
                <p className="text-xl sm:text-2xl font-bold text-[#292929]">
                  {(187912932).toLocaleString()}
                </p>
              </div>
            </div>
          </CardComponent>

          <CardComponent>
            <div className="p-4 sm:p-6">
              <div className="text-center">
                <p className="text-sm font-medium text-[#292929] mb-2">
                  Total Transaction Blocks
                </p>
                <p className="text-xl sm:text-2xl font-bold text-[#292929]">
                  {(4095278873).toLocaleString()}
                </p>
              </div>
            </div>
          </CardComponent>

          <CardComponent>
            <div className="p-4 sm:p-6">
              <div className="text-center">
                <p className="text-sm font-medium text-[#292929] mb-2">
                  TTotal Transactions
                </p>
                <p className="text-xl sm:text-2xl font-bold text-[#292929]">
                  {(11801389140).toLocaleString()}
                </p>
              </div>
            </div>
          </CardComponent>
        </div>

        {/* Checkpoints Table */}
        <CardComponent>
          <div className="p-4">
            <h3 className="text-xl font-semibold text-[#292929] mb-4">
              Recent Checkpoints
            </h3>
          </div>
          <Table.Root className="border border-[#e8e8e8] rounded-[10px] overflow-hidden">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell className="text-[#292929]">
                  Sequence
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell className="text-[#292929]">
                  Digest
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell className="text-[#292929]">
                  Epoch
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell className="text-[#292929]">
                  Tx Count
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell className="text-[#292929]">
                  Timestamp
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell className="text-[#292929]">
                  Storage Cost
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell className="text-[#292929]">
                  Storage Rebate
                </Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {checkpoint.map((cp) => (
                <Table.Row key={cp.sequence}>
                  <Table.Cell>
                    <Badge color="blue" variant="soft">
                      {cp.sequence.toLocaleString()}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell className="text-[#292929]">
                    <Text className="font-mono text-sm">
                      {formatDigest(cp.digest)}
                    </Text>
                  </Table.Cell>
                  <Table.Cell className="text-[#292929]">
                    <Text>{cp.epoch}</Text>
                  </Table.Cell>
                  <Table.Cell className="text-[#292929]">
                    <Badge color="green" variant="soft">
                      {cp.txCount}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell className="text-[#292929]">
                    <Text className="text-sm">
                      {formatTimestamp(cp.timestamp)}
                    </Text>
                  </Table.Cell>
                  <Table.Cell className="text-[#292929]">
                    <Text>
                      {cp.storageCost ? cp.storageCost.toLocaleString() : "N/A"}
                    </Text>
                  </Table.Cell>
                  <Table.Cell className="text-[#292929]">
                    <Text>
                      {cp.storageRebate
                        ? cp.storageRebate.toLocaleString()
                        : "N/A"}
                    </Text>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </CardComponent>

        {/* Transaction Blocks Table */}
        <CardComponent>
          <div className="p-4">
            <h3 className="text-xl font-semibold text-[#292929] mb-4">
              Recent Transaction Blocks
            </h3>
          </div>
          <Table.Root className="border border-[#e8e8e8] rounded-[10px] overflow-hidden">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell className="text-[#292929]">
                  Tx Hash
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell className="text-[#292929]">
                  Type
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell className="text-[#292929]">
                  Status
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell className="text-[#292929]">
                  Sender
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell className="text-[#292929]">
                  Fee (SUI)
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell className="text-[#292929]">
                  Functions
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell className="text-[#292929]">
                  Timestamp
                </Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {transactionBlock.map((tx) => (
                <Table.Row key={tx.txHash}>
                  <Table.Cell className="text-[#292929]">
                    <Text className="font-mono text-sm">
                      {formatDigest(tx.txHash)}
                    </Text>
                  </Table.Cell>
                  <Table.Cell className="text-[#292929]">
                    <Badge color="blue" variant="soft">
                      {tx.txType}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell className="text-[#292929]">
                    <Badge color={getStatusColor(tx.txStatus)} variant="soft">
                      {tx.txStatus}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell className="text-[#292929]">
                    <Text className="font-mono text-sm">
                      {formatAddress(tx.senderAddress)}
                    </Text>
                  </Table.Cell>
                  <Table.Cell className="text-[#292929]">
                    <Text>{tx.fee.toFixed(6)}</Text>
                  </Table.Cell>
                  <Table.Cell className="text-[#292929]">
                    <Text className="text-sm">
                      {tx.functions
                        ? `${tx.functions.length} functions`
                        : "N/A"}
                    </Text>
                  </Table.Cell>
                  <Table.Cell className="text-[#292929]">
                    <Text className="text-sm">
                      {formatTimestamp(tx.timestamp)}
                    </Text>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </CardComponent>
      </main>
    </Layout>
  );
}

export default BlockProduction;
