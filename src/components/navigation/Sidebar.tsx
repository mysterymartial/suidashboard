import React, { useState } from "react";
import { NavLink } from "react-router";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  HomeIcon,
  BarChartIcon,
  CircleIcon,
  CubeIcon,
  PaperPlaneIcon,
  DesktopIcon,
} from "@radix-ui/react-icons";
import suilog01 from "../../assets/Sui_Logo1.png";
import walogo from "../../assets/Wal_Logo.webp";
import deeplogo from "../../assets/Deep_Logo.png";
import ikaLogo from "../../assets/ika-icon-white.svg";
import SuinsIcon from "../../assets/suins-icon";

const navigationData = [
  {
    name: "Overview",
    path: "/",
    icon: HomeIcon,
    hasDropdown: false,
  },
  {
    name: "Sui",
    path: "/sui",
    icon: () =>
      suilog01 ? (
        <img src={suilog01} alt="Sui" className="w-5 h-5" />
      ) : (
        <CubeIcon className="w-5 h-5" />
      ),
    hasDropdown: true,
    dataPoints: [
      { name: "Network Stats", path: "/sui/network-stats" },
      { name: "Transaction Volume", path: "/sui/transaction-volume" },
      { name: "Gas Usage", path: "/sui/gas-usage" },
      { name: "Active Addresses", path: "/sui/active-addresses" },
      { name: "Block Production", path: "/sui/block-production" },
    ],
  },
  {
    name: "Walrus",
    path: "/walrus",
    icon: () =>
      walogo ? (
        <img src={walogo} alt="Walrus" className="w-5 h-5 rounded" />
      ) : (
        <BarChartIcon className="w-5 h-5" />
      ),
    hasDropdown: true,
    dataPoints: [
      { name: "Account Details", path: "/walrus/accounts" },
      { name: "Blobs", path: "/walrus/blobs" },
      { name: "Blob Activity", path: "/walrus/blob-activity" },
      { name: "Storage Analytics", path: "/walrus/storage" },
      { name: "Metadata", path: "/walrus/metadata" },
    ],
  },
  {
    name: "Ika",
    path: "/ika",
    icon: () =>
      ikaLogo ? (
        <img src={ikaLogo} alt="Ika" className="w-5 h-5 rounded" />
      ) : (
        <CircleIcon className="w-5 h-5" />
      ),
    hasDropdown: true,
    dataPoints: [
      { name: "Protocol Stats", path: "/ika/protocol-stats" },
      { name: "Liquidity Pools", path: "/ika/liquidity-pools" },
      { name: "Trading Volume", path: "/ika/trading-volume" },
      { name: "Fee Generation", path: "/ika/fee-generation" },
      { name: "User Activity", path: "/ika/user-activity" },
    ],
  },
  {
    name: "DeepBook",
    path: "/deepbook",
    icon: () =>
      deeplogo ? (
        <img src={deeplogo} alt="DeepBook" className="w-5 h-5 rounded" />
      ) : (
        <DesktopIcon className="w-5 h-5" />
      ),
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
    icon: SuinsIcon,
    hasDropdown: true,
    dataPoints: [
      { name: "Name Resolution", path: "/suins/name-resolution" },
      // { name: "Address Resolution", path: "/suins/address-resolution" },
      // { name: "Owned Names", path: "/suins/owned-names" },
      { name: "Active Pricing", path: "/suins/pricing" },
      { name: "Renewals", path: "/suins/renewals" },
    ],
  },
  {
    name: "Coins",
    path: "/coins",
    icon: CircleIcon,
    hasDropdown: true,
    dataPoints: [
      { name: "Account Coins", path: "/coins/account-coins" },
      { name: "Coin Details", path: "/coins/coin-details" },
      { name: "Multiple Prices", path: "/coins/prices" },
      { name: "Coin Holders", path: "/coins/holders" },
      { name: "Market Data", path: "/coins/market-data" },
    ],
  },
  {
    name: "NFTs",
    path: "/nfts",
    icon: CubeIcon,
    hasDropdown: true,
    dataPoints: [
      { name: "Collection NFT List", path: "/nfts/collection-list" },
      { name: "NFT Activity", path: "/nfts/activity" },
      { name: "Account NFTs", path: "/nfts/account-nfts" },
      { name: "Collection Holders", path: "/nfts/collection-holders" },
      { name: "Transfers & Sales", path: "/nfts/transfers-sales" },
    ],
  },
  {
    name: "Stablecoins",
    path: "/stablecoins",
    icon: PaperPlaneIcon,
    hasDropdown: true,
    dataPoints: [
      { name: "Supply", path: "/stablecoins/supply" },
      { name: "Mint/Burn", path: "/stablecoins/mint-burn" },
      { name: "Backing", path: "/stablecoins/backing" },
      { name: "Stability", path: "/stablecoins/stability" },
      { name: "Usage", path: "/stablecoins/usage" },
    ],
  },
  {
    name: "RWA",
    path: "/rwa",
    icon: DesktopIcon,
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
    icon: DesktopIcon,
    hasDropdown: true,
    dataPoints: [
      { name: "Sui Metadata", path: "/security/sui-metadata" },
      { name: "Security Alerts", path: "/security/alerts" },
      { name: "API Checks", path: "/security/api-checks" },
      { name: "Latest Blocks", path: "/security/latest-blocks" },
      { name: "Validators", path: "/security/validators" },
    ],
  },
];

