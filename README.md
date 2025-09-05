# Sui Transaction Analyser

A comprehensive FastAPI application for analyzing Sui blockchain transactions with AI-powered insights and tax calculations.

## Features

- **Transaction Analysis**: Detailed breakdown of Sui blockchain transactions
- **AI-Powered Insights**: Human-readable explanations of transaction activities
- **Tax Calculations**: Real-time tax implications based on transaction data
- **Multi-Network Support**: Works with all Sui networks (mainnet, testnet, devnet)
- **Batch Processing**: Analyze multiple addresses simultaneously

## Tech Stack

- **Backend**: FastAPI, Python 3.11
- **AI**: Hugging Face Inference API
- **Database**: SQLite
- **Deployment**: Docker, Docker Compose

## Installation

### Prerequisites

- Python 3.11+
- Docker and Docker Compose (for containerized deployment)

### Local Development

1. Clone the repository:

```bash
git clone <repository-url>
cd sui-transaction-analyser
```

2. Set up a virtual environment:

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:

```bash
pip install -r requirements.txt
```

4. Create a `.env` file with required environment variables:

```
# API Configuration
DEBUG=True
API_HOST=0.0.0.0
API_PORT=8000

# Hugging Face Configuration
HF_MODEL=microsoft/DialoGPT-medium
HF_API_URL=https://api-inference.huggingface.co/models
HF_TOKEN=your_huggingface_token

# Database Configuration
DATABASE_URL=sqlite:///./data/sui_tax_analysis.db

# Rate Limiting
RATE_LIMIT_PER_MINUTE=60
RATE_LIMIT_PER_HOUR=1000
```

5. Run the application:

```bash
uvicorn main:app --reload
```

### Docker Deployment

1. Build and start the container:

```bash
docker-compose up -d
```

2. The API will be available at `https://sui-transaction-analyser-api-v1.onrender.com`

## API Endpoints

### Transaction Analysis

```
POST /api/v1/analyze
```

Analyze a single Sui transaction or address.

**Request Body:**

```json
{
  "input": "transaction_hash_or_address",
  "country": "US"
}
```

**Response:**

```json
{
  "transaction_details": {
    "hash": "transaction_hash",
    "timestamp": "2023-05-01T12:34:56Z",
    "network": "mainnet",
    "type": "transfer",
    "amount": 1000000,
    "currency": "SUI",
    "from": "sender_address",
    "to": "recipient_address"
  },
  "tax_info": {
    "country": "US",
    "tax_rates": {
      "short_term": 0.35,
      "long_term": 0.15
    },
    "estimated_tax": 350.0,
    "currency": "USD"
  },
  "explanation": "This transaction represents a transfer of 1 SUI from sender to recipient..."
}
```

### Batch Analysis

```
POST /api/v1/batch-analyze
```

Analyze multiple addresses in a single request.

**Request Body:**

```json
{
  "addresses": ["address1", "address2"],
  "country": "US"
}
```

## Documentation

API documentation is available at:

- Swagger UI: `https://sui-transaction-analyser-api-v1.onrender.com/docs`
- ReDoc: `https://sui-transaction-analyser-api-v1.onrender.com/redoc`

## API Usage Examples

### JavaScript

```javascript
// Analyze a single transaction
const analyzeSuiTransaction = async (transactionHash, country) => {
  try {
    const response = await fetch('https://sui-transaction-analyser-api-v1.onrender.com/api/v1/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        input: transactionHash,
        country: country
      })
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error analyzing transaction:', error);
    throw error;
  }
};

// Example usage
analyzeSuiTransaction('your_transaction_hash', 'US')
  .then(result => console.log(result))
  .catch(error => console.error(error));

// Batch analyze multiple addresses
const batchAnalyzeSuiAddresses = async (addresses, country, limit = 10) => {
  try {
    const response = await fetch('https://sui-transaction-analyser-api-v1.onrender.com/api/v1/batch-analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        addresses: addresses,
        country: country,
        limit: limit
      })
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error analyzing addresses:', error);
    throw error;
  }
};

// Example batch usage
batchAnalyzeSuiAddresses(['address1', 'address2'], 'US')
  .then(result => console.log(result))
  .catch(error => console.error(error));
```

### TypeScript

```typescript
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
  return fetch('https://sui-transaction-analyser-api-v1.onrender.com/api/v1/analyze', {
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
  return fetch('https://sui-transaction-analyser-api-v1.onrender.com/api/v1/batch-analyze', {
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
```

## Testing

Run the test suite:

```bash
python -m unittest discover app/tests
```

## Deployment Options

The application can be deployed to various cloud providers:

- **Render**: Offers easy deployment with Docker support
- **Back4app**: Container as a Service platform with GitHub integration
- **Koyeb**: Supports both git-driven and container-based deployment

For detailed deployment instructions, see the [Deployment Guide](./DEPLOYMENT.md).

## License

[MIT](LICENSE)