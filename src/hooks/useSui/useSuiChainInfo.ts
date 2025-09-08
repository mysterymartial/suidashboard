import { useEffect, useState } from "react";
import axios from "axios";

export function useSuiAccounts() {
    const [chainInfo, setChainInfo] = useState<any[]>([]);
    const [stakeParam, setStakeParam] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<Error | null>(null);
    const apiKey = import.meta.env.VITE_BLOCKBERRY_API_KEY;

    async function fetchChainInfo() {
        if (!apiKey) {
            setError(new Error("Missing BlockBerry API Key"));
            return;
        }
        try {
            setLoading(true)

            const [chainInfoRes, stakeParamRes] = await Promise.all([
                axios.get("https://api.blockberry.one/sui/v1/chain-info", {
                    headers: {
                        accept: '*/*',
                        "x-api-key": apiKey
                    }
                }),
                axios.get("https://api.blockberry.one/sui/v1/staking-parameters", {
                    headers: {
                        accept: '*/*',
                        "x-api-key": apiKey
                    }
                })
            ])

            setChainInfo(chainInfoRes.data)
            setStakeParam(stakeParamRes.data)

        } catch (err: any) {
            console.error(err.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        // fetchAccounts()
    }, [])

    return { chainInfo, stakeParam, loading, error }
}