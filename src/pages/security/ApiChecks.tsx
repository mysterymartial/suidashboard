import React from "react";
import { Layout } from "../../components/layout/Layout";
import { WalletStatus } from "../../WalletStatus";
import { AssetsTable } from "../../components/tables/AssetsTable";
import { usePoolsData } from "../../hooks/useDeep/usePoolsData";
import { StatsCards } from "../../components/cards/StatsCards";
import { useStatsData } from "../../hooks/useStatsData";

function ApiChecks() {
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

  return (
    <Layout>
      <main className="p-6 space-y-8">
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-sm">
          <h2 className="text-2xl font-semibold text-white">
            Security - API Checks
          </h2>
          <p className="text-gray-300 mt-1">
            Status of internal and external API checks.
          </p>
        </div>
        <StatsCards stats={suiStats} />
        <AssetsTable assets={assets} />
      </main>
      <WalletStatus />
    </Layout>
  );
}

export default ApiChecks;
