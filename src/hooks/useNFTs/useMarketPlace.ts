import { useEffect, useState } from "react";
import axios from "axios";

export function useMarketPlace() {
    const [marketplace, setMarketPlace] = useState<any[]>([]);
    const [topMarketplace, setTopMarketPlace] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<Error | null>(null);
    const apiKey = import.meta.env.VITE_BLOCKBERRY_API_KEY;

    async function fetchMarketPlace() {
        if (!apiKey) {
            setError(new Error("Missing BlockBerry API Key"));
            return;
        }
        try {
            setLoading(true)

            const [marketplaceRes, topMarketplaceRes] = await Promise.all([
                axios.get("https://api.blockberry.one/sui/v1/marketplaces?page=0&size=20&orderBy=DESC&period=DAY&sortBy=VOLUME&showWithVolume=true", {
                    headers: {
                        accept: '*/*',
                        "x-api-key": apiKey
                    }
                }),
                axios.get("https://api.blockberry.one/sui/v1/widgets/marketplaces?period=DAY", {
                    headers: {
                        accept: '*/*',
                        "x-api-key": apiKey
                    }
                })
            ])

            setMarketPlace(marketplaceRes.data.content || [])
            console.log(marketplaceRes.data)
            setTopMarketPlace(topMarketplaceRes.data)
            console.log(topMarketplaceRes.data)

        } catch (err: any) {
            console.error(err.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchMarketPlace()
    }, [])

    return { marketplace, topMarketplace, loading, error }
}