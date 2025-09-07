import React from "react";
import { Layout } from "../../components/layout/Layout";
import { useWalrusAnalytics } from "../../hooks/usewalrus/useWalrusAnalytics";


function Storage() {

  const { analyticsData, loading, error  } = useWalrusAnalytics();

  return (
    <Layout>
      <main className="p-6 space-y-8">
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-sm">
          <h2 className="text-2xl font-semibold text-white">
            Walrus - Storage Analytics
          </h2>
          <p className="text-gray-300 mt-1">
            Storage usage and performance insights.
          </p>
        </div>
        
      </main>
    </Layout>
  );
}

export default Storage;
