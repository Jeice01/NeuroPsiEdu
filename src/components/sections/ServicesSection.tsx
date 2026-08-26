"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Brain, Baby, User, Activity, ClipboardCheck, ArrowRight, MessageCircle, CheckCircle2, Award, Network } from "lucide-react";

export function ServicesSection() {
  const services = [
    {
      title: "Infantil e Adolescente",
      desc: "Avaliação neuropsicológica especializada para investigar transtornos do neurodesenvolvimento, dificuldades de aprendizagem, atrasos no desenvolvimento cognitivo e emocional, além de quadros como TDAH, TEA e prejuízos no desempenho escolar e funcional.",
      icon: Baby,
      points: ["Investigação de TDAH, TEA, Dificuldades intelectuais e outros...", "Desenvolvimento Cognitivo e Comportamental", "Desempenho Escolar e Habilidades Sociais"],
      color: "blue"
    },
    {
      title: "Adulto e Idoso",
      desc: "Avaliação neuropsicológica especializada para investigar funções cognitivas, desempenho e funcionalidade social, acadêmica, familiar e profissional, além de identificar prejuízos cognitivos e doenças relacionadas ao envelhecimento.",
      icon: User,
      points: ["Memória, Atenção e Funções Cognitivas", "Desempenho e Funcionalidade no Dia a Dia", "Investigação do Envelhecimento Cognitivo"],
      color: "cyan"
    },
    {
      title: "Laudo Neuropsicológico e Plano de Intervenção",
      desc: "Resultados detalhados para compreender dificuldades e potencialidades, direcionando intervenções mais assertivas para família, escola e tratamento clínico, com estratégias terapêuticas individualizadas para cada caso.",
      icon: ClipboardCheck,
      points: ["Laudo Neuropsicológico Completo", "Estratégias Terapêuticas Personalizadas", "Orientações para Família e Escola"],
      color: "orange"
    }
  ];

  return (
    <section id="atendimento" className="defer-render py-12 xs:py-16 sm:py-20 md:py-24 bg-[#f8fafc] relative overflow-hidden">
      {/* Visual Background Elements */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-neuro-cyan/5 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neuro-blue/5 border border-neuro-blue/10 mb-6"
          >
            <Brain className="w-4 h-4 text-neuro-blue" />
            <span className="text-xs font-black text-neuro-blue tracking-widest uppercase">Atendimento Especializado</span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl xs:text-4xl md:text-5xl font-bold text-neuro-blue mb-6 leading-tight"
          >
            Compreender o funcionamento cerebral é o <span className="text-[#42b6a5]">primeiro passo</span> para transformar o desenvolvimento e a qualidade de vida
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-600 leading-relaxed"
          >
            Investigamos o funcionamento cerebral, os comportamentos e os aspectos emocionais para direcionar estratégias personalizadas e assertivas em todas as fases da vida.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-center">
          {services.map((service, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              className="group bg-white rounded-3xl p-8 border border-slate-100 shadow-[0_15px_40px_-10px_rgba(0,0,0,0.02)] hover:shadow-[0_25px_60px_-15px_rgba(28,69,104,0.1)] transition-all duration-500 hover:-translate-y-2 flex flex-col w-full max-w-[380px] xs:max-w-[420px] sm:max-w-md md:max-w-none mx-auto"
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 transition-transform group-hover:scale-110 duration-500 ${
                service.color === 'blue' ? 'bg-neuro-blue/5 text-neuro-blue' : 
                service.color === 'cyan' ? 'bg-[#42b6a5]/5 text-[#42b6a5]' : 
                'bg-neuro-orange/5 text-neuro-orange'
              }`}>
                <service.icon className="w-7 h-7" />
              </div>
              
              <h3 className="text-2xl font-bold text-neuro-blue mb-4 leading-tight">
                {service.title}
              </h3>
              
              <p className="text-slate-500 mb-8 leading-relaxed text-center">
                {service.desc}
              </p>
              
              <ul className="space-y-4 mb-10 mt-auto">
                {service.points.map((point, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm font-bold text-slate-700">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                    {point}
                  </li>
                ))}
              </ul>

              <div className="pt-6 border-t border-slate-50">
                <Link href="/avaliacao-neuropsicologica/" className="flex items-center gap-2 text-sm font-black text-neuro-blue uppercase tracking-widest hover:text-neuro-orange transition-colors group/btn">
                  Saber mais
                  <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Final High-Conversion CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 xs:mt-20 sm:mt-24 md:mt-28 bg-gradient-to-br from-[#0a1e30] via-[#0d273d] to-[#0a1e30] bg-[length:200%_auto] animate-gradient rounded-[2rem] xs:rounded-[3rem] p-6 xs:p-8 md:p-12 lg:p-20 text-center relative overflow-hidden shadow-2xl shadow-neuro-blue/40 border border-white/5"
        >
          {/* 1. Cinematic Background Decorations - Radial Glows */}
          {/* Deep Blue Center Glow */}
          <motion.div 
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.2, 0.25, 0.2]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-neuro-blue/20 rounded-full blur-[150px] pointer-events-none" 
          />
          
          {/* Orange Top-Right Glow */}
          <motion.div 
            animate={{ 
              x: [0, 20, 0],
              y: [0, -20, 0]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-neuro-orange/10 rounded-full blur-[120px] pointer-events-none" 
          />
          
          {/* Cyan Bottom-Left Glow */}
          <motion.div 
            animate={{ 
              x: [0, -20, 0],
              y: [0, 20, 0]
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-neuro-cyan/10 rounded-full blur-[120px] pointer-events-none" 
          />

          {/* 2. Neuro-Wavy Lines Texture */}
          <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
            <path 
              d="M-100 200 C 200 100, 400 300, 800 150 S 1200 400, 1600 250" 
              fill="none" 
              stroke="white" 
              strokeWidth="0.5" 
              strokeDasharray="5 5"
              className="animate-pulse"
            />
            <path 
              d="M-100 400 C 300 300, 600 500, 1000 350 S 1400 600, 1800 450" 
              fill="none" 
              stroke="#f3821a" 
              strokeWidth="0.5" 
              className="opacity-20"
            />
          </svg>

          {/* 3. Discrete Brain Illustration Texture */}
          <div className="absolute top-1/2 right-12 -translate-y-1/2 opacity-[0.03] hidden lg:block pointer-events-none group-hover:opacity-[0.05] transition-opacity duration-700">
            <Brain className="w-96 h-96 text-white" strokeWidth={0.5} />
          </div>

          <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
            {/* Headline */}
            <h3 className="text-3xl xs:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 xs:mb-8 leading-[1.15] max-w-3xl">
              Tire suas dúvidas antes de iniciar a <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f3821a] to-[#ffb347] animate-gradient">avaliação neuropsicológica</span>
            </h3>

            {/* Subheadline */}
            <p className="text-blue-100/70 text-lg md:text-xl mb-12 max-w-2xl leading-relaxed">
              Converse diretamente com nossa especialista e compreenda como funciona o processo de avaliação neuropsicológica, quais dificuldades podem ser investigadas e quais caminhos podem ser mais adequados para o seu caso.
            </p>

            {/* CTA Button */}
            <a 
              href="https://wa.me/5561996436007?text=Quero%20uma%20avalia%C3%A7%C3%A3o%2C%20pode%20me%20ajudar%3F"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex items-center gap-4 bg-gradient-to-r from-[#f3821a] to-[#e07516] hover:from-[#e07516] hover:to-[#f3821a] text-white px-12 py-6 rounded-2xl font-black text-base uppercase tracking-widest transition-all shadow-[0_20px_50px_-10px_rgba(243,130,26,0.4)] hover:-translate-y-1"
            >
              <MessageCircle className="w-6 h-6 fill-current" />
              Agendar Sessão
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </a>

            {/* Trust Note */}
            <div className="mt-8 flex items-center gap-2 text-blue-100/40 text-[13px] font-medium">
              <CheckCircle2 className="w-4 h-4" />
              Um primeiro atendimento para acolher, orientar e esclarecer suas necessidades de forma humanizada e especializada.
            </div>

            {/* Bottom Features */}
            <div className="mt-12 xs:mt-16 md:mt-20 pt-8 xs:pt-12 border-t border-white/5 w-full grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex items-center justify-center md:justify-start gap-4">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-blue-100/60">
                  <Activity className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <p className="text-white font-bold text-sm">Atendimento humanizado</p>
                  <p className="text-blue-100/40 text-xs">Cuidado em cada detalhe</p>
                </div>
              </div>
              <div className="flex items-center justify-center md:justify-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-blue-100/60">
                  <Network className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <p className="text-white font-bold text-sm">Online e presencial</p>
                  <p className="text-blue-100/40 text-xs">Flexibilidade para você</p>
                </div>
              </div>
              <div className="flex items-center justify-center md:justify-end gap-4">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-blue-100/60">
                  <Award className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <p className="text-white font-bold text-sm">Equipe especializada</p>
                  <p className="text-blue-100/40 text-xs">Excelência em neuropsicologia</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
