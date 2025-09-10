import { useEffect, useState } from "react";
import { useSuinsClient } from "../../contexts/SuinsClientContext";

export function useSuins() {
    const suinsClient = useSuinsClient();
    const [nameRecord, setNameRecord] = useState<any | null>(null);
    const [priceList, setPriceList] = useState<any[]>([]);
    const [renewalPriceList, setRenewalPriceList] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    // ✅ fix: call this manually when you want to resolve a name
    const fetchName = async (name: string) => {
        // Guard: don't run if no name
        if (!name) return null;

        setLoading(true);
        setError(null);      // <<-- CLEAR previous errors before starting
        try {
            const record = await suinsClient.getNameRecord(name);
            setNameRecord(record);
            setError(null);    // <<-- ensure error is cleared on success
            return record;
        } catch (err) {
            // Clear any previous success result so UI can't show stale data
            setNameRecord(null);
            setError(err as Error);
            return null;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        async function getPriceList() {
            setLoading(true);
            try {
                const priceList = await suinsClient.getPriceList();
                setPriceList(priceList);
                console.log(priceList);
            } catch (err) {
                setError(err as Error);
            } finally {
                setLoading(false);
            }
        }

        async function getRenewalPrice() {
            setLoading(true);
            try {
                const renewalPriceList = await suinsClient.getRenewalPriceList();
                setRenewalPriceList(renewalPriceList);
                console.log(renewalPriceList);
            } catch (err) {
                setError(err as Error);
            } finally {
                setLoading(false);
            }
        }

        getPriceList();
        getRenewalPrice();
    }, [suinsClient]);

    return { nameRecord, priceList, renewalPriceList, loading, error, fetchName };
}
