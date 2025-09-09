import React, { useState } from 'react';
import { Coin } from '../../hooks/useCoinsData';
import { ExternalLink, Shield, TrendingUp, TrendingDown, Loader2, Search, Filter } from 'lucide-react';

interface CoinsTableProps {
  coins: Coin[];
  loading: boolean;
  error: string | null;
}

export function CoinsTable({ coins, loading, error }: CoinsTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof Coin>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [filterVerified, setFilterVerified] = useState<boolean | null>(null);

  // Filter and sort coins
  const filteredAndSortedCoins = React.useMemo(() => {
    let filtered = coins.filter(coin => {
      const matchesSearch = coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           coin.symbol.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesVerified = filterVerified === null || 
                             (filterVerified ? coin.verified : !coin.verified);
      
      return matchesSearch && matchesVerified;
    });

    // Sort coins
    filtered.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (aValue === undefined && bValue === undefined) return 0;
      if (aValue === undefined) return 1;
      if (bValue === undefined) return -1;
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      return 0;
    });

    return filtered;
  }, [coins, searchTerm, sortField, sortDirection, filterVerified]);

  const handleSort = (field: keyof Coin) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const formatPrice = (price: number | undefined) => {
    if (price === undefined || price === null) return '-';
    return `$${price.toFixed(6)}`;
  };

  const formatMarketCap = (marketCap: number | undefined) => {
    if (marketCap === undefined || marketCap === null) return '-';
    if (marketCap >= 1e9) return `$${(marketCap / 1e9).toFixed(2)}B`;
    if (marketCap >= 1e6) return `$${(marketCap / 1e6).toFixed(2)}M`;
    if (marketCap >= 1e3) return `$${(marketCap / 1e3).toFixed(2)}K`;
    return `$${marketCap.toFixed(2)}`;
  };

  const formatVolume = (volume: number | undefined) => {
    if (volume === undefined || volume === null) return '-';
    if (volume >= 1e9) return `$${(volume / 1e9).toFixed(2)}B`;
    if (volume >= 1e6) return `$${(volume / 1e6).toFixed(2)}M`;
    if (volume >= 1e3) return `$${(volume / 1e3).toFixed(2)}K`;
    return `$${volume.toFixed(2)}`;
  };

  const formatPriceChange = (change: number | undefined) => {
    if (change === undefined || change === null) return '-';
    const isPositive = change >= 0;
    return (
      <span className={`flex items-center gap-1 ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
        {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
        {Math.abs(change).toFixed(2)}%
      </span>
    );
  };

  if (error) {
    return (
      <div className="bg-red-900/20 border border-red-600/30 rounded-xl p-6">
        <div className="flex items-center gap-2 text-red-400">
          <div className="w-2 h-2 bg-red-400 rounded-full"></div>
          <span className="font-medium">Error loading coins data</span>
        </div>
        <p className="text-red-300 mt-2 text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 shadow-sm">
      {/* Header */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold text-white">Coins Data</h3>
            <p className="text-gray-400 text-sm mt-1">
              {loading ? 'Loading...' : `${filteredAndSortedCoins.length} coins found`}
            </p>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search coins..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Verified Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                value={filterVerified === null ? 'all' : filterVerified ? 'verified' : 'unverified'}
                onChange={(e) => {
                  const value = e.target.value;
                  setFilterVerified(value === 'all' ? null : value === 'verified');
                }}
                className="pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Coins</option>
                <option value="verified">Verified Only</option>
                <option value="unverified">Unverified Only</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
            <span className="ml-2 text-gray-400">Loading coins data...</span>
          </div>
        ) : filteredAndSortedCoins.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-400">No coins found matching your criteria</p>
            </div>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-700/50">
              <tr>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-600/50"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center gap-2">
                    Name
                    {sortField === 'name' && (
                      <span className="text-blue-400">
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-600/50"
                  onClick={() => handleSort('symbol')}
                >
                  <div className="flex items-center gap-2">
                    Symbol
                    {sortField === 'symbol' && (
                      <span className="text-blue-400">
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-600/50"
                  onClick={() => handleSort('price')}
                >
                  <div className="flex items-center gap-2">
                    Price
                    {sortField === 'price' && (
                      <span className="text-blue-400">
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-600/50"
                  onClick={() => handleSort('market_cap')}
                >
                  <div className="flex items-center gap-2">
                    Market Cap
                    {sortField === 'market_cap' && (
                      <span className="text-blue-400">
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-600/50"
                  onClick={() => handleSort('volume_24h')}
                >
                  <div className="flex items-center gap-2">
                    24h Volume
                    {sortField === 'volume_24h' && (
                      <span className="text-blue-400">
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-600/50"
                  onClick={() => handleSort('price_change_24h')}
                >
                  <div className="flex items-center gap-2">
                    24h Change
                    {sortField === 'price_change_24h' && (
                      <span className="text-blue-400">
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredAndSortedCoins.map((coin) => (
                <tr key={coin.id} className="hover:bg-gray-700/30 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      {coin.icon_url ? (
                        <img 
                          src={coin.icon_url} 
                          alt={coin.name}
                          className="w-8 h-8 rounded-full"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                          <span className="text-gray-300 text-xs font-medium">
                            {coin.symbol.charAt(0)}
                          </span>
                        </div>
                      )}
                      <div>
                        <div className="text-sm font-medium text-white">{coin.name}</div>
                        <div className="text-xs text-gray-400">{coin.decimals} decimals</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-mono text-blue-400">{coin.symbol}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {coin.verified ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-900/20 text-green-400 border border-green-600/30">
                        <Shield className="w-3 h-3" />
                        Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-700 text-gray-400">
                        Unverified
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                    {formatPrice(coin.price)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                    {formatMarketCap(coin.market_cap)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                    {formatVolume(coin.volume_24h)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {formatPriceChange(coin.price_change_24h)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {coin.project_url && (
                      <a
                        href={coin.project_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        <ExternalLink className="w-3 h-3" />
                        Visit
                      </a>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
