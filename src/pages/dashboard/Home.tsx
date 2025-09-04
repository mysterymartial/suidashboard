import React, { useState } from "react";
import { Box, Container, Flex, Heading } from "@radix-ui/themes";
import { ConnectButton } from "@mysten/dapp-kit";
import { WalletStatus } from "../../WalletStatus";
import { Sidebar } from "../../components/navigation/Sidebar";
import { StatsCards } from "../../components/cards/StatsCards";
import { ChartsSection } from "../../components/charts/ChartsSection";
import { AssetsTable } from "../../components/tables/AssetsTable";
import { LeagueTable } from "../../components/tables/LeagueTable";
import { NewsCard } from "../../components/cards/NewsCard";
import { IssuanceAndTransfers } from "../../components/cards/IssuanceAndTransfers";
import { usePoolsData } from "../../hooks/usePoolsData";
import { useStatsData } from "../../hooks/useStatsData";
import "../../App.css";
import Suilogo from "../../assets/Sui_Logo.webp";

function Home() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const sidebarWidth = sidebarCollapsed ? 44 : 72;
  const { suidata, loading } = usePoolsData();
  const { suiStats } = useStatsData();

  // Defensive: fallback to [] if suidata is not an array
  const assets = Array.isArray(suidata)
    ? suidata.map((pool) => ({
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

  const networks = Array.isArray(suidata)
    ? suidata.map((pool) => ({
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
      <Box
        style={{
          marginLeft: sidebarWidth,
          transition: "margin-left 0.2s cubic-bezier(.4,0,.2,1)",
        }}
      >
        <Container>
          <Flex align="center" justify="between" mb="4">
            <Heading className="flex" size="6">
              <img className="w-16" src={Suilogo} alt="suilogo" />&nbsp;Analytics
            </Heading>
            <Flex gap="3">
              <ConnectButton />
            </Flex>
          </Flex>
          <StatsCards stats={suiStats} />
          <ChartsSection data={suidata} valueField="liqUsd" labelField="pool" symbolField="symbol"/>
          <AssetsTable assets={assets} />
          <Flex gap="6">
            <LeagueTable networks={networks} />
            <NewsCard news={[]} />
          </Flex>
          <IssuanceAndTransfers />
        </Container>
      </Box>
      <WalletStatus />
    </div>
  );
}

export default Home;
