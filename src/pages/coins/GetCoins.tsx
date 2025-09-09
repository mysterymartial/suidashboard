import React from "react";
import { Layout } from "../../components/layout/Layout";
import { WalletStatus } from "../../WalletStatus";
import { CoinsMetricsCards } from "../../components/coins/CoinsMetricsCards";
import { CoinsTable } from "../../components/coins/CoinsTable";
import { useCoinsData } from "../../hooks/useCoinsData";

function GetCoins() {
  const {
    coinsWithMarketCapCount,
    coinsCount,
    coinsVerifiedCount,
    coins,
    loading,
    error,
    fetchCoins,
    hasApiKey
  } = useCoinsData();

  // Auto-fetch coins data when component mounts
  React.useEffect(() => {
    if (hasApiKey && coins.length === 0) {
      fetchCoins(50);
    }
  }, [hasApiKey, coins.length, fetchCoins]);

  return (
    <Layout>
      <main className="p-6 space-y-8">
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-sm">
          <h2 className="text-2xl font-semibold text-white">
            Coins - Get Coins Data
          </h2>
          <p className="text-gray-300 mt-1">
            Detailed coin information from BlockBerry API including prices, market cap, and trading data.
          </p>
        </div>
        
        <CoinsMetricsCards
          coinsWithMarketCapCount={coinsWithMarketCapCount}
          coinsCount={coinsCount}
          coinsVerifiedCount={coinsVerifiedCount}
          loading={loading.metrics}
          error={error}
        />

        {coins.length > 0 && (
          <CoinsTable
            coins={coins}
            loading={loading.coins}
            error={error}
          />
        )}

        {!hasApiKey && (
          <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-xl p-6">
            <p className="text-yellow-400 text-sm">
              ⚠️ API key not found. Please set VITE_API_KEY in your .env file to use this feature.
            </p>
          </div>
        )}
      </main>
      <WalletStatus />
    </Layout>
  );
}

export default GetCoins;
