import { useState, useEffect, useMemo } from 'react';
import { fetchAccountBlobs, fetchBlobEvents, fetchBlobLifetime } from '../api/walrus';
import type { WalrusBlob, BlobEvent, BlobLifetime } from '../api/walrus';

interface UseWalrusBlobsResult {
  blobs: WalrusBlob[];
  blobEvents: Record<string, BlobEvent[]>;
  blobLifetimes: Record<string, BlobLifetime | null>;
  loading: boolean;
  error: string | null;
}

/**
 * Hook for fetching and managing Walrus blob data for an account
 * @param account The account address
 * @returns Object containing blobs, events, lifetimes, loading state, and error
 */
export function useWalrusBlobs(account: string): UseWalrusBlobsResult {
  const [blobs, setBlobs] = useState<WalrusBlob[]>([]);
  const [blobEvents, setBlobEvents] = useState<Record<string, BlobEvent[]>>({});
  const [blobLifetimes, setBlobLifetimes] = useState<Record<string, BlobLifetime | null>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadBlobData() {
      if (!account) return;
      
      setLoading(true);
      setError(null);
      
      try {
        // Fetch blobs owned by the account
        const accountBlobs = await fetchAccountBlobs(account);
        if (cancelled) return;
        setBlobs(accountBlobs);
        
        // Fetch events and lifetimes for each blob
        const eventsPromises = accountBlobs.map(blob => fetchBlobEvents(blob.id));
        const lifetimePromises = accountBlobs.map(blob => fetchBlobLifetime(blob.id));
        
        const eventsResults = await Promise.all(eventsPromises);
        const lifetimeResults = await Promise.all(lifetimePromises);
        
        if (cancelled) return;
        
        // Create maps of events and lifetimes by blob ID
        const eventsMap: Record<string, BlobEvent[]> = {};
        const lifetimesMap: Record<string, BlobLifetime | null> = {};
        
        accountBlobs.forEach((blob, index) => {
          eventsMap[blob.id] = eventsResults[index];
          lifetimesMap[blob.id] = lifetimeResults[index];
        });
        
        setBlobEvents(eventsMap);
        setBlobLifetimes(lifetimesMap);
      } catch (e: any) {
        if (cancelled) return;
        setError(e?.message || 'Failed to load Walrus blob data');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    
    loadBlobData();
    
    return () => { cancelled = true; };
  }, [account]);

  return useMemo(
    () => ({ blobs, blobEvents, blobLifetimes, loading, error }),
    [blobs, blobEvents, blobLifetimes, loading, error]
  );
}

export default useWalrusBlobs;