import { useEffect, useState } from "react";
import axios from "axios";

export type MarketData = {
  base_currency: string;
  quote_currency: string;
  trading_pairs: string;
  last_price: number;
  highest_bid: number;
  lowest_ask: number;
  highest_price_24h: number;
  lowest_price_24h: number;
  price_change_percent_24h: number;
  base_volume: number;
  quote_volume: number;
};

export function useMarketData() {
  const [marketdata, setMarketData] = useState<MarketData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const res = await axios.get<MarketData[]>(
          "https://deepbook-indexer.mainnet.mystenlabs.com/summary" // replace with actual endpoint
        );
        setMarketData(res.data);
      } catch (err: any) {
        setError(err.message || "Error fetching market data");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return { marketdata, loading, error };
}
