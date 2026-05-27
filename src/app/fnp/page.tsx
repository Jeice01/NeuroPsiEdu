import { Metadata } from "next";
import { FnpNavbar } from "@/components/fnp/FnpNavbar";
import { FnpHero } from "@/components/fnp/FnpHero";
import { FnpPainPoints } from "@/components/fnp/FnpPainPoints";
import { FnpTargetAudience } from "@/components/fnp/FnpTargetAudience";
import { FnpTransformation } from "@/components/fnp/FnpTransformation";
import { FnpDifferential } from "@/components/fnp/FnpDifferential";
import { FnpModules } from "@/components/fnp/FnpModules";
import { FnpCalendar } from "@/components/fnp/FnpCalendar";
import { FnpAbout } from "@/components/fnp/FnpAbout";
import { FnpPricing } from "@/components/fnp/FnpPricing";
import { FnpFaq } from "@/components/fnp/FnpFaq";
import { FnpCtaFinal } from "@/components/fnp/FnpCtaFinal";
import { FnpFooter } from "@/components/fnp/FnpFooter";

export const metadata: Metadata = {
  title: "Formação em Avaliação Neuropsicológica | NeuroPsiEdu",
  description: "Eleve a régua do seu trabalho clínico. Domine a avaliação e laudos diagnósticos de ponta a ponta com segurança e prática de testes supervisionada.",
  openGraph: {
    title: "Formação em Avaliação Neuropsicológica | NeuroPsiEdu",
    description: "Domine a avaliação de ponta a ponta com segurança e prática supervisionada.",
    images: [{ url: "/images/logo-vertical.png" }],
  },
};

export default function FnpPage() {
  return (
    <main className="bg-slate-950 min-h-screen text-white font-sans antialiased overflow-x-hidden">
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
    </main>
  );
}
