import { useEffect, useState } from "react";
import axios from "axios";

type Asset = {
  name: string;
  contractAddress: string;
  contractAddressUrl: string;
  can_deposit: string;
  can_withdraw: string;
  unified_cryptoasset_id?: string;
};

type Ticker = {
  last_price: number;
  base_volume: number;
  quote_volume: number;
  isFrozen: number;
};

export function useDeepAssets() {
  const [assets, setAssets] = useState<Record<string, Asset>>({});
  const [tickers, setTickers] = useState<Record<string, Ticker>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        const [assetsRes, tickerRes] = await Promise.all([
          axios.get("https://deepbook-indexer.mainnet.mystenlabs.com/assets"),
          axios.get("https://deepbook-indexer.mainnet.mystenlabs.com/ticker"),
        ]);

        setAssets(assetsRes.data);
        setTickers(tickerRes.data);
      } catch (err: any) {
        setError(err.message || "Failed to fetch DeepBook data");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return { assets, tickers, loading, error };
}
