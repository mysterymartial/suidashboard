import React from "react";
import { Layout } from "../../components/layout/Layout";
import { useMarketPlace } from "../../hooks/useNFTs/useMarketPlace";
import { Table, Card, Text, Avatar, Flex, Box, Spinner } from "@radix-ui/themes";

function TransfersSales() {

  const {marketplace, topMarketplace, loading} = useMarketPlace()

  if (loading) {
    return (
      <Layout>
        <main className="p-6 space-y-8">
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-sm">
            <h2 className="text-2xl font-semibold text-white">
              NFTs - Marketplace
            </h2>
            <p className="text-gray-300 mt-1">
              Marketplace of all NFTs collections.
            </p>
          </div>
          <div className="flex justify-center items-center py-12">
            <Spinner size="3" />
          </div>
        </main>
      </Layout>
    );
  }

  return (
    <Layout>
      <main className="p-6 space-y-8">
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-sm">
          <h2 className="text-2xl font-semibold text-white">
            NFTs - Marketplace
          </h2>
          <p className="text-gray-300 mt-1">
            Marketplace of all NFTs collections.
          </p>
        </div>
        
        {/* Top Marketplaces Table */}
        <Card>
          <div className="p-4">
            <h3 className="text-xl font-semibold text-white mb-4">Top Marketplaces by Volume</h3>
          </div>
          <Table.Root variant="surface" className="rounded-xl overflow-hidden">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell className="text-white">Rank</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell className="text-white">Marketplace</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell className="text-white">Volume (SUI)</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell className="text-white">Transactions</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell className="text-white">Listed NFTs</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell className="text-white">Website</Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {topMarketplace.map((marketplace, index) => (
                <Table.Row key={index}>
                  <Table.Cell>
                    <Text className="text-white font-medium">#{index + 1}</Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Flex align="center" gap="3">
                      <Avatar 
                        src={marketplace.packageImg || marketplace.imgUrl} 
                        fallback={marketplace.name?.[0] || "M"} 
                        size="2" 
                      />
                      <Box>
                        <Text weight="medium" className="text-white">
                          {marketplace.name}
                        </Text>
                        <Text size="1" color="gray">
                          {marketplace.packageName || marketplace.projectName}
                        </Text>
                      </Box>
                    </Flex>
                  </Table.Cell>
                  <Table.Cell>
                    <Text className="text-white font-medium">
                      {marketplace.volume ? marketplace.volume.toLocaleString(undefined, {maximumFractionDigits: 2}) : "0"}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text className="text-white">
                      {marketplace.txsCount ? marketplace.txsCount.toLocaleString() : "0"}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text className="text-white">
                      {marketplace.listedNftsCount ? marketplace.listedNftsCount.toLocaleString() : "0"}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    {marketplace.socialWebsite ? (
                      <a 
                        href={marketplace.socialWebsite} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 underline"
                      >
                        <Text size="1">Visit</Text>
                      </a>
                    ) : (
                      <Text size="1" className="text-gray-400">N/A</Text>
                    )}
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Card>

        {/* All Marketplaces Table */}
        <Card>
          <div className="p-4">
            <h3 className="text-xl font-semibold text-white mb-4">All Marketplaces</h3>
          </div>
          <Table.Root variant="surface" className="rounded-xl overflow-hidden">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell className="text-white">Marketplace</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell className="text-white">Package ID</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell className="text-white">Volume (SUI)</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell className="text-white">Transactions</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell className="text-white">Listed NFTs</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell className="text-white">Period</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell className="text-white">Website</Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {marketplace.map((mp, index) => (
                <Table.Row key={index}>
                  <Table.Cell>
                    <Flex align="center" gap="3">
                      <Avatar 
                        src={mp.packageImg || mp.projectImg} 
                        fallback={mp.name?.[0] || "M"} 
                        size="2" 
                      />
                      <Box>
                        <Text weight="medium" className="text-white">
                          {mp.name}
                        </Text>
                        <Text size="1" color="gray">
                          {mp.packageName || mp.projectName}
                        </Text>
                      </Box>
                    </Flex>
                  </Table.Cell>
                  <Table.Cell>
                    <Text size="1" className="text-gray-300">
                      {mp.packageId ? 
                        `${mp.packageId.slice(0, 8)}...${mp.packageId.slice(-6)}` : 
                        "Unknown"
                      }
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text className="text-white font-medium">
                      {mp.volume ? mp.volume.toLocaleString(undefined, {maximumFractionDigits: 2}) : "0"}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text className="text-white">
                      {mp.txsCount ? mp.txsCount.toLocaleString() : "0"}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text className="text-white">
                      {mp.listedNftsCount ? mp.listedNftsCount.toLocaleString() : "0"}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text size="2" className="text-gray-300">
                      {mp.period || "DAY"}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    {mp.socialWebsite ? (
                      <a 
                        href={mp.socialWebsite} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 underline"
                      >
                        <Text size="1">Visit</Text>
                      </a>
                    ) : (
                      <Text size="1" className="text-gray-400">N/A</Text>
                    )}
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

export default TransfersSales;
