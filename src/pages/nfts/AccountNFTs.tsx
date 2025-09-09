import React from "react";
import { Layout } from "../../components/layout/Layout";
import { useNfts } from "../../hooks/useNFTs/useNfts";
import { Table, Card, Text, Avatar, Flex, Box, Spinner, Badge } from "@radix-ui/themes";
import { Skeleton, TableRowSkeleton } from "../../components/ui/Skeleton";

function AccountNFTs() {

  const { nft, nftCount, loading } = useNfts()

  if (loading) {
    return (
      <Layout>
        <main className="p-6 space-y-8">
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-sm">
            <Skeleton height="2rem" width="200px" className="mb-2" />
            <Skeleton height="1rem" width="150px" />
          </div>
          
          <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
            <Table.Root>
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeaderCell className="text-white">NFT</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell className="text-white">Collection</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell className="text-white">Type</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell className="text-white">Object ID</Table.ColumnHeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {Array.from({ length: 12 }).map((_, index) => (
                  <TableRowSkeleton key={index} columns={4} />
                ))}
              </Table.Body>
            </Table.Root>
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
            NFTs - All NFTs
          </h2>
          <p className="text-gray-300 mt-1">
            All NFTs List. Total NFTs: {nftCount || 0}
          </p>
        </div>
        
        {/* All NFTs Table */}
        <Card>
          <div className="p-4">
            <h3 className="text-xl font-semibold text-white mb-4">Recent NFTs</h3>
          </div>
          <Table.Root variant="surface" className="rounded-xl overflow-hidden">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell className="text-white">NFT</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell className="text-white">ID</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell className="text-white">Type</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell className="text-white">Owner</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell className="text-white">Owner Type</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell className="text-white">Version</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell className="text-white">Created</Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {nft.map((nftItem, index) => (
                <Table.Row key={index}>
                  <Table.Cell>
                    <Flex align="center" gap="3">
                      <Avatar 
                        src={nftItem.imgUrl} 
                        fallback={nftItem.objectName?.[0] || "N"} 
                        size="2" 
                      />
                      <Box>
                        <Text weight="medium" className="text-white">
                          {nftItem.objectName || "Unnamed NFT"}
                        </Text>
                        <Text size="1" color="gray">
                          {nftItem.latestTx ? `Tx: ${nftItem.latestTx.slice(0, 8)}...` : "No recent tx"}
                        </Text>
                      </Box>
                    </Flex>
                  </Table.Cell>
                  <Table.Cell>
                    <Text size="1" className="text-gray-300">
                      {nftItem.id ? 
                        `${nftItem.id.slice(0, 8)}...${nftItem.id.slice(-6)}` : 
                        "Unknown"
                      }
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Badge color="blue" variant="soft">
                      {nftItem.objectType || "NFT"}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>
                    <Text size="1" className="text-gray-300">
                      {nftItem.ownerAddress ? 
                        `${nftItem.ownerAddress.slice(0, 8)}...${nftItem.ownerAddress.slice(-6)}` : 
                        "Unknown"
                      }
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Badge color={nftItem.ownerType === "ACCOUNT" ? "green" : "orange"} variant="soft">
                      {nftItem.ownerType || "UNKNOWN"}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>
                    <Text className="text-white">
                      {nftItem.version ? nftItem.version.toLocaleString() : "0"}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text size="2" className="text-gray-300">
                      {nftItem.createTimestamp ? 
                        new Date(nftItem.createTimestamp).toLocaleDateString() : 
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

export default AccountNFTs;
