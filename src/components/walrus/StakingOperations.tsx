import React from 'react';
import type { StakingOperation } from '../../api/walrus';

interface StakingOperationsProps {
  operations: StakingOperation[];
  loading: boolean;
  error: string | null;
}

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleString();
};

const formatAmount = (amount: number): string => {
  return amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

export const StakingOperations: React.FC<StakingOperationsProps> = ({ operations, loading, error }) => {
  if (loading) {
    return <div className="loading">Loading staking operations...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  if (operations.length === 0) {
    return <div className="empty-state">No staking operations found for this account.</div>;
  }

  // Sort operations by timestamp (newest first)
  const sortedOperations = [...operations].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <div className="staking-operations">
      <h3>Staking Operations</h3>
      <table className="data-table">
        <thead>
          <tr>
            <th>Type</th>
            <th>Amount</th>
            <th>Date</th>
            <th>Status</th>
            <th>Transaction ID</th>
          </tr>
        </thead>
        <tbody>
          {sortedOperations.map((operation) => (
            <tr key={operation.id} className={`status-${operation.status}`}>
              <td className={`operation-type ${operation.type}`}>
                {operation.type === 'stake' ? '⬆️ Stake' : 
                 operation.type === 'unstake' ? '⬇️ Unstake' : 
                 operation.type === 'claim' ? '💰 Claim' : 
                 operation.type}
              </td>
              <td>{formatAmount(operation.amount)} WAL</td>
              <td>{formatDate(operation.timestamp)}</td>
              <td>
                <span className={`status-badge ${operation.status}`}>
                  {operation.status.charAt(0).toUpperCase() + operation.status.slice(1)}
                </span>
              </td>
              <td>
                {operation.transactionId ? (
                  <a 
                    href={`https://explorer.sui.io/txblock/${operation.transactionId}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="transaction-link"
                  >
                    {operation.transactionId.substring(0, 10)}...
                  </a>
                ) : (
                  'N/A'
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StakingOperations;