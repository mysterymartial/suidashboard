import "./App.css";
import Home from "./pages/dashboard/Home";
// import { GenericPage } from "./components/pages/GenericPage";
import NetworkStats from "./pages/sui/Validators";
import TransactionVolume from "./pages/sui/TransactionVolume";
import GasUsage from "./pages/sui/ChainInfo";
import ActiveAddresses from "./pages/sui/ActiveAddresses";
import BlockProduction from "./pages/sui/BlockProduction";
import { BrowserRouter as Router, Routes, Route } from "react-router";
import WalrusAccounts from "./pages/walrus/Accounts";
import WalrusBlobs from "./pages/walrus/Blobs";
import WalrusBlobActivity from "./pages/walrus/BlobActivity";
import WalrusStorage from "./pages/walrus/Storage";
import WalrusMetadata from "./pages/walrus/Metadata";
import DeepbookOrderBook from "./pages/deepbook/OrderBook";
import DeepPools from "./pages/deepbook/DeepPools";
import DeepbookMarketDepth from "./pages/deepbook/MarketSummary";
import DeepbookTradeHistory from "./pages/deepbook/HistoricalVol";
import DeepbookPriceDiscovery from "./pages/deepbook/PriceDiscovery";
import DeepbookLiquidity from "./pages/deepbook/Liquidity";
import SuinsNameResolution from "./pages/suins/NameResolution";
import SuinsAddressResolution from "./pages/suins/AddressResolution";
import SuinsOwnedNames from "./pages/suins/OwnedNames";
import SuinsPricing from "./pages/suins/Pricing";
import SuinsRenewals from "./pages/suins/Renewals";
import CoinsAccountCoins from "./pages/coins/AccountCoins";
import CoinsCoinDetails from "./pages/coins/CoinDetails";
import CoinsPrices from "./pages/coins/Prices";
import CoinsHolders from "./pages/coins/Holders";
import CoinsMarketData from "./pages/coins/MarketData";
import NFTsCollectionList from "./pages/nfts/CollectionList";
import NFTsActivity from "./pages/nfts/Activity";
import NFTsAccountNFTs from "./pages/nfts/AccountNFTs";
import NFTsCollectionHolders from "./pages/nfts/CollectionHolders";
import NFTsTransfersSales from "./pages/nfts/Marketplace";
import StableSupply from "./pages/stablecoins/Supply";
import StableMintBurn from "./pages/stablecoins/MintBurn";
import StableBacking from "./pages/stablecoins/Backing";
import StableStability from "./pages/stablecoins/Stability";
import StableUsage from "./pages/stablecoins/Usage";
import IkaProtocolStats from "./pages/ika/ProtocolStats";
import IkaLiquidityPools from "./pages/ika/LiquidityPools";
import IkaTradingVolume from "./pages/ika/TradingVolume";
import IkaFeeGeneration from "./pages/ika/FeeGeneration";
import IkaUserActivity from "./pages/ika/UserActivity";
import RwaTokenizedAssets from "./pages/rwa/TokenizedAssets";
import RwaRealEstate from "./pages/rwa/RealEstate";
import RwaCommodities from "./pages/rwa/Commodities";
import RwaBonds from "./pages/rwa/Bonds";
import RwaPrivateCredit from "./pages/rwa/PrivateCredit";
import SecSuiMetadata from "./pages/security/SuiMetadata";
import SecAlerts from "./pages/security/Alerts";
import SecApiChecks from "./pages/security/ApiChecks";
import SecLatestBlocks from "./pages/security/LatestBlocks";
import SecValidators from "./pages/security/Validators";

