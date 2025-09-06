import React, { useState } from 'react';
import { useWalrusAnalytics } from '../hooks/useWalrusAnalytics';

// Placeholder components - these would be replaced with actual UI components
const BlobsOwnedSection = ({ blobs, onSelectBlob, isLoading, error }: any) => (
  <div className="section">
    <h2>Blobs Owned</h2>
    {isLoading ? (
      <p>Loading blobs...</p>
    ) : error ? (
      <p className="error">{error}</p>
    ) : (
      <div className="blob-list">
        {blobs.map((blob: any) => (
          <div 
            key={blob.id} 
            className="blob-item" 
            onClick={() => onSelectBlob(blob.id)}
          >
            <h3>{blob.name}</h3>
            <p>Size: {(blob.size / (1024 * 1024)).toFixed(2)} MB</p>
            <p>Type: {blob.contentType}</p>
            <p>Status: <span className={`status-${blob.status}`}>{blob.status}</span></p>
            <p>Created: {new Date(blob.createdAt).toLocaleDateString()}</p>
            <p>Expires: {new Date(blob.expiresAt).toLocaleDateString()}</p>
            <div className="tags">
              {blob.tags.map((tag: string) => (
                <span key={tag} className="tag">{tag}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);

const BlobEventsSection = ({ events, isLoading, error }: any) => (
  <div className="section">
    <h2>Blob Events</h2>
    {isLoading ? (
      <p>Loading events...</p>
    ) : error ? (
      <p className="error">{error}</p>
    ) : (
      <div className="events-list">
        {events.map((event: any) => (
          <div key={event.id} className="event-item">
            <div className={`event-type ${event.eventType}`}>{event.eventType}</div>
            <p>Blob ID: {event.blobId}</p>
            <p>Time: {new Date(event.timestamp).toLocaleString()}</p>
            <p>Transaction: {event.txHash}</p>
            <div className="event-data">
              <pre>{JSON.stringify(event.data, null, 2)}</pre>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);

const StakingOperationsSection = ({ operations, isLoading, error }: any) => (
  <div className="section">
    <h2>Staking Operations</h2>
    {isLoading ? (
      <p>Loading staking operations...</p>
    ) : error ? (
      <p className="error">{error}</p>
    ) : (
      <div className="operations-list">
        {operations.map((op: any) => (
          <div key={op.id} className="operation-item">
            <div className={`operation-type ${op.operationType}`}>{op.operationType}</div>
            <p>Amount: {op.amount} WAL</p>
            <p>Time: {new Date(op.timestamp).toLocaleString()}</p>
            <p>Status: <span className={`status-${op.status}`}>{op.status}</span></p>
            <p>Transaction: {op.txHash}</p>
          </div>
        ))}
      </div>
    )}
  </div>
);

const OperatorInteractionsSection = ({ interactions, isLoading, error }: any) => (
  <div className="section">
    <h2>Operator Interactions</h2>
    {isLoading ? (
      <p>Loading operator interactions...</p>
    ) : error ? (
      <p className="error">{error}</p>
    ) : (
      <div className="interactions-list">
        {interactions.map((interaction: any) => (
          <div key={interaction.id} className="interaction-item">
            <div className={`interaction-type ${interaction.interactionType}`}>
              {interaction.interactionType}
            </div>
            <p>Operator: {interaction.operator}</p>
            <p>Amount: {interaction.amount} WAL</p>
            <p>Time: {new Date(interaction.timestamp).toLocaleString()}</p>
            <p>Transaction: {interaction.txHash}</p>
          </div>
        ))}
      </div>
    )}
  </div>
);

const BlobLifetimeSection = ({ selectedBlobId, blobLifetimes, isLoading, error }: any) => {
  const lifetime = selectedBlobId ? blobLifetimes[selectedBlobId] : null;
  
  return (
    <div className="section">
      <h2>Blob Lifetime</h2>
      {!selectedBlobId ? (
        <p>Select a blob to view lifetime details</p>
      ) : isLoading ? (
        <p>Loading blob lifetime...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : !lifetime ? (
        <p>No lifetime data available for this blob</p>
      ) : (
        <div className="lifetime-details">
          <p>Created: {new Date(lifetime.createdAt).toLocaleString()}</p>
          <p>Expires: {new Date(lifetime.expiresAt).toLocaleString()}</p>
          <p>Auto-renewal: {lifetime.autoRenewal ? 'Enabled' : 'Disabled'}</p>
          
          <h3>Renewal Options</h3>
          <div className="renewal-options">
            {lifetime.renewalOptions.map((option: any, index: number) => (
              <div key={index} className="renewal-option">
                <p>Period: {option.period}</p>
                <p>Cost: {option.costWAL} WAL (${option.costUSD})</p>
                <button className="renew-button">Renew</button>
              </div>
            ))}
          </div>
          
          {lifetime.renewalHistory.length > 0 && (
            <>
              <h3>Renewal History</h3>
              <div className="renewal-history">
                {lifetime.renewalHistory.map((renewal: any, index: number) => (
                  <div key={index} className="renewal-record">
                    <p>Date: {new Date(renewal.date).toLocaleString()}</p>
                    <p>Period: {renewal.period}</p>
                    <p>Cost: {renewal.costWAL} WAL</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

const WalrusAnalyticsDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('blobs');
  const analytics = useWalrusAnalytics();
  
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };
  
  const handleSelectBlob = (blobId: string) => {
    analytics.selectBlob(blobId);
  };
  
  const handleClearSelection = () => {
    analytics.selectBlob(null);
  };
  
  return (
    <div className="walrus-analytics-dashboard">
      <div className="dashboard-header">
        <h1>Walrus Analytics Dashboard</h1>
        <button onClick={analytics.refreshAll} className="refresh-button">
          Refresh All Data
        </button>
        {analytics.selectedBlobId && (
          <button onClick={handleClearSelection} className="clear-selection-button">
            Clear Selection
          </button>
        )}
      </div>
      
      <div className="dashboard-tabs">
        <button 
          className={`tab-button ${activeTab === 'blobs' ? 'active' : ''}`}
          onClick={() => handleTabChange('blobs')}
        >
          Blobs Owned
        </button>
        <button 
          className={`tab-button ${activeTab === 'events' ? 'active' : ''}`}
          onClick={() => handleTabChange('events')}
        >
          Blob Events
        </button>
        <button 
          className={`tab-button ${activeTab === 'staking' ? 'active' : ''}`}
          onClick={() => handleTabChange('staking')}
        >
          Staking Operations
        </button>
        <button 
          className={`tab-button ${activeTab === 'operators' ? 'active' : ''}`}
          onClick={() => handleTabChange('operators')}
        >
          Operator Interactions
        </button>
        <button 
          className={`tab-button ${activeTab === 'lifetime' ? 'active' : ''}`}
          onClick={() => handleTabChange('lifetime')}
        >
          Blob Lifetime
        </button>
      </div>
      
      <div className="dashboard-content">
        {activeTab === 'blobs' && (
          <BlobsOwnedSection 
            blobs={analytics.blobs} 
            onSelectBlob={handleSelectBlob}
            isLoading={analytics.isLoading.blobs}
            error={analytics.error.blobs}
          />
        )}
        
        {activeTab === 'events' && (
          <BlobEventsSection 
            events={analytics.blobEvents} 
            isLoading={analytics.isLoading.blobEvents}
            error={analytics.error.blobEvents}
          />
        )}
        
        {activeTab === 'staking' && (
          <StakingOperationsSection 
            operations={analytics.stakingOperations} 
            isLoading={analytics.isLoading.stakingOperations}
            error={analytics.error.stakingOperations}
          />
        )}
        
        {activeTab === 'operators' && (
          <OperatorInteractionsSection 
            interactions={analytics.operatorInteractions} 
            isLoading={analytics.isLoading.operatorInteractions}
            error={analytics.error.operatorInteractions}
          />
        )}
        
        {activeTab === 'lifetime' && (
          <BlobLifetimeSection 
            selectedBlobId={analytics.selectedBlobId}
            blobLifetimes={analytics.blobLifetimes}
            isLoading={analytics.isLoading.blobLifetime}
            error={analytics.error.blobLifetime}
          />
        )}
      </div>
      
      <style jsx>{`
        .walrus-analytics-dashboard {
          font-family: Arial, sans-serif;
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }
        
        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        
        .dashboard-tabs {
          display: flex;
          border-bottom: 1px solid #ccc;
          margin-bottom: 20px;
        }
        
        .tab-button {
          padding: 10px 20px;
          background: none;
          border: none;
          cursor: pointer;
          font-size: 16px;
          border-bottom: 3px solid transparent;
        }
        
        .tab-button.active {
          border-bottom: 3px solid #0070f3;
          color: #0070f3;
        }
        
        .section {
          margin-bottom: 30px;
        }
        
        .blob-list, .events-list, .operations-list, .interactions-list {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
        }
        
        .blob-item, .event-item, .operation-item, .interaction-item, .lifetime-details {
          border: 1px solid #eaeaea;
          border-radius: 8px;
          padding: 15px;
          box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
        
        .blob-item {
          cursor: pointer;
          transition: transform 0.2s;
        }
        
        .blob-item:hover {
          transform: translateY(-5px);
          box-shadow: 0 5px 10px rgba(0,0,0,0.15);
        }
        
        .event-type, .operation-type, .interaction-type {
          display: inline-block;
          padding: 5px 10px;
          border-radius: 4px;
          margin-bottom: 10px;
          font-weight: bold;
        }
        
        .event-type.upload {
          background-color: #e6f7ff;
          color: #0070f3;
        }
        
        .event-type.certification {
          background-color: #f6ffed;
          color: #52c41a;
        }
        
        .event-type.expiration {
          background-color: #fff2e8;
          color: #fa541c;
        }
        
        .operation-type.stake {
          background-color: #f6ffed;
          color: #52c41a;
        }
        
        .operation-type.unstake {
          background-color: #fff2e8;
          color: #fa541c;
        }
        
        .operation-type.claim {
          background-color: #e6f7ff;
          color: #0070f3;
        }
        
        .interaction-type.delegate {
          background-color: #f6ffed;
          color: #52c41a;
        }
        
        .interaction-type.undelegate {
          background-color: #fff2e8;
          color: #fa541c;
        }
        
        .interaction-type.reward {
          background-color: #e6f7ff;
          color: #0070f3;
        }
        
        .status-active {
          color: #52c41a;
        }
        
        .status-expired {
          color: #fa541c;
        }
        
        .status-pending {
          color: #faad14;
        }
        
        .status-completed {
          color: #52c41a;
        }
        
        .tags {
          display: flex;
          flex-wrap: wrap;
          gap: 5px;
          margin-top: 10px;
        }
        
        .tag {
          background-color: #f0f0f0;
          padding: 3px 8px;
          border-radius: 4px;
          font-size: 12px;
        }
        
        .renewal-options {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 15px;
          margin-top: 15px;
        }
        
        .renewal-option {
          border: 1px solid #eaeaea;
          border-radius: 6px;
          padding: 10px;
        }
        
        .renew-button {
          background-color: #0070f3;
          color: white;
          border: none;
          border-radius: 4px;
          padding: 5px 10px;
          cursor: pointer;
        }
        
        .refresh-button, .clear-selection-button {
          padding: 8px 16px;
          border-radius: 4px;
          border: none;
          cursor: pointer;
        }
        
        .refresh-button {
          background-color: #0070f3;
          color: white;
        }
        
        .clear-selection-button {
          background-color: #f0f0f0;
          margin-left: 10px;
        }
        
        .error {
          color: #ff4d4f;
        }
      `}</style>
    </div>
  );
};

export default WalrusAnalyticsDashboard;