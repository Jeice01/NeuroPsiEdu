"use client";

import { ArrowRight, MessageCircle, Send } from "lucide-react";
import { TELEGRAM_LINK } from "@/lib/links";

export function FnpFooter() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-slate-950 text-white pt-16 pb-10 relative overflow-hidden border-t border-white/5">
      {/* Glow elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-neuro-blue/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
          
          {/* Logo & Slogan */}
          <div className="space-y-4">
            <span className="font-display font-black text-xl tracking-tight text-white">
              NeuroPsi<span className="text-neuro-orange">EDU</span>
            </span>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              Formação Completa em Avaliação Clínica e Neuropsicológica. Teoria aprofundada, raciocínio clínico e prática de testes com acompanhamento.
            </p>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-slate-300 uppercase tracking-widest">Contato & Suporte</h4>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-center gap-2 text-slate-400">
                <MessageCircle className="w-4 h-4 text-emerald-400 fill-current" />
                <a href="https://wa.me/5561996436007" className="hover:text-white transition-colors">
                  (61) 99643-6007
                </a>
              </li>
              <li className="text-slate-400">
                <a href="mailto:contato@neuropsiedu.com.br" className="hover:text-white transition-colors">
                  contato@neuropsiedu.com.br
                </a>
              </li>
              <li className="flex items-center gap-2 text-slate-400">
                <Send className="w-4 h-4 text-sky-300" />
                <a
                  href={TELEGRAM_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Telegram NeuroPsiEdu
                </a>
              </li>
            </ul>
          </div>

          {/* Location */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-slate-300 uppercase tracking-widest">Localização</h4>
            <p className="text-slate-400 text-sm leading-relaxed">
              Ed. Conect Towers - QS 1 BLOCO D - Águas Claras, Brasília - DF<br />
              11º andar - Sala 1129
            </p>
          </div>

        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center md:items-start gap-1">
            <p className="text-slate-500 text-xs">
              © {new Date().getFullYear()} NeuroPsiEdu. Todos os direitos reservados.
            </p>
            <p className="text-slate-600 text-[10px] font-medium tracking-wider">
              CNPJ: 34.800.411/0001-83 · Formação em Avaliação Neuropsicológica
            </p>
          </div>
          
          <button 
            onClick={scrollToTop}
            className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-neuro-orange transition-colors group"
          >
            Voltar ao topo
            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-neuro-orange transition-colors">
              <ArrowRight className="w-4 h-4" />
            </div>
          </button>
        </div>
      </div>
    </footer>
  );
}
