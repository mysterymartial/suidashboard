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
import "../../App.css";
import Suilogo from "../../assets/Sui_Logo.webp";

function Home() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const sidebarWidth = sidebarCollapsed ? 44 : 72;
  const { data, loading } = usePoolsData();

  // Map API data for AssetsTable
  const assets = Array.isArray(data)
    ? data.map((pool) => ({
        name: pool.pool_name,
        symbol: pool.base_asset_symbol,
        protocol: pool.base_asset_name,
        change7d: "-",
        change30d: "-",
        marketCap: "-",
        assetClass: pool.quote_asset_symbol,
      }))
    : [];

  // Map API data for LeagueTable
  const networks = Array.isArray(data)
    ? data.map((pool) => ({
        name: pool.pool_name,
        count: "-",
        value: "-",
        change30d: "-",
        share: "-",
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
          <StatsCards />
          <ChartsSection data={data} />
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
