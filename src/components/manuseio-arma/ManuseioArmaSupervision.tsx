"use client";

import { motion } from "framer-motion";
import {
  Award,
  CheckCircle2,
  ClipboardCheck,
  FileSearch,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import { useManuseioArmaLead } from "./ManuseioArmaLeadContext";

export function ManuseioArmaSupervision() {
  const { openModal } = useManuseioArmaLead();

  const highlights = [
    {
      icon: <ClipboardCheck className="w-6 h-6 text-neuro-orange" />,
      title: "12 protocolos supervisionados",
      description:
        "Você terá acompanhamento prático para desenvolver análise técnica em protocolos reais ou simulados.",
    },
    {
      icon: <FileSearch className="w-6 h-6 text-cyan-400" />,
      title: "6 protocolos de Palográfico",
      description:
        "Supervisão voltada à leitura, interpretação e integração dos dados do Palográfico.",
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-violet-400" />,
      title: "6 protocolos de Pfister",
      description:
        "Análise acompanhada dos indicadores emocionais e de personalidade relacionados ao Pfister.",
    },
  ];

  return (
    <section
      id="supervisao"
      className="relative py-24 bg-gradient-to-b from-slate-950 via-[#0a1e30] to-slate-950 text-white overflow-hidden border-t border-white/5"
    >
      <div className="absolute top-1/4 left-1/4 w-[520px] h-[520px] bg-neuro-blue/20 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[420px] h-[420px] bg-orange-600/10 rounded-full blur-[130px] pointer-events-none" />

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-[0.95fr_1.05fr] gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="space-y-6"
          >
            <span className="inline-flex items-center gap-2 glass-dark px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest text-orange-300 border border-orange-500/20">
              <Award className="w-4 h-4" />
              Principal Diferencial
            </span>

            <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl tracking-tight text-white leading-tight">
              120 horas de supervisão individual para consolidar sua segurança
              técnica.
            </h2>

            <p className="text-slate-300 text-base sm:text-lg leading-relaxed font-light">
              A formação não se limita à exposição de conteúdo. O diferencial
              está no acompanhamento individual, com supervisão prática para
              análise de protocolos, discussão técnica e desenvolvimento do
              raciocínio avaliativo.
            </p>

            <div className="space-y-3 pt-2">
              {[
                "Supervisão individualizada para fortalecer a tomada de decisão.",
                "Discussão técnica dos protocolos com orientação da profissional responsável.",
                "Turma limitada para garantir acompanhamento próximo.",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-neuro-orange mt-0.5 shrink-0" />
                  <p className="text-slate-300 text-sm leading-relaxed">
                    {item}
                  </p>
                </div>
              ))}
            </div>

            <button
              onClick={() => openModal("supervision-cta")}
              className="group mt-4 inline-flex items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-neuro-orange to-orange-600 px-8 py-4 text-base font-bold text-white shadow-[0_0_30px_rgba(242,140,40,0.25)] transition-all duration-300 hover:from-orange-500 hover:to-orange-700 hover:shadow-[0_0_40px_rgba(242,140,40,0.45)]"
            >
              Quero participar da turma
              <UserCheck className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="glass-dark rounded-[2rem] border border-white/10 p-6 sm:p-8 shadow-2xl">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className="rounded-2xl border border-orange-500/20 bg-orange-500/10 p-5 text-center">
                  <p className="text-4xl font-black text-orange-300">120h</p>
                  <p className="mt-2 text-xs uppercase tracking-widest text-slate-400">
                    Supervisão
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-center">
                  <p className="text-4xl font-black text-white">12</p>
                  <p className="mt-2 text-xs uppercase tracking-widest text-slate-400">
                    Protocolos
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-center">
                  <p className="text-4xl font-black text-white">10</p>
                  <p className="mt-2 text-xs uppercase tracking-widest text-slate-400">
                    Vagas
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {highlights.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-white/10 bg-slate-950/40 p-5 transition-all duration-300 hover:border-orange-500/20 hover:bg-slate-950/70"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5">
                        {item.icon}
                      </div>

                      <div>
                        <h3 className="font-display text-lg font-bold text-white">
                          {item.title}
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed text-slate-400">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
