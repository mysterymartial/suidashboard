import { WalletStatus } from "../../WalletStatus";
import { Layout } from "../../components/layout/Layout";
import { ChartsSection } from "../../components/charts/ChartsSection";
import { AssetsTable } from "../../components/tables/AssetsTable";
import { LeagueTable } from "../../components/tables/LeagueTable";
import { NewsCard } from "../../components/cards/NewsCard";
import { IssuanceAndTransfers } from "../../components/cards/IssuanceAndTransfers";
import { usePoolsData } from "../../hooks/useDeep/usePoolsData";
import { StatsCards } from "../../components/cards/StatsCards";
import { useStatsData } from "../../hooks/useStatsData";
import { PoolsTable } from "../../components/tables/PoolsTable";
import "../../App.css";
import CardComponent from "@/components/cards";
import React, { useRef, useState } from "react";
import { exportElementAsImage } from "@/utils/exportImage";

function Home() {
  const { suidata } = usePoolsData();
  const { suiStats, suipools, loading } = useStatsData();
  const exportRef = useRef<HTMLDivElement | null>(null);
  const [downloading, setDownloading] = useState(false);

  const assets = Array.isArray(suidata)
    ? suidata.map((pool) => ({
        name: pool.pool || "-", // pool address
        symbol:
          pool.coinA?.split("::").pop() + "/" + pool.coinB?.split("::").pop() ||
          "-",
        protocol: pool.platform || "-",
        change7d: "-", // Not available
        change30d: "-", // Not available
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
        {/* Global Market Overview */}
        <section>
          <StatsCards stats={suiStats} />
        </section>

        {/* Charts Section */}
        <section>
          <ChartsSection
            data={suidata}
            valueField="liqUsd"
            labelField="pool"
            symbolField="symbol"
          />
        </section>

        {/* Assets Table */}
        <section>
          <CardComponent>
            <div className="flex flex-col gap-4" ref={exportRef}>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-[#292929]">
                  All Assets
                </h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={async () => {
                      if (!exportRef.current) return;
                      try {
                        setDownloading(true);
                        await exportElementAsImage(exportRef.current, {
                          filename: "overview_assets",
                          watermarkText: "suihub africa",
                        });
                      } finally {
                        setDownloading(false);
                      }
                    }}
                    disabled={downloading}
                    className="px-3 py-2 text-sm bg-[#292929] cursor-pointer text-[#fafafa] rounded-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {downloading ? (
                      <span className="inline-flex items-center gap-2">
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
                        Downloading...
                      </span>
                    ) : (
                      "Download Data"
                    )}
                  </button>
                </div>
              </div>
              <AssetsTable assets={assets} />
            </div>
          </CardComponent>
        </section>
      </main>
    </Layout>
  );
}

export default Home;
