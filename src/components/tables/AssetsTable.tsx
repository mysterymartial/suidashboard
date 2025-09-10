import { Table, Flex, Avatar, Box, Text } from "@radix-ui/themes";
import CardComponent from "../cards";

export function AssetsTable({ assets }: { assets: any[] }) {
  return (
    <CardComponent>
      {/* <Heading className="text-[#292929]" size="4" mb="3">
        All Assets
      </Heading> */}
      <Table.Root className="border border-[#e8e8e8] rounded-[10px]">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell className="text-[#292929]">
              #
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="text-[#292929]">
              Name
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="text-[#292929]">
              Protocol
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="text-[#292929]">
              7D
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="text-[#292929]">
              30D
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="text-[#292929]">
              Market Cap
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="text-[#292929]">
              Asset Class
            </Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {assets.map((asset: any, i: number) => (
            <Table.Row key={i}>
              <Table.Cell className="text-[#292929]">{i + 1}</Table.Cell>
              <Table.Cell className="text-[#292929]">
                <Flex align="center" gap="2">
                  <Avatar fallback={asset.symbol[0]} size="1" />
                  <Box>
                    <Text className="text-[#292929]">{asset.name}</Text>
                    <Text size="1" className="text-[#292929]">
                      {asset.symbol}
                    </Text>
                  </Box>
                </Flex>
              </Table.Cell>
              <Table.Cell className="text-[#292929]">
                {asset.protocol}
              </Table.Cell>
              <Table.Cell className="text-[#292929]">
                {asset.change7d}
              </Table.Cell>
              <Table.Cell className="text-[#292929]">
                {asset.change30d}
              </Table.Cell>
              <Table.Cell className="text-[#292929]">
                {asset.marketCap}
              </Table.Cell>
              <Table.Cell className="text-[#292929]">
                {asset.assetClass}
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </CardComponent>
  );
}
