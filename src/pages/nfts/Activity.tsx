import React from "react";
import { Layout } from "../../components/layout/Layout";
import { useEvents } from "../../hooks/useNFTs/useEvents";


function Activity() {
  const {nftevents, loading, error} = useEvents()

  return (
    <Layout>
      <main className="p-6 space-y-8">
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-sm">
          <h2 className="text-2xl font-semibold text-white">
            NFTs - NFT Activity
          </h2>
          <p className="text-gray-300 mt-1">
            Transfers, listings, and sales activity.
          </p>
        </div>

      </main>
    </Layout>
  );
}

export default Activity;
