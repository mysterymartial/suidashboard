import { useEffect, useState } from "react";
import axios from "axios";

export function useStatsData() {
    const [suiStats, setSuistats] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        setLoading(true);
        axios
            .get("api/external-api/insidex/coins/0x2::sui::SUI/market-data", {
                headers: { 'x-api-key': "insidex_api.hGhJarqGjnUDkw36WUXETXyR" }
            })
            .then((res) => setSuistats(res.data))
            .catch((err) => setError(err))
            .finally(() => setLoading(false));
    }, []);

    return { suiStats, loading, error };
}