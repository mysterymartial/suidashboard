import React from 'react';
import type { BlobEvent } from '../../api/walrus';
import { BlobEventType } from '../../api/walrus';

interface BlobEventsProps {
  events: BlobEvent[];
  loading: boolean;
  error: string | null;
}

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleString();
};

const getEventTypeLabel = (type: BlobEventType): string => {
  switch (type) {
    case BlobEventType.UPLOAD:
      return 'Upload';
    case BlobEventType.CERTIFICATION:
      return 'Certification';
    case BlobEventType.EXPIRATION:
      return 'Expiration';
    case BlobEventType.RENEWAL:
      return 'Renewal';
    default:
      return type;
  }
};

const getEventIcon = (type: BlobEventType): string => {
  switch (type) {
    case BlobEventType.UPLOAD:
      return '📤';
    case BlobEventType.CERTIFICATION:
      return '✅';
    case BlobEventType.EXPIRATION:
      return '⏱️';
    case BlobEventType.RENEWAL:
      return '🔄';
    default:
      return '📝';
  }
};

export const BlobEvents: React.FC<BlobEventsProps> = ({ events, loading, error }) => {
  if (loading) {
    return <div className="loading">Loading events data...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  if (events.length === 0) {
    return <div className="empty-state">No events found for this blob.</div>;
  }

  // Sort events by timestamp (newest first)
  const sortedEvents = [...events].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <div className="blob-events">
      <h3>Blob Events</h3>
      <div className="events-timeline">
        {sortedEvents.map((event) => (
          <div key={event.id} className={`event-item event-${event.type}`}>
            <div className="event-icon">{getEventIcon(event.type)}</div>
            <div className="event-content">
              <div className="event-header">
                <span className="event-type">{getEventTypeLabel(event.type)}</span>
                <span className="event-time">{formatDate(event.timestamp)}</span>
              </div>
              <div className="event-details">
                {event.data && (
                  <pre className="event-data">{JSON.stringify(event.data, null, 2)}</pre>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlobEvents;