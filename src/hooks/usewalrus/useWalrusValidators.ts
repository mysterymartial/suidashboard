import { useEffect, useState, useRef } from "react";

interface WalrusValidator {
  validatorHash: string;
  validatorName: string;
  status: string;
  stake: number;
  commissionRate: number;
  uptime: number;
  rank: number;
  [key: string]: any; // optional: for extra fields
}

interface WalrusValidatorResponse {
  data: WalrusValidator[];
  page: number;
  size: number;
  total: number;
}

type ValidatorCache = Record<number, any>;

export function useWalrusValidators(page: number = 0) {
  const [validatorsData, setValidatorsData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const apiKey = import.meta.env.VITE_BLOCKBERRY_API_KEY;
  const cache = useRef<ValidatorCache>({});
  const lastRequestTime = useRef<number>(0);

  useEffect(() => {
    let cancelled = false;

    const fetchValidators = async () => {
      if (cache.current[page]) {
        setValidatorsData(cache.current[page]);
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
          `https://api.blockberry.one/walrus-mainnet/v1/validators?page=${page}&size=20&orderBy=DESC&sortBy=STAKE`,
          { headers: { accept: "*/*", "x-api-key": apiKey } }
        );

        lastRequestTime.current = Date.now();

        if (!res.ok) throw new Error(`API Error: ${res.statusText}`);

        const data = await res.json();
        cache.current[page] = data;
        if (!cancelled) setValidatorsData(data);
      } catch (err: any) {
        if (!cancelled) setError(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    // fetchValidators();

    return () => { cancelled = true; };
  }, [page, apiKey]);

  return { validatorsData, loading, error };
}
