import { Flex, Card, Heading, Text } from "@radix-ui/themes";

type StatsCardsProps = {
  pools?: any[];
};

export function DbStatsCard({ pools }: StatsCardsProps) {
  if (!pools || pools.length === 0) {
    return <Text color="gray">No pool stats available.</Text>;
  }

  // Aggregate stats
  const totalMinSize = pools.reduce(
    (sum, p) => sum + (Number(p.min_size) || 0),
    0
  );
  const totalLotSize = pools.reduce(
    (sum, p) => sum + (Number(p.lot_size) || 0),
    0
  );
  const totalTickSize = pools.reduce(
    (sum, p) => sum + (Number(p.tick_size) || 0),
    0
  );

  const cards = [
    {
      label: "Pools Count",
      value: pools.length,
    },
    {
      label: "Total Min Size",
      value: totalMinSize.toLocaleString(),
    },
    {
      label: "Total Lot Size",
      value: totalLotSize.toLocaleString(),
    },
    {
      label: "Total Tick Size",
      value: totalTickSize.toLocaleString(),
    },
  ];

  return (
    <Flex gap="6" mb="6" wrap="wrap">
      {cards.map((card, idx) => (
        <Card key={idx} className="min-w-[180px]">
          <Text size="2" color="gray">
            {card.label}
          </Text>
          <Heading size="5">
            {typeof card.value === "number"
              ? card.value.toLocaleString()
              : card.value}
          </Heading>
        </Card>
      ))}
    </Flex>
  );
}
