import { Layout } from "../../components/layout/Layout";
import { useCollections } from "../../hooks/useNFTs/useCollections";
import { Table, Text, Avatar, Flex, Box, Spinner } from "@radix-ui/themes";
import CardComponent from "@/components/cards";

function CollectionList() {
  const { collections, topCollections, loading } = useCollections();

  if (loading) {
    return (
      <Layout>
        <main className="p-6 space-y-8">
          <CardComponent>
            <h2 className="text-2xl font-semibold text-[#292929]">
              NFTs - Collection NFT List
            </h2>
            <p className="text-[#292929] mt-1">Browse NFTs by collection.</p>
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
            NFTs - Collection NFT List
          </h2>
          <p className="text-[#292929] mt-1">Browse NFTs by collection. </p>
        </CardComponent>

        {/* Top Collections Table */}
        <CardComponent>
          <div className="p-4">
            <h3 className="text-xl font-semibold text-[#292929] mb-4">
              Top Collections by Volume
            </h3>
          </div>
          <Table.Root className="border border-[#e8e8e8] rounded-[10px] overflow-hidden">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell className="text-[#292929]">
                  Rank
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell className="text-[#292929]">
                  Collection
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell className="text-[#292929]">
                  Type
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell className="text-[#292929]">
                  Volume (SUI)
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell className="text-[#292929]">
                  Status
                </Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {topCollections.map((collection, index) => (
                <Table.Row key={index}>
                  <Table.Cell>
                    <Text className="text-[#292929] font-medium">
                      #{index + 1}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Flex align="center" gap="3">
                      <Avatar
                        src={collection.imgUrl}
                        fallback={collection.name?.[0] || "N"}
                        size="2"
                      />
                      <Box>
                        <Text weight="medium" className="text-[#292929]">
                          {collection.name}
                        </Text>
                      </Box>
                    </Flex>
                  </Table.Cell>
                  <Table.Cell>
                    <Text size="1" className="text-[#292929]">
                      {collection.type
                        ? `${collection.type.slice(0, 30)}...`
                        : "Unknown"}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text className="text-[#292929] font-medium">
                      {collection.volume
                        ? collection.volume.toLocaleString(undefined, {
                            maximumFractionDigits: 2,
                          })
                        : "0"}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text
                      size="2"
                      className={
                        collection.isIndexed
                          ? "text-green-400"
                          : "text-[#292929]"
                      }
                    >
                      {collection.isIndexed ? "Indexed" : "Not Indexed"}
                    </Text>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </CardComponent>

        {/* All Collections Table */}
        <CardComponent>
          <div className="p-4">
            <h3 className="text-xl font-semibold text-[#292929] mb-4">
              All Collections
            </h3>
          </div>
          <Table.Root className="border border-[#e8e8e8] rounded-[10px] overflow-hidden">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell className="text-[#292929]">
                  Collection
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell className="text-[#292929]">
                  Description
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell className="text-[#292929]">
                  NFTs Count
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell className="text-[#292929]">
                  Holders
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell className="text-[#292929]">
                  Latest Price
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell className="text-[#292929]">
                  Volume
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell className="text-[#292929]">
                  Creator
                </Table.ColumnHeaderCell>
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
                        <Text weight="medium" className="text-[#292929]">
                          {collection.collectionName}
                        </Text>
                        <Text size="1" className="text-[#292929]">
                          {collection.collectionType?.slice(0, 20)}...
                        </Text>
                      </Box>
                    </Flex>
                  </Table.Cell>
                  <Table.Cell>
                    <Text size="2" className="text-[#292929]">
                      {collection.description
                        ? collection.description.length > 100
                          ? collection.description.slice(0, 100) + "..."
                          : collection.description
                        : "No description"}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text className="text-[#292929]">
                      {collection.nftsCount || 0}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text className="text-[#292929]">
                      {collection.holdersCount || 0}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text className="text-[#292929]">
                      {collection.latestPrice
                        ? `${collection.latestPrice} SUI`
                        : "N/A"}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text className="text-[#292929]">
                      {collection.volume ? `${collection.volume} SUI` : "N/A"}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text size="1" className="text-[#292929]">
                      {collection.creatorAddress
                        ? `${collection.creatorAddress.slice(0, 8)}...${collection.creatorAddress.slice(-6)}`
                        : "Unknown"}
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

export default CollectionList;
