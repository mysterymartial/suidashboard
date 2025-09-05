import React from "react";
import { Layout } from "../../components/layout/Layout";
import { WalletStatus } from "../../WalletStatus";
import { ChartsSection } from "../../components/charts/ChartsSection";
import { usePoolsData } from "../../hooks/usePoolsData";
import { StatsCards } from "../../components/cards/StatsCards";
import { useStatsData } from "../../hooks/useStatsData";

function PriceDiscovery() {
  const { dbdata } = usePoolsData();
  const { suiStats } = useStatsData();

  return (
    <Layout>
      <main className="p-6 space-y-8">
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-sm">
          <h2 className="text-2xl font-semibold text-white">
            DeepBook - Price Discovery
          </h2>
          <p className="text-gray-300 mt-1">
            Price formation and discovery metrics.
          </p>
        </div>
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
