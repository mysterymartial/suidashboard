import { Flex, Heading, Text, Grid } from "@radix-ui/themes";
import CardComponent from "./index";

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
  // const trades24h = stats?.coin24hTradeCount
  //   ? Number(stats.coin24hTradeCount).toLocaleString()
  //   : "-";
  // const liquidity = stats?.totalLiquidityUsd
  //   ? `$${Number(stats.totalLiquidityUsd).toLocaleString(undefined, { maximumFractionDigits: 2 })}`
  //   : "-";
  // const tokensBurned = stats?.tokensBurned
  //   ? Number(stats.tokensBurned).toLocaleString()
  //   : "-";

  return (
    <Grid gap="4" mb="" columns="4">
      <div className="border-[#DCDCDC] border p-4 rounded-[10px] flex flex-col justify-between h-[100px]">
        <Text size="2" className="text-[#292929]">
          SUI Price
        </Text>
        <Heading size="5" className="text-[#3D3D3D]">
          {typeof price === "number" ? `$${price.toFixed(4)}` : price}
        </Heading>
      </div>

      <div className="border-[#DCDCDC] border p-4 rounded-[10px] flex flex-col justify-between h-[100px]">
        <Text size="2" className="text-[#292929]">
          Market Cap
        </Text>
        <Heading size="5" className="text-[#3D3D3D]">
          {marketCap}
        </Heading>
      </div>

      <div className="border-[#DCDCDC] border p-4 rounded-[10px] flex flex-col justify-between h-[100px]">
        <Text size="2" className="text-[#292929]">
          Holders
        </Text>
        <Heading size="5" className="text-[#3D3D3D]">
          {holders}
        </Heading>
      </div>

      <div className="border-[#DCDCDC] border p-4 rounded-[10px] flex flex-col justify-between h-[100px]">
        <Text size="2" className="text-[#292929]">
          24h Volume
        </Text>
        <Heading size="5" className="text-[#3D3D3D]">
          {volume24h}
        </Heading>
      </div>
    </Grid>
  );
}
