import React, { useState, useEffect } from "react";
import { Layout } from "../../components/layout/Layout";
import { TrendingUp, TrendingDown, DollarSign, Activity, Users, Zap } from 'lucide-react';

interface SimplePriceData {
  [key: string]: {
    usd: number;
    usd_24h_change: number;
  };
}

function FeeGeneration() {
  const [priceData, setPriceData] = useState<SimplePriceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  // Popular cryptocurrencies to track
  const coins = ['bitcoin', 'ethereum', 'cardano', 'polkadot', 'chainlink', 'solana'];

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Using CORS proxy to avoid CORS issues
        const proxyUrl = 'https://corsproxy.io/?';
        const coinIds = coins.join(',');
        const targetUrl = `https://api.coingecko.com/api/v3/simple/price?ids=${coinIds}&vs_currencies=usd&include_24hr_change=true`;
        
        console.log('Fetching price data...');
        const response = await fetch(`${proxyUrl}${encodeURIComponent(targetUrl)}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        });
        
        console.log('Price response status:', response.status);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Price data received:', data);
        setPriceData(data);
      } catch (err) {
        console.error('Error fetching price data:', err);
        setError(err instanceof Error ? err.message : 'An error occurred while fetching price data');
      } finally {
        setLoading(false);
      }
    };

    fetchPrices();
    
    // Refresh data every 30 seconds
    const interval = setInterval(fetchPrices, 30000);
    return () => clearInterval(interval);
  }, []);

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(num);
  };

  const getCoinName = (id: string) => {
    const names: { [key: string]: string } = {
      bitcoin: 'Bitcoin',
      ethereum: 'Ethereum', 
      cardano: 'Cardano',
      polkadot: 'Polkadot',
      chainlink: 'Chainlink',
      solana: 'Solana'
    };
    return names[id] || id;
  };

  const getCoinSymbol = (id: string) => {
    const symbols: { [key: string]: string } = {
      bitcoin: 'BTC',
      ethereum: 'ETH',
      cardano: 'ADA',
      polkadot: 'DOT',
      chainlink: 'LINK',
      solana: 'SOL'
    };
    return symbols[id] || id.toUpperCase();
  };

  if (loading) {
    return (
      <div className="bg-gray-900 text-white p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Market Overview</h2>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="animate-pulse flex justify-between items-center bg-gray-800 p-4 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-700 rounded-full"></div>
                <div className="space-y-1">
                  <div className="h-4 bg-gray-700 rounded w-20"></div>
                  <div className="h-3 bg-gray-700 rounded w-16"></div>
                </div>
              </div>
              <div className="text-right space-y-1">
                <div className="h-4 bg-gray-700 rounded w-24"></div>
                <div className="h-3 bg-gray-700 rounded w-16"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900 text-red-100 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Error Loading Price Data</h3>
        <p>{error}</p>
      </div>
    );
  }

  if (!priceData) return null;

  return (
    <Layout>
      <main className="p-6 space-y-8">
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-sm">
          <h2 className="text-2xl font-semibold text-white">
            Ika - Price Tracker
          </h2>
          <p className="text-gray-300 mt-1">
            Fees accrued by protocol activity.
          </p>
        </div>
        
        <div className="bg-gray-900 text-white p-6 rounded-lg shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Market Overview</h2>
            <div className="text-sm text-gray-400">
              Auto-refreshing every 30s
            </div>
          </div>

          <div className="space-y-3">
            {Object.entries(priceData).map(([coinId, data]) => {
              const isPositive = data.usd_24h_change > 0;
              return (
                <div key={coinId} className="bg-gray-800 p-4 rounded-lg hover:bg-gray-750 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-xs font-bold">
                        {getCoinSymbol(coinId).charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold">{getCoinName(coinId)}</div>
                        <div className="text-sm text-gray-400">{getCoinSymbol(coinId)}</div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-lg font-bold">
                        {formatCurrency(data.usd)}
                      </div>
                      <div className={`flex items-center justify-end space-x-1 text-sm ${
                        isPositive ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                        <span>{Math.abs(data.usd_24h_change).toFixed(2)}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 pt-4 border-t border-gray-700">
            <div className="text-center text-sm text-gray-400">
              Data provided by CoinGecko API
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}

export default FeeGeneration;
