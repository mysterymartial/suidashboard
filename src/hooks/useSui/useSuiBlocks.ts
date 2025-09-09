import { useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";

// --- Retry helper ---
async function fetchWithRetry<T>(
  method: "get" | "post",
  url: string,
  apiKey: string,
  body: any = {},
  retries = 3,
  delay = 1000
): Promise<AxiosResponse<T>> {
  try {
    if (method === "get") {
      return await axios.get<T>(url, {
        headers: {
          accept: "*/*",
          "x-api-key": apiKey,
        },
      });
    } else {
      return await axios.post<T>(url, body, {
        headers: {
          accept: "*/*",
          "x-api-key": apiKey,
        },
      });
    }
  } catch (err: any) {
    if (err.response?.status === 429 && retries > 0) {
      console.warn(`Rate limited, retrying in ${delay}ms...`);
      await new Promise((r) => setTimeout(r, delay));
      return fetchWithRetry(method, url, apiKey, body, retries - 1, delay * 2);
    }
    throw err;
  }
}

// --- Types ---
interface Checkpoint {
  sequence: number;
  digest: string;
  epoch: number;
  txCount: number;
  timestamp: number;
  computationCost: number | null;
  networkTotalTxCount: number | null;
  nonRefundableStorageFee: number | null;
  previousDigest: string | null;
  storageCost: number | null;
  storageRebate: number | null;
}

interface CheckpointResponse {
  content: Checkpoint[];
  totalCount: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

interface CheckpointCount {
  totalCheckpoints: number;
}

interface TransactionBlockCount {
  totalTransactionBlocks: number;
}

interface TransactionCount {
  totalTransactions: number;
}

interface TransactionBlock {
  txHash: string;
  txType: string;
  txStatus: string;
  senderAddress: string;
  timestamp: number;
  checkpoint: number;
  fee: number;
  functions: string[] | null;
  txsCount: number;
  balanceChanges: Array<{
    amount: string;
    coinType: string;
    owner: {
      addressOwner: string;
      ownerType: string;
    };
  }>;
  packagesMetadata: any[];
  recipients: any;
  senderImg: string | null;
  senderName: string | null;
  senderSecurityMessage: string | null;
}

interface TransactionBlockResponse {
  content: TransactionBlock[];
  totalCount: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

interface SuiBlocksData {
  checkpoint: Checkpoint[];
  checkpointCount: CheckpointCount | null;
  transactionBlockCount: TransactionBlockCount | null;
  transactionCount: TransactionCount | null;
  transactionBlock: TransactionBlock[];
}

interface SuiBlocksHookReturn extends SuiBlocksData {
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

// --- Hook ---
export function useSuiBlocks(): SuiBlocksHookReturn {
  const [checkpoint, setCheckpoint] = useState<Checkpoint[]>([]);
  const [checkpointCount, setCheckpointCount] = useState<CheckpointCount | null>(null);
  const [transactionBlockCount, setTransactionBlockCount] = useState<TransactionBlockCount | null>(null);
  const [transactionCount, setTransactionCount] = useState<TransactionCount | null>(null);
  const [transactionBlock, setTransactionBlock] = useState<TransactionBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const apiKey = import.meta.env.VITE_BLOCKBERRY_API_KEY;

  async function fetchTransactionBlocks() {
    if (!apiKey) {
      setError(new Error("Missing BlockBerry API Key"));
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Sequential with retry
      const checkpointRes = await fetchWithRetry<CheckpointResponse>(
        "get",
        "https://api.blockberry.one/sui/v1/checkpoints?page=0&size=20&orderBy=DESC&sortBy=SEQUENCE",
        apiKey
      );
      await new Promise((r) => setTimeout(r, 500));

      const checkpointCountRes = await fetchWithRetry<CheckpointCount>(
        "get",
        "https://api.blockberry.one/sui/v1/checkpoints/total",
        apiKey
      );
      await new Promise((r) => setTimeout(r, 500));

      const transactionBlockCountRes = await fetchWithRetry<TransactionBlockCount>(
        "get",
        "https://api.blockberry.one/sui/v1/total/values/transaction-blocks",
        apiKey
      );
      await new Promise((r) => setTimeout(r, 500));

      const transactionCountRes = await fetchWithRetry<TransactionCount>(
        "get",
        "https://api.blockberry.one/sui/v1/total/values/transactions",
        apiKey
      );
      await new Promise((r) => setTimeout(r, 500));

      // ✅ Transactions endpoint requires POST
      const txRes = await fetchWithRetry<TransactionBlockResponse>(
        "post",
        "https://api.blockberry.one/sui/v1/transactions?page=0&size=20&orderBy=DESC&sortBy=AGE",
        apiKey,
        {}
      );

      // Update state
      setCheckpoint(checkpointRes.data.content);
      setCheckpointCount(checkpointCountRes.data);
      console.log(checkpointCountRes.data)
      setTransactionBlockCount(transactionBlockCountRes.data);
      console.log(transactionBlockCountRes.data)
      setTransactionCount(transactionCountRes.data);
      console.log(transactionCountRes.data)
      setTransactionBlock(txRes.data.content);
    } catch (err: any) {
      console.error("Fetch error:", err.message);
      setError(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // fetchTransactionBlocks();
  }, []);

  return {
    checkpoint,
    checkpointCount,
    transactionBlockCount,
    transactionCount,
    transactionBlock,
    loading,
    error,
    refetch: fetchTransactionBlocks,
  };
}
