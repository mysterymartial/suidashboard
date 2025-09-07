# Sui Analytics Backend API

A Node.js backend that fetches Sui blockchain analytics data from Blockberry API and serves it to your frontend dashboard.

## What This API Does

This backend provides 3 main endpoints that return chart-ready data for your Sui analytics dashboard:

1. **Average Blob Size** - Shows blob size trends over time
2. **Accounts Count** - Shows total account growth 
3. **Blobs Count** - Shows blob transaction volume

Each endpoint returns data in a format ready for charting libraries like Chart.js.

## Quick Start

```bash
# Install dependencies
npm install

# Install Blockberry API
npx api install "@blockberry/v1.0#v3cjoomckkvyl7"

# Start server
npm start
```

Server runs on `http://localhost:3001`

## Frontend Integration

### Base URL
```
http://localhost:3001
```

### 1. Health Check
```javascript
const response = await fetch('http://localhost:3001/health');
const data = await response.json();
// Returns: { success: true, message: "Server is running" }
```

### 2. Get Chart Data

#### Average Blob Size
```javascript
const response = await fetch('http://localhost:3001/api/analytics/avg-blob-size?period=24H&size=SMALL');
const data = await response.json();

if (data.success) {
  // data.data contains chart-ready format:
  // {
  //   labels: ["00:00", "04:00", "08:00", ...],
  //   datasets: [{ label: "Value", data: [73, 78, 141, ...] }],
  //   metadata: { value: 182352, changeValue: 1779, changePercent: null }
  // }
}
```

#### Accounts Count
```javascript
const response = await fetch('http://localhost:3001/api/analytics/accounts-count?period=7D&size=MEDIUM');
const data = await response.json();
```

#### Blobs Count
```javascript
const response = await fetch('http://localhost:3001/api/analytics/blobs-count?period=30D&size=LARGE&widgetPage=DASHBOARD');
const data = await response.json();
```

### Query Parameters

All endpoints accept these optional parameters:

- `period`: `1H`, `4H`, `24H`, `7D`, `30D`, `90D` (default: `24H`)
- `size`: `SMALL`, `MEDIUM`, `LARGE` (default: `SMALL`) 
- `widgetPage`: `HOME`, `DASHBOARD`, `ANALYTICS` (default: `HOME`)

### Response Format

```json
{
  "success": true,
  "message": "Chart data retrieved successfully",
  "data": {
    "labels": ["00:00", "04:00", "08:00"],
    "datasets": [{
      "label": "Value",
      "data": [73, 78, 141],
      "borderColor": "rgb(75, 192, 192)",
      "backgroundColor": "rgba(75, 192, 192, 0.2)"
    }],
    "metadata": {
      "value": 182352,
      "changeValue": 1779,
      "changePercent": null,
      "changePeriod": "24H"
    }
  },
  "timestamp": "2025-01-15T10:30:00.000Z",
  "parameters": {
    "period": "24H",
    "size": "SMALL"
  }
}
```

### Error Handling

```javascript
const response = await fetch('http://localhost:3001/api/analytics/avg-blob-size?period=INVALID');
const data = await response.json();

if (!data.success) {
  console.error('Error:', data.message);
  // Validation errors: data.errors array
  // Server errors: data.error string
}
```

### Chart.js Integration Example

```javascript
// Fetch data
const response = await fetch('http://localhost:3001/api/analytics/avg-blob-size');
const result = await response.json();

if (result.success) {
  // Use directly with Chart.js
  const chart = new Chart(ctx, {
    type: 'line',
    data: result.data, // Ready to use!
    options: {
      responsive: true,
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
}
```

## Environment Setup

Create `.env` file:
```env
BLOCKBERRY_API_KEY=uRQ2FafmcegmCzOGJVZ6qWHiMKyK1a
PORT=3001
NODE_ENV=development
```

## That's It!

Your frontend can now fetch real Sui blockchain analytics data with simple HTTP requests. The API handles all the Blockberry integration and returns data ready for your charts.