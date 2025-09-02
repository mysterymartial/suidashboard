import { useEffect, useState } from "react";
import axios from "axios";

export function usePoolsData() {
  const [dbdata, setDbdata] = useState<any[]>([]);
  const [suidata, setSuidata] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    axios
      .get("https://deepbook-indexer.mainnet.mystenlabs.com/get_pools")
      .then((res) => setDbdata(res.data))
      .catch((err) => setError(err))
      .finally(() => setLoading(false));

  axios
    .get(
      "api/external-api/insidex/pools/top-liquidity?limit=10&platforms=cetus%2Cturbos",
      {
        headers: {
          "x-api-key": "insidex_api.hGhJarqGjnUDkw36WUXETXyR"
        }
      }
    )
    .then((res) => setSuidata(res.data))
    .catch((err) => setError(err))
    .finally(() => setLoading(false))

console.log(suidata)
  }, []);

  return { dbdata, suidata, loading, error };
}
