"use client";

import { createContext, useContext } from "react";

interface LeadModalContextType {
  openModal: (botaoOrigem: string) => void;
}

export const LeadModalContext = createContext<LeadModalContextType>({
  openModal: () => {},
});

export function useLeadModal() {
  return useContext(LeadModalContext);
}
