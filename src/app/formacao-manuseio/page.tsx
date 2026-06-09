import { Metadata } from "next";
import { ManuseioArmaPageClient } from "@/components/manuseio-arma/ManuseioArmaPageClient";

export const metadata: Metadata = {
  title: "Formação em Avaliação Neuropsicológica para Manuseio de Arma de Fogo | NeuroPsiEdu",
  description:
    "Formação presencial em Brasília/DF para psicólogos e estudantes de Psicologia, com 138 horas, incluindo 120 horas de supervisão prática individualizada.",
  openGraph: {
    title: "Formação em Avaliação Neuropsicológica para Manuseio de Arma de Fogo | NeuroPsiEdu",
    description:
      "Desenvolva mais segurança técnica para atuar em avaliações psicológicas para manuseio de arma de fogo.",
    images: [{ url: "/images/logo-vertical.png" }],
  },
};

export default function FormacaoManuseioArmaPage() {
  return (
    <main className="bg-slate-950 min-h-screen text-white font-sans antialiased overflow-x-hidden">
      <ManuseioArmaPageClient />
    </main>
  );
}
