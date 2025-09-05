import React from "react";
import { Layout } from "../../components/layout/Layout";
import { WalletStatus } from "../../WalletStatus";
import { AssetsTable } from "../../components/tables/AssetsTable";
import { usePoolsData } from "../../hooks/usePoolsData";
import { StatsCards } from "../../components/cards/StatsCards";
import { useStatsData } from "../../hooks/useStatsData";

function OrderBook() {
  const { dbdata } = usePoolsData();
  const { suiStats } = useStatsData();

  const assets = Array.isArray(dbdata)
    ? dbdata.map((pool) => ({
        name: pool.pool_name || pool.name || "-",
        symbol: pool.base_asset_symbol || pool.symbol || "-",
        protocol: pool.base_asset_name || pool.protocol || "-",
        change7d: pool.change7d || "-",
        change30d: pool.change30d || "-",
        marketCap: pool.marketCap || "-",
        assetClass: pool.assetClass || pool.quote_asset_symbol || "-",
      }))
    : [];

  return (
    <Layout>
      <main className="p-6 space-y-8">
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-sm">
          <h2 className="text-2xl font-semibold text-white">
            DeepBook - Order Book
          </h2>
          <p className="text-gray-300 mt-1">
            Order book level details and listings.
          </p>
        </div>
        <StatsCards stats={suiStats} />
        <AssetsTable assets={assets} />
      </main>
      <WalletStatus />
    </Layout>
  );
}

export default OrderBook;
