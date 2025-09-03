import { useEffect, useMemo, useState } from 'react';
import { fetchWALPrice, fetchWalrusOverviewData, calculateWalrusData, calculateStorageCosts } from '../api/walrus';
import type { WalrusOverviewData } from '../api/walrus';

export function useWalrus(amount: number = 100, unit: string = 'GB') {
const [overview, setOverview] = useState<WalrusOverviewData | null>(null);
const [walPriceUSD, setWalPriceUSD] = useState<number | null>(null);
const [storageCosts, setStorageCosts] = useState<any[] | null>(null);
const [meta, setMeta] = useState<any | null>(null);
const [loading, setLoading] = useState<boolean>(true);
const [error, setError] = useState<string | null>(null);

useEffect(() => {
let cancelled = false;
async function load() {
setLoading(true);
setError(null);
try {
const [overviewData, wal] = await Promise.all([
fetchWalrusOverviewData(amount, unit),
fetchWALPrice().catch(() => ({ price: 0, marketCap: 0, supply: 0 }))
]);
if (cancelled) return;
setOverview(overviewData);
setWalPriceUSD(wal.price ?? 0);
const derived = await calculateWalrusData();
if (cancelled) return;
setMeta(derived);
const costs = await calculateStorageCosts(wal.price ?? 0, undefined, amount, unit);
if (cancelled) return;
setStorageCosts(costs);
} catch (e: any) {
if (cancelled) return;
setError(e?.message || 'Failed to load Walrus data');
} finally {
if (!cancelled) setLoading(false);
}
}
load();
return () => { cancelled = true; };
}, [amount, unit]);

return useMemo(() => ({ overview, walPriceUSD, storageCosts, meta, loading, error }), [overview, walPriceUSD, storageCosts, meta, loading, error]);
}

export default useWalrus;
