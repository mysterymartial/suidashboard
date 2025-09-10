import { useEffect, useState, useRef, useCallback } from "react";

type AnalyticsResponse = {
  value: number;
  changeValue: number;
  changePercent: number | null;
  additionalValue: number | null;
  maxRate: number | null;
  changeRate: number | null;
  changePeriod: string;
  noChanges: boolean;
  chart: { value: number; timestamp: number }[];
};

export function useWalrusAnalytics() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsResponse | null>(null);
  const [accountCount, setAccountCount] = useState<AnalyticsResponse | null>(null);
  const [blobCount, setBlobCount] = useState<AnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const lastRequestTime = useRef<number>(0);
  const apiKey = import.meta.env.VITE_BLOCKBERRY_API_KEY;

  const fetchData = useCallback(async (url: string, setState: (data: AnalyticsResponse) => void) => {
    if (!apiKey) throw new Error("Missing BlockBerry API Key");
    setLoading(true);
    setError(null);

    try {
      // Rate limiting: wait 15 seconds between requests
      const now = Date.now();
      const elapsed = now - lastRequestTime.current;
      if (elapsed < 15000) {
        await new Promise((resolve) => setTimeout(resolve, 15000 - elapsed));
      }

      const res = await fetch(url, {
        headers: {
          accept: "*/*",
          "x-api-key": apiKey,
        },
      });

      lastRequestTime.current = Date.now();

      if (!res.ok) throw new Error(`API Error: ${res.statusText}`);
      const data: AnalyticsResponse = await res.json();
      setState(data);
      console.log(data);
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [apiKey]);

  useEffect(() => {
    let isCancelled = false;

    const safeFetch = async () => {
      if (!isCancelled) await fetchData(
        "https://api.blockberry.one/walrus-mainnet/v1/widgets/avg-blob-size?period=24H&size=SMALL&widgetPage=HOME",
        setAnalyticsData
      );

      if (!isCancelled) await fetchData(
        "https://api.blockberry.one/walrus-mainnet/v1/widgets/total-accounts?period=24H&size=SMALL&widgetPage=HOME",
        setAccountCount
      );

      if (!isCancelled) await fetchData(
        "https://api.blockberry.one/walrus-mainnet/v1/widgets/total-blobs?period=24H&size=SMALL&widgetPage=HOME",
        setBlobCount
      );
    };

    safeFetch();

    return () => {
      isCancelled = true;
    };
  }, [fetchData]);

  return { analyticsData, accountCount, blobCount, loading, error };
}
