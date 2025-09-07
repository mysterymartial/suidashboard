import { useEffect, useState } from "react";

export function useWalrusBlob() {
    const [blobData, setBlobData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const apiKey = import.meta.env.VITE_BLOCKBERRY_API_KEY;

    async function fetchBlobData() {
        setLoading(true);
        setError(null);

        try {
      if (!apiKey) {
        throw new Error("Missing BlockBerry API Key");
      }

      const res = await fetch(
        "https://api.blockberry.one/walrus-mainnet/v1/blobs?page=0&size=20&orderBy=DESC&sortBy=TIMESTAMP",
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
      setBlobData(data);
      console.log(data);
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }

    }
    
    useEffect(() => {
        // fetchBlobData();
    }, []);

    return { blobData, loading, error  };
}