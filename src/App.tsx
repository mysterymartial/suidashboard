import "./App.css";
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
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sui" element={<Home />} />
        <Route path="/walrus" element={<Walrus />} />
        <Route path="/ika" element={<Pools />} />
        <Route path="/deepbook" element={<DeepBook />} />
        <Route path="/suins" element={<Stablecoins />} />
        <Route path="/coins" element={<Stablecoins />} />
        <Route path="/nfts" element={<NFTs />} />
        <Route path="/stablecoins" element={<Stablecoins />} />
        <Route path="/rwa" element={<Stablecoins />} />
        <Route path="/gaming" element={<Pools />} />
        <Route path="/pools" element={<Pools />} />
        <Route path="/yield" element={<Yeilds />} />
        <Route path="/yeilds" element={<Yeilds />} />
        {/* Add routes for dropdown data points */}
        <Route path="/sui/*" element={<Home />} />
        <Route path="/walrus/*" element={<Walrus />} />
        <Route path="/ika/*" element={<Pools />} />
        <Route path="/deepbook/*" element={<DeepBook />} />
        <Route path="/suins/*" element={<Stablecoins />} />
        <Route path="/coins/*" element={<Stablecoins />} />
        <Route path="/nfts/*" element={<NFTs />} />
        <Route path="/stablecoins/*" element={<Stablecoins />} />
        <Route path="/rwa/*" element={<Stablecoins />} />
        <Route path="/gaming/*" element={<Pools />} />
        <Route path="/yield/*" element={<Yeilds />} />
      </Routes>
    </Router>
  );
}

export default App;
