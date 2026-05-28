import { Metadata } from "next";
import { FnpPageClient } from "@/components/fnp/FnpPageClient";

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
      <FnpPageClient />
    </main>
  );
}
