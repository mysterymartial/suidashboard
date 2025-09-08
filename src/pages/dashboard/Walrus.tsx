import React, { useState } from "react";
import { Box, Container, Flex, Heading } from "@radix-ui/themes";
import { ConnectButton } from "@mysten/dapp-kit";
import { Sidebar } from "../../components/navigation/Sidebar";
import { StatsCards } from "../../components/cards/StatsCards";
import { ChartsSection } from "../../components/charts/ChartsSection";
import { AssetsTable } from "../../components/tables/AssetsTable";
import { LeagueTable } from "../../components/tables/LeagueTable";
import { NewsCard } from "../../components/cards/NewsCard";
import { IssuanceAndTransfers } from "../../components/cards/IssuanceAndTransfers";
import { usePoolsData } from "../../hooks/useDeep/usePoolsData";
import { useStatsData } from "../../hooks/useStatsData";
import Walogo from "../../assets/Wal_Logo.webp";
import { Layout } from "../../components/layout/Layout";

function Walrus() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const sidebarWidth = sidebarCollapsed ? 44 : 72;
  const { waldata } = usePoolsData();
  const { suiStats } = useStatsData();

  const assets = Array.isArray(waldata)
    ? waldata.map((pool) => ({
        name: pool.pool || "-", // pool address
        symbol: pool.coinA?.split("::").pop() + "/" + pool.coinB?.split("::").pop() || "-",
        protocol: pool.platform || "-",
        change7d: "-", // Not available
        change30d: "-", // Not available
        marketCap: pool.liqUsd ? `$${Number(pool.liqUsd).toLocaleString(undefined, {maximumFractionDigits:2})}` : "-",
        assetClass: pool.coinA?.split("::").pop() || "-",
        swapCount: pool.swapCount || "-",
        price: pool.price || "-",
      }))
    : [];

  const networks = Array.isArray(waldata)
    ? waldata.map((pool) => ({
       name: pool.platform || "-",
        count: pool.swapCount || "-",
        value: pool.liqUsd ? `$${Number(pool.liqUsd).toLocaleString(undefined, {maximumFractionDigits:2})}` : "-",
        change30d: "-", // Not available
        share: "-", // Not available
      }))
    : [];

  return (
    <div className="pt-4 pb-4">
      <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      <Box style={{ marginLeft: sidebarWidth, transition: "margin-left 0.2s cubic-bezier(.4,0,.2,1)" }}>
        <Container>
          <Flex align="center" justify="between" mb="4">
            <Heading className="flex justify-center, items-center" size="6">
              <img className="w-10" src={Walogo} alt="walogo" />&nbsp;Walrus Analytics
            </Heading>
            <Flex gap="3">
              <ConnectButton />
            </Flex>
          </Flex>
          <StatsCards stats={suiStats} />
          <ChartsSection data={waldata} />
          <AssetsTable assets={assets} />
          <Flex gap="6">
            <LeagueTable networks={networks} />
            <NewsCard news={[]} />
          </Flex>
          <IssuanceAndTransfers />
        </Container>
      </Box>
    </div>
  );
}

export default Walrus;
