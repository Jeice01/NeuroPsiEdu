import { FnpPageClient } from "@/components/fnp/FnpPageClient";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Formação em Avaliação Neuropsicológica",
  description: "Eleve a régua do seu trabalho clínico. Domine a avaliação e laudos diagnósticos de ponta a ponta com segurança e prática de testes supervisionada.",
  path: "/fnp/",
});

export default function FnpPage() {
  return (
    <main className="bg-slate-950 min-h-screen text-white font-sans antialiased overflow-x-hidden">
      <FnpPageClient />
    </main>
  );
}
