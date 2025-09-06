import React from 'react'
import { DeepBookPoolsTable } from "../../components/tables/DeepBookPoolsTable";
import { Layout } from "../../components/layout/Layout";
import { usePoolsData } from "../../hooks/usePoolsData";
import { PoolsPieChart } from '../../components/charts/dbcharts/PoolsPiechart';
import { PoolsBarChart } from '../../components/charts/dbcharts/PoolsBarChart';
import { DbStatsCard } from '../../components/cards/DbStatsCard';
import { Flex } from '@radix-ui/themes';


function DeepPools() {

    const { dbdata } = usePoolsData();

    return (
        <Layout>
            <main className="p-6 space-y-8">
                <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-sm">
                    <h2 className="text-2xl font-semibold text-white">
                        DeepBook - Liquidity Pools
                    </h2>
                    <p className="text-gray-300 mt-1">
                        Liquidity availability and utilization metrics.
                    </p>
                </div>
                <DbStatsCard pools={dbdata} />
                <Flex justify="center">
                    <PoolsBarChart pools={dbdata} />
                    <PoolsPieChart pools={dbdata} />
                </Flex>
                <DeepBookPoolsTable pools={dbdata} />
            </main>
        </Layout>
    )
}

export default DeepPools