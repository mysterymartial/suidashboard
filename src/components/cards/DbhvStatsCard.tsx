import { Flex, Card, Heading, Text } from "@radix-ui/themes";

type HistoricalVolumeStatsProps = {
  volumeData: Record<string, number>;
};

export function HistoricalVolumeStats({ volumeData }: HistoricalVolumeStatsProps) {
  const pools = Object.entries(volumeData);

  if (pools.length === 0) {
    return <Text className="text-[#292929]">No volume stats available.</Text>;
  }

  const volumes = pools.map(([_, volume]) => volume);
  const totalVolume = volumes.reduce((sum, v) => sum + v, 0);
  const minVolume = Math.min(...volumes);
  const maxVolume = Math.max(...volumes);

  const cards = [
    {
      label: "Total Pools",
      value: pools.length,
    },
    {
      label: "Total Volume",
      value: totalVolume.toLocaleString(undefined, {
        maximumFractionDigits: 2,
      }),
    },
    {
      label: "Min Volume",
      value: minVolume.toLocaleString(undefined, {
        maximumFractionDigits: 2,
      }),
    },
    {
      label: "Max Volume",
      value: maxVolume.toLocaleString(undefined, {
        maximumFractionDigits: 2,
      }),
    },
  ];

  return (
    <Flex gap="6" mb="6" wrap="wrap">
      {cards.map((card, idx) => (
        <Card key={idx} className="min-w-[180px] p-4 shadow-sm rounded-lg">
          <Text size="2" className="text-[#292929]">
            {card.label}
          </Text>
          <Heading size="5" className="text-[#292929]">{card.value}</Heading>
        </Card>
      ))}
    </Flex>
  );
}
