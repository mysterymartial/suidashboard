import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { useLocation } from "react-router";

interface NavbarProps {
  sidebarWidth: number;
}

// Navigation data for title mapping
const navigationData = [
  {
    name: "Overview",
    path: "/",
    hasDropdown: false,
  },
  {
    name: "Sui",
    path: "/sui",
    hasDropdown: true,
    dataPoints: [
      { name: "Validators", path: "/sui/network-stats" },
      { name: "Chain Info", path: "/sui/gas-usage" },
      { name: "Accounts", path: "/sui/active-addresses" },
      { name: "Block Production", path: "/sui/block-production" },
    ],
  },
  {
    name: "Walrus",
    path: "/walrus",
    hasDropdown: true,
    dataPoints: [
      { name: "Accounts", path: "/walrus/accounts" },
      { name: "Blobs", path: "/walrus/blobs" },
      { name: "Storage Analytics", path: "/walrus/storage" },
    ],
  },
  {
    name: "Ika",
    path: "/ika",
    hasDropdown: true,
    dataPoints: [
      { name: "Coin Information", path: "/ika/protocol-stats" },
      { name: "Price Tracker", path: "/ika/fee-generation" },
    ],
  },
  {
    name: "DeepBook",
    path: "/deepbook",
    hasDropdown: true,
    dataPoints: [
      { name: "Pools", path: "/deepbook/pools" },
      { name: "Market Summary", path: "/deepbook/market-summary" },
      { name: "Historical Volume", path: "/deepbook/historical-volume" },
      { name: "Order Books", path: "/deepbook/order-book" },
      { name: "Assets & Tickers", path: "/deepbook/assets" },
    ],
  },
  {
    name: "SuiNS",
    path: "/suins",
    hasDropdown: true,
    dataPoints: [
      { name: "Name Resolution", path: "/suins/name-resolution" },
      { name: "Active Pricing", path: "/suins/pricing" },
      { name: "Renewals", path: "/suins/renewals" },
    ],
  },
  {
    name: "Coins",
    path: "/coins",
    hasDropdown: true,
    dataPoints: [
      { name: "All Coins", path: "/coins/account-coins" },
      { name: "Coin Details", path: "/coins/coin-details" },
      { name: "Trending Coins", path: "/coins/prices" },
    ],
  },
  {
    name: "NFTs",
    path: "/nfts",
    hasDropdown: true,
    dataPoints: [
      { name: "Collection NFT List", path: "/nfts/collection-list" },
      { name: "NFT Activity", path: "/nfts/activity" },
      { name: "All NFTs", path: "/nfts/account-nfts" },
      { name: "Marketplace", path: "/nfts/transfers-sales" },
    ],
  },
  {
    name: "Stablecoins",
    path: "/stablecoins",
    hasDropdown: true,
    dataPoints: [{ name: "Supply", path: "/stablecoins/supply" }],
  },
  {
    name: "RWA",
    path: "/rwa",
    hasDropdown: true,
    dataPoints: [
      { name: "Tokenized Assets", path: "/rwa/tokenized-assets" },
      { name: "Real Estate", path: "/rwa/real-estate" },
      { name: "Commodities", path: "/rwa/commodities" },
      { name: "Bonds", path: "/rwa/bonds" },
      { name: "Private Credit", path: "/rwa/private-credit" },
    ],
  },
  {
    name: "Security & Metadata",
    path: "/security",
    hasDropdown: true,
    dataPoints: [
      { name: "Sui Metadata", path: "/security/sui-metadata" },
      { name: "Security Alerts", path: "/security/alerts" },
      { name: "API Checks", path: "/security/api-checks" },
      { name: "Latest Blocks", path: "/security/latest-blocks" },
      { name: "Validators", path: "/security/validators" },
    ],
  },
  {
    name: "Personal Finance",
    path: "/finance",
    hasDropdown: true,
    dataPoints: [
      { name: "Transaction Analyzer", path: "/finance/transaction-analyzer" },
    ],
  },
  {
    name: "Chatbot",
    path: "/chatbot",
    hasDropdown: false,
  },
];

// Function to get current page title
function getCurrentPageTitle(pathname: string): string {
  // Handle root path
  if (pathname === "/") {
    return "Overview";
  }

  // First, try to find an exact match in dataPoints
  for (const navItem of navigationData) {
    if (navItem.dataPoints) {
      const matchingDataPoint = navItem.dataPoints.find(
        (dataPoint) => dataPoint.path === pathname,
      );
      if (matchingDataPoint) {
        return matchingDataPoint.name;
      }
    }
  }

  // If no exact match in dataPoints, try to find a parent nav item
  for (const navItem of navigationData) {
    if (pathname.startsWith(navItem.path) && navItem.path !== "/") {
      return navItem.name;
    }
  }

  // Fallback to a formatted version of the pathname
  const pathSegments = pathname.split("/").filter(Boolean);
  if (pathSegments.length > 0) {
    const lastSegment = pathSegments[pathSegments.length - 1];
    return lastSegment
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  return "Sui Dashboard";
}

export function Navbar({ sidebarWidth }: NavbarProps) {
  const location = useLocation();
  const currentPageTitle = getCurrentPageTitle(location.pathname);

  return (
    <nav
      className="fixed top-0 bg-[#FAFAFA] border border-[#DCDCDC] px-6 py-3.5 z-50"
      style={{ left: sidebarWidth, right: 0 }}
    >
      <div className="flex items-center justify-between">
        <h1 className="text-[1.5rem] font-bold text-[#292929] font-inter">
          {currentPageTitle}
        </h1>
        <div className="relative hidden md:block">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#292929] w-4 h-4" />
          <input
            type="text"
            placeholder="Search "
            className="pl-10 pr-4 py-2 w-full bg-[#fafafa] border border-[#DCDCDC] text-[#292929] placeholder-gray-400 rounded-lg"
          />
        </div>
      </div>
    </nav>
  );
}
