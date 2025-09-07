import { useEffect, useState } from "react";

export function useWalrusAnalytics() {
    const [analyticsData, setAnalyticsData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const apiKey = import.meta.env.VITE_BLOCKBERRY_API_KEY;

    async function fetchAnalyticsData() {
        setLoading(true);
        setError(null);

        try {
      if (!apiKey) {
        throw new Error("Missing BlockBerry API Key");
      }

      const res = await fetch(
        "https://api.blockberry.one/walrus-mainnet/v1/widgets/avg-blob-size?period=24H&size=SMALL&widgetPage=HOME",
        {
          method: "GET",
          headers: {
            accept: "*/*",
            "x-api-key": apiKey,
          },
        }
      );

      if (!res.ok) {
        throw new Error(`API Error: ${res.statusText}`);
      }

      const data = await res.json();
      setAnalyticsData(data);
      console.log(data);
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
    }

    useEffect(() => {
        // fetchAnalyticsData();
    }, []);

    return { analyticsData, loading, error  };

}