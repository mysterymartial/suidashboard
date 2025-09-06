import { useState, useEffect } from 'react';
import {
  WalrusBlob,
  WalrusBlobEvent,
  WalrusStakingOperation,
  WalrusOperatorInteraction,
  WalrusBlobLifetime,
  fetchUserBlobs,
  fetchBlobEvents,
  fetchStakingOperations,
  fetchOperatorInteractions,
  fetchBlobLifetime
} from '../api/walrus';

interface WalrusAnalyticsState {
  blobs: WalrusBlob[];
  blobEvents: WalrusBlobEvent[];
  stakingOperations: WalrusStakingOperation[];
  operatorInteractions: WalrusOperatorInteraction[];
  blobLifetimes: Record<string, WalrusBlobLifetime | null>;
  selectedBlobId: string | null;
  isLoading: {
    blobs: boolean;
    blobEvents: boolean;
    stakingOperations: boolean;
    operatorInteractions: boolean;
    blobLifetime: boolean;
  };
  error: {
    blobs: string | null;
    blobEvents: string | null;
    stakingOperations: string | null;
    operatorInteractions: string | null;
    blobLifetime: string | null;
  };
}

const initialState: WalrusAnalyticsState = {
  blobs: [],
  blobEvents: [],
  stakingOperations: [],
  operatorInteractions: [],
  blobLifetimes: {},
  selectedBlobId: null,
  isLoading: {
    blobs: false,
    blobEvents: false,
    stakingOperations: false,
    operatorInteractions: false,
    blobLifetime: false
  },
  error: {
    blobs: null,
    blobEvents: null,
    stakingOperations: null,
    operatorInteractions: null,
    blobLifetime: null
  }
};

export function useWalrusAnalytics(userAddress: string = '0x123abc') {
  const [state, setState] = useState<WalrusAnalyticsState>(initialState);

  // Fetch user blobs
  const fetchBlobs = async () => {
    setState(prev => ({
      ...prev,
      isLoading: { ...prev.isLoading, blobs: true },
      error: { ...prev.error, blobs: null }
    }));

    try {
      const data = await fetchUserBlobs(userAddress);
      setState(prev => ({
        ...prev,
        blobs: data,
        isLoading: { ...prev.isLoading, blobs: false }
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: { ...prev.isLoading, blobs: false },
        error: { ...prev.error, blobs: error instanceof Error ? error.message : 'Failed to fetch blobs' }
      }));
    }
  };

  // Fetch blob events
  const fetchEvents = async (blobId?: string) => {
    setState(prev => ({
      ...prev,
      isLoading: { ...prev.isLoading, blobEvents: true },
      error: { ...prev.error, blobEvents: null }
    }));

    try {
      const data = await fetchBlobEvents(blobId);
      setState(prev => ({
        ...prev,
        blobEvents: data,
        isLoading: { ...prev.isLoading, blobEvents: false }
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: { ...prev.isLoading, blobEvents: false },
        error: { ...prev.error, blobEvents: error instanceof Error ? error.message : 'Failed to fetch blob events' }
      }));
    }
  };

  // Fetch staking operations
  const fetchStaking = async () => {
    setState(prev => ({
      ...prev,
      isLoading: { ...prev.isLoading, stakingOperations: true },
      error: { ...prev.error, stakingOperations: null }
    }));

    try {
      const data = await fetchStakingOperations(userAddress);
      setState(prev => ({
        ...prev,
        stakingOperations: data,
        isLoading: { ...prev.isLoading, stakingOperations: false }
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: { ...prev.isLoading, stakingOperations: false },
        error: { ...prev.error, stakingOperations: error instanceof Error ? error.message : 'Failed to fetch staking operations' }
      }));
    }
  };

  // Fetch operator interactions
  const fetchOperators = async () => {
    setState(prev => ({
      ...prev,
      isLoading: { ...prev.isLoading, operatorInteractions: true },
      error: { ...prev.error, operatorInteractions: null }
    }));

    try {
      const data = await fetchOperatorInteractions(userAddress);
      setState(prev => ({
        ...prev,
        operatorInteractions: data,
        isLoading: { ...prev.isLoading, operatorInteractions: false }
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: { ...prev.isLoading, operatorInteractions: false },
        error: { ...prev.error, operatorInteractions: error instanceof Error ? error.message : 'Failed to fetch operator interactions' }
      }));
    }
  };

  // Fetch blob lifetime
  const fetchLifetime = async (blobId: string) => {
    setState(prev => ({
      ...prev,
      isLoading: { ...prev.isLoading, blobLifetime: true },
      error: { ...prev.error, blobLifetime: null }
    }));

    try {
      const data = await fetchBlobLifetime(blobId);
      setState(prev => ({
        ...prev,
        blobLifetimes: { ...prev.blobLifetimes, [blobId]: data },
        isLoading: { ...prev.isLoading, blobLifetime: false }
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: { ...prev.isLoading, blobLifetime: false },
        error: { ...prev.error, blobLifetime: error instanceof Error ? error.message : 'Failed to fetch blob lifetime' }
      }));
    }
  };

  // Set selected blob
  const selectBlob = (blobId: string | null) => {
    setState(prev => ({
      ...prev,
      selectedBlobId: blobId
    }));

    if (blobId) {
      fetchEvents(blobId);
      fetchLifetime(blobId);
    } else {
      fetchEvents();
    }
  };

  // Refresh all data
  const refreshAll = () => {
    fetchBlobs();
    fetchEvents(state.selectedBlobId || undefined);
    fetchStaking();
    fetchOperators();
    if (state.selectedBlobId) {
      fetchLifetime(state.selectedBlobId);
    }
  };

  // Initial data fetch
  useEffect(() => {
    refreshAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userAddress]);

  return {
    ...state,
    refreshAll,
    fetchBlobs,
    fetchEvents,
    fetchStaking,
    fetchOperators,
    fetchLifetime,
    selectBlob
  };
}