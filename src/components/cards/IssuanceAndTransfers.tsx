import { Flex, Heading, Box, Text, Table } from "@radix-ui/themes";
import CardComponent from "./index";

export function IssuanceAndTransfers() {
  return (
    <Flex gap="6" mt="6">
      <CardComponent>
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
          <Text className="text-[#292929]">[Bar Chart Placeholder]</Text>
        </Box>
      </CardComponent>
      <CardComponent>
        <Heading size="4" mb="2">
          Top Transfers
        </Heading>
        <Table.Root className="border border-[#e8e8e8] rounded-[10px]">
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
      </CardComponent>
    </Flex>
  );
}
