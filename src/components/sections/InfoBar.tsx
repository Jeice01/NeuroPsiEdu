"use client";

import { motion } from "framer-motion";
import { Users2, MonitorSmartphone, ShieldCheck, Microscope } from "lucide-react";

const items = [
  {
    icon: Users2,
    title: "Para todas as idades",
    desc: "Crianças, adultos e idosos"
  },
  {
    icon: MonitorSmartphone,
    title: "Atendimento Online e Presencial",
    desc: "Mais comodidade para você"
  },
  {
    icon: ShieldCheck,
    title: "Equipe Especializada",
    desc: "Profissionais altamente qualificados"
  },
  {
    icon: Microscope,
    title: "Base Científica",
    desc: "Métodos validados e atualizados"
  }
];

export function InfoBar() {
  return (
    <div className="w-full bg-gradient-to-b from-white to-slate-50 border-y border-slate-100 py-12 px-4 md:px-6 shadow-[inset_0_1px_3px_rgba(0,0,0,0.02)]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-6">
        {items.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            className="flex items-center gap-4"
          >
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-neuro-blue/5 border border-neuro-blue/10 flex items-center justify-center text-neuro-blue flex-shrink-0 shadow-sm transition-transform hover:scale-110 duration-300">
              <item.icon className="w-6 h-6 md:w-7 md:h-7" />
            </div>
            <div>
              <p className="font-bold text-slate-900 text-[13px] md:text-[15px] leading-tight mb-1">
                {item.title}
              </p>
              <p className="text-slate-500 text-[11px] md:text-[13px] leading-relaxed">
                {item.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
