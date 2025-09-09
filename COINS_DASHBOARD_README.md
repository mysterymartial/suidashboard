# Coins Dashboard Implementation

This document describes the implementation of the coins dashboard feature for the Sui Analytics project.

## Overview

The coins dashboard provides a comprehensive view of coin-related data from the BlockBerry API, including metrics and detailed coin information.

## Files Created/Modified

### New Files Created

1. **`src/hooks/useCoinsData.ts`** - Custom React hook for managing coins data
2. **`src/components/coins/CoinBar.tsx`** - Navigation bar component with action buttons
3. **`src/components/coins/CoinsMetricsCards.tsx`** - Component for displaying key metrics
4. **`src/components/coins/CoinsTable.tsx`** - Table component for detailed coin data
5. **`src/pages/coins/CoinsDashboard.tsx`** - Main dashboard page component

### Modified Files

1. **`src/App.tsx`** - Added new routes for the coins dashboard

## API Integration

The implementation integrates with the following BlockBerry APIs:

- **CoinsWithMarketCapCount**: `https://api.blockberry.one/sui/v1/coins/total-with-market-cap`
- **CoinsCount**: `https://api.blockberry.one/sui/v1/coins/total`
- **CoinsVerifiedCount**: `https://api.blockberry.one/sui/v1/coins/total-verified`
- **GetCoins**: `https://api.blockberry.one/sui/v1/coins`

## Environment Configuration

### Required Environment Variables

Create a `.env` file in the project root with:

```env
VITE_API_KEY=your_blockberry_api_key_here
```

**Important**: Replace `your_blockberry_api_key_here` with your actual BlockBerry API key.

## Features

### 1. Metrics Dashboard
- **Total Coins**: Displays the total number of coins on the Sui network
- **Verified Coins**: Shows count and percentage of verified coins
- **Coins with Market Cap**: Displays coins that have market cap data
- **Market Cap Coverage**: Shows percentage of coins with market data

### 2. Interactive Coin Table
- **Search Functionality**: Filter coins by name or symbol
- **Sorting**: Sort by any column (name, symbol, price, market cap, volume, price change)
- **Verification Filter**: Filter by verified/unverified status
- **Responsive Design**: Works on desktop and mobile devices

### 3. Action Buttons
- **Refresh Metrics**: Updates all metric data
- **Get Coins Data**: Fetches detailed coin information

### 4. Error Handling
- **API Key Validation**: Checks for API key presence
- **Loading States**: Shows loading indicators during API calls
- **Error Messages**: Displays user-friendly error messages
- **Empty States**: Handles cases with no data

## Component Architecture

```
CoinsDashboard
├── CoinBar (Header with actions)
├── CoinsMetricsCards (Key metrics display)
└── CoinsTable (Detailed coin data)
```

## Usage

### Accessing the Dashboard

Navigate to `/coins` or `/coins/dashboard` in your application.

### API Key Setup

1. Obtain a BlockBerry API key
2. Create a `.env` file in the project root
3. Add `VITE_API_KEY=your_actual_api_key`
4. Restart the development server

### Development

The implementation uses:
- **React 18** with TypeScript
- **Axios** for HTTP requests
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Vite** for build tooling

## Error States

The dashboard handles various error scenarios:

1. **Missing API Key**: Shows setup instructions
2. **API Errors**: Displays error messages with retry options
3. **Network Issues**: Graceful degradation with user feedback
4. **Empty Data**: Encourages user to fetch data

## Responsive Design

The dashboard is fully responsive and works on:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (320px - 767px)

## Performance Optimizations

- **Parallel API Calls**: Metrics are fetched simultaneously
- **Memoized Filtering**: Table filtering is optimized with useMemo
- **Lazy Loading**: Coins data is only fetched when requested
- **Error Boundaries**: Prevents crashes from API failures

## Future Enhancements

Potential improvements:
- Pagination for large coin datasets
- Real-time data updates
- Export functionality
- Advanced filtering options
- Coin comparison features
- Historical price charts

## Troubleshooting

### Common Issues

1. **"API key not found" error**
   - Ensure `.env` file exists in project root
   - Verify `VITE_API_KEY` is set correctly
   - Restart development server after adding env vars

2. **API request failures**
   - Check API key validity
   - Verify network connectivity
   - Check BlockBerry API status

3. **Styling issues**
   - Ensure Tailwind CSS is properly configured
   - Check for CSS conflicts

## Dependencies

The implementation uses existing project dependencies:
- `axios` - HTTP client
- `lucide-react` - Icons
- `@radix-ui/themes` - UI components (existing)
- `tailwindcss` - Styling (existing)

No additional dependencies were added to the project.
