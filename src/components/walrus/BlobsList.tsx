import React from 'react';
import type { WalrusBlob } from '../../api/walrus';

interface BlobsListProps {
  blobs: WalrusBlob[];
  loading: boolean;
  error: string | null;
  onSelectBlob?: (blob: WalrusBlob) => void;
}

const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleString();
};

export const BlobsList: React.FC<BlobsListProps> = ({ blobs, loading, error, onSelectBlob }) => {
  if (loading) {
    return <div className="loading">Loading blobs data...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  if (blobs.length === 0) {
    return <div className="empty-state">No blobs found for this account.</div>;
  }

  return (
    <div className="blobs-list">
      <h3>Blobs Owned</h3>
      <table className="data-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Size</th>
            <th>Type</th>
            <th>Created</th>
            <th>Expires</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {blobs.map((blob) => (
            <tr key={blob.id} className={`status-${blob.status}`}>
              <td>{blob.name || blob.id.substring(0, 10)}</td>
              <td>{formatBytes(blob.size)}</td>
              <td>{blob.contentType || 'Unknown'}</td>
              <td>{formatDate(blob.createdAt)}</td>
              <td>{formatDate(blob.expiresAt)}</td>
              <td>
                <span className={`status-badge ${blob.status}`}>
                  {blob.status.charAt(0).toUpperCase() + blob.status.slice(1)}
                </span>
              </td>
              <td>
                <button 
                  className="view-details-btn" 
                  onClick={() => onSelectBlob && onSelectBlob(blob)}
                >
                  View Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BlobsList;