import React, { useState } from "react";
import { NavLink, useLocation } from "react-router";
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
  ChatBubbleIcon,
  PieChartIcon,
} from "@radix-ui/react-icons";
import suilog01 from "../../assets/Sui_Logo1.png";
import walogo from "../../assets/Wal_Logo.webp";
import deeplogo from "../../assets/Deep_Logo.png";
import ikaLogo from "../../assets/ika-icon-white.svg";
import SuinsIcon from "../../assets/suins-icon";

const navigationSections = [
  {
    title: "Overview",
    items: [
      {
        name: "Overview",
        path: "/",
        icon: HomeIcon,
        hasDropdown: false,
      },
    ],
  },
  {
    title: "Infrastructure",
    items: [
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
          { name: "Validators", path: "/sui/validators" },
          // { name: "Transaction Volume", path: "/sui/transaction-volume" },
          { name: "Chain Info", path: "/sui/chain-info" },
          { name: "Accounts", path: "/sui/accounts" },
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
          { name: "Accounts", path: "/walrus/accounts" },
          { name: "Blobs", path: "/walrus/blobs" },
          // { name: "Blob Activity", path: "/walrus/blob-activity" },
          { name: "Storage Analytics", path: "/walrus/storage" },
          // { name: "Metadata", path: "/walrus/metadata" },
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
          { name: "Coin Information", path: "/ika/protocol-stats" },
          // { name: "Liquidity Pools", path: "/ika/liquidity-pools" },
          // { name: "Trading Volume", path: "/ika/trading-volume" },
          // { name: "Price Tracker", path: "/ika/fee-generation" },
          // { name: "User Activity", path: "/ika/user-activity" },
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
          // { name: "Assets & Tickers", path: "/deepbook/assets" },
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
    ],
  },
  {
    title: "Assets",
    items: [
      {
        name: "Coins",
        path: "/coins",
        icon: CircleIcon,
        hasDropdown: true,
        dataPoints: [
          { name: "All Coins", path: "/coins/account-coins" },
          { name: "Coin Details", path: "/coins/coin-details" },
          { name: "Trending Coins", path: "/coins/prices" },
          // { name: "Coin Holders", path: "/coins/holders" },
          // { name: "Market Data", path: "/coins/market-data" },
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
          { name: "All NFTs", path: "/nfts/account-nfts" },
          // { name: "Collection Holders", path: "/nfts/collection-holders" },
          { name: "Marketplace", path: "/nfts/transfers-sales" },
        ],
      },
      {
        name: "Stablecoins",
        path: "/stablecoins",
        icon: PaperPlaneIcon,
        hasDropdown: true,
        dataPoints: [
          { name: "Supply", path: "/stablecoins/supply" },
          // { name: "Mint/Burn", path: "/stablecoins/mint-burn" },
          // { name: "Backing", path: "/stablecoins/backing" },
          // { name: "Stability", path: "/stablecoins/stability" },
          // { name: "Usage", path: "/stablecoins/usage" },
        ],
      },
    ],
  },
  {
    title: "Tools",
    items: [
      {
        name: "Personal Finance",
        path: "/finance",
        icon: PieChartIcon,
        hasDropdown: true,
        dataPoints: [
          {
            name: "Transaction Analyzer",
            path: "/finance/transaction-analyzer",
          },
        ],
      },
      {
        name: "Chatbot",
        path: "/chatbot",
        icon: ChatBubbleIcon,
        hasDropdown: false,
      },
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
        `block px-8 py-2 text-xs text-[#292929] transition-colors hover:bg-[#f0f0f0] rounded-lg ${
          isActive ? "text-[#292929] bg-[#d9d9d9]" : ""
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
  const location = useLocation();
  const IconComponent = item.icon;

  // Check if any dropdown item is currently active
  const hasActiveDropdownItem = item.dataPoints?.some(
    (dataPoint) => location.pathname === dataPoint.path,
  );

  // Keep dropdown expanded if it has an active item
  const shouldBeExpanded = isExpanded || hasActiveDropdownItem;

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
            `block p-3 text-[#292929] transition-colors rounded-lg hover:bg-[#f0f0f0] ${
              isActive ? "text-[#292929] bg-[#d9d9d9]" : ""
            }`
          }
          title={item.name}
        >
          {renderIcon()}
        </NavLink>
        <div className="absolute left-full top-0 ml-2 bg-[#d9d9d9] text-[#292929] px-3 py-2 rounded-md shadow-lg opacity-0 transition-opacity pointer-events-none whitespace-nowrap z-50">
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
          `flex items-center gap-3 p-3 text-[#292929] transition-colors rounded-lg group hover:bg-[#f0f0f0] ${
            isActive ? "text-[#292929] bg-[#d9d9d9]" : ""
          }`
        }
      >
        {renderIcon()}
        <span className="text-xs font-medium">{item.name}</span>
      </NavLink>
    );
  }

  return (
    <div>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-3 text-[#292929] transition-colors flex items-center justify-between rounded-lg hover:bg-[#f0f0f0]"
      >
        <div className="flex items-center gap-3">
          {renderIcon()}
          <span className="text-xs font-medium">{item.name}</span>
        </div>
        <ChevronDownIcon
          className={`w-4 h-4 transition-transform ${shouldBeExpanded ? "rotate-180" : ""}`}
        />
      </button>
      {shouldBeExpanded && item.dataPoints && (
        <div className="mt-1 space-y-1">
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
      className="fixed top-0 left-0 bg-[#FAFAFA] border border-[#DCDCDC] z-40 flex flex-col transition-all duration-300 ease-in-out"
      style={{ width: sidebarWidth, height: "100vh" }}
    >
      <div
        className={`pt-4 px-4 flex items-center ${collapsed ? "justify-center" : "justify-between"}`}
      >
        {!collapsed && (
          <h1 className="text-base font-bold text-[#292929]">Sui Dashboard</h1>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 text-[#292929] rounded-lg transition-colors"
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
        <div className="p-2 mt-4 flex flex-col gap-[2rem]">
          {navigationSections.map((section, sectionIndex) => (
            <div className="flex flex-col gap-2" key={sectionIndex}>
              {!collapsed && (
                <h3 className="text-[10px] font-semibold text-[#5a5a5a] uppercase tracking-wider px-3">
                  {section.title}
                </h3>
              )}
              <div className="flex flex-col">
                {section.items.map((item, itemIndex) => (
                  <NavigationItem
                    key={itemIndex}
                    item={item}
                    collapsed={collapsed}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {!collapsed && (
        <div className="p-4 border-t border-gray-700">
          <div className="text-[#292929] text-xs text-center">
            Built with ❤️ by Sui Boys
          </div>
        </div>
      )}
    </div>
  );
}
