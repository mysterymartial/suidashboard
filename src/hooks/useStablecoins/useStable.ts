import { useEffect, useState } from "react";
import axios from "axios";

interface StablecoinData {
  date: string;
  totalCirculating: { peggedUSD: number };
  totalCirculatingUSD: { peggedUSD: number };
  totalMintedUSD: { peggedUSD: number };
}

export function useStablecoinData() {
  const [data, setData] = useState<StablecoinData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axios.get<StablecoinData[]>(
          "https://stablecoins.llama.fi/stablecoincharts/Sui",
          { timeout: 10000 } // 10s timeout
        );
        setData(res.data);
        console.log(res.data)
      } catch (err: any) {
        setError(err.message || "Failed to fetch stablecoin data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
}
