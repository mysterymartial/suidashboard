import { useEffect, useState } from "react";

export function useWalrusAccount() {
  const [accountData, setAccountData] = useState<any[]>([]);
  const [validatorsData, setValidatorsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const apiKey = import.meta.env.VITE_BLOCKBERRY_API_KEY;

  async function fetchAccountData() {
    setLoading(true);
    setError(null);

    try {
      if (!apiKey) {
        throw new Error("Missing BlockBerry API Key");
      }

      const res = await fetch(
        "https://api.blockberry.one/walrus-mainnet/v1/accounts?page=0&size=20&orderBy=DESC&sortBy=BALANCE",
        {
          method: "GET",
          headers: {
            accept: "*/*",
            "x-api-key": apiKey,
          },
        }
      );

      if (!res.ok) {
        throw new Error(`API Error: ${res.statusText}`);
      }

      const data = await res.json();
      setAccountData(data);
      console.log(data);
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }

  async function fetchValidatorsData() {
    setLoading(true);
    setError(null);

    try {
      if (!apiKey) {
        throw new Error("Missing BlockBerry API Key");
      }

      const res = await fetch(
        "https://api.blockberry.one/walrus-mainnet/v1/validators?page=0&size=20&orderBy=DESC&sortBy=STAKE",
        {
          method: "GET",
          headers: {
            accept: "*/*",
            "x-api-key": apiKey,
          },
        }
      );

      if (!res.ok) {
        throw new Error(`API Error: ${res.statusText}`);
      }

      const data = await res.json();
      setValidatorsData(data);
      console.log(data);
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }

//   useEffect(() => {
//     fetchAccountData();
//     fetchValidatorsData();
//   }, []);

  return { accountData, loading, error, validatorsData  };
}
