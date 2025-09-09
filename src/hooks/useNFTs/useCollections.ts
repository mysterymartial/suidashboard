import { useEffect, useState } from "react";
import axios from "axios";

export function useCollections() {
    const [collections, setCollections] = useState<any[]>([])
    const [topCollections, setTopCollections] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<Error | null>(null);
    const apiKey = import.meta.env.VITE_BLOCKBERRY_API_KEY;

    async function fetchCollections() {
        if (!apiKey) {
            setError(new Error("Missing BlockBerry API Key"));
            return;
        }
        try {
            setLoading(true)

            const [collectionRes, topCollectionRes] = await Promise.all([
                axios.get("https://api.blockberry.one/sui/v1/collections?page=0&size=20&orderBy=DESC&sortBy=AGE&period=DAY", {
                    headers: {
                        accept: '*/*',
                        "x-api-key": apiKey
                    }
                }),
                axios.get("https://api.blockberry.one/sui/v1/widgets/collections?period=DAY", {
                    headers: {
                        accept: '*/*',
                        "x-api-key": apiKey
                    }
                })
            ])

            setCollections(collectionRes.data.content || [])
            setTopCollections(topCollectionRes.data)

        } catch (err: any) {
            console.error(err.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        // fetchCollections()
    }, [])

    return { collections, topCollections, loading, error}

}