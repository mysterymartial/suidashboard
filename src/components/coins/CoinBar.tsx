import React from 'react';
import { RefreshCw, Download, TrendingUp } from 'lucide-react';

interface CoinBarProps {
  onGetCoins: () => void;
  onRefreshMetrics: () => void;
  isLoadingCoins: boolean;
  isLoadingMetrics: boolean;
  hasApiKey: boolean;
  coinsCount?: number;
}

export function CoinBar({
  onGetCoins,
  onRefreshMetrics,
  isLoadingCoins,
  isLoadingMetrics,
  hasApiKey,
  coinsCount
}: CoinBarProps) {
  return (
    <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Title and Description */}
        <div className="flex-1">
          <h2 className="text-2xl font-semibold text-white flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-blue-400" />
            Coins Dashboard
          </h2>
          <p className="text-gray-300 mt-1">
            {coinsCount 
              ? `Explore ${coinsCount.toLocaleString()} coins on the Sui network`
              : 'Explore coins data and metrics on the Sui network'
            }
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Refresh Metrics Button */}
          <button
            onClick={onRefreshMetrics}
            disabled={!hasApiKey || isLoadingMetrics}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200
              ${!hasApiKey 
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                : isLoadingMetrics
                  ? 'bg-blue-600 text-white cursor-wait'
                  : 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-lg'
              }
            `}
          >
            <RefreshCw className={`w-4 h-4 ${isLoadingMetrics ? 'animate-spin' : ''}`} />
            {isLoadingMetrics ? 'Refreshing...' : 'Refresh Metrics'}
          </button>

          {/* Get Coins Button */}
          <button
            onClick={onGetCoins}
            disabled={!hasApiKey || isLoadingCoins}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200
              ${!hasApiKey 
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                : isLoadingCoins
                  ? 'bg-green-600 text-white cursor-wait'
                  : 'bg-green-600 hover:bg-green-700 text-white hover:shadow-lg'
              }
            `}
          >
            <Download className={`w-4 h-4 ${isLoadingCoins ? 'animate-pulse' : ''}`} />
            {isLoadingCoins ? 'Loading Coins...' : 'Get Coins Data'}
          </button>
        </div>
      </div>

      {/* API Key Warning */}
      {!hasApiKey && (
        <div className="mt-4 p-3 bg-yellow-900/20 border border-yellow-600/30 rounded-lg">
          <p className="text-yellow-400 text-sm">
            ⚠️ API key not found. Please set VITE_API_KEY in your .env file to use this feature.
          </p>
        </div>
      )}
    </div>
  );
}
