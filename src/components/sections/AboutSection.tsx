"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { CheckCircle2, Award, GraduationCap, Microscope } from "lucide-react";

export function AboutSection() {
  const points = [
    {
      title: "Diagnósticos Precisos e Humanizados",
      icon: Microscope,
      color: "text-neuro-cyan",
      bg: "bg-neuro-cyan/5"
    },
    {
      title: "Experiência Clínica Comprovada",
      icon: Award,
      color: "text-neuro-blue",
      bg: "bg-neuro-blue/5"
    },
    {
      title: "Metodologia Prática no Ensino",
      icon: GraduationCap,
      color: "text-neuro-orange",
      bg: "bg-neuro-orange/5"
    }
  ];

  return (
    <section id="sobre" className="py-24 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-neuro-blue/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Image Column */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative group"
          >
            <div className="relative z-10 rounded-[2.5rem] overflow-hidden shadow-[0_30px_60px_-15px_rgba(28,69,104,0.15)] aspect-[4/5] md:aspect-auto md:h-[650px]">
              <Image
                src="/images/Foto_Marília_Jaleco.jpeg"
                alt="Dra. Marília Karine"
                fill
                className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neuro-blue/40 via-transparent to-transparent opacity-60" />
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-neuro-orange/10 rounded-3xl -z-10 blur-2xl" />
            <div className="absolute -top-6 -left-6 w-32 h-32 border-2 border-slate-100 rounded-full -z-10" />
            
            {/* Floating Experience Badge */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-12 -left-4 md:-left-12 bg-white/90 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-slate-100 z-20 hidden sm:block"
            >
              <p className="text-3xl font-black text-neuro-blue leading-none mb-1">Especialista</p>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">em Neuropsicologia</p>
              <div className="mt-3 pt-3 border-t border-slate-100">
                <p className="text-[10px] font-black text-neuro-orange uppercase tracking-widest">CRP DF 0119553</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Content Column */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neuro-blue/5 border border-neuro-blue/10 mb-6">
              <span className="w-2 h-2 rounded-full bg-neuro-blue animate-pulse" />
              <span className="text-xs font-black text-neuro-blue tracking-widest uppercase">Sobre Nós</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-neuro-blue leading-[1.15] mb-8">
              Conheça a <span className="text-[#42b6a5]">Dra. Marília Karine</span> e a NeuroPsiEdu
            </h2>
            
            <div className="space-y-6 text-slate-600 text-lg leading-relaxed mb-10">
              <p>
                A <span className="font-bold text-neuro-blue">NeuroPsiEdu</span> nasceu com a missão de oferecer avaliações neuropsicológicas de excelência e, ao mesmo tempo, capacitar profissionais da saúde com conhecimento prático e baseado nas melhores evidências científicas.
              </p>
              <p>
                A Dra. Marília Karine é especialista em Neuropsicologia, atuando com dedicação para promover clareza diagnóstica e qualidade de vida aos seus pacientes. Como educadora, lidera formações técnicas transformadoras.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-1 gap-5">
              {points.map((point, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="flex items-center gap-4 p-4 rounded-2xl border border-slate-100 hover:border-neuro-blue/20 transition-colors bg-slate-50/50"
                >
                  <div className={`w-12 h-12 rounded-xl ${point.bg} flex items-center justify-center ${point.color} flex-shrink-0`}>
                    <point.icon className="w-6 h-6" />
                  </div>
                  <span className="font-bold text-slate-800">
                    {point.title}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
