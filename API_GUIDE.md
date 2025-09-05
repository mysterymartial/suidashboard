# Sui Transaction Analyser API Guide

This guide provides examples and instructions for using the Sui Transaction Analyser API.

## Base URL

When deployed, the API is available at:

```
http://<your-domain>/api/v1
```

For local development:

```
http://localhost:8000/api/v1
```

For production deployment on Render:

```
https://sui-transaction-analyser-api-v1.onrender.com/api/v1
```

## Authentication

Currently, the API uses rate limiting but does not require authentication. Rate limits are configured in the `.env` file:

- `RATE_LIMIT_PER_MINUTE`: Maximum requests per minute per client IP
- `RATE_LIMIT_PER_HOUR`: Maximum requests per hour per client IP

## Endpoints

### Health Check

```
GET /health
```

Verifies that the API is running.

**Response:**

```json
{
  "status": "ok",
  "version": "2.0.0"
}
```

### Analyze Transaction or Address

```
POST /api/v1/analyze
```

Analyzes a Sui transaction or address and provides detailed information including tax implications.

**Request Body:**

```json
{
  "input": "<transaction-hash-or-address>",
  "country": "US"
}
```

**Parameters:**

- `input` (required): A Sui transaction hash or address
- `country` (required): Two-letter country code for tax calculations

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

### Batch Analyze Addresses

```
POST /api/v1/batch-analyze
```

Analyzes multiple Sui addresses in a single request.

**Request Body:**

```json
{
  "addresses": ["address1", "address2", "address3"],
  "country": "US",
  "limit": 10
}
```

**Parameters:**

- `addresses` (required): Array of Sui addresses (maximum 10)
- `country` (required): Two-letter country code for tax calculations
- `limit` (optional): Maximum number of transactions to analyze per address (default: 10)

**Response:**

```json
{
  "results": [
    {
      "address": "address1",
      "transactions": [...],
      "tax_summary": {
        "country": "US",
        "total_taxable_amount": 5000.0,
        "estimated_tax": 1750.0,
        "currency": "USD"
      }
    },
    {
      "address": "address2",
      "transactions": [...],
      "tax_summary": {...}
    }
  ]
}
```

## Example Usage

### cURL

```bash
# Analyze a transaction
curl -X POST https://sui-transaction-analyser-api-v1.onrender.com/api/v1/analyze \
  -H "Content-Type: application/json" \
  -d '{"input":"transaction_hash","country":"US"}'

# Batch analyze addresses
curl -X POST https://sui-transaction-analyser-api-v1.onrender.com/api/v1/batch-analyze \
  -H "Content-Type: application/json" \
  -d '{"addresses":["address1","address2"],"country":"US"}'
```

### Python

```python
import requests

# Analyze a transaction
response = requests.post(
    "https://sui-transaction-analyser-api-v1.onrender.com/api/v1/analyze",
    json={"input": "transaction_hash", "country": "US"}
)
print(response.json())

# Batch analyze addresses
response = requests.post(
    "https://sui-transaction-analyser-api-v1.onrender.com/api/v1/batch-analyze",
    json={"addresses": ["address1", "address2"], "country": "US"}
)
print(response.json())
```

### JavaScript

```javascript
// Analyze a transaction
fetch('https://sui-transaction-analyser-api-v1.onrender.com/api/v1/analyze', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    input: 'transaction_hash',
    country: 'US'
  })
})
.then(response => response.json())
.then(data => console.log(data));

// Batch analyze addresses
fetch('https://sui-transaction-analyser-api-v1.onrender.com/api/v1/batch-analyze', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    addresses: ['address1', 'address2'],
    country: 'US'
  })
})
.then(response => response.json())
.then(data => console.log(data));
```

## Error Handling

The API returns standard HTTP status codes:

- `200 OK`: Request successful
- `400 Bad Request`: Invalid input parameters
- `404 Not Found`: Transaction or address not found
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Server-side error

Error responses include a JSON body with details:

```json
{
  "detail": "Error message describing the issue"
}
```

## Best Practices

1. **Implement caching**: Cache responses to reduce API calls for frequently accessed data
2. **Handle rate limits**: Implement exponential backoff when rate limits are hit
3. **Validate inputs**: Ensure transaction hashes and addresses are properly formatted before sending
4. **Error handling**: Properly handle and display error messages to users

## Support

For additional help or to report issues, please refer to the project repository or contact the development team.