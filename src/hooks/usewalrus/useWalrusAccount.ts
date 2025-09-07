import { useEffect, useState, useRef } from "react";

interface WalrusAccount {
  accountId: string;
  accountAddress: string;
  balance: number;
  baseAssetId: string;
  baseAssetName: string;
  baseAssetSymbol: string;
  baseAssetDecimals: number;
  lotSize: number;
  minSize: number;
  [key: string]: any; // optional: for any extra fields
}

interface WalrusAccountResponse {
  data: WalrusAccount[];
  page: number;
  size: number;
  total: number;
}

type AccountCache = Record<number, any>;

export function useWalrusAccount(page: number = 0) {
  const [accountData, setAccountData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const apiKey = import.meta.env.VITE_BLOCKBERRY_API_KEY;
  const cache = useRef<AccountCache>({});
  const lastRequestTime = useRef<number>(0);

  useEffect(() => {
    let cancelled = false;

    const fetchAccounts = async () => {
      if (cache.current[page]) {
        setAccountData(cache.current[page]);
        return;
      }

      if (!apiKey) {
        setError(new Error("Missing BlockBerry API Key"));
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const elapsed = Date.now() - lastRequestTime.current;
        if (elapsed < 15000) await new Promise(r => setTimeout(r, 15000 - elapsed));

        if (cancelled) return;

        const res = await fetch(
          `https://api.blockberry.one/walrus-mainnet/v1/accounts?page=${page}&size=20&orderBy=DESC&sortBy=BALANCE`,
          { headers: { accept: "*/*", "x-api-key": apiKey } }
        );

        lastRequestTime.current = Date.now();

        if (!res.ok) throw new Error(`API Error: ${res.statusText}`);

        const data = await res.json();
        cache.current[page] = data;
        if (!cancelled) setAccountData(data);
      } catch (err: any) {
        if (!cancelled) setError(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchAccounts();

    return () => { cancelled = true; };
  }, [page, apiKey]);

  return { accountData, loading, error };
}
