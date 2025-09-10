// API Types
export interface AnalyzeRequest {
  input: string;
  country: string;
}

export interface TaxSummary {
  total_transactions: number;
  total_gas_fees: number;
  total_gains: number;
  total_losses: number;
  net_gain_loss: number;
  estimated_tax: number;
  currency: string;
}

export interface AnalyzeResponse {
  address: string;
  analysis_type: string;
  human_summary: string;
  network: string;
  success: boolean;
  tax_summary: TaxSummary;
  transactions: any[];
  transactions_analyzed: number;
}

// API Configuration
const API_BASE_URL =
  "https://sui-transaction-analyser-api-v1.onrender.com/api/v1";

// Error handling
class TransactionAnalyzerError extends Error {
  constructor(
    message: string,
    public status?: number,
  ) {
    super(message);
    this.name = "TransactionAnalyzerError";
  }
}

// Main API function to analyze a single transaction
export async function analyzeSuiTransaction(
  transactionHash: string,
  country: string,
): Promise<AnalyzeResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/analyze`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        input: transactionHash,
        country: country,
      }),
    });

    if (!response.ok) {
      throw new TransactionAnalyzerError(
        `API error: ${response.status} ${response.statusText}`,
        response.status,
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof TransactionAnalyzerError) {
      throw error;
    }

    // Handle network errors or other issues
    throw new TransactionAnalyzerError(
      `Network error: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

export async function analyzeBatchTransactions(
  transactions: Array<{ hash: string; country: string }>,
): Promise<AnalyzeResponse[]> {
  const promises = transactions.map(({ hash, country }) =>
    analyzeSuiTransaction(hash, country),
  );

  try {
    return await Promise.all(promises);
  } catch (error) {
    throw new TransactionAnalyzerError(
      `Batch analysis failed: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

// Utility function to validate transaction hash format
export function isValidSuiTransactionHash(hash: string): boolean {
  // Sui transaction hashes are typically 64 characters long and contain only hex characters
  const suiHashRegex = /^[a-fA-F0-9]{64}$/;
  return suiHashRegex.test(hash);
}

// Utility function to format currency amounts
export function formatCurrency(amount: number, currency: string): string {
  return (
    new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    }).format(amount) + ` ${currency}`
  );
}

// Utility function to format addresses for display
export function formatAddress(
  address: string,
  startChars: number = 8,
  endChars: number = 8,
): string {
  if (address.length <= startChars + endChars) return address;
  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
}

// Country options for tax analysis
export const SUPPORTED_COUNTRIES = [
  { value: "US", label: "United States", flag: "🇺🇸" },
  { value: "UK", label: "United Kingdom", flag: "🇬🇧" },
  { value: "CA", label: "Canada", flag: "🇨🇦" },
  { value: "AU", label: "Australia", flag: "🇦🇺" },
  { value: "DE", label: "Germany", flag: "🇩🇪" },
  { value: "FR", label: "France", flag: "🇫🇷" },
  { value: "JP", label: "Japan", flag: "🇯🇵" },
  { value: "SG", label: "Singapore", flag: "🇸🇬" },
  { value: "CH", label: "Switzerland", flag: "🇨🇭" },
  { value: "NL", label: "Netherlands", flag: "🇳🇱" },
] as const;

export type SupportedCountry = (typeof SUPPORTED_COUNTRIES)[number]["value"];
