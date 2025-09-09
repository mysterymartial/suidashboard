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

function Home() {
  const { suidata } = usePoolsData();
  const { suiStats, suipools, loading } = useStatsData();

  const assets = Array.isArray(suidata)
    ? suidata.map((pool) => ({
        name: pool.pool || "-", // pool address
        symbol: pool.coinA?.split("::").pop() + "/" + pool.coinB?.split("::").pop() || "-",
        protocol: pool.platform || "-",
        change7d: "-", // Not available
        change30d: "-", // Not available
        marketCap: pool.liqUsd ? `$${Number(pool.liqUsd).toLocaleString(undefined, {maximumFractionDigits:2})}` : "-",
        assetClass: pool.coinA?.split("::").pop() || "-",
        swapCount: pool.swapCount || "-",
        price: pool.price || "-",
      }))
    : [];



  const dummyAssets = [
    {
      name: "SUI",
      symbol: "SUI",
      protocol: "Sui Network",
      change7d: "+12.5%",
      change30d: "+45.2%",
      marketCap: "$1.2B",
      assetClass: "Native Token",
    },
    {
      name: "USDC",
      symbol: "USDC",
      protocol: "Circle",
      change7d: "+0.1%",
      change30d: "+0.3%",
      marketCap: "$850M",
      assetClass: "Stablecoin",
    },
    {
      name: "USDT",
      symbol: "USDT",
      protocol: "Tether",
      change7d: "+0.05%",
      change30d: "+0.2%",
      marketCap: "$420M",
      assetClass: "Stablecoin",
    },
    {
      name: "WETH",
      symbol: "WETH",
      protocol: "Ethereum",
      change7d: "+8.2%",
      change30d: "+22.1%",
      marketCap: "$180M",
      assetClass: "Wrapped Token",
    },
    {
      name: "WBTC",
      symbol: "WBTC",
      protocol: "Bitcoin",
      change7d: "+5.8%",
      change30d: "+18.7%",
      marketCap: "$95M",
      assetClass: "Wrapped Token",
    },
  ];

  const dummyNetworks = [
    {
      name: "Sui Mainnet",
      count: "1,247",
      value: "$1.8B",
      change30d: "+15.2%",
      share: "64.3%",
    },
    {
      name: "Sui Testnet",
      count: "892",
      value: "$420M",
      change30d: "+8.7%",
      share: "15.0%",
    },
    {
      name: "Sui Devnet",
      count: "156",
      value: "$180M",
      change30d: "+12.1%",
      share: "6.4%",
    },
  ];

  const dummyNews = [
    {
      title: "Sui Network reaches $2B TVL milestone",
      time: "2 hours ago",
      source: "Sui Foundation",
    },
    {
      title: "New RWA tokenization protocol launches on Sui",
      time: "4 hours ago",
      source: "DeFi Pulse",
    },
    {
      title: "Major gaming studio announces Sui integration",
      time: "6 hours ago",
      source: "Gaming News",
    },
  ];

  return (
    <Layout>
      {/* Main Content Area */}
      <main className="p-6 space-y-8">
        {/* Global Market Overview */}
        <section>
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-white mb-2">
              Global Market Overview
            </h2>
            <p className="text-gray-300">
              Welcome to Sui Dashboard. Explore tokenized assets and the
              protocols participating on the Sui blockchain.
            </p>
          </div>

          {/* Stats Cards */}
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
          <div className="bg-gray-800 rounded-xl border border-gray-700 shadow-sm">
            <div className="p-6 border-b border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">All Assets</h3>
                <div className="flex items-center gap-2">
                  <button className="px-3 py-1 text-sm bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors">
                    Include Stablecoins
                  </button>
                  <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Download
                  </button>
                </div>
              </div>
            </div>
            {/* <AssetsTable assets={dummyAssets} /> */}
            <AssetsTable assets={assets} />
          </div>
        </section>

        {/* Liquidity Pools Section */}
        <section>
          <PoolsTable pools={suipools} loading={loading} />
        </section>

      </main>
    </Layout>
  );
}

export default Home;
