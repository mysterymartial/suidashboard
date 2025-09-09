import React from 'react';
import { Layout } from '../../components/layout/Layout';
import { WalletStatus } from '../../WalletStatus';
import { CoinBar } from '../../components/coins/CoinBar';
import { CoinsMetricsCards } from '../../components/coins/CoinsMetricsCards';
import { CoinsTable } from '../../components/coins/CoinsTable';
import { useCoinsData } from '../../hooks/useCoinsData';

function CoinsDashboard() {
  const {
    coinsWithMarketCapCount,
    coinsCount,
    coinsVerifiedCount,
    coins,
    loading,
    error,
    fetchCoins,
    refreshMetrics,
    hasApiKey
  } = useCoinsData();

  const handleGetCoins = async () => {
    try {
      await fetchCoins(50); // Fetch first 50 coins
    } catch (err) {
      console.error('Failed to fetch coins:', err);
    }
  };

  const handleRefreshMetrics = async () => {
    try {
      await refreshMetrics();
    } catch (err) {
      console.error('Failed to refresh metrics:', err);
    }
  };

  return (
    <Layout>
      <main className="p-6 space-y-8">
        {/* Header with Actions */}
        <CoinBar
          onGetCoins={handleGetCoins}
          onRefreshMetrics={handleRefreshMetrics}
          isLoadingCoins={loading.coins}
          isLoadingMetrics={loading.metrics}
          hasApiKey={hasApiKey}
          coinsCount={coinsCount?.total}
        />

        {/* Metrics Cards */}
        <CoinsMetricsCards
          coinsWithMarketCapCount={coinsWithMarketCapCount}
          coinsCount={coinsCount}
          coinsVerifiedCount={coinsVerifiedCount}
          loading={loading.metrics}
          error={error}
        />

        {/* Coins Table */}
        {coins.length > 0 && (
          <CoinsTable
            coins={coins}
            loading={loading.coins}
            error={error}
          />
        )}

        {/* Empty State */}
        {!loading.coins && coins.length === 0 && hasApiKey && (
          <div className="bg-gray-800 rounded-xl border border-gray-700 shadow-sm p-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No Coins Data</h3>
              <p className="text-gray-400 mb-6">
                Click "Get Coins Data" to fetch detailed information about coins on the Sui network.
              </p>
              <button
                onClick={handleGetCoins}
                disabled={loading.coins}
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading.coins ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Loading...
                  </>
                ) : (
                  'Get Coins Data'
                )}
              </button>
            </div>
          </div>
        )}

        {/* API Key Missing State */}
        {!hasApiKey && (
          <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-xl p-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-yellow-400 mb-2">API Key Required</h3>
              <p className="text-yellow-300 mb-4">
                To use the coins dashboard, you need to set up your BlockBerry API key.
              </p>
              <div className="bg-gray-800 rounded-lg p-4 text-left max-w-md mx-auto">
                <p className="text-gray-300 text-sm mb-2">Create a <code className="bg-gray-700 px-2 py-1 rounded text-yellow-300">.env</code> file in your project root with:</p>
                <code className="text-green-400 text-sm">
                  VITE_API_KEY=your_blockberry_api_key_here
                </code>
              </div>
            </div>
          </div>
        )}
      </main>
      <WalletStatus />
    </Layout>
  );
}

export default CoinsDashboard;
