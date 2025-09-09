import { Card, Heading, Table } from "@radix-ui/themes";

export function LeagueTable({ networks }) {
  return (
    <Card style={{ flex: 2 }}>
      <Heading size="4" mb="3">
        RWA League Table
      </Heading>
      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>#</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Network</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>RWA Count</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Total Value</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>30D%</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Market Share</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {networks.map((net, i) => (
            <Table.Row key={i}>
              <Table.Cell>{i + 1}</Table.Cell>
              <Table.Cell>{net.name}</Table.Cell>
              <Table.Cell>{net.count}</Table.Cell>
              <Table.Cell>{net.value}</Table.Cell>
              <Table.Cell>{net.change30d}</Table.Cell>
              <Table.Cell>{net.share}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Card>
  );
}
