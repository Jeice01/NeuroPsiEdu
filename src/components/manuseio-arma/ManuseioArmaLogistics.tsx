"use client";

import { motion } from "framer-motion";
import {
  Calendar,
  Clock3,
  MapPin,
  Award,
  BadgeDollarSign,
  Users,
} from "lucide-react";
import { useManuseioArmaLead } from "./ManuseioArmaLeadContext";

export function ManuseioArmaLogistics() {
  const { openModal } = useManuseioArmaLead();

  const infos = [
    {
      icon: <Calendar className="w-6 h-6 text-neuro-orange" />,
      title: "Datas",
      value: "27/07/2026 a 01/08/2026",
    },
    {
      icon: <Clock3 className="w-6 h-6 text-cyan-400" />,
      title: "Horários",
      value: "Seg a Sex: 19h às 22h • Sábado: 9h às 12h",
    },
    {
      icon: <MapPin className="w-6 h-6 text-violet-400" />,
      title: "Local",
      value: "ConnectTower • Sala 1129 • Águas Claras • Brasília/DF",
    },
    {
      icon: <Award className="w-6 h-6 text-emerald-400" />,
      title: "Certificação",
      value: "138 horas",
    },
  ];

  return (
    <section
      id="informacoes"
      className="relative py-24 bg-slate-950 text-white overflow-hidden border-t border-white/5"
    >
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-neuro-blue/15 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[420px] h-[420px] bg-orange-600/10 rounded-full blur-[130px] pointer-events-none" />

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
            Informações Práticas
          </span>

          <h2 className="mt-4 font-display font-black text-3xl sm:text-4xl lg:text-5xl tracking-tight">
            Tudo o que você precisa para participar
          </h2>

          <p className="mt-4 text-slate-400 text-base sm:text-lg font-light">
            Formação presencial com supervisão individualizada e vagas limitadas.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-8 items-start">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {infos.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                viewport={{ once: true }}
                className="glass-dark rounded-2xl border border-white/10 p-6"
              >
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-5">
                  {item.icon}
                </div>

                <h3 className="font-bold text-lg text-white">
                  {item.title}
                </h3>

                <p className="mt-3 text-slate-300 leading-relaxed">
                  {item.value}
                </p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="rounded-[2rem] border border-orange-500/20 bg-gradient-to-b from-slate-900 to-slate-950 p-8 shadow-2xl"
          >
            <div className="flex items-center gap-2 text-orange-300 text-sm font-semibold uppercase tracking-wider">
              <BadgeDollarSign className="w-5 h-5" />
              Investimento
            </div>

            <div className="mt-8">
              <p className="text-slate-500 text-sm uppercase tracking-widest">
                Valor da formação
              </p>

              <p className="mt-2 text-5xl font-black text-white">
                R$ 1.997
              </p>
            </div>

            <div className="mt-8 rounded-2xl border border-orange-500/20 bg-orange-500/10 p-5">
              <p className="text-orange-300 text-sm font-bold uppercase tracking-widest">
                Condição Especial
              </p>

              <p className="mt-2 text-3xl font-black text-white">
                R$ 1.697
              </p>

              <p className="mt-2 text-sm text-slate-300">
                Exclusivo para os 3 primeiros inscritos.
              </p>
            </div>

            <div className="mt-8 flex items-center gap-3 rounded-xl bg-white/5 p-4 border border-white/10">
              <Users className="w-5 h-5 text-neuro-orange shrink-0" />

              <p className="text-sm text-slate-300">
                Turma limitada a apenas <strong>10 participantes</strong> para
                garantir supervisão individualizada.
              </p>
            </div>

            <button
              onClick={() => openModal("pricing-cta")}
              className="mt-8 w-full rounded-xl bg-gradient-to-r from-neuro-orange to-orange-600 px-8 py-4 text-base font-bold text-white shadow-[0_0_30px_rgba(242,140,40,0.25)] transition-all duration-300 hover:from-orange-500 hover:to-orange-700"
            >
              Quero garantir minha vaga
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
