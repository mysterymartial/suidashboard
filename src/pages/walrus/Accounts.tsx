import React from "react";
import { Layout } from "../../components/layout/Layout";
import { useWalrusAccount } from "../../hooks/usewalrus/useWalrusAccount";


function Accounts() {

  const { accountData, loading, error } = useWalrusAccount();

  
  return (
    <Layout>
      <main className="p-6 space-y-8">
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-sm">
          <h2 className="text-2xl font-semibold text-white">
            Walrus - Account Details
          </h2>
          <p className="text-gray-300 mt-1">
            Overview of accounts and related metrics.
          </p>
        </div>
        
      </main>
    
    </Layout>
  );
}

export default Accounts;
