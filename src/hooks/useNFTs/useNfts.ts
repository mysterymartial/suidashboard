import { useEffect, useState } from "react";
import axios from "axios";

export function useNfts() {
    const [nft, setNfts] = useState<any[]>([]);
    const [nftCount, setNftCount] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<Error | null>(null);
    const apiKey = import.meta.env.VITE_BLOCKBERRY_API_KEY;

    async function fetchNfts() {
        if (!apiKey) {
            setError(new Error("Missing BlockBerry API Key"));
            return;
        }
        try {
            setLoading(true)

            const [nftRes, nftcountRes] = await Promise.all([
                axios.get("https://api.blockberry.one/sui/v1/nfts?page=0&size=20&orderBy=DESC&sortBy=AGE", {
                    headers: {
                        accept: '*/*',
                        "x-api-key": apiKey
                    }
                }),
                axios.get("https://api.blockberry.one/sui/v1/nfts/total", {
                    headers: {
                        accept: '*/*',
                        "x-api-key": apiKey
                    }
                })
            ])

            setNfts(nftRes.data.content || [])
            // console.log(nftRes.data.content || [])
            setNftCount(nftcountRes.data)
            console.log(nftcountRes.data)

        } catch (err: any) {
            console.error(err.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchNfts()
    }, [])

    return { nft, nftCount, loading, error }
}