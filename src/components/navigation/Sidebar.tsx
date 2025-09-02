import React, { useState } from "react";
import { Box, Button, Heading, Separator, Text, Badge, Flex, IconButton, Tooltip } from "@radix-ui/themes";
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import { NavLink } from "react-router";

// Simple emoji icons for demonstration
const icons = {
  overview: "🌐",
  news: "📰",
  invest: "🌱",
  stablecoins: "🪙",
  treasuries: "🏦",
  bonds: "🌍",
  credit: "💳",
  commodities: "⚖️",
  funds: "💼",
  stocks: "📈",
  networks: "🕸️",
  platforms: "🧩",
  directory: "📒",
};

export function Sidebar({ collapsed, setCollapsed }: { collapsed: boolean; setCollapsed: React.Dispatch<React.SetStateAction<boolean>> }) {

  // Reduce sidebar: 44px collapsed, 72px expanded (very compact)
  const sidebarWidth = collapsed ? 44 : 72;

  // Helper to show/hide label
  const show = (children: React.ReactNode) => collapsed ? null : children;

  // Helper for NavLink styling
  const navButtonStyle = ({ isActive }: { isActive: boolean }) => ({
    width: "100%",
    justifyContent: collapsed ? "center" : "flex-start",
    background: isActive ? "#e0e7ef" : "transparent",
    color: isActive ? "#222" : "#fff",
    fontWeight: 600,
    paddingLeft: collapsed ? 0 : 5,
    paddingRight: collapsed ? 0 : 2,
    minHeight: 24,
    gap: collapsed ? 0 : 2,
    fontSize: 15,
    border: "none",
    outline: "none",
    textDecoration: "none",
    display: "flex",
    alignItems: "center",
  });

  return (
    <Box
      width={collapsed ? 44 : 72}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        height: "100vh",
        background: "#111113",
        color: "#222",
        borderRight: "1px solid #4088d1",
        zIndex: 100,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        transition: "width 0.2s cubic-bezier(.4,0,.2,1)",
      }}
    >
      <Box
        p="1"
        pb="0"
        style={{
          borderBottom: "1px solid #e5e7eb",
          minHeight: 44,
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "space-between",
        }}
      >
        <Flex align="center" gap="1">
          <span style={{ fontSize: 20 }}>{icons.overview}</span>
          {show(
            <Heading size="1" style={{ letterSpacing: 0.5, fontWeight: 700, fontSize: 20, color: "white" }}>Analytics</Heading>
          )}
        </Flex>
        <Tooltip content={collapsed ? "Expand" : "Collapse"} side="right">
          <IconButton
            variant="ghost"
            color="black"
            size="1"
            style={{ marginLeft: collapsed ? 0 : 2 }}
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </Tooltip>
      </Box>
      {show(
        <Text size="1" color="black" style={{ paddingLeft: 10, paddingTop: 15, paddingBottom: 10, fontSize: 15, color: "white" }}>
          Every Analysis on Sui.
        </Text>
      )}
      <Box
        p="1"
        pt={collapsed ? "0" : "2"}
        style={{
          flex: 1,
          overflowY: "auto",
          paddingLeft: collapsed ? 0 : undefined,
          paddingRight: collapsed ? 0 : undefined,
        }}
      >
        <NavLink to="/" style={navButtonStyle} end>
          <span style={{ marginRight: collapsed ? 0 : 4 }}>{icons.overview}</span>
          {show("Sui")}
        </NavLink>
        <NavLink to="/walrus" style={navButtonStyle}>
          <span style={{ marginRight: collapsed ? 0 : 4 }}>{icons.news}</span>
          {show("Walrus")}
        </NavLink>
        <NavLink to="/deepbook" style={navButtonStyle}>
          <span style={{ marginRight: collapsed ? 0 : 4 }}>{icons.invest}</span>
          {show(
            <>
              DeepBook
              <Badge color="blue" ml="2" size="1">NEW</Badge>
            </>
          )}
        </NavLink>
        <Separator my="1" />
        <Flex direction="column" gap="3" mb="1" className="text-white">
          <NavLink to="/stablecoins" style={navButtonStyle}>
            <span>{icons.stablecoins}</span>
            {show(<Text as="span" size="1" style={{ fontSize: 15 }}>Stablecoins</Text>)}
          </NavLink>
          <NavLink to="/nfts" style={navButtonStyle}>
            <span>{icons.treasuries}</span>
            {show(<Text as="span" size="1" style={{ fontSize: 15 }}>NFTs</Text>)}
          </NavLink>
          <NavLink to="/pools" style={navButtonStyle}>
            <span>{icons.commodities}</span>
            {show(<Text as="span" size="1" style={{ fontSize: 15 }}>Pools</Text>)}
          </NavLink>
          <NavLink to="/yeilds" style={navButtonStyle}>
            <span>{icons.funds}</span>
            {show(<Text as="span" size="1" style={{ fontSize: 15 }}>Yeilds</Text>)}
          </NavLink>
        </Flex>
        <Separator my="1" />
        <Flex direction="column" gap="1">
          <Flex align="center" gap="1" justify={collapsed ? "center" : "start"}>
            <span>{icons.networks}</span>
            {show(<Text as="span" size="1" style={{ fontSize: 11 }}>Networks</Text>)}
          </Flex>
          <Flex align="center" gap="1" justify={collapsed ? "center" : "start"}>
            <span>{icons.platforms}</span>
            {show(
              <>
                <Text as="span" size="1" style={{ fontSize: 11 }}>Platforms</Text>
                <Badge color="blue" ml="2" size="1">NEW</Badge>
              </>
            )}
          </Flex>
        </Flex>
      </Box>
    </Box>
  );
}