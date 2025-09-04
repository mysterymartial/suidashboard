// TypeScript code for API interaction

// Request and response interfaces for single transaction analysis
interface AnalyzeRequest {
  input: string;
  country: string;
}

interface TransactionDetails {
  hash: string;
  timestamp: string;
  network: string;
  type: string;
  amount: number;
  currency: string;
  from: string;
  to: string;
}

interface TaxInfo {
  country: string;
  tax_rates: {
    short_term: number;
    long_term: number;
  };
  estimated_tax: number;
  currency: string;
}

interface AnalyzeResponse {
  transaction_details: TransactionDetails;
  tax_info: TaxInfo;
  explanation: string;
}

// Function to analyze a single transaction
function analyzeSuiTransaction(transactionHash: string, country: string): Promise<AnalyzeResponse> {
  return fetch('http://localhost:8000/api/v1/analyze', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      input: transactionHash,
      country: country
    })
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    return response.json();
  })
  .catch(error => {
    console.error('Error analyzing transaction:', error instanceof Error ? error.message : String(error));
    throw error;
  });
}

// Example usage
// analyzeSuiTransaction('your_transaction_hash', 'US')
//   .then(result => console.log(result))
//   .catch(error => console.error(error));

// Request interface for batch analysis
interface BatchAnalyzeRequest {
  addresses: string[];
  country: string;
  limit?: number;
}

// Response interfaces for batch analysis
interface TransactionSummary {
  hash: string;
  timestamp: string;
  type: string;
  amount: number;
  currency: string;
}

interface TaxSummary {
  country: string;
  total_taxable_amount: number;
  estimated_tax: number;
  currency: string;
}

interface AddressResult {
  address: string;
  transactions: TransactionSummary[];
  tax_summary: TaxSummary;
}

interface BatchAnalyzeResponse {
  results: AddressResult[];
}

// Function to batch analyze multiple addresses
function batchAnalyzeSuiAddresses(
  addresses: string[], 
  country: string, 
  limit: number = 10
): Promise<BatchAnalyzeResponse> {
  return fetch('http://localhost:8000/api/v1/batch-analyze', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      addresses: addresses,
      country: country,
      limit: limit
    })
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    return response.json();
  })
  .catch(error => {
    console.error('Error analyzing addresses:', error instanceof Error ? error.message : String(error));
    throw error;
  });
}

// Example batch usage
// batchAnalyzeSuiAddresses(['address1', 'address2'], 'US')
//   .then(result => console.log(result))
//   .catch(error => console.error(error));