function App() {
  return (
    <Router>
      <Routes>
        {/* Main overview page */}
        <Route path="/" element={<Home />} />

        {/* Sui routes */}
        <Route path="/sui" element={<NetworkStats />} />
        <Route path="/sui/network-stats" element={<NetworkStats />} />
        <Route path="/sui/transaction-volume" element={<TransactionVolume />} />
        <Route path="/sui/gas-usage" element={<GasUsage />} />
        <Route path="/sui/active-addresses" element={<ActiveAddresses />} />
        <Route path="/sui/block-production" element={<BlockProduction />} />

        {/* Walrus routes */}
        <Route path="/walrus" element={<WalrusAccounts />} />
        <Route path="/walrus/accounts" element={<WalrusAccounts />} />
        <Route path="/walrus/blobs" element={<WalrusBlobs />} />
        <Route path="/walrus/blob-activity" element={<WalrusBlobActivity />} />
        <Route path="/walrus/storage" element={<WalrusStorage />} />
        <Route path="/walrus/metadata" element={<WalrusMetadata />} />

        {/* Ika routes */}
        <Route path="/ika" element={<IkaProtocolStats />} />
        <Route path="/ika/protocol-stats" element={<IkaProtocolStats />} />
        <Route path="/ika/liquidity-pools" element={<IkaLiquidityPools />} />
        <Route path="/ika/trading-volume" element={<IkaTradingVolume />} />
        <Route path="/ika/fee-generation" element={<IkaFeeGeneration />} />
        <Route path="/ika/user-activity" element={<IkaUserActivity />} />

        {/* DeepBook routes */}
        <Route path="/deepbook" element={<DeepPools />} />
        <Route path="/deepbook/pools" element={<DeepPools />} />
        <Route
          path="/deepbook/market-summary"
          element={<DeepbookMarketDepth />}
        />
        <Route
          path="/deepbook/historical-volume"
          element={<DeepbookTradeHistory />}
        />
        <Route
          path="/deepbook/order-book"
          element={<DeepbookOrderBook />}
        />
        <Route path="/deepbook/assets" element={<DeepbookLiquidity />} />

        {/* SuiNS routes */}
        <Route path="/suins" element={<SuinsNameResolution />} />
        <Route
          path="/suins/name-resolution"
          element={<SuinsNameResolution />}
        />
        <Route
          path="/suins/address-resolution"
          element={<SuinsAddressResolution />}
        />
        <Route path="/suins/owned-names" element={<SuinsOwnedNames />} />
        <Route path="/suins/pricing" element={<SuinsPricing />} />
        <Route path="/suins/renewals" element={<SuinsRenewals />} />

        {/* Coins routes */}
        <Route path="/coins" element={<CoinsAccountCoins />} />
        <Route path="/coins/account-coins" element={<CoinsAccountCoins />} />
        <Route path="/coins/coin-details" element={<CoinsCoinDetails />} />
        <Route path="/coins/coin-details/:coinType" element={<CoinsCoinDetails />} />
        <Route path="/coins/prices" element={<CoinsPrices />} />
        <Route path="/coins/holders" element={<CoinsHolders />} />
        <Route path="/coins/market-data" element={<CoinsMarketData />} />

        {/* NFTs routes */}
        <Route path="/nfts" element={<NFTsCollectionList />} />
        <Route path="/nfts/collection-list" element={<NFTsCollectionList />} />
        <Route path="/nfts/activity" element={<NFTsActivity />} />
        <Route path="/nfts/account-nfts" element={<NFTsAccountNFTs />} />
        <Route
          path="/nfts/collection-holders"
          element={<NFTsCollectionHolders />}
        />
        <Route path="/nfts/transfers-sales" element={<NFTsTransfersSales />} />

        {/* Stablecoins routes */}
        <Route path="/stablecoins" element={<StableSupply />} />
        <Route path="/stablecoins/supply" element={<StableSupply />} />
        <Route path="/stablecoins/mint-burn" element={<StableMintBurn />} />
        <Route path="/stablecoins/backing" element={<StableBacking />} />
        <Route path="/stablecoins/stability" element={<StableStability />} />
        <Route path="/stablecoins/usage" element={<StableUsage />} />

        {/* RWA routes */}
        <Route path="/rwa" element={<RwaTokenizedAssets />} />
        <Route path="/rwa/tokenized-assets" element={<RwaTokenizedAssets />} />
        <Route path="/rwa/real-estate" element={<RwaRealEstate />} />
        <Route path="/rwa/commodities" element={<RwaCommodities />} />
        <Route path="/rwa/bonds" element={<RwaBonds />} />
        <Route path="/rwa/private-credit" element={<RwaPrivateCredit />} />

        {/* Security & Metadata routes */}
        <Route path="/security" element={<SecSuiMetadata />} />
        <Route path="/security/sui-metadata" element={<SecSuiMetadata />} />
        <Route path="/security/alerts" element={<SecAlerts />} />
        <Route path="/security/api-checks" element={<SecApiChecks />} />
        <Route path="/security/latest-blocks" element={<SecLatestBlocks />} />
        <Route path="/security/validators" element={<SecValidators />} />
      </Routes>
    </Router>
  );
}

export default App;
