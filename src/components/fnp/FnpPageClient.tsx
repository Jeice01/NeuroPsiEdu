"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { LeadModalContext } from "./FnpLeadContext";
import { FnpNavbar } from "./FnpNavbar";
import { FnpHero } from "./FnpHero";
import { FnpPainPoints } from "./FnpPainPoints";
import { FnpTargetAudience } from "./FnpTargetAudience";
import { FnpTransformation } from "./FnpTransformation";
import { FnpDifferential } from "./FnpDifferential";
import { FnpModules } from "./FnpModules";
import { FnpCalendar } from "./FnpCalendar";
import { FnpAbout } from "./FnpAbout";
import { FnpPricing } from "./FnpPricing";
import { FnpFaq } from "./FnpFaq";
import { FnpCtaFinal } from "./FnpCtaFinal";
import { FnpFooter } from "./FnpFooter";

const FnpLeadModal = dynamic(
  () => import("./FnpLeadModal").then((module) => module.FnpLeadModal),
  { ssr: false }
);

export function FnpPageClient() {
  const [modalOpen, setModalOpen] = useState(false);
  const [botaoOrigem, setBotaoOrigem] = useState("");

  const openModal = (origem: string) => {
    setBotaoOrigem(origem);
    setModalOpen(true);
  };

  return (
    <LeadModalContext.Provider value={{ openModal }}>
      <FnpNavbar />
      <FnpHero />
      <FnpPainPoints />
      <FnpTargetAudience />
      <FnpTransformation />
      <FnpDifferential />
      <FnpModules />
      <FnpCalendar />
      <FnpAbout />
      <FnpPricing />
      <FnpFaq />
      <FnpCtaFinal />
      <FnpFooter />
      {modalOpen && (
        <FnpLeadModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          botaoOrigem={botaoOrigem}
        />
      )}
    </LeadModalContext.Provider>
  );
}
