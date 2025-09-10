
import { Layout } from "../../components/layout/Layout";
import { useSuins } from "../../hooks/useSuins/useSuins";
import { SuinsPricingTable } from "../../components/tables/SuinsPricingTable";
import CardComponent from "@/components/cards";

function Pricing() {
  const { renewalPriceList } = useSuins();

  // Normalize Map -> array
  const prices = Array.from(renewalPriceList.entries()).map(
    // @ts-ignore
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
        <CardComponent>
          <h2 className="text-2xl font-semibold text-[#292929]">
            SuiNS - Renewals
          </h2>
          <p className="text-[#292929] mt-1">Pricing rules and active rates.</p>
        </CardComponent>

        <SuinsPricingTable prices={prices} />
      </main>
    </Layout>
  );
}

export default Pricing;
