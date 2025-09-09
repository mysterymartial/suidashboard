import React from "react";
import { Layout } from "../../components/layout/Layout";
import { WalletStatus } from "../../WalletStatus";
import { AssetsTable } from "../../components/tables/AssetsTable";
import { usePoolsData } from "../../hooks/useDeep/usePoolsData";
import { StatsCards } from "../../components/cards/StatsCards";
import { useStatsData } from "../../hooks/useStatsData";

function Metadata() {
  const { waldata } = usePoolsData();
  const { suiStats } = useStatsData();

  const assets = Array.isArray(waldata)
    ? waldata.map((pool) => ({
        name: pool.pool || "-",
        symbol:
          (pool.coinA?.split("::").pop() || "-") +
          "/" +
          (pool.coinB?.split("::").pop() || "-"),
        protocol: pool.platform || "-",
        change7d: "-",
        change30d: "-",
        marketCap: pool.liqUsd
          ? `$${Number(pool.liqUsd).toLocaleString(undefined, { maximumFractionDigits: 2 })}`
          : "-",
        assetClass: pool.coinA?.split("::").pop() || "-",
        swapCount: pool.swapCount || "-",
        price: pool.price || "-",
      }))
    : [];

  return (
    <Layout>
      <main className="p-6 space-y-8">
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-sm">
          <h2 className="text-2xl font-semibold text-white">
            Walrus - Metadata
          </h2>
          <p className="text-gray-300 mt-1">
            Metadata extracted from pools and assets.
          </p>
        </div>
        <StatsCards stats={suiStats} />
        <AssetsTable assets={assets} />
      </main>
      <WalletStatus />
    </Layout>
  );
}

export default Metadata;
