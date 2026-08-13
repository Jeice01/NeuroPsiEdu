import { Send } from "lucide-react";
import { TELEGRAM_LINK } from "@/lib/links";

export function ManuseioArmaFooter() {
  return (
    <footer className="bg-slate-950 border-t border-white/10 py-10 text-center text-sm text-slate-500">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-4 px-6">
        <p>NeuroPsiEdu © Formação em Avaliação Psicológica para Manuseio de Arma de Fogo</p>
        <a
          href={TELEGRAM_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-slate-400 transition-colors hover:text-white"
        >
          <Send className="h-4 w-4 text-sky-300" />
          Telegram NeuroPsiEdu
        </a>
      </div>
    </footer>
  );
}
