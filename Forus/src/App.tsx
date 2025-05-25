"use client";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Wrapper from "./front-page/Wrapper";
import Forus from "./ui-components/Container";
import { WagmiProvider } from "wagmi";
import { http, createConfig } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectKitProvider } from "connectkit";
import { arbitrum, metis ,polygonAmoy } from "wagmi/chains";


// @ts-ignore
const config = createConfig({
  chains: [arbitrum, metis , polygonAmoy],
  transports: {
    [polygonAmoy.id]: http(""),
    [arbitrum.id]: http(""),
    [metis.id]: http(""),
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
              </Routes>
            </Router>
          </ConnectKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </div>
  );
}

export default App;
