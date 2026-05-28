"use client";

import { Check, ShieldCheck, ArrowRight } from "lucide-react";
import { useLeadModal } from "./FnpLeadContext";

export function FnpPricing() {
  const { openModal } = useLeadModal();
  const inclusions = [
    "7 módulos presenciais (teoria + prática dirigida)",
    "Prática supervisionada com testes e instrumentos psicológicos",
    "Materiais de apoio",
    "Espaço para estudo*",
    "Certificado de Conclusão de 140 horas",
  ];

  return (
    <section id="investimento" className="relative py-24 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden border-t border-white/5">
      
      {/* Background glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-neuro-blue/15 rounded-full blur-[130px] pointer-events-none animate-pulse-glow" />
      <div className="absolute top-0 right-1/4 w-[300px] h-[300px] bg-orange-600/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Investimento Profissional</span>
          <h2 className="font-display font-black text-3xl sm:text-4xl tracking-tight text-white leading-tight">
            Uma Decisão Estratégica para sua Carreira
          </h2>
          <p className="text-slate-400 font-light text-base sm:text-lg">
            Ao invés de investir tempo e dinheiro em especializações puramente teóricas. Escolha uma formação focada em segurança, raciocínio clínico e retorno prático.
          </p>
        </div>

        {/* Pricing Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-5xl mx-auto">
          
          {/* Left Block - Value Proposition */}
          <div className="lg:col-span-7 space-y-6">
            <h3 className="font-display font-bold text-2xl text-white">
              O que está incluso na sua matrícula:
            </h3>
            <p className="text-slate-400 text-sm font-light leading-relaxed">
              Você terá acesso a uma estrutura física e metodológica de excelência, planejada para que você alcance maior autonomia para conduzir avaliações e produzir laudos neuropsicológicos claros e assertivos.
            </p>

            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {inclusions.map((inc, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                  <Check className="w-4 h-4 text-neuro-orange shrink-0 mt-0.5" />
                  <span className="leading-relaxed font-light">{inc}</span>
                </li>
              ))}
            </ul>
            <p className="text-[11px] text-slate-500 font-light">* Espaço para estudo: consultar horário disponível.</p>

            <div className="pt-6 border-t border-white/5 flex items-center gap-3">
              <ShieldCheck className="w-8 h-8 text-neuro-orange shrink-0" />
              <div>
                <p className="text-xs font-semibold text-white">Satisfação e Garantia de Aprendizado</p>
                <p className="text-[11px] text-slate-400">Satisfação garantida ou seu dinheiro de volta.</p>
              </div>
            </div>
          </div>

          {/* Right Block - Pricing Card */}
          <div className="lg:col-span-5">
            <div className="glass-dark border-orange-500/20 p-8 rounded-3xl relative overflow-hidden shadow-[0_0_40px_rgba(242,140,40,0.1)] flex flex-col justify-between">
              {/* Card Ribbon */}
              <div className="absolute top-4 right-4 bg-orange-500/10 border border-orange-500/25 text-orange-400 text-[9px] uppercase tracking-widest font-black px-3 py-1 rounded-full">
                Vagas Limitadas
              </div>

              <div className="space-y-6">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold block mb-1">Formação Completa</span>
                  <h4 className="font-display font-black text-xl text-white">8ª Turma FANP · Brasília</h4>
                </div>

                <div className="space-y-2 border-y border-white/5 py-6">
                  <p className="text-xs text-slate-400 font-light">Investimento parcelado:</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-slate-400 text-xs font-light">10x de</span>
                    <span className="font-display font-black text-4xl sm:text-5xl text-white tracking-tight">R$ 417</span>
                    <span className="text-slate-400 text-xs font-light">,00</span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-light">Sem juros no cartão de crédito</p>
                  
                  <div className="pt-4 flex items-center justify-between text-xs">
                    <span className="text-slate-400">À vista com desconto:</span>
                    <span className="font-bold text-neuro-orange">R$ 3.990,00</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <button
                    onClick={() => openModal("pricing-card")}
                    className="group w-full py-4 rounded-xl text-center font-bold text-slate-950 bg-gradient-to-r from-neuro-orange to-orange-500 hover:from-orange-400 hover:to-orange-600 transition-all duration-300 shadow-[0_0_20px_rgba(242,140,40,0.2)] flex items-center justify-center gap-2 active:scale-[0.98]"
                  >
                    <span>Garantir minha vaga</span>
                    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </button>

                  <p className="text-center text-[10px] text-slate-500 font-light leading-relaxed">
                    Preencha o formulário e nossa equipe entrará em contato para orientar sobre matrícula e pagamento.
                  </p>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
