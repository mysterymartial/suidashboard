import React, { useState } from 'react';
import { useWalrusBlobs } from '../hooks/useWalrusBlobs';
import { useWalrusStaking } from '../hooks/useWalrusStaking';
import BlobsList from '../components/walrus/BlobsList';
import BlobEvents from '../components/walrus/BlobEvents';
import StakingOperations from '../components/walrus/StakingOperations';
import OperatorInteractions from '../components/walrus/OperatorInteractions';
import BlobLifetime from '../components/walrus/BlobLifetime';
import type { WalrusBlob } from '../api/walrus';

// Styles for the demo page
const styles = `
  .walrus-analytics {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    color: #333;
  }

  .walrus-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
    border-bottom: 1px solid #eaeaea;
    padding-bottom: 15px;
  }

  .walrus-title {
    font-size: 24px;
    font-weight: 600;
    color: #1E40AF;
    margin: 0;
  }

  .account-selector {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .account-input {
    padding: 8px 12px;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    font-size: 14px;
    width: 300px;
  }

  .tabs {
    display: flex;
    border-bottom: 1px solid #eaeaea;
    margin-bottom: 20px;
  }

  .tab {
    padding: 10px 20px;
    cursor: pointer;
    font-weight: 500;
    color: #6b7280;
    border-bottom: 2px solid transparent;
  }

  .tab.active {
    color: #1E40AF;
    border-bottom: 2px solid #1E40AF;
  }

  .tab-content {
    padding: 20px 0;
  }

  .data-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 15px;
    font-size: 14px;
  }

  .data-table th {
    background-color: #f9fafb;
    text-align: left;
    padding: 12px 15px;
    font-weight: 600;
    color: #374151;
    border-bottom: 1px solid #e5e7eb;
  }

  .data-table td {
    padding: 12px 15px;
    border-bottom: 1px solid #e5e7eb;
  }

  .data-table tr:hover {
    background-color: #f9fafb;
  }

  .status-badge {
    display: inline-block;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 500;
  }

  .status-badge.active {
    background-color: #dcfce7;
    color: #166534;
  }

  .status-badge.expired {
    background-color: #fee2e2;
    color: #b91c1c;
  }

  .status-badge.pending {
    background-color: #fef3c7;
    color: #92400e;
  }

  .status-badge.completed {
    background-color: #dbeafe;
    color: #1e40af;
  }

  .status-badge.failed {
    background-color: #fee2e2;
    color: #b91c1c;
  }

  .view-details-btn {
    background-color: #eff6ff;
    color: #1e40af;
    border: none;
    padding: 6px 12px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 12px;
    font-weight: 500;
  }

  .view-details-btn:hover {
    background-color: #dbeafe;
  }

  .events-timeline {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  .event-item {
    display: flex;
    gap: 15px;
    padding: 15px;
    border-radius: 8px;
    background-color: #f9fafb;
    border-left: 4px solid #d1d5db;
  }

  .event-upload {
    border-left-color: #60a5fa;
  }

  .event-certification {
    border-left-color: #34d399;
  }

  .event-expiration {
    border-left-color: #f87171;
  }

  .event-renewal {
    border-left-color: #a78bfa;
  }

  .event-icon {
    font-size: 24px;
  }

  .event-content {
    flex: 1;
  }

  .event-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
  }

  .event-type {
    font-weight: 600;
    color: #374151;
  }

  .event-time {
    color: #6b7280;
    font-size: 12px;
  }

  .event-data {
    background-color: #f3f4f6;
    padding: 10px;
    border-radius: 4px;
    font-size: 12px;
    overflow-x: auto;
    margin: 0;
  }

  .operation-type, .interaction-type {
    font-weight: 500;
  }

  .operation-type.stake {
    color: #059669;
  }

  .operation-type.unstake {
    color: #dc2626;
  }

  .interaction-type.delegation {
    color: #2563eb;
  }

  .interaction-type.undelegation {
    color: #dc2626;
  }

  .interaction-type.reward {
    color: #059669;
  }

  .transaction-link {
    color: #2563eb;
    text-decoration: none;
  }

  .transaction-link:hover {
    text-decoration: underline;
  }

  .lifetime-card {
    background-color: #f9fafb;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  .lifetime-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
  }

  .auto-renewal-badge {
    display: inline-block;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 500;
  }

  .auto-renewal-badge.enabled {
    background-color: #dbeafe;
    color: #1e40af;
  }

  .auto-renewal-badge.disabled {
    background-color: #f3f4f6;
    color: #6b7280;
  }

  .detail-row {
    display: flex;
    margin-bottom: 10px;
  }

  .detail-label {
    width: 150px;
    font-weight: 500;
    color: #6b7280;
  }

  .detail-value {
    color: #111827;
  }

  .renewal-history {
    margin-top: 20px;
  }

  .lifetime-actions {
    display: flex;
    gap: 10px;
    margin-top: 20px;
  }

  .renew-btn, .toggle-auto-renewal-btn {
    padding: 8px 16px;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    border: none;
  }

  .renew-btn {
    background-color: #1e40af;
    color: white;
  }

  .renew-btn:disabled {
    background-color: #d1d5db;
    cursor: not-allowed;
  }

  .toggle-auto-renewal-btn {
    background-color: #f3f4f6;
    color: #374151;
  }

  .loading, .error, .empty-state {
    padding: 20px;
    text-align: center;
    background-color: #f9fafb;
    border-radius: 8px;
    margin: 20px 0;
  }

  .loading {
    color: #6b7280;
  }

  .error {
    color: #b91c1c;
  }

  .empty-state {
    color: #6b7280;
  }

  .blob-details-modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }

  .modal-content {
    background-color: white;
    border-radius: 8px;
    width: 90%;
    max-width: 1000px;
    max-height: 90vh;
    overflow-y: auto;
    padding: 20px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding-bottom: 10px;
    border-bottom: 1px solid #eaeaea;
  }

  .modal-title {
    font-size: 20px;
    font-weight: 600;
    color: #1E40AF;
    margin: 0;
  }

  .close-modal-btn {
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: #6b7280;
  }

  .modal-tabs {
    display: flex;
    border-bottom: 1px solid #eaeaea;
    margin-bottom: 20px;
  }

  .modal-tab {
    padding: 10px 20px;
    cursor: pointer;
    font-weight: 500;
    color: #6b7280;
    border-bottom: 2px solid transparent;
  }

  .modal-tab.active {
    color: #1E40AF;
    border-bottom: 2px solid #1E40AF;
  }
`;

