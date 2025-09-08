import { useEffect, useState } from "react";
import axios from "axios";

export function useSuiBlocks() {
    const [checkpoint, setCheckpoint] = useState<any[]>([]);
    const [checkpointCount, setCheckpointCount] = useState<any[]>([])
    const [transactionBlockCount, setTransactionBlockCount] = useState<any[]>([])
    const [transactionCount, setTransactionCount] = useState<any[]>([])
    const [transactionBlock, setTransactionBlock] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<Error | null>(null);
    const apiKey = import.meta.env.VITE_BLOCKBERRY_API_KEY;

    async function fetchTransactionBlocks() {
        if (!apiKey) {
            setError(new Error("Missing BlockBerry API Key"));
            return;
        }
        try {
            setLoading(true)

            const [checkpointRes, checkpointcountRes, transactionBlockCountRes, transactionCountRes, transactionBlockRes ] = await Promise.all([
                axios.get("https://api.blockberry.one/sui/v1/checkpoints?page=0&size=20&orderBy=DESC&sortBy=SEQUENCE", {
                    headers: {
                        accept: '*/*',
                        "x-api-key": apiKey
                    }
                }),
                axios.get("https://api.blockberry.one/sui/v1/checkpoints/total", {
                    headers: {
                        accept: '*/*',
                        "x-api-key": apiKey
                    }
                }),
                axios.get("https://api.blockberry.one/sui/v1/total/values/transaction-blocks", {
                    headers: {
                        accept: '*/*',
                        "x-api-key": apiKey
                    }
                }),
                axios.get("https://api.blockberry.one/sui/v1/total/values/transactions", {
                    headers: {
                        accept: '*/*',
                        "x-api-key": apiKey
                    }
                }),
                axios.post("https://api.blockberry.one/sui/v1/transactions?page=0&size=20&orderBy=DESC&sortBy=AGE", {
                    headers: {
                        accept: '*/*',
                        "x-api-key": apiKey
                    }
                })
            ])

            setCheckpoint(checkpointRes.data)
            setCheckpointCount(checkpointcountRes.data)
            setTransactionBlockCount(transactionBlockCountRes.data)
            setTransactionCount(transactionCountRes.data)
            setTransactionBlock(transactionBlockRes.data)

        } catch (err: any) {
            console.error(err.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        // fetchTransactionBlocks()
    }, [])

    return { checkpoint, checkpointCount, transactionBlockCount, transactionCount, transactionBlock, loading, error }
}