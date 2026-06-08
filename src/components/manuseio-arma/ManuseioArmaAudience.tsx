"use client";

import { motion } from "framer-motion";
import {
  GraduationCap,
  UserCheck,
  BriefcaseBusiness,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { useManuseioArmaLead } from "./ManuseioArmaLeadContext";

export function ManuseioArmaAudience() {
  const { openModal } = useManuseioArmaLead();

  const audiences = [
    {
      icon: <UserCheck className="w-7 h-7 text-neuro-orange" />,
      title: "Psicólogos",
      description:
        "Profissionais formados que desejam iniciar ou fortalecer sua atuação em avaliação psicológica para manuseio de arma de fogo.",
    },
    {
      icon: <GraduationCap className="w-7 h-7 text-cyan-400" />,
      title: "Estudantes de Psicologia",
      description:
        "Estudantes que desejam compreender essa área de atuação desde cedo, com base técnica, ética e prática supervisionada.",
    },
    {
      icon: <BriefcaseBusiness className="w-7 h-7 text-violet-400" />,
      title: "Profissionais que desejam ampliar atuação",
      description:
        "Psicólogos que querem diversificar sua prática profissional com mais segurança técnica e responsabilidade.",
    },
  ];

  const notFor = [
    "Pessoas sem vínculo com a Psicologia.",
    "Quem busca apenas um certificado sem prática supervisionada.",
    "Quem deseja atuar sem considerar critérios éticos, técnicos e normativos.",
  ];

  return (
    <section
      id="para-quem"
      className="relative py-24 bg-[#fdfdfd] text-[#1c4568] overflow-hidden border-t border-slate-100"
    >
      <div className="absolute top-0 left-1/4 w-[420px] h-[420px] bg-blue-50 rounded-full blur-[110px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[380px] h-[380px] bg-orange-50 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
            Público da Formação
          </span>

          <h2 className="font-display font-black text-3xl sm:text-4xl tracking-tight text-neuro-blue leading-tight">
            Para quem é esta formação?
          </h2>

          <p className="text-slate-600 font-light text-base sm:text-lg">
            A formação foi pensada para quem deseja atuar com responsabilidade,
            método e segurança técnica em uma área sensível da avaliação
            psicológica.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8 items-stretch">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-1 gap-6">
            {audiences.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                viewport={{ once: true }}
                className="bg-white border border-slate-100 rounded-2xl p-6 shadow-[0_10px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_15px_40px_rgba(0,0,0,0.08)] transition-all duration-300"
              >
                <div className="flex flex-col sm:flex-row gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center shrink-0">
                    {item.icon}
                  </div>

                  <div>
                    <h3 className="font-display font-bold text-xl text-neuro-blue">
                      {item.title}
                    </h3>

                    <p className="mt-2 text-slate-600 text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="rounded-[2rem] bg-slate-950 text-white p-8 sm:p-10 shadow-2xl border border-white/10"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-orange-300">
              <CheckCircle2 className="w-4 h-4" />
              Critério importante
            </div>

            <h3 className="mt-6 font-display text-3xl font-black leading-tight">
              Esta não é uma formação genérica.
            </h3>

            <p className="mt-4 text-slate-300 leading-relaxed font-light">
              O conteúdo foi estruturado para quem compreende a responsabilidade
              envolvida na avaliação psicológica e deseja desenvolver uma prática
              tecnicamente consistente.
            </p>

            <div className="mt-8 space-y-4">
              <p className="text-sm font-bold uppercase tracking-widest text-slate-400">
                Não é indicada para:
              </p>

              {notFor.map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-red-400 mt-0.5 shrink-0" />
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {item}
                  </p>
                </div>
              ))}
            </div>

            <button
              onClick={() => openModal("audience-cta")}
              className="mt-8 w-full rounded-xl bg-gradient-to-r from-neuro-orange to-orange-600 px-8 py-4 text-base font-bold text-white shadow-[0_0_30px_rgba(242,140,40,0.25)] transition-all duration-300 hover:from-orange-500 hover:to-orange-700"
            >
              Quero receber informações
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
