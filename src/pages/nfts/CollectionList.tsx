import React from "react";
import { Layout } from "../../components/layout/Layout";
import { useCollections } from "../../hooks/useNFTs/useCollections";
import { Table, Card, Text, Avatar, Flex, Box, Spinner } from "@radix-ui/themes";

function CollectionList() {

  const {collections, topCollections, loading} = useCollections()

  if (loading) {
    return (
      <Layout>
        <main className="p-6 space-y-8">
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-sm">
            <h2 className="text-2xl font-semibold text-white">
              NFTs - Collection NFT List
            </h2>
            <p className="text-gray-300 mt-1">Browse NFTs by collection.</p>
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
            NFTs - Collection NFT List
          </h2>
          <p className="text-gray-300 mt-1">Browse NFTs by collection.</p>
        </div>
        
        {/* Top Collections Table */}
        <Card>
          <div className="p-4">
            <h3 className="text-xl font-semibold text-white mb-4">Top Collections by Volume</h3>
          </div>
          <Table.Root variant="surface" className="rounded-xl overflow-hidden">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell className="text-white">Rank</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell className="text-white">Collection</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell className="text-white">Type</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell className="text-white">Volume (SUI)</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell className="text-white">Status</Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {topCollections.map((collection, index) => (
                <Table.Row key={index}>
                  <Table.Cell>
                    <Text className="text-white font-medium">#{index + 1}</Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Flex align="center" gap="3">
                      <Avatar 
                        src={collection.imgUrl} 
                        fallback={collection.name?.[0] || "N"} 
                        size="2" 
                      />
                      <Box>
                        <Text weight="medium" className="text-white">
                          {collection.name}
                        </Text>
                      </Box>
                    </Flex>
                  </Table.Cell>
                  <Table.Cell>
                    <Text size="1" className="text-gray-300">
                      {collection.type ? 
                        `${collection.type.slice(0, 30)}...` : 
                        "Unknown"
                      }
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text className="text-white font-medium">
                      {collection.volume ? collection.volume.toLocaleString(undefined, {maximumFractionDigits: 2}) : "0"}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text size="2" className={collection.isIndexed ? "text-green-400" : "text-gray-400"}>
                      {collection.isIndexed ? "Indexed" : "Not Indexed"}
                    </Text>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Card>

        {/* All Collections Table */}
        <Card>
          <div className="p-4">
            <h3 className="text-xl font-semibold text-white mb-4">All Collections</h3>
          </div>
          <Table.Root variant="surface" className="rounded-xl overflow-hidden">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell className="text-white">Collection</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell className="text-white">Description</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell className="text-white">NFTs Count</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell className="text-white">Holders</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell className="text-white">Latest Price</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell className="text-white">Volume</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell className="text-white">Creator</Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {collections.map((collection, index) => (
                <Table.Row key={index}>
                  <Table.Cell>
                    <Flex align="center" gap="3">
                      <Avatar 
                        src={collection.collectionImg} 
                        fallback={collection.collectionName?.[0] || "N"} 
                        size="2" 
                      />
                      <Box>
                        <Text weight="medium" className="text-white">
                          {collection.collectionName}
                        </Text>
                        <Text size="1" color="gray">
                          {collection.collectionType?.slice(0, 20)}...
                        </Text>
                      </Box>
                    </Flex>
                  </Table.Cell>
                  <Table.Cell>
                    <Text size="2" className="text-gray-300">
                      {collection.description ? 
                        (collection.description.length > 100 ? 
                          collection.description.slice(0, 100) + "..." : 
                          collection.description
                        ) : "No description"
                      }
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text className="text-white">{collection.nftsCount || 0}</Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text className="text-white">{collection.holdersCount || 0}</Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text className="text-white">
                      {collection.latestPrice ? `${collection.latestPrice} SUI` : "N/A"}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text className="text-white">
                      {collection.volume ? `${collection.volume} SUI` : "N/A"}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text size="1" className="text-gray-300">
                      {collection.creatorAddress ? 
                        `${collection.creatorAddress.slice(0, 8)}...${collection.creatorAddress.slice(-6)}` : 
                        "Unknown"
                      }
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

export default CollectionList;
