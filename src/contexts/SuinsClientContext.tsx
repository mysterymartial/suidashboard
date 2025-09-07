2// src/context/SuinsClientContext.tsx
import { createContext, useContext, ReactNode } from "react";
import { SuinsClient } from "@mysten/suins";
import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";

const suiClient = new SuiClient({ url: getFullnodeUrl("mainnet") });

const suinsClient = new SuinsClient({
  client: suiClient,
  network: "mainnet",
});

// Context type
const SuinsClientContext = createContext<SuinsClient | null>(null);

// Provider
export function SuinsClientProvider({ children }: { children: ReactNode }) {
  return (
    <SuinsClientContext.Provider value={suinsClient}>
      {children}
    </SuinsClientContext.Provider>
  );
}

// Hook for easy usage
export function useSuinsClient() {
  const context = useContext(SuinsClientContext);
  if (!context) {
    throw new Error("useSuinsClient must be used within a SuinsClientProvider");
  }
  return context;
}
