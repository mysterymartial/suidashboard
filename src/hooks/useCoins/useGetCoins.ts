import { useEffect, useState } from "react";
import axios from "axios";

export function useGetCoins() {
    const [coins, setCoins] = useState<any[]>([]);
    const [coinCount, setCoinCount] = useState<number>(0);
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<Error | null>(null);
    const apiKey = import.meta.env.VITE_BLOCKBERRY_API_KEY;

    
    async function fetchCoins() {
        if (!apiKey) {
            setError(new Error("Missing BlockBerry API Key"));
            return;
        }
        try {
            setLoading(true)

            const [coinRes, coincountRes] = await Promise.all([
                axios.get("https://api.blockberry.one/sui/v1/coins?page=0&size=20&orderBy=DESC&sortBy=AGE", {
                    headers: {
                        accept: '*/*',
                        "x-api-key": apiKey
                    }
                }),
                axios.get("https://api.blockberry.one/sui/v1/coins/total", {
                    headers: {
                        accept: '*/*',
                        "x-api-key": apiKey
                    }
                })
            ])

            // setCollections(collectionRes.data.content || [])
            console.log(coinRes.data)
            // setTopCollections(topCollectionRes.data)

        } catch (err: any) {
            console.error(err.message)
        } finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        // fetchCoins()
    }, [])

    return {coins, coinCount, loading, error}

}