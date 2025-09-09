import React from "react";
import { Layout } from "../../components/layout/Layout";
import { useSuiBlocks } from "../../hooks/useSui/useSuiBlocks";
import { Table, Card, Text, Spinner, Badge } from "@radix-ui/themes";

function BlockProduction() {
  const { checkpoint, transactionBlock, loading, error } = useSuiBlocks();

  if (loading) {
    return (
      <Layout>
        <main className="p-6 space-y-8">
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-sm">
            <h2 className="text-2xl font-semibold text-white">
              Sui - Block Production
            </h2>
            <p className="text-gray-300 mt-1">
              Block times, production rates and related metrics.
            </p>
          </div>
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
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-sm">
            <h2 className="text-2xl font-semibold text-white">
              Sui - Block Production
            </h2>
            <p className="text-gray-300 mt-1">
              Block times, production rates and related metrics.
            </p>
          </div>
          <div className="bg-red-900/20 border border-red-700 rounded-xl p-6">
            <Text color="red">Error loading checkpoint data: {error.message}</Text>
          </div>
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
      case 'SUCCESS': return 'green';
      case 'FAILURE': return 'red';
      case 'ABORT': return 'orange';
      default: return 'gray';
    }
  };

  return (
    <Layout>
      <main className="p-6 space-y-8">
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-sm">
          <h2 className="text-2xl font-semibold text-white">
            Sui - Block Production
          </h2>
          <p className="text-gray-300 mt-1">
            Block times, production rates and related metrics.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <Card>
            <div className="p-4 sm:p-6">
              <div className="text-center">
                <p className="text-sm font-medium text-gray-400 mb-2">Total Checkpoints</p>
                <p className="text-xl sm:text-2xl font-bold text-white">
                  {(187912932).toLocaleString()}
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-4 sm:p-6">
              <div className="text-center">
                <p className="text-sm font-medium text-gray-400 mb-2">Total Transaction Blocks</p>
                <p className="text-xl sm:text-2xl font-bold text-white">
                  {(4095278873).toLocaleString()}
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-4 sm:p-6">
              <div className="text-center">
                <p className="text-sm font-medium text-gray-400 mb-2">TTotal Transactions</p>
                <p className="text-xl sm:text-2xl font-bold text-white">
                  {(11801389140).toLocaleString()}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Checkpoints Table */}
        <Card>
          <div className="p-4">
            <h3 className="text-xl font-semibold text-white mb-4">Recent Checkpoints</h3>
          </div>
          <Table.Root variant="surface" className="rounded-xl overflow-hidden">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell className="text-white">Sequence</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell className="text-white">Digest</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell className="text-white">Epoch</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell className="text-white">Tx Count</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell className="text-white">Timestamp</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell className="text-white">Storage Cost</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell className="text-white">Storage Rebate</Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {checkpoint.map((cp, index) => (
                <Table.Row key={cp.sequence}>
                  <Table.Cell>
                    <Badge color="blue" variant="soft">
                      {cp.sequence.toLocaleString()}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>
                    <Text className="font-mono text-sm">
                      {formatDigest(cp.digest)}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text>{cp.epoch}</Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Badge color="green" variant="soft">
                      {cp.txCount}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>
                    <Text className="text-sm">
                      {formatTimestamp(cp.timestamp)}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text>
                      {cp.storageCost ? cp.storageCost.toLocaleString() : 'N/A'}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text>
                      {cp.storageRebate ? cp.storageRebate.toLocaleString() : 'N/A'}
                    </Text>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Card>

        {/* Transaction Blocks Table */}
        <Card>
          <div className="p-4">
            <h3 className="text-xl font-semibold text-white mb-4">Recent Transaction Blocks</h3>
          </div>
          <Table.Root variant="surface" className="rounded-xl overflow-hidden">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell className="text-white">Tx Hash</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell className="text-white">Type</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell className="text-white">Status</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell className="text-white">Sender</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell className="text-white">Fee (SUI)</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell className="text-white">Functions</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell className="text-white">Timestamp</Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {transactionBlock.map((tx, index) => (
                <Table.Row key={tx.txHash}>
                  <Table.Cell>
                    <Text className="font-mono text-sm">
                      {formatDigest(tx.txHash)}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Badge color="blue" variant="soft">
                      {tx.txType}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>
                    <Badge color={getStatusColor(tx.txStatus)} variant="soft">
                      {tx.txStatus}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>
                    <Text className="font-mono text-sm">
                      {formatAddress(tx.senderAddress)}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text>
                      {tx.fee.toFixed(6)}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text className="text-sm">
                      {tx.functions ? `${tx.functions.length} functions` : 'N/A'}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text className="text-sm">
                      {formatTimestamp(tx.timestamp)}
                    </Text>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Card>
      </main>
    </Layout>
  );
}

export default BlockProduction;
