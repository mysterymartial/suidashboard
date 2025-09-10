import React, { useState, useEffect } from "react";
import { Layout } from "../../components/layout/Layout";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Activity,
  Users,
  Zap,
} from "lucide-react";
import CardComponent from "@/components/cards";
import { Spinner } from "../../components/ui/Spinner";

// Types for API responses
interface CoinDetails {
  id: string;
  name: string;
  symbol: string;
  market_cap_rank: number;
  image: {
    thumb: string;
    small: string;
    large: string;
  };
  market_data: {
    current_price: {
      usd: number;
    };
    market_cap: {
      usd: number;
    };
    total_volume: {
      usd: number;
    };
    price_change_24h: {
      usd: number;
    };
    price_change_percentage_24h: {
      usd: number;
    };
    market_cap_change_24h: {
      usd: number;
    };
    circulating_supply: number;
    total_supply: number;
    ath: {
      usd: number;
    };
    atl: {
      usd: number;
    };
  };
  description: {
    en: string;
  };
  links: {
    homepage: string[];
    whitepaper: string;
    blockchain_site: string[];
    official_forum_url: string[];
    chat_url: string[];
    announcement_url: string[];
    twitter_screen_name: string;
    facebook_username: string;
    telegram_channel_identifier: string;
    subreddit_url: string | null;
    repos_url: {
      github: string[];
      bitbucket: string[];
    };
  };
  contract_address: string;
  country_origin: string;
  genesis_date: string | null;
  tickers: Array<{
    base: string;
    target: string;
    market: {
      name: string;
      identifier: string;
      has_trading_incentive: boolean;
    };
    last: number;
    volume: number;
    converted_last: {
      btc: number;
      eth: number;
      usd: number;
    };
    converted_volume: {
      btc: number;
      eth: number;
      usd: number;
    };
    trust_score: string;
    trade_url: string;
    bid_ask_spread_percentage?: number;
  }>;
}

