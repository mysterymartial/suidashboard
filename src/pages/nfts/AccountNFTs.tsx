import React from "react";
import { Layout } from "../../components/layout/Layout";
import { useNfts } from "../../hooks/useNFTs/useNfts";

function AccountNFTs() {

  const { nft, nftCount } = useNfts()


  return (
    <Layout>
      <main className="p-6 space-y-8">
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-sm">
          <h2 className="text-2xl font-semibold text-white">
            NFTs - All NFTs
          </h2>
          <p className="text-gray-300 mt-1">
            All NFTs List.
          </p>
        </div>
      </main>
    </Layout>
  );
}

export default AccountNFTs;
