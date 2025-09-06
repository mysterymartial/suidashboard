import { useState, useEffect, useMemo } from 'react';
import { fetchStakingOperations, fetchOperatorInteractions } from '../api/walrus';
import type { StakingOperation, OperatorInteraction } from '../api/walrus';

interface UseWalrusStakingResult {
  stakingOperations: StakingOperation[];
  operatorInteractions: OperatorInteraction[];
  loading: boolean;
  error: string | null;
}

/**
 * Hook for fetching and managing Walrus staking data for an account
 * @param account The account address
 * @returns Object containing staking operations, operator interactions, loading state, and error
 */
export function useWalrusStaking(account: string): UseWalrusStakingResult {
  const [stakingOperations, setStakingOperations] = useState<StakingOperation[]>([]);
  const [operatorInteractions, setOperatorInteractions] = useState<OperatorInteraction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadStakingData() {
      if (!account) return;
      
      setLoading(true);
      setError(null);
      
      try {
        // Fetch staking operations and operator interactions in parallel
        const [operations, interactions] = await Promise.all([
          fetchStakingOperations(account),
          fetchOperatorInteractions(account)
        ]);
        
        if (cancelled) return;
        
        setStakingOperations(operations);
        setOperatorInteractions(interactions);
      } catch (e: any) {
        if (cancelled) return;
        setError(e?.message || 'Failed to load Walrus staking data');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    
    loadStakingData();
    
    return () => { cancelled = true; };
  }, [account]);

  return useMemo(
    () => ({ stakingOperations, operatorInteractions, loading, error }),
    [stakingOperations, operatorInteractions, loading, error]
  );
}

export default useWalrusStaking;