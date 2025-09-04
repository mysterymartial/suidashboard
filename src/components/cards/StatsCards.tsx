import { Flex, Card, Heading, Text } from "@radix-ui/themes";

type StatsCardsProps = {
  stats?: any;
};

export function StatsCards({ stats }: StatsCardsProps) {
  // Remove useStatsData from here! Data should be passed in via props.

  // Defensive: fallback to "-" if value is missing
  const price = stats?.coinPrice ?? stats?.suiPrice ?? "-";
  const marketCap = stats?.marketCap
    ? `$${Number(stats.marketCap).toLocaleString(undefined, { maximumFractionDigits: 2 })}`
    : "-";
  const holders = stats?.holdersCount
    ? Number(stats.holdersCount).toLocaleString()
    : "-";
  const volume24h = stats?.coin24hTradeVolumeUsd
    ? `$${Number(stats.coin24hTradeVolumeUsd).toLocaleString(undefined, { maximumFractionDigits: 2 })}`
    : "-";
  const trades24h = stats?.coin24hTradeCount
    ? Number(stats.coin24hTradeCount).toLocaleString()
    : "-";
  const liquidity = stats?.totalLiquidityUsd
    ? `$${Number(stats.totalLiquidityUsd).toLocaleString(undefined, { maximumFractionDigits: 2 })}`
    : "-";
  const tokensBurned = stats?.tokensBurned
    ? Number(stats.tokensBurned).toLocaleString()
    : "-";

  return (
    <Flex gap="6" mb="6">
      <Card>
        <Text size="2" color="gray">
          SUI Price
        </Text>
        <Heading size="5">{typeof price === "number" ? `$${price.toFixed(4)}` : price}</Heading>
      </Card>
      <Card>
        <Text size="2" color="gray">
          Market Cap
        </Text>
        <Heading size="5">{marketCap}</Heading>
      </Card>
      <Card>
        <Text size="2" color="gray">
          Holders
        </Text>
        <Heading size="5">{holders}</Heading>
      </Card>
      <Card>
        <Text size="2" color="gray">
          24h Volume
        </Text>
        <Heading size="5">{volume24h}</Heading>
      </Card>
      <Card>
        <Text size="2" color="gray">
          24h Trades
        </Text>
        <Heading size="5">{trades24h}</Heading>
      </Card>
      <Card>
        <Text size="2" color="gray">
          Total Liquidity
        </Text>
        <Heading size="5">{liquidity}</Heading>
      </Card>
      <Card>
        <Text size="2" color="gray">
          Tokens Burned
        </Text>
        <Heading size="5">{tokensBurned}</Heading>
      </Card>
    </Flex>
  );
}
// Note: Ensure that the parent component (e.g., Home.tsx or Walrus.tsx) imports useStatsData and passes the stats prop to StatsCards.