const WalrusAnalytics: React.FC = () => {
  // Default account for demo purposes
  const [account, setAccount] = useState<string>('0x123abc456def789');
  const [activeTab, setActiveTab] = useState<string>('blobs');
  const [selectedBlob, setSelectedBlob] = useState<WalrusBlob | null>(null);
  const [blobModalTab, setBlobModalTab] = useState<string>('events');

  // Fetch data using our custom hooks
  const { blobs, blobEvents, blobLifetimes, loading: blobsLoading, error: blobsError } = useWalrusBlobs(account);
  const { stakingOperations, operatorInteractions, loading: stakingLoading, error: stakingError } = useWalrusStaking(account);

  const handleAccountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAccount(e.target.value);
  };

  const handleSelectBlob = (blob: WalrusBlob) => {
    setSelectedBlob(blob);
    setBlobModalTab('events');
  };

  const closeModal = () => {
    setSelectedBlob(null);
  };

  return (
    <div className="walrus-analytics">
      <style>{styles}</style>
      
      <div className="walrus-header">
        <h1 className="walrus-title">Walrus Analytics Dashboard</h1>
        <div className="account-selector">
          <label htmlFor="account">Account:</label>
          <input
            id="account"
            type="text"
            className="account-input"
            value={account}
            onChange={handleAccountChange}
            placeholder="Enter Sui account address"
          />
        </div>
      </div>
      
      <div className="tabs">
        <div 
          className={`tab ${activeTab === 'blobs' ? 'active' : ''}`}
          onClick={() => setActiveTab('blobs')}
        >
          Blobs Owned
        </div>
        <div 
          className={`tab ${activeTab === 'staking' ? 'active' : ''}`}
          onClick={() => setActiveTab('staking')}
        >
          Staking Operations
        </div>
        <div 
          className={`tab ${activeTab === 'operators' ? 'active' : ''}`}
          onClick={() => setActiveTab('operators')}
        >
          Operator Interactions
        </div>
      </div>
      
      <div className="tab-content">
        {activeTab === 'blobs' && (
          <BlobsList 
            blobs={blobs} 
            loading={blobsLoading} 
            error={blobsError} 
            onSelectBlob={handleSelectBlob}
          />
        )}
        
        {activeTab === 'staking' && (
          <StakingOperations 
            operations={stakingOperations} 
            loading={stakingLoading} 
            error={stakingError} 
          />
        )}
        
        {activeTab === 'operators' && (
          <OperatorInteractions 
            interactions={operatorInteractions} 
            loading={stakingLoading} 
            error={stakingError} 
          />
        )}
      </div>
      
      {selectedBlob && (
        <div className="blob-details-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">
                {selectedBlob.name || `Blob ${selectedBlob.id.substring(0, 10)}...`}
              </h2>
              <button className="close-modal-btn" onClick={closeModal}>&times;</button>
            </div>
            
            <div className="modal-tabs">
              <div 
                className={`modal-tab ${blobModalTab === 'events' ? 'active' : ''}`}
                onClick={() => setBlobModalTab('events')}
              >
                Blob Events
              </div>
              <div 
                className={`modal-tab ${blobModalTab === 'lifetime' ? 'active' : ''}`}
                onClick={() => setBlobModalTab('lifetime')}
              >
                Blob Lifetime
              </div>
            </div>
            
            {blobModalTab === 'events' && (
              <BlobEvents 
                events={blobEvents[selectedBlob.id] || []} 
                loading={blobsLoading} 
                error={blobsError} 
              />
            )}
            
            {blobModalTab === 'lifetime' && (
              <BlobLifetime 
                lifetime={blobLifetimes[selectedBlob.id]} 
                loading={blobsLoading} 
                error={blobsError} 
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default WalrusAnalytics;