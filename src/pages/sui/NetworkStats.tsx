import React from "react";
import { Layout } from "../../components/layout/Layout";
import { WalletStatus } from "../../WalletStatus";
import { StatsCards } from "../../components/cards/StatsCards";
import { ChartsSection } from "../../components/charts/ChartsSection";
import { AssetsTable } from "../../components/tables/AssetsTable";
import { LeagueTable } from "../../components/tables/LeagueTable";
import { NewsCard } from "../../components/cards/NewsCard";
import { IssuanceAndTransfers } from "../../components/cards/IssuanceAndTransfers";
import { usePoolsData } from "../../hooks/usePoolsData";
import { useStatsData } from "../../hooks/useStatsData";

function NetworkStats() {
  const { suidata } = usePoolsData();
  const { suiStats } = useStatsData();

  const assets = Array.isArray(suidata)
    ? suidata.map((pool) => ({
        name: pool.pool || "-",
        symbol: pool.symbol || "-",
        protocol: pool.platform || "-",
        change7d: pool.change7d || "-",
        change30d: pool.change30d || "-",
        marketCap: pool.liqUsd
          ? `$${Number(pool.liqUsd).toLocaleString(undefined, { maximumFractionDigits: 2 })}`
          : "-",
        assetClass: pool.assetClass || "-",
      }))
    : [];

  const networks = Array.isArray(suidata)
    ? suidata.map((pool) => ({
        name: pool.platform || "-",
        count: pool.count || "-",
        value: pool.liqUsd
          ? `$${Number(pool.liqUsd).toLocaleString(undefined, { maximumFractionDigits: 2 })}`
          : "-",
        change30d: pool.change30d || "-",
        share: pool.share || "-",
      }))
    : [];

  return (
    <Layout>
      <main className="p-6 space-y-8">
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-sm">
          <h2 className="text-2xl font-semibold text-white">
            Sui - Network Stats
          </h2>
          <p className="text-gray-300 mt-1">
            High-level network performance and health metrics.
          </p>
        </div>

        <StatsCards stats={suiStats} />
        <ChartsSection
          data={suidata}
          valueField="liqUsd"
          labelField="pool"
          symbolField="symbol"
        />
        <AssetsTable assets={assets} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <LeagueTable networks={networks} />
          <NewsCard news={[]} />
        </div>
        <IssuanceAndTransfers />
      </main>
      <WalletStatus />
    </Layout>
  );
}

export default NetworkStats;
