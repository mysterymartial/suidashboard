import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

// Types for the API responses
export interface CoinsWithMarketCapCount {
  total: number;
}

export interface CoinsCount {
  total: number;
}

export interface CoinsVerifiedCount {
  total: number;
}

export interface Coin {
  id: string;
  name: string;
  symbol: string;
  decimals: number;
  description?: string;
  icon_url?: string;
  project_url?: string;
  market_cap?: number;
  price?: number;
  volume_24h?: number;
  price_change_24h?: number;
  verified?: boolean;
}

export interface GetCoinsResponse {
  data: Coin[];
  next_cursor?: string;
  has_next_page: boolean;
}

// Hook for managing coins data from BlockBerry APIs
export function useCoinsData() {
  const [coinsWithMarketCapCount, setCoinsWithMarketCapCount] = useState<CoinsWithMarketCapCount | null>(null);
  const [coinsCount, setCoinsCount] = useState<CoinsCount | null>(null);
  const [coinsVerifiedCount, setCoinsVerifiedCount] = useState<CoinsVerifiedCount | null>(null);
  const [coins, setCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState({
    metrics: true,
    coins: false
  });
  const [error, setError] = useState<string | null>(null);

  // Get API key from environment variables
  const apiKey = import.meta.env.VITE_API_KEY;

  // Create axios instance with default headers
  const apiClient = axios.create({
    baseURL: 'https://api.blockberry.one/sui/v1',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    }
  });

  // Fetch coins with market cap count
  const fetchCoinsWithMarketCapCount = useCallback(async () => {
    try {
      const response = await apiClient.get('/coins/total-with-market-cap');
      setCoinsWithMarketCapCount(response.data);
    } catch (err) {
      console.error('Error fetching coins with market cap count:', err);
      throw err;
    }
  }, [apiClient]);

  // Fetch total coins count
  const fetchCoinsCount = useCallback(async () => {
    try {
      const response = await apiClient.get('/coins/total');
      setCoinsCount(response.data);
    } catch (err) {
      console.error('Error fetching coins count:', err);
      throw err;
    }
  }, [apiClient]);

  // Fetch verified coins count
  const fetchCoinsVerifiedCount = useCallback(async () => {
    try {
      const response = await apiClient.get('/coins/total-verified');
      setCoinsVerifiedCount(response.data);
    } catch (err) {
      console.error('Error fetching verified coins count:', err);
      throw err;
    }
  }, [apiClient]);

  // Fetch detailed coins data
  const fetchCoins = useCallback(async (limit: number = 50, cursor?: string) => {
    try {
      setLoading(prev => ({ ...prev, coins: true }));
      setError(null);

      const params: any = { limit };
      if (cursor) {
        params.cursor = cursor;
      }

      const response = await apiClient.get<GetCoinsResponse>('/coins', { params });
      setCoins(response.data.data);
      return response.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch coins data';
      setError(errorMessage);
      console.error('Error fetching coins:', err);
      throw err;
    } finally {
      setLoading(prev => ({ ...prev, coins: false }));
    }
  }, [apiClient]);

  // Fetch all metrics on component mount
  useEffect(() => {
    const fetchMetrics = async () => {
      if (!apiKey) {
        setError('API key not found. Please set VITE_API_KEY in your .env file.');
        setLoading(prev => ({ ...prev, metrics: false }));
        return;
      }

      try {
        setLoading(prev => ({ ...prev, metrics: true }));
        setError(null);

        // Fetch all metrics in parallel
        await Promise.all([
          fetchCoinsWithMarketCapCount(),
          fetchCoinsCount(),
          fetchCoinsVerifiedCount()
        ]);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch metrics';
        setError(errorMessage);
        console.error('Error fetching metrics:', err);
      } finally {
        setLoading(prev => ({ ...prev, metrics: false }));
      }
    };

    fetchMetrics();
  }, [apiKey, fetchCoinsWithMarketCapCount, fetchCoinsCount, fetchCoinsVerifiedCount]);

  // Refresh metrics function
  const refreshMetrics = useCallback(async () => {
    if (!apiKey) {
      setError('API key not found. Please set VITE_API_KEY in your .env file.');
      return;
    }

    try {
      setLoading(prev => ({ ...prev, metrics: true }));
      setError(null);

      await Promise.all([
        fetchCoinsWithMarketCapCount(),
        fetchCoinsCount(),
        fetchCoinsVerifiedCount()
      ]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to refresh metrics';
      setError(errorMessage);
      console.error('Error refreshing metrics:', err);
    } finally {
      setLoading(prev => ({ ...prev, metrics: false }));
    }
  }, [apiKey, fetchCoinsWithMarketCapCount, fetchCoinsCount, fetchCoinsVerifiedCount]);

  return {
    // Data
    coinsWithMarketCapCount,
    coinsCount,
    coinsVerifiedCount,
    coins,
    
    // Loading states
    loading,
    
    // Error state
    error,
    
    // Actions
    fetchCoins,
    refreshMetrics,
    
    // Computed values
    hasApiKey: !!apiKey
  };
}