interface DropdownItemProps {
  item: {
    name: string;
    path: string;
  };
  collapsed: boolean;
}

const DropdownItem: React.FC<DropdownItemProps> = ({ item, collapsed }) => {
  if (collapsed) return null;

  return (
    <NavLink
      to={item.path}
      className={({ isActive }) =>
        `block px-8 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700 transition-colors ${
          isActive ? "text-white bg-gray-700" : ""
        }`
      }
    >
      {item.name}
    </NavLink>
  );
};

interface NavigationItemProps {
  item: {
    name: string;
    path: string;
    icon: React.ComponentType<{ className?: string }> | (() => React.ReactNode);
    hasDropdown: boolean;
    dataPoints?: Array<{ name: string; path: string }>;
  };
  collapsed: boolean;
}

const NavigationItem: React.FC<NavigationItemProps> = ({ item, collapsed }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const IconComponent = item.icon;

  const renderIcon = () => {
    if (
      item.name === "Sui" ||
      item.name === "Walrus" ||
      item.name === "DeepBook" ||
      item.name === "SuiNS"
    ) {
      return (IconComponent as () => React.ReactNode)();
    }
    const Component = IconComponent as React.ComponentType<{
      className?: string;
    }>;
    return <Component className="w-5 h-5" />;
  };

  if (collapsed) {
    return (
      <div className="relative group">
        <NavLink
          to={item.path}
          className={({ isActive }) =>
            `block p-3 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors rounded-lg ${
              isActive ? "text-white bg-gray-700" : ""
            }`
          }
          title={item.name}
        >
          {renderIcon()}
        </NavLink>
        <div className="absolute left-full top-0 ml-2 bg-gray-800 text-white px-3 py-2 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
          {item.name}
        </div>
      </div>
    );
  }

  if (!item.hasDropdown) {
    return (
      <NavLink
        to={item.path}
        className={({ isActive }) =>
          `flex items-center gap-3 p-3 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors rounded-lg ${
            isActive ? "text-white bg-gray-700" : ""
          }`
        }
      >
        {renderIcon()}
        <span className="text-sm font-medium">{item.name}</span>
      </NavLink>
    );
  }

  return (
    <div>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-3 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors flex items-center justify-between rounded-lg"
      >
        <div className="flex items-center gap-3">
          {renderIcon()}
          <span className="text-sm font-medium">{item.name}</span>
        </div>
        <ChevronDownIcon
          className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-180" : ""}`}
        />
      </button>
      {isExpanded && item.dataPoints && (
        <div className="bg-gray-800">
          {item.dataPoints.map((dataPoint, index) => (
            <DropdownItem key={index} item={dataPoint} collapsed={collapsed} />
          ))}
        </div>
      )}
    </div>
  );
};

export function Sidebar({
  collapsed,
  setCollapsed,
}: {
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const sidebarWidth = collapsed ? 64 : 280;

  return (
    <div
      className="fixed top-16 left-0 bg-gray-900 border-r border-gray-700 z-40 flex flex-col transition-all duration-300 ease-in-out"
      style={{ width: sidebarWidth, height: "calc(100vh - 4rem)" }}
    >
      {/* Header */}
      <div className="pt-4 px-4 flex items-center justify-end">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRightIcon className="w-5 h-5" />
          ) : (
            <ChevronLeftIcon className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-2">
          {navigationData.map((item, index) => (
            <NavigationItem key={index} item={item} collapsed={collapsed} />
          ))}
        </div>
      </div>

      {!collapsed && (
        <div className="p-4 border-t border-gray-700">
          <div className="text-gray-400 text-xs text-center">
            Built with ❤️ by Sui Boys
          </div>
        </div>
      )}
    </div>
  );
}