function ProtocolStats() {
  const [coinData, setCoinData] = useState<CoinDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCoinDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "https://api.coingecko.com/api/v3/coins/ika",
        );
        if (!response.ok) {
          throw new Error("Failed to fetch coin details");
        }
        const data = await response.json();
        setCoinData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchCoinDetails();
  }, []);

  const formatNumber = (num: number) => {
    if (num >= 1e9) return (num / 1e9).toFixed(2) + "B";
    if (num >= 1e6) return (num / 1e6).toFixed(2) + "M";
    if (num >= 1e3) return (num / 1e3).toFixed(2) + "K";
    return num.toFixed(2);
  };

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(num);
  };

  if (loading) {
    return (
      <Layout>
        <main className="p-6 space-y-8">
          <CardComponent>
            <h2 className="text-2xl font-semibold text-[#292929]">
              Ika - Protocol Stats
            </h2>
            <p className="text-[#292929] mt-1">Protocol metrics and statistics.</p>
          </CardComponent>
          <Spinner />
          <CardComponent>
            <div className="animate-pulse">
              <div className="h-8 bg-gray-700 rounded w-1/3 mb-4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-700 rounded w-full"></div>
                <div className="h-4 bg-gray-700 rounded w-3/4"></div>
              </div>
            </div>
          </CardComponent>
        </main>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <main className="p-6 space-y-8">
          <CardComponent>
            <h2 className="text-2xl font-semibold text-[#292929]">
              Ika - Protocol Stats
            </h2>
            <p className="text-[#292929] mt-1">
              Error loading protocol metrics.
            </p>
          </CardComponent>
          <CardComponent>
            <h3 className="text-lg font-semibold mb-2 text-[#292929]">
              Error Loading Coin Data
            </h3>
            <p>{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-red-700 hover:bg-red-600 rounded-lg transition-colors text-[#292929]"
            >
              Retry
            </button>
          </CardComponent>
        </main>
      </Layout>
    );
  }

  if (!coinData) return null;

  const isPositive = coinData.market_data.price_change_percentage_24h.usd > 0;

  return (
    <Layout>
      <main className="p-6 space-y-8">
        <CardComponent>
          <h2 className="text-2xl font-semibold text-[#292929]">
            Ika - Protocol Stats
          </h2>
          <p className="text-[#292929] mt-1">
            Key performance metrics across the protocol.
          </p>
        </CardComponent>

        <div className="space-y-8">
          <CardComponent>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <img
                  src={coinData.image?.large}
                  alt={coinData.name}
                  className="w-12 h-12 rounded-full"
                  onError={(e) => {
                    e.currentTarget.src = "/assets/ika-icon-white.svg";
                  }}
                />
                <div>
                  <h2 className="text-2xl font-bold text-[#292929]">
                    {coinData.name}
                  </h2>
                  <p className="text-[#292929] uppercase">{coinData.symbol}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-[#292929]">
                  {formatCurrency(coinData.market_data.current_price.usd)}
                </div>
                <div
                  className={`flex items-center space-x-1 ${isPositive ? "text-green-400" : "text-red-400"}`}
                >
                  {isPositive ? (
                    <TrendingUp size={16} />
                  ) : (
                    <TrendingDown size={16} />
                  )}
                  {/* <span>
                    {Math.abs(
                      coinData.market_data.price_change_percentage_24h.usd,
                    ).toFixed(2)}
                    %
                  </span> */}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <CardComponent>
                <div className="flex items-center space-x-2 mb-2">
                  <DollarSign size={20} className="text-[#292929]" />
                  <span className="text-[#292929]">Market Cap</span>
                </div>
                <div className="text-xl font-semibold text-[#292929]">
                  {formatCurrency(coinData.market_data.market_cap.usd)}
                </div>
                <div className="text-sm text-[#292929]">
                  Rank #{coinData.market_cap_rank}
                </div>
              </CardComponent>

              <CardComponent>
                <div className="flex items-center space-x-2 mb-2">
                  <Activity size={20} className="text-green-400" />
                  <span className="text-[#292929]">24h Volume</span>
                </div>
                <div className="text-xl font-semibold text-[#292929]">
                  {formatCurrency(coinData.market_data.total_volume.usd)}
                </div>
              </CardComponent>

              <CardComponent>
                <div className="flex items-center space-x-2 mb-2">
                  <Users size={20} className="text-[#292929]" />
                  <span className="text-[#292929]">Circulating Supply</span>
                </div>
                <div className="text-xl font-semibold text-[#292929]">
                  {formatNumber(coinData.market_data.circulating_supply)}
                </div>
                <div className="text-sm text-[#292929]">
                  {coinData.symbol.toUpperCase()}
                </div>
              </CardComponent>

              <CardComponent>
                <div className="flex items-center space-x-2 mb-2">
                  <Zap size={20} className="text-[#292929]" />
                  <span className="text-[#292929]">All Time High</span>
                </div>
                <div className="text-xl font-semibold text-[#292929]">
                  {formatCurrency(coinData.market_data.ath.usd)}
                </div>
              </CardComponent>

              <CardComponent>
                <div className="flex items-center space-x-2 mb-2">
                  <TrendingDown size={20} className="text-red-400" />
                  <span className="text-[#292929]">All Time Low</span>
                </div>
                <div className="text-xl font-semibold text-[#292929]">
                  {formatCurrency(coinData.market_data.atl.usd)}
                </div>
              </CardComponent>

              {/* <CardComponent>
                <div className="flex items-center space-x-2 mb-2">
                  <DollarSign size={20} className="text-[#292929]" />
                  <span className="text-[#292929]">24h Change</span>
                </div>
                <div
                  className={`text-xl font-semibold ${isPositive ? "text-green-400" : "text-red-400"}`}
                >
                  {formatCurrency(coinData.market_data.price_change_24h.usd)}
                </div>
              </CardComponent> */}
            </div>

            {coinData.description && coinData.description.en && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-3 text-[#292929]">
                  About {coinData.name}
                </h3>
                <p className="text-[#292929] leading-relaxed">
                  {coinData.description.en.split(".")[0]}.
                </p>
              </div>
            )}
          </CardComponent>

          {/* Contract Information */}
          <CardComponent>
            <h3 className="text-xl font-semibold text-[#292929] mb-4">
              Contract Information
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[#292929]">Contract Address:</span>
                <span className="text-[#292929] font-mono text-sm break-all">
                  {coinData.contract_address}
                </span>
              </div>
              {coinData.genesis_date && (
                <div className="flex justify-between items-center">
                  <span className="text-[#292929]">Genesis Date:</span>
                  <span className="text-[#292929]">
                    {new Date(coinData.genesis_date).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          </CardComponent>

          {/* Links Section */}
          {coinData.links && (
            <CardComponent>
              <h3 className="text-xl font-semibold text-[#292929] mb-4">
                Official Links
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {coinData.links.homepage &&
                  coinData.links.homepage.length > 0 && (
                    <div>
                      <h4 className="text-[#292929] mb-2">Homepage</h4>
                      {coinData.links.homepage.map((link, index) => (
                        <a
                          key={index}
                          href={link.trim()}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-[#292929] block"
                        >
                          {link.trim()}
                        </a>
                      ))}
                    </div>
                  )}
                {coinData.links.whitepaper && (
                  <div>
                    <h4 className="text-[#292929] mb-2">Whitepaper</h4>
                    <a
                      href={coinData.links.whitepaper.trim()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-[#292929]"
                    >
                      {coinData.links.whitepaper.trim()}
                    </a>
                  </div>
                )}
                {coinData.links.blockchain_site &&
                  coinData.links.blockchain_site.length > 0 && (
                    <div>
                      <h4 className="text-[#292929] mb-2">
                        Blockchain Explorers
                      </h4>
                      {coinData.links.blockchain_site.map((link, index) => (
                        <a
                          key={index}
                          href={link.trim()}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-[#292929] block"
                        >
                          {link.trim().includes("suiscan")
                            ? "SuiScan"
                            : link.trim().includes("suivision")
                              ? "SuiVision"
                              : "Explorer"}
                        </a>
                      ))}
                    </div>
                  )}
                {coinData.links.twitter_screen_name && (
                  <div>
                    <h4 className="text-[#292929] mb-2">Social Media</h4>
                    <a
                      href={`https://twitter.com/${coinData.links.twitter_screen_name}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-[#292929] block"
                    >
                      @{coinData.links.twitter_screen_name}
                    </a>
                    {coinData.links.telegram_channel_identifier && (
                      <a
                        href={`https://t.me/${coinData.links.telegram_channel_identifier}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-[#292929] block"
                      >
                        Telegram: {coinData.links.telegram_channel_identifier}
                      </a>
                    )}
                  </div>
                )}
                {coinData.links.repos_url &&
                  coinData.links.repos_url.github &&
                  coinData.links.repos_url.github.length > 0 && (
                    <div>
                      <h4 className="text-[#292929] mb-2">GitHub</h4>
                      {coinData.links.repos_url.github.map((link, index) => (
                        <a
                          key={index}
                          href={link.trim()}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-[#292929] block"
                        >
                          {link.trim()}
                        </a>
                      ))}
                    </div>
                  )}
              </div>
            </CardComponent>
          )}

          {/* Trading Markets */}
          {coinData.tickers && coinData.tickers.length > 0 && (
            <CardComponent>
              <h3 className="text-xl font-semibold text-[#292929] mb-4">
                Trading Markets ({coinData.tickers.length} exchanges)
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border border-[#DCDCDC]">
                      <th className="text-left py-3 px-2 text-[#292929]">
                        Exchange
                      </th>
                      <th className="text-left py-3 px-2 text-[#292929]">
                        Pair
                      </th>
                      <th className="text-right py-3 px-2 text-[#292929]">
                        Price (USD)
                      </th>
                      <th className="text-right py-3 px-2 text-[#292929]">
                        Native Price
                      </th>
                      <th className="text-right py-3 px-2 text-[#292929]">
                        24h Volume
                      </th>
                      <th className="text-right py-3 px-2 text-[#292929]">
                        Volume (USD)
                      </th>
                      <th className="text-center py-3 px-2 text-[#292929]">
                        Trust
                      </th>
                      <th className="text-center py-3 px-2 text-[#292929]">
                        Spread
                      </th>
                      <th className="text-center py-3 px-2 text-[#292929]">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {coinData.tickers.map((ticker, index) => {
                      const formatPair = (base: string, target: string) => {
                        // Clean up long contract addresses for display
                        const cleanBase = base.includes("::")
                          ? base.split("::").pop() || base
                          : base;
                        const cleanTarget = target.includes("::")
                          ? target.split("::").pop() || target
                          : target;
                        return `${cleanBase}/${cleanTarget}`;
                      };

                      const getExchangeColor = (name: string): string => {
                        const colors: Record<string, string> = {
                          Bitget: "text-blue-400",
                          KuCoin: "text-green-400",
                          Gate: "text-purple-400",
                          Cetus: "text-cyan-400",
                          Bitvavo: "text-orange-400",
                        };
                        return colors[name] || "text-[#292929]";
                      };

                      return (
                        <tr
                          key={index}
                          className="border border-[#DCDCDC] hover:bg-gray-100 transition-colors"
                        >
                          <td
                            className={`py-3 px-2 font-medium ${getExchangeColor(ticker.market.name)}`}
                          >
                            {ticker.market.name}
                            {ticker.market.has_trading_incentive && (
                              <span className="ml-1 text-xs bg-yellow-600 text-yellow-100 px-1 rounded">
                                🎁
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-2 text-[#292929] font-mono text-xs">
                            {formatPair(ticker.base, ticker.target)}
                          </td>
                          <td className="py-3 px-2 text-right text-[#292929] font-semibold">
                            ${ticker.converted_last.usd.toFixed(6)}
                          </td>
                          <td className="py-3 px-2 text-right text-[#292929] font-mono text-xs">
                            {ticker.last.toFixed(8)}
                          </td>
                          <td className="py-3 px-2 text-right text-[#292929]">
                            {formatNumber(ticker.volume)}
                          </td>
                          <td className="py-3 px-2 text-right text-green-400 font-semibold">
                            ${formatNumber(ticker.converted_volume.usd)}
                          </td>
                          <td className="py-3 px-2 text-center">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                ticker.trust_score === "green"
                                  ? "bg-green-900/50 text-green-300 border border-green-700"
                                  : ticker.trust_score === "yellow"
                                    ? "bg-yellow-900/50 text-yellow-300 border border-yellow-700"
                                    : "bg-red-900/50 text-red-300 border border-red-700"
                              }`}
                            >
                              {ticker.trust_score}
                            </span>
                          </td>
                          <td className="py-3 px-2 text-center text-[#292929] text-xs">
                            {ticker.bid_ask_spread_percentage?.toFixed(2) || 'N/A'}%
                          </td>
                          <td className="py-3 px-2 text-center">
                            <a
                              href={ticker.trade_url?.trim()}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center px-3 py-1 bg-blue-600 hover:bg-blue-500 text-[#292929] text-xs rounded-md transition-colors"
                            >
                              Trade →
                            </a>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 text-xs text-[#292929]">
                <p>
                  • Trust scores: <span className="text-green-300">Green</span>{" "}
                  = High, <span className="text-yellow-300">Yellow</span> =
                  Medium, <span className="text-red-300">Red</span> = Low
                </p>
                <p>• 🎁 indicates exchanges with trading incentives</p>
                <p>• Prices updated in real-time from CoinGecko API</p>
              </div>
            </CardComponent>
          )}

          {/* Description Section */}
          {coinData.description && coinData.description.en && (
            <CardComponent>
              <h3 className="text-xl font-semibold text-[#292929] mb-4">
                About {coinData.name}
              </h3>
              <p className="text-[#292929] leading-relaxed">
                {coinData.description.en}
              </p>
            </CardComponent>
          )}
        </div>
      </main>
    </Layout>
  );
}

export default ProtocolStats;