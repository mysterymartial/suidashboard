import React from 'react';
import type { OperatorInteraction } from '../../api/walrus';

interface OperatorInteractionsProps {
  interactions: OperatorInteraction[];
  loading: boolean;
  error: string | null;
}

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleString();
};

const formatAmount = (amount?: number): string => {
  if (amount === undefined) return 'N/A';
  return amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const getInteractionTypeIcon = (type: string): string => {
  switch (type) {
    case 'delegation':
      return '🔗';
    case 'undelegation':
      return '🔓';
    case 'reward':
      return '🎁';
    default:
      return '📝';
  }
};

export const OperatorInteractions: React.FC<OperatorInteractionsProps> = ({ 
  interactions, 
  loading, 
  error 
}) => {
  if (loading) {
    return <div className="loading">Loading operator interactions...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  if (interactions.length === 0) {
    return <div className="empty-state">No operator interactions found for this account.</div>;
  }

  // Sort interactions by timestamp (newest first)
  const sortedInteractions = [...interactions].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <div className="operator-interactions">
      <h3>Operator Interactions</h3>
      <table className="data-table">
        <thead>
          <tr>
            <th>Operator</th>
            <th>Type</th>
            <th>Amount</th>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {sortedInteractions.map((interaction) => (
            <tr key={interaction.id} className={`status-${interaction.status}`}>
              <td>{interaction.operatorName || interaction.operatorId}</td>
              <td className={`interaction-type ${interaction.type}`}>
                {getInteractionTypeIcon(interaction.type)} {interaction.type.charAt(0).toUpperCase() + interaction.type.slice(1)}
              </td>
              <td>{formatAmount(interaction.amount)} {interaction.amount !== undefined ? 'WAL' : ''}</td>
              <td>{formatDate(interaction.timestamp)}</td>
              <td>
                <span className={`status-badge ${interaction.status}`}>
                  {interaction.status.charAt(0).toUpperCase() + interaction.status.slice(1)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OperatorInteractions;