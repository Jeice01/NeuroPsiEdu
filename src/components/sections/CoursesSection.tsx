"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap, Calendar, Award, ArrowRight, Clock, CheckCircle2, Activity, Network, X, User, Mail, Phone } from "lucide-react";
import { supabase } from "@/lib/supabase";

export function CoursesSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formStep, setFormStep] = useState(1);
  const [selectedModule, setSelectedModule] = useState<number | null>(null);
  
  const [formData, setFormData] = useState({
    nome: "",
    telefone: "",
    email: "",
    isPsicologo: "sim"
  });

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    
    try {
      const { error } = await supabase
        .from('espera_pos')
        .insert([
          { 
            nome: formData.nome, 
            email: formData.email, 
            telefone: formData.telefone, 
            is_psicologo: formData.isPsicologo,
            origem: 'pos-graduacao'
          }
        ]);

      if (error) throw error;

      setFormStep(2);
      
      setTimeout(() => {
        const msg = `Olá! Meu nome é ${formData.nome}. Sou ${formData.isPsicologo === 'sim' ? 'Psicólogo(a)' : 'estudante/outro'}. Gostaria de saber mais sobre a Pós-Graduação.`;
        window.open(`https://wa.me/5561982088284?text=${encodeURIComponent(msg)}`, '_blank');
      }, 2000);
    } catch (error) {
      console.error("Error saving lead:", error);
      alert("Houve um erro ao salvar seus dados. Por favor, tente novamente.");
    }
  };
  const moduleData = [
    {
      num: "01",
      title: "Avaliação Clínica e Neuropsicológica do Transtorno do Desenvolvimento Intelectual (DI) e Altas Habilidades",
      resumo: "Este módulo aborda a avaliação clínica e neuropsicológica do desenvolvimento cognitivo: o Transtorno do Desenvolvimento Intelectual (Deficiência Intelectual) e as Altas Habilidades/Superdotação. O profissional aprenderá a identificar, diferenciar e avaliar essas condições por meio de instrumentos padronizados e do raciocínio clínico neuropsicológico.",
      conteudos: [
        "Teoria e conceitos gerais sobre inteligência",
        "Critérios diagnósticos do Transtorno do Desenvolvimento Intelectual (Deficiência Intelectual) conforme DSM-5 e CID-11",
        "Conceito e teoria acerca de Superdotação e Altas Habilidades",
      ],
      testes: [
        "WISC IV — Escala Wechsler de Inteligência para Crianças (4ª edição)",
        "WAIS III — Escala Wechsler de Inteligência para Adultos (3ª edição)",
      ],
    },
    {
      num: "02",
      title: "Avaliação Clínica e Neuropsicológica do TDAH",
      resumo: "Este módulo é dedicado à avaliação clínica e neuropsicológica do TDAH. São abordados desde os fundamentos teóricos sobre atenção e funções executivas até os critérios diagnósticos e os principais instrumentos utilizados na prática clínica.",
      conteudos: [
        "Teoria e conceitos gerais sobre atenção",
        "Tipos de atenção: concentrada, sustentada, seletiva, alternada e dividida",
        "Funções Executivas (FE): teoria e conceitos gerais",
        "Análise de laudos e históricos clínicos com déficits atencionais e nas Funções Executivas",
        "Avaliação clínica do TDAH e critérios diagnósticos",
      ],
      testes: [
        "BPA — Bateria Psicológica da Atenção",
        "Teste D-2-R — Teste de Atenção Concentrada",
        "FDT — Teste dos Cinco Dígitos",
        "BDEFS — Bateria de Disfunções Executivas de Barkley",
        "EPF-TDAH — Escala de Prejuízos Funcionais do TDAH",
        "ETDAH-AD — Escala de Transtorno do Déficit de Atenção e Hiperatividade",
        "Inventários e material de apoio diagnóstico do TDAH",
      ],
    },
    {
      num: "03",
      title: "Avaliação Clínica e Neuropsicológica do TEA",
      resumo: "Este módulo apresenta a avaliação clínica e neuropsicológica do TEA. O foco está na compreensão dos critérios diagnósticos, nas particularidades do desenvolvimento da linguagem e na aplicação de instrumentos especializados de rastreio e avaliação.",
      conteudos: [
        "Teoria e conceitos gerais sobre o Transtorno do Espectro Autista",
        "Critérios diagnósticos do TEA conforme DSM-5 e CID-11",
        "Desenvolvimento e avaliação da linguagem no contexto do TEA",
      ],
      testes: [
        "Anamnese estruturada para suspeita de TEA",
        "PROTEA-R — Sistema de Avaliação da Suspeita de Transtorno do Espectro Autista",
        "SRS-2 — Escala de Responsividade Social",
        "M-CHAT — Modified Checklist for Autism in Toddlers",
        "CARS — Childhood Autism Rating Scale",
        "ATA — Escala de Traços Autísticos",
        "Inventários de avaliação complementar",
      ],
    },
    {
      num: "04",
      title: "Avaliação Clínica e Neuropsicológica dos Transtornos Específicos de Aprendizagem (Dislexia, Discalculia e Disortografia)",
      resumo: "Este módulo aborda os Transtornos Específicos de Aprendizagem, com ênfase na avaliação neuropsicológica da Dislexia. O profissional aprenderá a reconhecer as características clínicas da dislexia, discalculia e disortografia, além de aplicar e interpretar os principais instrumentos de avaliação das habilidades de leitura, escrita e processamento fonológico.",
      conteudos: [
        "Teoria e conceitos gerais sobre Transtornos Específicos de Aprendizagem",
        "Dislexia: características, impacto e critérios diagnósticos",
        "Discalculia e disortografia: conceitos e diferenciação clínica",
        "Critérios diagnósticos conforme DSM-5 e CID-11",
      ],
      testes: [
        "CONFIAS — Consciência Fonológica: Instrumento de Avaliação Sequencial",
        "PROLEC — Provas de Avaliação dos Processos de Leitura",
        "TDE II — Teste de Desenvolvimento Escolar (2ª edição)",
        "TENA — Teste de Nomeação Automática",
      ],
    },
    {
      num: "05",
      title: "Avaliação Clínica e Neuropsicológica da Pessoa Idosa",
      resumo: "Este módulo é dedicado à avaliação neuropsicológica da pessoa idosa, com foco na avaliação das funções cognitivas, nos transtornos neurocognitivos maiores e menores e demências. O profissional será capacitado a identificar déficits cognitivos, diferenciar quadros clínicos e utilizar instrumentos apropriados para essa faixa etária.",
      conteudos: [
        "Teoria e conceitos gerais sobre memória",
        "Transtornos Neurocognitivos: demências e rebaixamentos cognitivos",
        "Análise de laudos e históricos clínicos com déficits cognitivos relacionados a Transtornos Neurocognitivos",
        "Inventários e recursos clínicos complementares de análise",
      ],
      testes: [
        "RAVLT — Teste de Aprendizagem Auditivo-Verbal de Rey",
        "NEUPSILIN — Instrumento de Avaliação Neuropsicológica Breve",
        "MTL — Bateria Montreal Toulouse de Avaliação da Linguagem",
        "CDR — Clinical Dementia Rating (Escala de Avaliação Clínica da Demência)",
        "NPI — Inventário Neuropsiquiátrico",
        "KATZ — Escala de Independência nas Atividades da Vida Diária",
      ],
    },
    {
      num: "06",
      title: "Avaliação de Traços de Personalidade e Aspectos Emocionais na Prática Clínica",
      resumo: "Este módulo apresenta a avaliação de traços de personalidade e da dinâmica emocional. O profissional aprenderá a utilizar testes projetivos e de autorrelato para compreender o funcionamento da personalidade do avaliando, integrando os resultados ao raciocínio clínico neuropsicológico.",
      conteudos: [
        "Teoria e conceitos gerais sobre personalidade",
        "Modelos explicativos da personalidade e sua relação com a avaliação psicológica",
        "A dinâmica das emoções e sua expressão nos instrumentos projetivos e fatoriais",
      ],
      testes: [
        "Pirâmides Coloridas de Pfister — avaliação projetiva da dinâmica afetiva e emocional",
        "Teste Palográfico — avaliação da personalidade por meio da escrita",
        "BFP — Bateria Fatorial de Personalidade (modelo dos Cinco Grandes Fatores)",
      ],
    },
    {
      num: "07",
      title: "Escrita de Laudos e Raciocínio Clínico com Inteligência Artificial",
      resumo: "O módulo final integra todo o aprendizado do curso por meio da escrita de laudos neuropsicológicos e do desenvolvimento do raciocínio clínico. O profissional aprenderá a estruturar documentos técnicos de forma assertiva, ética e fundamentada, utilizando inclusive ferramentas de Inteligência Artificial como apoio ao processo.",
      conteudos: [
        "Resolução nº 6 do CFP — elaboração de documentos escritos produzidos pelo(a) psicólogo(a) no exercício profissional",
        "Etapas de elaboração de um laudo neuropsicológico",
        "Escrita de resultados de forma assertiva e conclusiva",
        "Tipos de raciocínios clínicos voltados para responder à demanda do laudo",
        "Construção de gráficos e tabelas para interpretação dos dados da avaliação",
        "Uso de Inteligência Artificial (IA) como ferramenta de apoio à escrita do laudo",
      ],
      testes: [],
    },
  ];

  const badges = [
    { icon: Award, label: "Reconhecimento MEC", sub: "Validade Nacional" },
    { icon: Activity, label: "220h de Prática Clínica", sub: "Experiência Real" },
    { icon: Network, label: "Formação Aplicada", sub: "Metodologia Ativa" },
    { icon: CheckCircle2, label: "Supervisão Especializada", sub: "Mentoria Direta" },
  ];

  return (
    <section id="cursos" className="py-32 bg-[#fafbfc] relative overflow-hidden">
      {/* Cinematic Background Lighting */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-neuro-orange/5 rounded-full blur-[150px] translate-x-1/3 -translate-y-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-neuro-blue/5 rounded-full blur-[120px] -translate-x-1/4 translate-y-1/4 pointer-events-none" />
      
      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        
        {/* Header: Editorial High-End */}
        <div className="flex flex-col items-center text-center mb-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white border border-slate-200 shadow-sm mb-8"
          >
            <GraduationCap className="w-4 h-4 text-neuro-orange" />
            <span className="text-[11px] font-black text-slate-500 tracking-[0.2em] uppercase italic">Aprenda Neuropsicologia na prática clínica real</span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-bold text-neuro-blue leading-[1.1] mb-6 max-w-4xl mx-auto"
          >
            Da teoria à prática clínica da <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-neuro-blue via-[#3b82f6] to-neuro-blue bg-[length:200%_auto] animate-gradient">
              Neuropsicologia
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_3s_infinite] pointer-events-none" />
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto"
          >
            Desenvolva segurança profissional com uma formação baseada em evidências científicas, experiência clínica e aplicação prática da avaliação neuropsicológica.
          </motion.p>

          {/* Social Proof Stats */}
          <div className="flex flex-wrap justify-center gap-10 mt-4">
            <div className="flex flex-col items-center">
              <span className="text-2xl font-black text-neuro-blue">+100</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Alunos Formados</span>
            </div>
            <div className="h-10 w-[1px] bg-slate-200 hidden md:block" />
            <div className="flex flex-col items-center">
              <span className="text-2xl font-black text-neuro-blue">220h</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Prática Real</span>
            </div>
            <div className="h-10 w-[1px] bg-slate-200 hidden md:block" />
            <div className="flex flex-col items-center">
              <span className="text-2xl font-black text-neuro-blue">4.9/5</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Avaliação Média</span>
            </div>
          </div>
        </div>

        {/* FEATURED PROGRAM: Formação Continuada */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative group rounded-[3.5rem] bg-[#0a1e30] p-1 md:p-2 mb-24 overflow-hidden shadow-[0_40px_100px_-20px_rgba(10,30,48,0.3)] transition-all duration-700 hover:shadow-[0_50px_120px_-20px_rgba(28,69,104,0.2)]"
        >
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-neuro-blue/15 rounded-full blur-[100px] translate-x-1/3 -translate-y-1/3 opacity-60 pointer-events-none group-hover:opacity-80 transition-opacity" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-neuro-cyan/10 rounded-full blur-[80px] -translate-x-1/3 translate-y-1/3 opacity-30 pointer-events-none" />

          <div className="relative z-10 bg-gradient-to-br from-[#122f47] to-[#0a1e30] rounded-[3.2rem] p-8 md:p-16 flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">
            {/* Left: info */}
            <div className="flex-1">
              <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-10">
                <div className="w-2 h-2 rounded-full bg-neuro-cyan animate-pulse" />
                <span className="text-[10px] font-black text-blue-100/60 tracking-[0.2em] uppercase">Formação Continuada</span>
                <div className="h-4 w-[1px] bg-white/10" />
                <span className="text-[10px] font-black text-neuro-cyan tracking-[0.2em] uppercase">Vagas Abertas</span>
              </div>

              <h3 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8 leading-tight">
                Formação em<br />
                <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-neuro-orange via-white to-neuro-orange bg-[length:200%_auto] animate-gradient">
                  Avaliação Neuropsicológica
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_3s_infinite] pointer-events-none" />
                </span>
              </h3>

              <p className="text-white font-bold text-lg mb-3">Avaliação Neuropsicológica na Prática Clínica</p>
              <p className="text-blue-100/70 text-base leading-relaxed mb-10 max-w-xl">
                Formação prática para psicólogos que desejam desenvolver segurança clínica na avaliação neuropsicológica, unindo raciocínio clínico, aplicação de testes e supervisão especializada.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all">
                  <Calendar className="w-5 h-5 text-neuro-cyan flex-shrink-0" />
                  <div>
                    <p className="text-white font-bold text-sm leading-none mb-1">Encontros presenciais mensais</p>
                    <p className="text-blue-100/40 text-[10px] uppercase tracking-wider">Periodicidade</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all">
                  <Clock className="w-5 h-5 text-neuro-cyan flex-shrink-0" />
                  <div>
                    <p className="text-white font-bold text-sm leading-none mb-1">220h de prática clínica supervisionada</p>
                    <p className="text-blue-100/40 text-[10px] uppercase tracking-wider">Carga Horária</p>
                  </div>
                </div>
              </div>

              <a
                href="https://wa.me/5561982088284?text=Quero%20saber%20mais%20sobre%20a%20Forma%C3%A7%C3%A3o%20Continuada%2C%20pode%20me%20ajudar%3F"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-neuro-orange hover:bg-neuro-orange-light text-white px-12 py-6 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-[0_20px_40px_-10px_rgba(242,140,40,0.6)] hover:shadow-[0_25px_50px_-10px_rgba(242,140,40,0.7)] hover:-translate-y-1 active:scale-95 group"
              >
                Quero Me Inscrever
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </a>
            </div>

            {/* Right: modules list */}
            <div className="lg:w-[400px] w-full space-y-2.5">
              <p className="text-[10px] font-black text-blue-100/30 uppercase tracking-[0.25em] mb-5">Módulos do Curso</p>
              {moduleData.map((mod, idx) => (
                <div
                  key={mod.num}
                  onClick={() => setSelectedModule(idx)}
                  className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-neuro-orange/10 hover:border-neuro-orange/40 transition-all group/mod cursor-pointer"
                >
                  <span className="w-8 h-8 rounded-lg bg-neuro-blue/30 text-neuro-cyan font-black text-xs flex items-center justify-center flex-shrink-0 group-hover/mod:bg-neuro-orange group-hover/mod:text-white transition-colors">
                    {mod.num}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-white/80 text-sm font-semibold leading-snug group-hover/mod:text-neuro-orange transition-colors">{mod.title}</p>
                    <p className="text-white/30 text-[10px] uppercase tracking-widest mt-1 group-hover/mod:text-neuro-orange/60 transition-colors">Ver detalhes →</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* PÓS-GRADUAÇÃO: Secondary */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start"
        >
          {/* Left: title + description + badges + CTA */}
          <div className="lg:col-span-5">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 border border-slate-200 mb-6">
              <div className="w-1.5 h-1.5 rounded-full bg-neuro-orange animate-pulse" />
              <span className="text-[10px] font-black text-slate-500 tracking-[0.2em] uppercase">Pós-Graduação</span>
              <span className="text-slate-300">·</span>
              <span className="text-[10px] font-black text-neuro-orange tracking-[0.2em] uppercase">Inscrições em Breve</span>
            </div>

            <h4 className="text-3xl md:text-4xl font-bold text-neuro-blue mb-5 leading-tight">
              Pós-Graduação em Neuropsicologia
            </h4>

            <p className="text-slate-500 mb-8 leading-relaxed text-base">
              Uma experiência de imersão definitiva que combina o rigor acadêmico com a vivência clínica intensiva. Projetada para transformar sua carreira em uma jornada de autoridade.
            </p>

            <div className="space-y-3 mb-8">
              {badges.map((badge, idx) => (
                <div key={idx} className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-100 shadow-sm">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 flex-shrink-0">
                    <badge.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-700 text-sm leading-none mb-0.5">{badge.label}</p>
                    <p className="text-slate-400 text-[10px] uppercase tracking-wider">{badge.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => { setFormStep(1); setIsModalOpen(true); }}
              className="group flex items-center gap-3 text-neuro-orange font-black text-sm uppercase tracking-widest transition-all bg-neuro-orange/5 px-8 py-4 rounded-2xl border border-neuro-orange/10 hover:bg-neuro-orange hover:text-white duration-500"
            >
              Entrar na Lista de Espera
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </button>
          </div>

          {/* Right: Em breve card */}
          <div className="lg:col-span-7 flex items-center justify-center">
            <div className="w-full rounded-[2.5rem] border border-slate-100 bg-white shadow-sm p-10 md:p-14 flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-[1.5rem] bg-slate-50 border border-slate-100 flex items-center justify-center mb-8">
                <GraduationCap className="w-10 h-10 text-slate-300" />
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-3">Reconhecimento MEC</p>
              <h5 className="text-2xl font-bold text-neuro-blue mb-4 leading-tight">
                Lançamento em Breve
              </h5>
              <p className="text-slate-400 text-sm leading-relaxed max-w-sm mb-8">
                A pós-graduação está em fase final de estruturação. Entre na lista de espera e garanta prioridade na inscrição com condições exclusivas.
              </p>
              <div className="flex items-center gap-3 px-6 py-3 rounded-full bg-slate-50 border border-slate-100">
                <div className="w-2 h-2 rounded-full bg-neuro-orange animate-pulse" />
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">+100 profissionais na lista</span>
              </div>
            </div>
          </div>
        </motion.div>

      </div>

      {/* LEAD MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-[#0a1e30]/80 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white rounded-[2.5rem] w-full max-w-lg overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-[#122f47] p-8 text-center relative">
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
                <div className="w-28 h-28 bg-white/5 backdrop-blur-sm rounded-[2rem] flex items-center justify-center p-5 mx-auto mb-6 border border-white/10 shadow-2xl">
                  <img 
                    src="/images/logo-saber-saude-icone.png" 
                    alt="NeuroPsiEdu Icon" 
                    className="w-full h-full object-contain" 
                  />
                </div>
                <h4 className="text-2xl font-bold text-white mb-2">Quase lá!</h4>
                <p className="text-blue-100/60 text-sm">Preencha seus dados para garantir prioridade na inscrição.</p>
              </div>

              <div className="p-8">
                {formStep === 1 ? (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Nome Completo</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                        <input 
                          required
                          type="text"
                          value={formData.nome}
                          onChange={(e) => setFormData({...formData, nome: e.target.value})}
                          placeholder="Seu nome completo"
                          className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-neuro-orange/20 focus:border-neuro-orange transition-all"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Telefone</label>
                        <div className="relative">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                          <input 
                            required
                            type="tel"
                            value={formData.telefone}
                            onChange={(e) => setFormData({...formData, telefone: e.target.value})}
                            placeholder="(00) 00000-0000"
                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-neuro-orange/20 focus:border-neuro-orange transition-all"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">E-mail</label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                          <input 
                            required
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            placeholder="seu@email.com"
                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-neuro-orange/20 focus:border-neuro-orange transition-all"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Status Profissional</label>
                      <div className="space-y-3">
                        <button
                          type="button"
                          onClick={() => setFormData({...formData, isPsicologo: 'sim'})}
                          className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${
                            formData.isPsicologo === 'sim' 
                            ? 'bg-neuro-blue/5 border-neuro-blue ring-1 ring-neuro-blue' 
                            : 'bg-white border-slate-100 hover:bg-slate-50'
                          }`}
                        >
                          <span className={`text-sm font-bold ${formData.isPsicologo === 'sim' ? 'text-neuro-blue' : 'text-slate-600'}`}>Sou formado em Psicologia</span>
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.isPsicologo === 'sim' ? 'border-neuro-blue bg-neuro-blue' : 'border-slate-300'}`}>
                            {formData.isPsicologo === 'sim' && <div className="w-2 h-2 rounded-full bg-white" />}
                          </div>
                        </button>

                        <button
                          type="button"
                          onClick={() => setFormData({...formData, isPsicologo: 'não'})}
                          className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${
                            formData.isPsicologo === 'não' 
                            ? 'bg-neuro-blue/5 border-neuro-blue ring-1 ring-neuro-blue' 
                            : 'bg-white border-slate-100 hover:bg-slate-50'
                          }`}
                        >
                          <span className={`text-sm font-bold ${formData.isPsicologo === 'não' ? 'text-neuro-blue' : 'text-slate-600'}`}>Não sou psicólogo / Sou estudante</span>
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.isPsicologo === 'não' ? 'border-neuro-blue bg-neuro-blue' : 'border-slate-300'}`}>
                            {formData.isPsicologo === 'não' && <div className="w-2 h-2 rounded-full bg-white" />}
                          </div>
                        </button>
                      </div>
                      <p className="mt-4 text-[11px] text-slate-400 leading-relaxed italic flex items-start gap-2">
                        <span className="text-neuro-orange mt-0.5 font-bold">*</span>
                        Nota: A pós-graduação exige formação completa em Psicologia para a obtenção do certificado de especialista.
                      </p>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-neuro-orange text-white py-6 rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-xl shadow-neuro-orange/20 hover:bg-neuro-orange-light hover:-translate-y-1 transition-all flex items-center justify-center gap-3 mt-4"
                    >
                      Enviar e Continuar
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </form>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-10"
                  >
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-500 mx-auto mb-6">
                      <CheckCircle2 className="w-10 h-10" />
                    </div>
                    <h5 className="text-2xl font-bold text-neuro-blue mb-3">Dados enviados!</h5>
                    <p className="text-slate-500 mb-8 leading-relaxed">Estamos redirecionando você para o nosso WhatsApp para finalizar seu atendimento...</p>
                    <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 2 }}
                        className="h-full bg-neuro-orange"
                      />
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODULE DETAIL MODAL */}
      <AnimatePresence>
        {selectedModule !== null && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedModule(null)}
              className="absolute inset-0 bg-[#0a1e30]/90 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 30 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative bg-white rounded-[2.5rem] w-full max-w-2xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-[#122f47] p-8 relative flex-shrink-0">
                <button
                  onClick={() => setSelectedModule(null)}
                  className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-neuro-orange/20 border border-neuro-orange/30 mb-4">
                  <span className="text-[10px] font-black text-neuro-orange tracking-[0.2em] uppercase">
                    Módulo {moduleData[selectedModule].num}
                  </span>
                </div>
                <h4 className="text-xl md:text-2xl font-bold text-white leading-snug pr-10">
                  {moduleData[selectedModule].title}
                </h4>
              </div>

              {/* Body — scrollable */}
              <div className="overflow-y-auto flex-1 p-8 space-y-8">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Sobre o Módulo</p>
                  <p className="text-slate-600 text-sm leading-relaxed">{moduleData[selectedModule].resumo}</p>
                </div>

                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Conteúdos Teóricos</p>
                  <ul className="space-y-2">
                    {moduleData[selectedModule].conteudos.map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-neuro-blue/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <CheckCircle2 className="w-3 h-3 text-neuro-blue" />
                        </div>
                        <span className="text-slate-600 text-sm leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {moduleData[selectedModule].testes.length > 0 && (
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Testes e Instrumentos</p>
                    <ul className="space-y-2">
                      {moduleData[selectedModule].testes.map((item, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <div className="w-5 h-5 rounded-full bg-neuro-orange/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Activity className="w-3 h-3 text-neuro-orange" />
                          </div>
                          <span className="text-slate-600 text-sm leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Footer CTA */}
              <div className="p-8 pt-4 flex-shrink-0 border-t border-slate-100">
                <a
                  href={`https://wa.me/5561982088284?text=${encodeURIComponent(`Olá! Tenho interesse em me inscrever no Módulo ${moduleData[selectedModule].num} — ${moduleData[selectedModule].title}. Pode me ajudar?`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 w-full bg-neuro-orange hover:bg-neuro-orange-light text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-lg shadow-neuro-orange/20 hover:shadow-neuro-orange/30 hover:-translate-y-0.5 active:scale-95"
                >
                  Quero Me Inscrever
                  <ArrowRight className="w-5 h-5" />
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
