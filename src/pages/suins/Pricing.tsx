import React from "react";
import { Layout } from "../../components/layout/Layout";
import { usePoolsData } from "../../hooks/usePoolsData";
import { useStatsData } from "../../hooks/useStatsData";
import { useSuins } from "../../hooks/useSuins";
import { SuinsPricingTable } from "../../components/tables/SuinsPricingTable";

function Pricing() {
  const { priceList } = useSuins();

  // Normalize Map -> array
  const prices = Array.from(priceList.entries()).map(
    ([[from, to], value]) => ({
      domainLengthFrom: from,
      domainLengthTo: to,
      priceMist: value,
      priceUSDC: value / 1_000_000,
    })
  );

  return (
    <Layout>
      <main className="p-6 space-y-8">
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-sm">
          <h2 className="text-2xl font-semibold text-white">
            SuiNS - Active Pricing
          </h2>
          <p className="text-gray-300 mt-1">Pricing rules and active rates.</p>
        </div>

        <SuinsPricingTable prices={prices} />
      </main>
    </Layout>
  );
}

export default Pricing;
