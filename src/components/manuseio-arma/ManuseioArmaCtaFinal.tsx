"use client";

import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, ShieldCheck, Users } from "lucide-react";
import { useManuseioArmaLead } from "./ManuseioArmaLeadContext";

export function ManuseioArmaCtaFinal() {
  const { openModal } = useManuseioArmaLead();

  return (
    <section
      id="inscricao"
      className="relative py-24 bg-slate-950 text-white overflow-hidden border-t border-white/5"
    >
      <div className="absolute inset-0 hero-grid-bg opacity-[0.05] pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-[520px] h-[520px] bg-neuro-blue/20 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[420px] h-[420px] bg-orange-600/15 rounded-full blur-[130px] pointer-events-none" />

      <div className="container mx-auto px-6 max-w-5xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="rounded-[2rem] border border-orange-500/20 bg-gradient-to-br from-slate-900 via-slate-950 to-[#0a1e30] p-8 sm:p-12 text-center shadow-2xl"
        >
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-orange-500/20 bg-orange-500/10">
            <ShieldCheck className="h-8 w-8 text-orange-300" />
          </div>

          <span className="text-xs font-bold uppercase tracking-widest text-orange-300">
            Próxima Turma · Vagas Limitadas
          </span>

          <h2 className="mx-auto mt-5 max-w-4xl font-display text-3xl sm:text-4xl lg:text-5xl font-black leading-tight text-white">
            Dê o próximo passo para atuar com mais segurança técnica em
            avaliações psicológicas para manuseio de arma de fogo.
          </h2>

          <p className="mx-auto mt-5 max-w-3xl text-base sm:text-lg leading-relaxed text-slate-300 font-light">
            Preencha o formulário e a equipe da NeuroPsiEdu entrará em contato
            pelo WhatsApp para enviar as informações da formação, contrato,
            pagamento e confirmação de matrícula.
          </p>

          <div className="mx-auto mt-8 grid max-w-3xl grid-cols-1 sm:grid-cols-3 gap-4 text-left">
            {[
              "Certificado de 138 horas",
              "120 horas de supervisão individual",
              "Turma limitada a 10 participantes",
            ].map((item) => (
              <div
                key={item}
                className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4"
              >
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-neuro-orange" />
                <p className="text-sm leading-relaxed text-slate-300">
                  {item}
                </p>
              </div>
            ))}
          </div>

          <button
            onClick={() => openModal("final-cta")}
            className="group mx-auto mt-10 inline-flex items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-neuro-orange to-orange-600 px-8 py-4 text-base font-bold text-white shadow-[0_0_30px_rgba(242,140,40,0.3)] transition-all duration-300 hover:from-orange-500 hover:to-orange-700 hover:shadow-[0_0_40px_rgba(242,140,40,0.5)]"
          >
            Quero Receber Informações da Formação
            <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-slate-400">
            <Users className="h-4 w-4 text-orange-300" />
            Apenas 10 vagas disponíveis para esta turma.
          </div>
        </motion.div>
      </div>
    </section>
  );
}
