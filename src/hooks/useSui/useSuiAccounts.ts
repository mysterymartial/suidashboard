import { useEffect, useState } from "react";
import axios from "axios";

export function useSuiAccounts() {
    const [accounts, setAccounts] = useState<any[]>([]);
    const [topAccounts, setTopAccount] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<Error | null>(null);
    const apiKey = import.meta.env.VITE_BLOCKBERRY_API_KEY;

    async function fetchAccounts() {
        if (!apiKey) {
            setError(new Error("Missing BlockBerry API Key"));
            return;
        }
        try {
            setLoading(true)

            const [accoutntRes, topAccountRes] = await Promise.all([
                axios.get("https://api.blockberry.one/sui/v1/accounts?page=0&size=20&orderBy=DESC&sortBy=BALANCE", {
                    headers: {
                        accept: '*/*',
                        "x-api-key": apiKey
                    }
                }),
                axios.get("https://api.blockberry.one/sui/v1/accounts/top?page=0&size=20&orderBy=DESC&sortBy=BALANCE", {
                    headers: {
                        accept: '*/*',
                        "x-api-key": apiKey
                    }
                })
            ])

            setAccounts(accoutntRes.data.content || [])
            console.log(accoutntRes.data)
            setTopAccount(topAccountRes.data.content || [])
            console.log(topAccountRes.data)

        } catch (err: any) {
            console.error(err.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchAccounts() 
    }, [])

    return { accounts, topAccounts, loading, error }
}