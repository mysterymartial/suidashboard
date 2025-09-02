import { Card, Heading, Table, Flex, Avatar, Box, Text } from "@radix-ui/themes";

export function AssetsTable({ assets }) {
  return (
    <Card mb="6">
      <Heading size="4" mb="3">
        All Assets
      </Heading>
      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>#</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Protocol</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>7D</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>30D</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Market Cap</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Asset Class</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {assets.map((asset, i) => (
            <Table.Row key={i}>
              <Table.Cell>{i + 1}</Table.Cell>
              <Table.Cell>
                <Flex align="center" gap="2">
                  <Avatar fallback={asset.symbol[0]} size="1" />
                  <Box>
                    <Text>{asset.name}</Text>
                    <Text size="1" color="gray">
                      {asset.symbol}
                    </Text>
                  </Box>
                </Flex>
              </Table.Cell>
              <Table.Cell>{asset.protocol}</Table.Cell>
              <Table.Cell>{asset.change7d}</Table.Cell>
              <Table.Cell>{asset.change30d}</Table.Cell>
              <Table.Cell>{asset.marketCap}</Table.Cell>
              <Table.Cell>{asset.assetClass}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Card>
  );
}
