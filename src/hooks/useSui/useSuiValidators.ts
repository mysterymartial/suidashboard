import { useEffect, useState } from "react";
import axios from "axios";

export function useSuiValidators() {
    const [validators, setValidators] = useState<any[]>([]);
    const [validatorsApy, setValidatorsApy] = useState<any[]>([]);
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<Error | null>(null);
    const apiKey = import.meta.env.VITE_BLOCKBERRY_API_KEY;

    async function fetchValidators() {
        if (!apiKey) {
            setError(new Error("Missing BlockBerry API Key"));
            return;
        }
        try {
            setLoading(true)

            const [validatorRes, validatorApyRes] = await Promise.all([
                axios.get("https://api.blockberry.one/sui/v1/validators?page=0&size=20&orderBy=DESC&sortBy=ADDRESS&searchStr=%25", {
                    headers: {
                        accept: '*/*',
                        "x-api-key": apiKey
                    }
                }),
                axios.get("https://api.blockberry.one/sui/v1/validators/avg-apy", {
                    headers: {
                        accept: '*/*',
                        "x-api-key": apiKey
                    }
                })
            ])

            setValidators(validatorRes.data.content || [])
            console.log(validatorRes.data)
            setValidatorsApy(validatorApyRes.data)

        } catch (err: any) {
            console.error(err.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        // fetchValidators()
    }, [])

    return { validators, validatorsApy, loading, error }
    
}