import { useEffect, useState } from "react";
import { useSuinsClient } from "../contexts/SuinsClientContext";

export function useSuins() {
    const suinsClient = useSuinsClient();
    const [nameRecord, setNameRecord] = useState<any[]>([]);
    const [priceList, setPriceList] = useState<any[]>([]);
    const [renewalPriceList, setRenewalPriceList] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        async function fetchName() {
            setLoading(true);
            try {
                const name = await suinsClient.getNameRecord("example.sui");
                setNameRecord(name);
                console.log(name);
            } catch (err) {
                setError(err as Error);
            } finally {
                setLoading(false);
            }
        }

        async function getPriceList(){
            setLoading(true);
            try{
                const priceList = await suinsClient.getPriceList();
                setPriceList(priceList);
                console.log(priceList);
            }catch(err){
                setError(err as Error);
            }   finally {
                setLoading(false);
            }
        }

        async function getRenewalPrice(){
            setLoading(true);
            try{
                const renewalPriceList = await suinsClient.getRenewalPriceList();
                setRenewalPriceList(renewalPriceList);
                console.log(priceList);
            }catch(err){
                setError(err as Error);
            }   finally {
                setLoading(false);
            }
        }


        fetchName();
        getPriceList()
        getRenewalPrice()
    }, [suinsClient]);

    return { nameRecord, priceList, renewalPriceList,  loading, error };
}