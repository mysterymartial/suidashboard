import React from "react";
import { Layout } from "../../components/layout/Layout";
import { useMarketPlace } from "../../hooks/useNFTs/useMarketPlace";

function TransfersSales() {

  const {marketplace, topMarketplace} = useMarketPlace()

  return (
    <Layout>
      <main className="p-6 space-y-8">
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-sm">
          <h2 className="text-2xl font-semibold text-white">
            NFTs - Marketplace
          </h2>
          <p className="text-gray-300 mt-1">
            Marketplace of all NFTs collections.
          </p>
        </div>
        
      </main>
    </Layout>
  );
}

export default TransfersSales;
