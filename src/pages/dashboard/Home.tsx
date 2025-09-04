import { WalletStatus } from "../../WalletStatus";
import { Layout } from "../../components/layout/Layout";
import { ChartsSection } from "../../components/charts/ChartsSection";
import { AssetsTable } from "../../components/tables/AssetsTable";
import { LeagueTable } from "../../components/tables/LeagueTable";
import { NewsCard } from "../../components/cards/NewsCard";
import { IssuanceAndTransfers } from "../../components/cards/IssuanceAndTransfers";
import { usePoolsData } from "../../hooks/usePoolsData";
import "../../App.css";

function Home() {
  const { suidata } = usePoolsData();

  // Dummy data for demonstration
  const dummyStats = {
    totalRWA: "$2.8B",
    totalHolders: "374,703",
    totalIssuers: "272",
    totalStablecoins: "$273.89B",
    totalStablecoinHolders: "191.18M",
  };

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

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-300">
                  Total RWA Onchain
                </h3>
                <span className="text-green-400 text-sm font-medium">
                  +7.27%
                </span>
              </div>
              <p className="text-2xl font-bold text-white">
                {dummyStats.totalRWA}
              </p>
              <p className="text-xs text-gray-400 mt-1">from 30d ago</p>
            </div>

            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-300">
                  Total Asset Holders
                </h3>
                <span className="text-green-400 text-sm font-medium">
                  +8.57%
                </span>
              </div>
              <p className="text-2xl font-bold text-white">
                {dummyStats.totalHolders}
              </p>
              <p className="text-xs text-gray-400 mt-1">from 30d ago</p>
            </div>

            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-300">
                  Total Asset Issuers
                </h3>
                <span className="text-gray-400 text-sm font-medium">-</span>
              </div>
              <p className="text-2xl font-bold text-white">
                {dummyStats.totalIssuers}
              </p>
              <p className="text-xs text-gray-400 mt-1">active protocols</p>
            </div>

            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-300">
                  Total Stablecoin Value
                </h3>
                <span className="text-green-400 text-sm font-medium">
                  +6.27%
                </span>
              </div>
              <p className="text-2xl font-bold text-white">
                {dummyStats.totalStablecoins}
              </p>
              <p className="text-xs text-gray-400 mt-1">from 30d ago</p>
            </div>

            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-300">
                  Total Stablecoin Holders
                </h3>
                <span className="text-green-400 text-sm font-medium">
                  +1.95%
                </span>
              </div>
              <p className="text-2xl font-bold text-white">
                {dummyStats.totalStablecoinHolders}
              </p>
              <p className="text-xs text-gray-400 mt-1">from 30d ago</p>
            </div>
          </div>
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
            <AssetsTable assets={dummyAssets} />
          </div>
        </section>

        {/* League Table and News */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <section>
            <div className="bg-gray-800 rounded-xl border border-gray-700 shadow-sm">
              <div className="p-6 border-b border-gray-700">
                <h3 className="text-lg font-semibold text-white">
                  Sui League Table
                </h3>
              </div>
              <LeagueTable networks={dummyNetworks} />
            </div>
          </section>

          <section>
            <div className="bg-gray-800 rounded-xl border border-gray-700 shadow-sm">
              <div className="p-6 border-b border-gray-700">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">
                    Latest News
                  </h3>
                  <button className="text-sm text-blue-400 hover:text-blue-300 font-medium">
                    View All
                  </button>
                </div>
              </div>
              <NewsCard news={dummyNews} />
            </div>
          </section>
        </div>

        {/* Issuance and Transfers */}
        <section>
          <IssuanceAndTransfers />
        </section>
      </main>
      <WalletStatus />
    </Layout>
  );
}

export default Home;
