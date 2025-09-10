import { DeepBookPoolsTable } from "../../components/tables/DeepBookPoolsTable";
import { Layout } from "../../components/layout/Layout";
import { usePoolsData } from "../../hooks/useDeep/usePoolsData";
import { PoolsPieChart } from "../../components/charts/dbcharts/PoolsPieChart";
import { PoolsBarChart } from "../../components/charts/dbcharts/PoolsBarChart";
import { DbStatsCard } from "../../components/cards/DbStatsCard";
import { Flex } from "@radix-ui/themes";
import CardComponent from "@/components/cards";

function DeepPools() {
  const { dbdata } = usePoolsData();

  return (
    <Layout>
      <main className="p-6 space-y-8">
        <CardComponent>
          <h2 className="text-2xl font-semibold text-[#292929]">
            DeepBook - Liquidity Pools
          </h2>
          <p className="text-[#292929] mt-1">
            Liquidity availability and utilization metrics.
          </p>
        </CardComponent>
        <DbStatsCard pools={dbdata} />
        <Flex justify="center">
          <PoolsBarChart pools={dbdata} />
          <PoolsPieChart pools={dbdata} />
        </Flex>
        <DeepBookPoolsTable pools={dbdata} />
      </main>
    </Layout>
  );
}

export default DeepPools;
