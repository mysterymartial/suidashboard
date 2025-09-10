import { Table, Badge, Heading, Text, Flex } from "@radix-ui/themes";
// @ts-ignore
import { Skeleton, TableRowSkeleton } from "../ui/Skeleton";
import CardComponent from "../cards";

interface Pool {
  id: number;
  name: string;
  tokenA: string;
  tokenB: string;
  volume24h: string;
  tvl: string;
  apr: string;
  platform: string;
}

interface PoolsTableProps {
  pools: Pool[];
  loading?: boolean;
}

export function PoolsTable({ pools, loading }: PoolsTableProps) {
  if (loading) {
    return (
      <CardComponent>
        <Flex direction="column" gap="4" p="6">
          <Flex justify="between" align="center">
            <Heading size="4" className="text-[#292929]">
              Top Liquidity Pools
            </Heading>
            <Skeleton height="1rem" width="300px" />
          </Flex>

          <Table.Root className="w-full border border-[#e8e8e8] rounded-[10px]">
            <Table.Header>
              <Table.Row className="border border-[#DCDCDC]">
                <Table.ColumnHeaderCell className="text-[#292929] font-medium py-3">
                  Pool
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell className="text-[#292929] font-medium py-3">
                  Platform
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell className="text-[#292929] font-medium py-3">
                  24h Volume
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell className="text-[#292929] font-medium py-3">
                  TVL
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell className="text-[#292929] font-medium py-3">
                  APR
                </Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {Array.from({ length: 10 }).map((_, index) => (
                <TableRowSkeleton key={index} columns={5} />
              ))}
            </Table.Body>
          </Table.Root>
        </Flex>
      </CardComponent>
    );
  }

  return (
    <CardComponent>
      <Flex direction="column" gap="4" p="6">
        <Flex justify="between" align="center">
          <Heading size="4" className="text-[#292929]">
            Top Liquidity Pools
          </Heading>
          <Text size="2" className="text-[#292929]">
            Top 20 pools by volume from various DEXs in the Sui ecosystem
          </Text>
        </Flex>

        <Table.Root className="w-full border border-[#e8e8e8] rounded-[10px]">
          <Table.Header>
            <Table.Row className="border border-[#DCDCDC]">
              <Table.ColumnHeaderCell className="text-[#292929] font-medium py-3">
                Pool
              </Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell className="text-[#292929] font-medium py-3">
                Platform
              </Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell className="text-[#292929] font-medium py-3">
                24h Volume
              </Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell className="text-[#292929] font-medium py-3">
                TVL
              </Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell className="text-[#292929] font-medium py-3">
                APR
              </Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {pools.map((pool) => (
              <Table.Row
                key={pool.id}
                className="border border-[#DCDCDC] hover:bg-gray-100"
              >
                <Table.Cell className="py-4">
                  <Flex direction="column" gap="1">
                    <Text weight="medium" className="text-[#292929]">
                      {pool.name}
                    </Text>
                    <Text size="1" className="text-[#292929]">
                      {pool.tokenA} • {pool.tokenB}
                    </Text>
                  </Flex>
                </Table.Cell>

                <Table.Cell className="py-4">
                  <Badge
                    variant="soft"
                    className="bg-blue-500/20 text-[#292929] border-blue-500/30"
                  >
                    {pool.platform}
                  </Badge>
                </Table.Cell>

                <Table.Cell className="py-4">
                  <Text weight="medium" className="text-[#292929]">
                    {pool.volume24h}
                  </Text>
                </Table.Cell>

                <Table.Cell className="py-4">
                  <Text weight="medium" className="text-[#292929]">
                    {pool.tvl}
                  </Text>
                </Table.Cell>

                <Table.Cell className="py-4">
                  <Badge
                    variant="soft"
                    className="bg-green-500/20 text-green-300 border-green-500/30"
                  >
                    {pool.apr}
                  </Badge>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>

        {pools.length === 0 && !loading && (
          <Flex justify="center" py="8">
            <Text className="text-[#292929]">No pools data available</Text>
          </Flex>
        )}
      </Flex>
    </CardComponent>
  );
}
