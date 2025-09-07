import { useEffect, useState, useRef } from "react";

type ValidatorCache = Record<number, any>; // page -> data

export function useWalrusValidators(page: number = 0) {
  const [validatorsData, setValidatorsData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const apiKey = import.meta.env.VITE_BLOCKBERRY_API_KEY;
  const cache = useRef<ValidatorCache>({});
  const lastRequestTime = useRef<number>(0);

  useEffect(() => {
    let isCancelled = false;

    async function fetchValidators() {
      // Return cached page immediately if available
      if (cache.current[page]) {
        setValidatorsData(cache.current[page]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        if (!apiKey) throw new Error("Missing BlockBerry API Key");

        // Ensure 15-second gap between requests
        const now = Date.now();
        const elapsed = now - lastRequestTime.current;
        if (elapsed < 15000) {
          await new Promise((resolve) => setTimeout(resolve, 15000 - elapsed));
        }

        if (isCancelled) return;

        const res = await fetch(
          `https://api.blockberry.one/walrus-mainnet/v1/validators?page=${page}&size=20&orderBy=DESC&sortBy=STAKE`,
          {
            headers: { accept: "*/*", "x-api-key": apiKey },
          }
        );

        lastRequestTime.current = Date.now(); // update last request time

        if (!res.ok) throw new Error(`API Error: ${res.statusText}`);

        const data = await res.json();
        cache.current[page] = data; // cache the page
        if (!isCancelled) setValidatorsData(data);
      } catch (err: any) {
        if (!isCancelled) setError(err);
      } finally {
        if (!isCancelled) setLoading(false);
      }
    }

    fetchValidators();

    return () => {
      isCancelled = true;
    };
  }, [page, apiKey]);

  return { validatorsData, loading, error };
}
