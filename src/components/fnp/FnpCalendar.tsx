"use client";

import { motion } from "framer-motion";
import { Clock, MapPin } from "lucide-react";

export function FnpCalendar() {
  const dates = [
    {
      num: "01",
      day: "27 e 28",
      month: "Junho",
      year: "2026",
      module: "Módulo 1",
      title: "DI e AH/SD",
      status: "Próximo Encontro",
    },
    {
      num: "02",
      day: "25 e 26",
      month: "Julho",
      year: "2026",
      module: "Módulo 2",
      title: "TDAH",
      status: "Confirmado",
    },
    {
      num: "03",
      day: "29 e 30",
      month: "Agosto",
      year: "2026",
      module: "Módulo 3",
      title: "TEA",
      status: "Confirmado",
    },
    {
      num: "04",
      day: "11 e 12",
      month: "Julho",
      year: "2026",
      module: "Módulo 4",
      title: "Transtornos de Aprendizagem",
      status: "Confirmado",
    },
    {
      num: "05",
      day: "08 e 09",
      month: "Agosto",
      year: "2026",
      module: "Módulo 5",
      title: "Avaliação da Pessoa Idosa",
      status: "Confirmado",
    },
    {
      num: "06",
      day: "12 e 13",
      month: "Setembro",
      year: "2026",
      module: "Módulo 6",
      title: "Personalidade e Emoções",
      status: "Confirmado",
    },
    {
      num: "07",
      day: "17 e 18",
      month: "Outubro",
      year: "2026",
      module: "Módulo 7",
      title: "Laudos e Raciocínio Clínico",
      status: "Confirmado",
    },
  ];

  return (
    <section id="calendario" className="relative py-24 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden border-t border-white/5">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-neuro-blue/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-orange-600/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Cronograma de Aulas</span>
          <h2 className="font-display font-black text-3xl sm:text-4xl tracking-tight text-white leading-tight">
            Datas Confirmadas dos Encontros Presenciais
          </h2>
          <p className="text-slate-400 font-light text-base sm:text-lg">
            Os encontros ocorrem mensalmente, sempre em um final de semana, cobrindo o conteúdo de forma intensiva e prática.
          </p>
        </div>

        {/* Horizontal scroll track for Desktop, Vertical stack for Mobile */}
        <div className="relative">
          
          {/* Main timeline tracker line (Desktop only) */}
          <div className="hidden lg:block absolute left-8 right-8 top-[88px] h-[2px] bg-gradient-to-r from-neuro-orange via-neuro-blue to-slate-800 pointer-events-none" />

          {/* Cards container */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-6 lg:gap-4">
            {dates.map((date, idx) => {
              const isNext = date.status === "Próximo Encontro";
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.4, delay: idx * 0.08 }}
                  className={`glass-dark rounded-2xl p-5 border flex flex-col justify-between relative overflow-hidden transition-all duration-300 ${
                    isNext 
                      ? "border-neuro-orange/30 shadow-[0_0_30px_rgba(242,140,40,0.15)] bg-slate-900/60" 
                      : "border-white/5 hover:border-white/10 hover:bg-slate-900/40"
                  }`}
                >
                  {/* Highlight for next date */}
                  {isNext && (
                    <div className="absolute top-0 right-0 bg-neuro-orange text-slate-950 font-bold text-[9px] uppercase tracking-wider px-3 py-1 rounded-bl-xl">
                      Próximo
                    </div>
                  )}

                  <div className="space-y-4">
                    {/* Date Block */}
                    <div className="flex items-baseline gap-1 lg:flex-col lg:gap-0">
                      <span className={`font-display font-black text-4xl leading-none ${isNext ? "text-neuro-orange" : "text-white"}`}>
                        {date.day}
                      </span>
                      <span className="text-sm font-medium text-slate-300">
                        {date.month}
                      </span>
                      <span className="text-[10px] text-slate-500 font-semibold block mt-0.5 ml-1 lg:ml-0">
                        {date.year}
                      </span>
                    </div>

                    {/* Divider for Desktop only */}
                    <div className="hidden lg:block w-8 h-[2px] bg-slate-800 my-2" />

                    {/* Details block */}
                    <div>
                      <span className="text-[10px] font-bold text-neuro-orange uppercase tracking-wider block mb-1">
                        {date.module}
                      </span>
                      <h4 className="font-display font-bold text-sm text-white leading-snug">
                        {date.title}
                      </h4>
                    </div>
                  </div>

                  {/* Footer metadata */}
                  <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-500" />
                      08h às 18h
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-500" />
                      Brasília/DF
                    </span>
                  </div>

                </motion.div>
              );
            })}
          </div>
        </div>


      </div>
    </section>
  );
}
