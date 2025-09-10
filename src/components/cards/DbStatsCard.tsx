import { Flex, Heading, Text } from "@radix-ui/themes";
import CardComponent from ".";

type StatsCardsProps = {
  pools?: any[];
};

export function DbStatsCard({ pools }: StatsCardsProps) {
  if (!pools || pools.length === 0) {
    return <Text className="text-[#292929]">No pool stats available.</Text>;
  }

  // Aggregate stats
  const totalMinSize = pools.reduce(
    (sum, p) => sum + (Number(p.min_size) || 0),
    0,
  );
  const totalLotSize = pools.reduce(
    (sum, p) => sum + (Number(p.lot_size) || 0),
    0,
  );
  const totalTickSize = pools.reduce(
    (sum, p) => sum + (Number(p.tick_size) || 0),
    0,
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
        <CardComponent key={idx}>
          <Text size="2" className="text-[#292929]">
            {card.label}
          </Text>
          <Heading size="5" className="text-[#292929]">
            {typeof card.value === "number"
              ? card.value.toLocaleString()
              : card.value}
          </Heading>
        </CardComponent>
      ))}
    </Flex>
  );
}
