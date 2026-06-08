"use client";

import { createContext, ReactNode, useContext, useMemo, useState } from "react";
import { ManuseioArmaLeadModal } from "./ManuseioArmaLeadModal";

type ManuseioArmaLeadContextValue = {
  openModal: (buttonOrigin?: string) => void;
};

const ManuseioArmaLeadContext =
  createContext<ManuseioArmaLeadContextValue | null>(null);

type ManuseioArmaLeadProviderProps = {
  children: ReactNode;
};

export function ManuseioArmaLeadProvider({
  children,
}: ManuseioArmaLeadProviderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [buttonOrigin, setButtonOrigin] = useState("cta-page");

  function openModal(origin = "cta-page") {
    setButtonOrigin(origin);
    setIsOpen(true);
  }

  const value = useMemo(() => ({ openModal }), []);

  return (
    <ManuseioArmaLeadContext.Provider value={value}>
      {children}

      <ManuseioArmaLeadModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        buttonOrigin={buttonOrigin}
      />
    </ManuseioArmaLeadContext.Provider>
  );
}

export function useManuseioArmaLead() {
  const context = useContext(ManuseioArmaLeadContext);

  if (!context) {
    throw new Error(
      "useManuseioArmaLead deve ser usado dentro de ManuseioArmaLeadProvider"
    );
  }

  return context;
}
