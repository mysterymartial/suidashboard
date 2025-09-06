import React from 'react';
import type { BlobLifetime as BlobLifetimeType } from '../../api/walrus';

interface BlobLifetimeProps {
  lifetime: BlobLifetimeType | null;
  loading: boolean;
  error: string | null;
}

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleString();
};

const calculateDaysRemaining = (expiresAt: string): number => {
  const now = new Date();
  const expiration = new Date(expiresAt);
  const diffTime = expiration.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const BlobLifetime: React.FC<BlobLifetimeProps> = ({ lifetime, loading, error }) => {
  if (loading) {
    return <div className="loading">Loading blob lifetime data...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  if (!lifetime) {
    return <div className="empty-state">No lifetime data available for this blob.</div>;
  }

  const daysRemaining = calculateDaysRemaining(lifetime.expiresAt);
  const isExpired = daysRemaining <= 0;

  return (
    <div className="blob-lifetime">
      <h3>Blob Lifetime</h3>
      
      <div className="lifetime-card">
        <div className="lifetime-header">
          <div className="lifetime-status">
            <span className={`status-badge ${isExpired ? 'expired' : 'active'}`}>
              {isExpired ? 'Expired' : 'Active'}
            </span>
          </div>
          <div className="auto-renewal">
            <span className={`auto-renewal-badge ${lifetime.isAutoRenewalEnabled ? 'enabled' : 'disabled'}`}>
              {lifetime.isAutoRenewalEnabled ? '🔄 Auto-renewal Enabled' : '❌ Auto-renewal Disabled'}
            </span>
          </div>
        </div>
        
        <div className="lifetime-details">
          <div className="detail-row">
            <span className="detail-label">Created:</span>
            <span className="detail-value">{formatDate(lifetime.createdAt)}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Expires:</span>
            <span className="detail-value">{formatDate(lifetime.expiresAt)}</span>
          </div>
          {!isExpired && (
            <div className="detail-row">
              <span className="detail-label">Time Remaining:</span>
              <span className="detail-value">
                {daysRemaining} day{daysRemaining !== 1 ? 's' : ''}
              </span>
            </div>
          )}
        </div>
        
        {lifetime.renewalHistory.length > 0 && (
          <div className="renewal-history">
            <h4>Renewal History</h4>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Extended Until</th>
                  <th>Cost</th>
                </tr>
              </thead>
              <tbody>
                {lifetime.renewalHistory.map((renewal, index) => (
                  <tr key={index}>
                    <td>{formatDate(renewal.timestamp)}</td>
                    <td>{formatDate(renewal.extendedUntil)}</td>
                    <td>{renewal.cost} WAL</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        <div className="lifetime-actions">
          <button className="renew-btn" disabled={lifetime.isAutoRenewalEnabled}>
            Renew Manually
          </button>
          <button className="toggle-auto-renewal-btn">
            {lifetime.isAutoRenewalEnabled ? 'Disable Auto-renewal' : 'Enable Auto-renewal'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlobLifetime;