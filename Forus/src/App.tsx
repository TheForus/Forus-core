"use client";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Wrapper from "./front-page/Wrapper";
import Forus from "./ui-components/Container";
import { WagmiProvider } from "wagmi";
import { http, createConfig } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectKitProvider } from "connectkit";
import { arbitrum, arbitrumSepolia, mainnet } from "wagmi/chains";


// @ts-ignore
const config = createConfig({
  chains: [mainnet, arbitrum, arbitrumSepolia],
  transports: {
    [mainnet.id]: http("https://ethereum-rpc.publicnode.com"),
    [arbitrum.id]: http("https://arb1.arbitrum.io/rpc"),
    [arbitrumSepolia.id]: http("https://sepolia-rollup.arbitrum.io/rpc"),
  },
});

const queryClient = new QueryClient();

function App() {
  return (
    <div className="App">
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <ConnectKitProvider>
            <Router>
              <Routes>
                <Route path="/" element={<Wrapper />} />
                <Route path="/Forus" element={<Forus />} />
                <Route path="/forus" element={<Forus />} />
              </Routes>
            </Router>
          </ConnectKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </div>
  );
}

export default App;
