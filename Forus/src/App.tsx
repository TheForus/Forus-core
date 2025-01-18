"use client";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Wrapper from "./front-page/Wrapper";
import Forus from "./ui-components/Container";
import { WagmiConfig, createConfig } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import {  arbitrum , metis } from "wagmi/chains";



const config = createConfig(
  getDefaultConfig({
    appName: "Forus",
    chains: [ arbitrum, metis],
    walletConnectProjectId: "3fcc6bba6f1de962d911bb5b5c3dba68",
  })
);

const queryClient = new QueryClient();

function App() {
  return (
    <div className="App">
      <WagmiConfig config={config}>
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
      </WagmiConfig>
    </div>
  );
}

export default App;
