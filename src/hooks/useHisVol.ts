import { useState, useEffect } from "react";
import axios from "axios";

interface VolumeData {
  [pool: string]: number;
}

export function useHistoricalVolume() {
  const [allPools, setAllPools] = useState<string[]>([]);
  const [volumeData, setVolumeData] = useState<VolumeData>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all pools initially
  useEffect(() => {
    const fetchInitial = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          "https://deepbook-indexer.mainnet.mystenlabs.com/all_historical_volume?start_time=0&end_time=9999999999&volume_in_base=false"
        );
        setAllPools(Object.keys(res.data));
        setVolumeData(res.data);
      } catch (err: any) {
        setError(err.message || "Error fetching initial data");
      } finally {
        setLoading(false);
      }
    };
    fetchInitial();
  }, []);

  // Fetch by date range
  const fetchByRange = async (
    startUnix: number,
    endUnix: number,
    volumeInBase: boolean = false
  ) => {
    if (allPools.length === 0) return;
    try {
      setLoading(true);
      const poolNames = allPools.join(",");
      const url = `https://deepbook-indexer.mainnet.mystenlabs.com/historical_volume/${poolNames}?start_time=${startUnix}&end_time=${endUnix}&volume_in_base=${volumeInBase}`;
      const res = await axios.get(url);
      setVolumeData(res.data);
    } catch (err: any) {
      setError(err.message || "Error fetching range data");
    } finally {
      setLoading(false);
    }
  };

  return { allPools, volumeData, fetchByRange, loading, error };
}
