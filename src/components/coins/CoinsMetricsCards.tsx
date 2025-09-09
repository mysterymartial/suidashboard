import React from 'react';
import { Coins, Shield, TrendingUp, DollarSign, Loader2 } from 'lucide-react';
import { CoinsWithMarketCapCount, CoinsCount, CoinsVerifiedCount } from '../../hooks/useCoinsData';

interface CoinsMetricsCardsProps {
  coinsWithMarketCapCount: CoinsWithMarketCapCount | null;
  coinsCount: CoinsCount | null;
  coinsVerifiedCount: CoinsVerifiedCount | null;
  loading: boolean;
  error: string | null;
}

export function CoinsMetricsCards({
  coinsWithMarketCapCount,
  coinsCount,
  coinsVerifiedCount,
  loading,
  error
}: CoinsMetricsCardsProps) {
  // Format number with commas
  const formatNumber = (num: number | undefined) => {
    if (num === undefined || num === null) return '-';
    return num.toLocaleString();
  };

  // Calculate verification percentage
  const verificationPercentage = () => {
    if (!coinsCount?.total || !coinsVerifiedCount?.total) return '-';
    const percentage = (coinsVerifiedCount.total / coinsCount.total) * 100;
    return `${percentage.toFixed(1)}%`;
  };

  // Calculate market cap coverage percentage
  const marketCapCoveragePercentage = () => {
    if (!coinsCount?.total || !coinsWithMarketCapCount?.total) return '-';
    const percentage = (coinsWithMarketCapCount.total / coinsCount.total) * 100;
    return `${percentage.toFixed(1)}%`;
  };

  if (error) {
    return (
      <div className="bg-red-900/20 border border-red-600/30 rounded-xl p-6">
        <div className="flex items-center gap-2 text-red-400">
          <div className="w-2 h-2 bg-red-400 rounded-full"></div>
          <span className="font-medium">Error loading metrics</span>
        </div>
        <p className="text-red-300 mt-2 text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Total Coins Card */}
      <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-sm hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm font-medium">Total Coins</p>
            <p className="text-2xl font-bold text-white mt-1">
              {loading ? (
                <Loader2 className="w-6 h-6 animate-spin text-blue-400" />
              ) : (
                formatNumber(coinsCount?.total)
              )}
            </p>
          </div>
          <div className="p-3 bg-blue-500/10 rounded-lg">
            <Coins className="w-6 h-6 text-blue-400" />
          </div>
        </div>
        <p className="text-gray-500 text-xs mt-2">
          All coins on Sui network
        </p>
      </div>

      {/* Verified Coins Card */}
      <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-sm hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm font-medium">Verified Coins</p>
            <p className="text-2xl font-bold text-white mt-1">
              {loading ? (
                <Loader2 className="w-6 h-6 animate-spin text-green-400" />
              ) : (
                formatNumber(coinsVerifiedCount?.total)
              )}
            </p>
            <p className="text-green-400 text-sm mt-1">
              {loading ? '-' : verificationPercentage()}
            </p>
          </div>
          <div className="p-3 bg-green-500/10 rounded-lg">
            <Shield className="w-6 h-6 text-green-400" />
          </div>
        </div>
        <p className="text-gray-500 text-xs mt-2">
          Verified and trusted coins
        </p>
      </div>

      {/* Coins with Market Cap Card */}
      <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-sm hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm font-medium">With Market Cap</p>
            <p className="text-2xl font-bold text-white mt-1">
              {loading ? (
                <Loader2 className="w-6 h-6 animate-spin text-purple-400" />
              ) : (
                formatNumber(coinsWithMarketCapCount?.total)
              )}
            </p>
            <p className="text-purple-400 text-sm mt-1">
              {loading ? '-' : marketCapCoveragePercentage()}
            </p>
          </div>
          <div className="p-3 bg-purple-500/10 rounded-lg">
            <TrendingUp className="w-6 h-6 text-purple-400" />
          </div>
        </div>
        <p className="text-gray-500 text-xs mt-2">
          Coins with market cap data
        </p>
      </div>

      {/* Market Cap Coverage Card */}
      <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-sm hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm font-medium">Market Cap Coverage</p>
            <p className="text-2xl font-bold text-white mt-1">
              {loading ? (
                <Loader2 className="w-6 h-6 animate-spin text-orange-400" />
              ) : (
                marketCapCoveragePercentage()
              )}
            </p>
            <p className="text-orange-400 text-sm mt-1">
              of total coins
            </p>
          </div>
          <div className="p-3 bg-orange-500/10 rounded-lg">
            <DollarSign className="w-6 h-6 text-orange-400" />
          </div>
        </div>
        <p className="text-gray-500 text-xs mt-2">
          Percentage with market data
        </p>
      </div>
    </div>
  );
}
