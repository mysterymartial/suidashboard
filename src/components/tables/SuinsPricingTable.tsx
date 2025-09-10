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
    <Table.Root className="border border-[#e8e8e8] rounded-[10px]">
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeaderCell className="text-[#292929]">Domain Length</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell className="text-[#292929]">Price (MIST)</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell className="text-[#292929]">Price (USDC)</Table.ColumnHeaderCell>
        </Table.Row>
      </Table.Header>

      <Table.Body>
        {prices.map((row, idx) => (
          <Table.Row key={idx}>
            <Table.Cell className="text-[#292929]">
              <Text>{row.domainLengthFrom === row.domainLengthTo 
                ? row.domainLengthFrom 
                : `${row.domainLengthFrom} – ${row.domainLengthTo}`}</Text>
            </Table.Cell>
            <Table.Cell className="text-[#292929]">
              <Text>{row.priceMist.toLocaleString()}</Text>
            </Table.Cell>
            <Table.Cell className="text-[#292929]">
              <Text>${row.priceUSDC.toFixed(2)}</Text>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
}
