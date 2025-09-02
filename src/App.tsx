import { ConnectButton } from "@mysten/dapp-kit";
import { Box, Container, Flex, Heading } from "@radix-ui/themes";
import { WalletStatus } from "./WalletStatus";
import suilogo from './assets/Sui_Logo.webp'
import './App.css'
import Home from "./pages/dashboard/Home";
import Walrus from "./pages/dashboard/Walrus";
import DeepBook from "./pages/dashboard/DeepBook";
import Stablecoins from "./pages/dashboard/Stablecoins";
import NFTs from "./pages/dashboard/NFTs";
import Pools from "./pages/dashboard/Pools";
import Yeilds from "./pages/dashboard/Yield";
import { BrowserRouter as Router, Routes, Route } from "react-router";

function App() {
  return (
    <Router>
      {/* <Flex
        position="sticky"
        px="4"
        py="2"
        justify="between"
        style={{
          borderBottom: "1px solid var(--gray-a2)",
        }}
      >
        <Box>
          <Heading className="flex justify-center items-center"> <img className="w-16" src={suilogo} alt="suilogo" /> &nbsp; Analytics</Heading>
        </Box>

        <Box>
          <input className="rounded-xl outline-1 w-120 p-2" type="search" name="" id="" placeholder="Search" />
        </Box>

        <Box>
          <ConnectButton className="cursor-pointer" />
        </Box>
      </Flex>
      <Container>
        <Container
          mt="5"
          pt="2"
          px="4"
          style={{ background: "var(--gray-a2)", minHeight: 500 }}
        >
          <WalletStatus />
        </Container>
      </Container> */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/walrus" element={<Walrus />} />
        <Route path="/deepbook" element={<DeepBook />} />
        <Route path="/stablecoins" element={<Stablecoins />} />
        <Route path="/nfts" element={<NFTs />} />
        <Route path="/pools" element={<Pools />} />
        <Route path="/yeilds" element={<Yeilds />} />
      </Routes>
    </Router>
  );
}

export default App;
