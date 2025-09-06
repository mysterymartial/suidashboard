import React from 'react';
import WalrusAnalyticsDashboard from '../components/WalrusAnalyticsDashboard';

const WalrusAnalyticsPage: React.FC = () => {
  return (
    <div className="walrus-analytics-page">
      <WalrusAnalyticsDashboard />
      
      <style jsx>{`
        .walrus-analytics-page {
          min-height: 100vh;
          background-color: #f5f5f5;
          padding: 20px;
        }
      `}</style>
    </div>
  );
};

export default WalrusAnalyticsPage;