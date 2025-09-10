import { useEffect, useState, useRef, useCallback } from "react";

interface BlobItem {
  blobId: string;
  blobIdBase64: string;
  objectId: string;
  status: string;
  startEpoch: number;
  endEpoch: number;
  size: number;
  timestamp: number;
}

interface BlobResponse {
  content: BlobItem[];
  pageable: {
    pageNumber: number;
    pageSize: number;
  };
  totalPages: number;
  totalElements: number;
}

type Cache = Record<number, BlobResponse>;

export function useWalrusBlob(page: number = 0) {
  const [blobData, setBlobData] = useState<BlobResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const apiKey = import.meta.env.VITE_BLOCKBERRY_API_KEY;
  const cache = useRef<Cache>({});
  const lastRequestTime = useRef<number>(0);

  const fetchBlobData = useCallback(async () => {
    if (cache.current[page]) {
      setBlobData(cache.current[page]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (!apiKey) throw new Error("Missing BlockBerry API Key");

      const now = Date.now();
      const elapsed = now - lastRequestTime.current;
      if (elapsed < 15000) await new Promise(r => setTimeout(r, 15000 - elapsed));

      const res = await fetch(
        `https://api.blockberry.one/walrus-mainnet/v1/blobs?page=${page}&size=20&orderBy=DESC&sortBy=TIMESTAMP`,
        {
          headers: { accept: "*/*", "x-api-key": apiKey },
        }
      );

      lastRequestTime.current = Date.now();

      if (!res.ok) throw new Error(`API Error: ${res.statusText}`);
      const data: BlobResponse = await res.json();
      cache.current[page] = data;
      setBlobData(data);
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [page, apiKey]);

  useEffect(() => {
    let isCancelled = false;
    if (!isCancelled) fetchBlobData();
    return () => { isCancelled = true; };
  }, [fetchBlobData]);

  return { blobData, loading, error };
}
