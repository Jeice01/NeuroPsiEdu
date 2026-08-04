import { ManuseioArmaPageClient } from "@/components/manuseio-arma/ManuseioArmaPageClient";
import { createPageMetadata, FAMAF_CANONICAL_PATH } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Formação em Avaliação Psicológica para Manuseio de Arma de Fogo",
  description:
    "Formação presencial em Brasília/DF para psicólogos e estudantes de Psicologia, com 138 horas, incluindo 120 horas de supervisão prática individualizada.",
  path: FAMAF_CANONICAL_PATH,
  noIndex: true,
});

export default function FormacaoManuseioArmaPage() {
  return (
    <main className="bg-slate-950 min-h-screen text-white font-sans antialiased overflow-x-hidden">
      <ManuseioArmaPageClient />
    </main>
  );
}
