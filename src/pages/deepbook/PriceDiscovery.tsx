import { Layout } from "../../components/layout/Layout";
import { WalletStatus } from "../../WalletStatus";
import { ChartsSection } from "../../components/charts/ChartsSection";
import { usePoolsData } from "../../hooks/useDeep/usePoolsData";
import { StatsCards } from "../../components/cards/StatsCards";
import { useStatsData } from "../../hooks/useStatsData";
import CardComponent from "@/components/cards";

function PriceDiscovery() {
  const { dbdata } = usePoolsData();
  const { suiStats } = useStatsData();

  return (
    <Layout>
      <main className="p-6 space-y-8">
        <CardComponent>
          <h2 className="text-2xl font-semibold text-[#292929]">
            DeepBook - Price Discovery
          </h2>
          <p className="text-[#292929] mt-1">
            Price formation and discovery metrics.
          </p>
        </CardComponent>
        <StatsCards stats={suiStats} />
        <ChartsSection
          data={dbdata}
          valueField="tick_size"
          labelField="pool_name"
          symbolField="base_asset_symbol"
        />
      </main>
      <WalletStatus />
    </Layout>
  );
}

export default PriceDiscovery;
