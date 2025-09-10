import { useEffect, useState } from "react";
import axios from "axios";

export function useCoinMeta(coinType?: string) {

    const [coinMeta, setCoinMeta] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<Error | null>(null);
    const apiKey = import.meta.env.VITE_BLOCKBERRY_API_KEY;

    async function fetchCoinMeta() {
        if (!apiKey) {
            setError(new Error("Missing BlockBerry API Key"));
            return;
        }
        if (!coinType) {
            setError(new Error("Missing coinType parameter"));
            return;
        }
        try {
            setLoading(true)

            const res = await axios.get(`https://api.blockberry.one/sui/v1/coins/metadata/${encodeURIComponent(coinType)}`, {
                headers: {
                    accept: '*/*',
                    "x-api-key": apiKey
                }
            })

            setCoinMeta(res.data)
            console.log(res.data)
        } catch (error) {
            setError(error as Error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (coinType) {
            fetchCoinMeta()
        }
    }, [apiKey, coinType])

    return {
        coinMeta,
        loading,
        error
    }
}