import React from "react";
import { Layout } from "../../components/layout/Layout";
import { useMarketPlace } from "../../hooks/useNFTs/useMarketPlace";
import { Table, Text, Avatar, Flex, Box, Spinner } from "@radix-ui/themes";
import CardComponent from "@/components/cards";

function TransfersSales() {
  const { marketplace, topMarketplace, loading } = useMarketPlace();

  if (loading) {
    return (
      <Layout>
        <main className="p-6 space-y-8">
          <CardComponent>
            <h2 className="text-2xl font-semibold text-[#292929]">
              NFTs - Marketplace
            </h2>
            <p className="text-[#292929] mt-1">
              Marketplace of all NFTs collections.
            </p>
          </CardComponent>
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
        <CardComponent>
          <h2 className="text-2xl font-semibold text-[#292929]">
            NFTs - Marketplace
          </h2>
          <p className="text-[#292929] mt-1">
            Marketplace of all NFTs collections.
          </p>
        </CardComponent>

        {/* Top Marketplaces Table */}
        <CardComponent>
          <div className="p-4">
            <h3 className="text-xl font-semibold text-[#292929] mb-4">
              Top Marketplaces by Volume
            </h3>
          </div>
          <Table.Root className="border border-[#e8e8e8] rounded-[10px] overflow-hidden">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell className="text-[#292929]">
                  Rank
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell className="text-[#292929]">
                  Marketplace
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell className="text-[#292929]">
                  Volume (SUI)
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell className="text-[#292929]">
                  Transactions
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell className="text-[#292929]">
                  Listed NFTs
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell className="text-[#292929]">
                  Website
                </Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {topMarketplace.map((marketplace, index) => (
                <Table.Row key={index}>
                  <Table.Cell>
                    <Text className="text-[#292929] font-medium">
                      #{index + 1}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Flex align="center" gap="3">
                      <Avatar
                        src={marketplace.packageImg || marketplace.imgUrl}
                        fallback={marketplace.name?.[0] || "M"}
                        size="2"
                      />
                      <Box>
                        <Text weight="medium" className="text-[#292929]">
                          {marketplace.name}
                        </Text>
                        <Text size="1" className="text-[#292929]">
                          {marketplace.packageName || marketplace.projectName}
                        </Text>
                      </Box>
                    </Flex>
                  </Table.Cell>
                  <Table.Cell>
                    <Text className="text-[#292929] font-medium">
                      {marketplace.volume
                        ? marketplace.volume.toLocaleString(undefined, {
                            maximumFractionDigits: 2,
                          })
                        : "0"}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text className="text-[#292929]">
                      {marketplace.txsCount
                        ? marketplace.txsCount.toLocaleString()
                        : "0"}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text className="text-[#292929]">
                      {marketplace.listedNftsCount
                        ? marketplace.listedNftsCount.toLocaleString()
                        : "0"}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    {marketplace.socialWebsite ? (
                      <a
                        href={marketplace.socialWebsite}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#292929] hover:text-[#292929] underline"
                      >
                        <Text size="1">Visit</Text>
                      </a>
                    ) : (
                      <Text size="1" className="text-[#292929]">
                        N/A
                      </Text>
                    )}
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </CardComponent>

        {/* All Marketplaces Table */}
        <CardComponent>
          <div className="p-4">
            <h3 className="text-xl font-semibold text-[#292929] mb-4">
              All Marketplaces
            </h3>
          </div>
          <Table.Root className="border border-[#e8e8e8] rounded-[10px] overflow-hidden">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell className="text-[#292929]">
                  Marketplace
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell className="text-[#292929]">
                  Package ID
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell className="text-[#292929]">
                  Volume (SUI)
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell className="text-[#292929]">
                  Transactions
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell className="text-[#292929]">
                  Listed NFTs
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell className="text-[#292929]">
                  Period
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell className="text-[#292929]">
                  Website
                </Table.ColumnHeaderCell>
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
                        <Text weight="medium" className="text-[#292929]">
                          {mp.name}
                        </Text>
                        <Text size="1" className="text-[#292929]">
                          {mp.packageName || mp.projectName}
                        </Text>
                      </Box>
                    </Flex>
                  </Table.Cell>
                  <Table.Cell>
                    <Text size="1" className="text-[#292929]">
                      {mp.packageId
                        ? `${mp.packageId.slice(0, 8)}...${mp.packageId.slice(-6)}`
                        : "Unknown"}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text className="text-[#292929] font-medium">
                      {mp.volume
                        ? mp.volume.toLocaleString(undefined, {
                            maximumFractionDigits: 2,
                          })
                        : "0"}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text className="text-[#292929]">
                      {mp.txsCount ? mp.txsCount.toLocaleString() : "0"}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text className="text-[#292929]">
                      {mp.listedNftsCount
                        ? mp.listedNftsCount.toLocaleString()
                        : "0"}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text size="2" className="text-[#292929]">
                      {mp.period || "DAY"}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    {mp.socialWebsite ? (
                      <a
                        href={mp.socialWebsite}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#292929] hover:text-[#292929] underline"
                      >
                        <Text size="1">Visit</Text>
                      </a>
                    ) : (
                      <Text size="1" className="text-[#292929]">
                        N/A
                      </Text>
                    )}
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

export default TransfersSales;
