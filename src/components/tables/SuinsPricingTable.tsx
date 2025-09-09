import React from "react";
import { Table, Text } from "@radix-ui/themes";

interface PriceRow {
  domainLengthFrom: number;
  domainLengthTo: number;
  priceMist: number;
  priceUSDC: number;
}

export function SuinsPricingTable({ prices }: { prices: PriceRow[] }) {
  return (
    <Table.Root variant="surface" className="rounded-xl overflow-hidden">
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeaderCell className="text-white">Domain Length</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell className="text-white">Price (MIST)</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell className="text-white">Price (USDC)</Table.ColumnHeaderCell>
        </Table.Row>
      </Table.Header>

      <Table.Body>
        {prices.map((row, idx) => (
          <Table.Row key={idx}>
            <Table.Cell>
              <Text>{row.domainLengthFrom === row.domainLengthTo 
                ? row.domainLengthFrom 
                : `${row.domainLengthFrom} – ${row.domainLengthTo}`}</Text>
            </Table.Cell>
            <Table.Cell>
              <Text>{row.priceMist.toLocaleString()}</Text>
            </Table.Cell>
            <Table.Cell>
              <Text>${row.priceUSDC.toFixed(2)}</Text>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
}
