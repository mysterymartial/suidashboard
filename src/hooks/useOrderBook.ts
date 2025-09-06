import { useState, useEffect } from "react";

const BASE_URL = "https://deepbook-indexer.mainnet.mystenlabs.com/orderbook";

export type OrderBookRow = [string, string]; // [price, quantity]
export interface OrderBookResponse {
  timestamp: string;
  bids: OrderBookRow[];
  asks: OrderBookRow[];
}

export function useOrderBook(pair: string) {
  const [data, setData] = useState<OrderBookResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!pair) return;

    async function fetchOrderBook() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${BASE_URL}/${pair}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        setData(json);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchOrderBook();
  }, [pair]);

  return { data, loading, error };
}
