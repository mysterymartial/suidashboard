import React from "react";
import { Layout } from "../../components/layout/Layout";
import { WalletStatus } from "../../WalletStatus";
import { ChartsSection } from "../../components/charts/ChartsSection";
import { usePoolsData } from "../../hooks/usePoolsData";
import { useStatsData } from "../../hooks/useStatsData";
import { StatsCards } from "../../components/cards/StatsCards";

function GasUsage() {
  const { suidata } = usePoolsData();
  const { suiStats } = useStatsData();

  return (
    <Layout>
      <main className="p-6 space-y-8">
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-sm">
          <h2 className="text-2xl font-semibold text-white">Sui - Gas Usage</h2>
          <p className="text-gray-300 mt-1">
            Monitor gas consumption and cost trends.
          </p>
        </div>

        <StatsCards stats={suiStats} />
        <ChartsSection
          data={suidata}
          valueField="liqUsd"
          labelField="pool"
          symbolField="symbol"
        />
      </main>
      <WalletStatus />
    </Layout>
  );
}

export default GasUsage;
