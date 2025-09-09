import { useEffect, useState } from "react";
import axios from "axios";

export function useEvents() {
    const [nftevents, setNftEvents] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<Error | null>(null);
    const apiKey = import.meta.env.VITE_BLOCKBERRY_API_KEY;

    const options = {
        method: 'POST',
        url: 'https://api.blockberry.one/sui/v1/events?page=0&size=20&orderBy=DESC&sortBy=AGE',
        headers: { accept: '*/*', 'x-api-key': 'uEX3gyeTtmpcKDOZPgxctqNpHmsf7Y' }
    };

    async function fetchNFTevents() {
        if (!apiKey) {
            setError(new Error("Missing BlockBerry API Key"));
            return;
        }
        try {
            setLoading(true)

            axios
                .request(options)
                .then(res => {
                    setNftEvents(res.data.content || [])
                    console.log(res.data.content || [])
                })
                .catch(err => console.error(err));

        } catch (err: any) {
            console.error(err.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        // fetchNFTevents()
    }, [])

    return { nftevents, loading, error }

}