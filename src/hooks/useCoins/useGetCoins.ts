import { useEffect, useState, useRef } from "react";
import axios from "axios";

// Cache to store fetched pages
const pageCache = new Map<string, any>();
let cachedCoinCount: number | null = null;
let cachedTotalPages: number | null = null;

export function useGetCoins(page: number = 0, size: number = 20) {
    const [coins, setCoins] = useState<any[]>([]);
    const [coinCount, setCoinCount] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(page);
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<Error | null>(null);
    const apiKey = import.meta.env.VITE_BLOCKBERRY_API_KEY;
    const abortControllerRef = useRef<AbortController | null>(null);

    
    async function fetchCoins() {
        if (!apiKey) {
            setError(new Error("Missing BlockBerry API Key"));
            setLoading(false);
            return;
        }

        // Cancel any ongoing request
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        abortControllerRef.current = new AbortController();

        const cacheKey = `${currentPage}-${size}`;
        
        // Check if page is already cached
        if (pageCache.has(cacheKey) && cachedCoinCount !== null && cachedTotalPages !== null) {
            setCoins(pageCache.get(cacheKey));
            setCoinCount(cachedCoinCount);
            setTotalPages(cachedTotalPages);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const requests = [
                axios.get(`https://api.blockberry.one/sui/v1/coins?page=${currentPage}&size=${size}&orderBy=DESC&sortBy=AGE`, {
                    headers: {
                        accept: '*/*',
                        "x-api-key": apiKey
                    },
                    signal: abortControllerRef.current.signal
                })
            ];

            // Only fetch total count if not cached
            if (cachedCoinCount === null) {
                requests.push(
                    axios.get("https://api.blockberry.one/sui/v1/coins/total", {
                        headers: {
                            accept: '*/*',
                            "x-api-key": apiKey
                        },
                        signal: abortControllerRef.current.signal
                    })
                );
            }

            const responses = await Promise.all(requests);
            const coinRes = responses[0];
            const coincountRes = responses[1];

            // Cache the page data
            pageCache.set(cacheKey, coinRes.data);
            setCoins(coinRes.data);

            // Update coin count and total pages if fetched
            if (coincountRes) {
                cachedCoinCount = coincountRes.data;
                cachedTotalPages = Math.ceil(coincountRes.data / size);
            }

            setCoinCount(cachedCoinCount!);
            setTotalPages(cachedTotalPages!);

            console.log('Fetched and cached page:', currentPage, coinRes.data);

        } catch (err: any) {
            if (err.name !== 'CanceledError') {
                console.error('Fetch error:', err.message);
                setError(err);
            }
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        fetchCoins();
        
        // Cleanup function to cancel ongoing requests
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, [currentPage, size])

    const goToPage = (newPage: number) => {
        if (newPage >= 0 && newPage < totalPages) {
            setCurrentPage(newPage);
        }
    };

    const clearCache = () => {
        pageCache.clear();
        cachedCoinCount = null;
        cachedTotalPages = null;
    };

    const nextPage = () => goToPage(currentPage + 1);
    const prevPage = () => goToPage(currentPage - 1);

    return { 
        coins, 
        coinCount, 
        loading, 
        error, 
        currentPage, 
        totalPages, 
        nextPage, 
        prevPage, 
        goToPage,
        clearCache
    }

}