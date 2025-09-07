import { useEffect, useState, useRef } from "react";

type AccountCache = Record<number, any>; // page -> data

export function useWalrusBlob(page: number = 0) {
  const [blobData, setBlobData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const apiKey = import.meta.env.VITE_BLOCKBERRY_API_KEY;
  const cache = useRef<AccountCache>({});
  const lastRequestTime = useRef<number>(0);



  useEffect(() => {

    let isCancelled = false;

    async function fetchBlobData() {
      if(cache.current[page]) {
        setBlobData(cache.current[page]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        if (!apiKey) {
          throw new Error("Missing BlockBerry API Key");
        }

        const now = Date.now();
        const elapsed = now - lastRequestTime.current;
        if (elapsed < 15000) {
          await new Promise((resolve) => setTimeout(resolve, 15000 - elapsed));
        }
        if (isCancelled) return;
        const res = await fetch(
          `https://api.blockberry.one/walrus-mainnet/v1/blobs?page=${page}&size=20&orderBy=DESC&sortBy=TIMESTAMP`,
          {
            // method: "GET",
            headers: {
              accept: "*/*",
              "x-api-key": apiKey,
            },
          }
        );

        lastRequestTime.current = Date.now(); // update last request time

        if (!res.ok) {
          throw new Error(`API Error: ${res.statusText}`);
        }

        const data = await res.json();
        cache.current[page] = data; // cache the page
        if (!isCancelled) setBlobData(data);
        console.log(data);
      } catch (err: any) {
        if (!isCancelled) setError(err);
      } finally {
        if (!isCancelled) setLoading(false);
      }

    }

    fetchBlobData();

    return () => {
      isCancelled = true;
    };

  }, [page, apiKey]);

  return { blobData, loading, error };
}