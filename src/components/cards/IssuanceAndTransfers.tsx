import { Flex, Card, Heading, Box, Text, Table } from "@radix-ui/themes";

export function IssuanceAndTransfers() {
  return (
    <Flex gap="6" mt="6">
      <Card style={{ flex: 2 }}>
        <Heading size="4" mb="2">
          New Issuance Volume
        </Heading>
        <Box
          style={{
            height: 220,
            background: "#f1f5f9",
            borderRadius: 8,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text color="gray">[Bar Chart Placeholder]</Text>
        </Box>
      </Card>
      <Card style={{ flex: 1 }}>
        <Heading size="4" mb="2">
          Top Transfers
        </Heading>
        <Table.Root>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>Asset</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>USD Amount</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Date</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Network</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <Table.Row>
              <Table.Cell>USYC</Table.Cell>
              <Table.Cell>$99,977</Table.Cell>
              <Table.Cell>08/27/25</Table.Cell>
              <Table.Cell>Ethereum</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table.Root>
      </Card>
    </Flex>
  );
}
