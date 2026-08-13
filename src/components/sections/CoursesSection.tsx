"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap, Calendar, Award, ArrowRight, Clock, CheckCircle2, Activity, Network, X, User, Mail, Phone, AlertCircle, Loader2, ShieldCheck } from "lucide-react";
import { TurnstileWidget } from "@/components/forms/TurnstileWidget";
import { HoneypotField } from "@/components/forms/SharedFormFields";
import { useLeadSubmission } from "@/hooks/useLeadSubmission";
import { pushLeadEvent } from "@/lib/lead-form-client";
import {
  normalizeEmail,
  normalizeText,
  onlyDigits,
  validateBrazilianWhatsapp,
  validateEmail,
  validateFullName,
} from "@/lib/lead-form";
import { CourseModuleModal } from "./CourseModuleModal";

export function CoursesSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formStep, setFormStep] = useState(1);
  const [selectedModule, setSelectedModule] = useState<number | null>(null);
  
  const [formData, setFormData] = useState({
    nome: "",
    telefone: "",
    email: "",
    isPsicologo: "sim",
    consentimentoContato: false,
  });
  const submission = useLeadSubmission();
  const {
    loading, apiError, setApiError, honeypot, setHoneypot,
    turnstileToken, handleTurnstileToken, turnstileResetKey,
    captchaError, setCaptchaError, reset, submit,
  } = submission;

  const openWaitlistModal = () => {
    setFormStep(1);
    reset();
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    if (!validateFullName(formData.nome)) {
      setApiError("Informe seu nome completo, com nome e sobrenome.");
      return;
    }
    if (!validateBrazilianWhatsapp(formData.telefone)) {
      setApiError("Informe um WhatsApp válido com DDD. Exemplo: (61) 99999-9999.");
      return;
    }
    if (!validateEmail(formData.email)) {
      setApiError("Informe um e-mail válido.");
      return;
    }
    if (!formData.consentimentoContato) {
      setApiError("É necessário autorizar o contato para prosseguir.");
      return;
    }
    if (!turnstileToken) {
      setCaptchaError("Conclua a verificação de segurança.");
      return;
    }

    const message = await submit({
      lead_type: "espera_pos",
      nome: normalizeText(formData.nome),
      whatsapp: onlyDigits(formData.telefone),
      email: normalizeEmail(formData.email),
      is_psicologo: formData.isPsicologo,
      consentimento_contato: true,
      turnstile_token: turnstileToken,
      website: honeypot,
    }, "Cadastro realizado com sucesso.");
    if (!message) return;

    setFormStep(2);
    pushLeadEvent({
      event: "lead_formacao", formacao: "POS_GRADUACAO", pagina: "/",
      perfil: formData.isPsicologo, botao_origem: "lista_espera_home",
    });

    setTimeout(() => {
      const msg = `Olá! Meu nome é ${formData.nome}. Sou ${formData.isPsicologo === 'sim' ? 'Psicólogo(a)' : 'estudante/outro'}. Gostaria de saber mais sobre a Pós-Graduação.`;
      window.open(`https://wa.me/5561982088284?text=${encodeURIComponent(msg)}`, '_blank');
    }, 2000);
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
    { icon: Activity, label: "140h de Prática Clínica", sub: "Experiência Real" },
    { icon: Network, label: "Formação Aplicada", sub: "Metodologia Ativa" },
    { icon: CheckCircle2, label: "Supervisão Especializada", sub: "Mentoria Direta" },
  ];

  return (
    <section id="cursos" className="defer-render py-16 xs:py-20 sm:py-24 md:py-32 bg-[#fafbfc] relative overflow-hidden">
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
            className="text-3xl xs:text-4xl md:text-6xl font-bold text-neuro-blue leading-[1.1] mb-6 max-w-4xl mx-auto"
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
              <span className="text-2xl font-black text-neuro-blue">140h</span>
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
          className="rounded-[2.2rem] xs:rounded-[3.5rem] bg-[#0a1e30] p-1 mb-12 xs:mb-16 md:mb-24 relative overflow-hidden shadow-2xl border border-white/[0.03] shadow-neuro-blue/10"
        >
          {/* Outer Border Glow Surface */}
          <div className="absolute inset-0 bg-gradient-to-tr from-neuro-orange/20 via-transparent to-neuro-cyan/10 opacity-30 animate-pulse" />
          
          <div 
            className="rounded-[2rem] xs:rounded-[3.2rem] p-5 xs:p-8 md:p-16 flex flex-col lg:flex-row gap-12 lg:gap-16 items-start relative z-10 overflow-hidden bg-gradient-to-br from-[#0c2237] via-[#091b2c] to-[#0c2237]"
          >
            {/* Left: info */}
            <div className="flex-1">
              <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-10">
                <div className="w-2 h-2 rounded-full bg-neuro-cyan animate-pulse" />
                <span className="text-[10px] font-black text-blue-100/60 tracking-[0.2em] uppercase">Formação Continuada</span>
                <div className="h-4 w-[1px] bg-white/10" />
                <span className="text-[10px] font-black text-neuro-cyan tracking-[0.2em] uppercase">Vagas Abertas</span>
              </div>

              <h3 className="text-3xl xs:text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.1] mb-6">
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
                    <p className="text-white font-bold text-sm leading-none mb-1">140h de prática clínica supervisionada</p>
                    <p className="text-blue-100/40 text-[10px] uppercase tracking-wider">Carga Horária</p>
                  </div>
                </div>
              </div>

              <a
                href="/fnp"
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
              onClick={openWaitlistModal}
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
              className="relative bg-white rounded-[1.5rem] xs:rounded-[2.5rem] w-full max-w-lg overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-[#122f47] p-5 xs:p-8 text-center relative">
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="absolute top-4 right-4 xs:top-6 xs:right-6 text-white/40 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
                <div className="w-20 h-20 xs:w-28 xs:h-28 bg-white/5 backdrop-blur-sm rounded-[1.5rem] xs:rounded-[2rem] flex items-center justify-center p-4 xs:p-5 mx-auto mb-4 xs:mb-6 border border-white/10 shadow-2xl">
                  <img 
                    src="/images/logo-saber-saude-icone.png" 
                    alt="NeuroPsiEdu Icon" 
                    width={971}
                    height={969}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-contain" 
                  />
                </div>
                <h4 className="text-xl xs:text-2xl font-bold text-white mb-2">Quase lá!</h4>
                <p className="text-blue-100/60 text-xs xs:text-sm">Preencha seus dados para garantir prioridade na inscrição.</p>
              </div>

              <div className="p-5 xs:p-8">
                {formStep === 1 ? (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <HoneypotField id="waitlist-website" value={honeypot} onChange={setHoneypot} />
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

                    <TurnstileWidget
                      key={turnstileResetKey}
                      onTokenChange={handleTurnstileToken}
                    />
                    {captchaError && (
                      <p role="alert" className="text-sm text-red-600">
                        {captchaError}
                      </p>
                    )}

                    <label className="flex items-start gap-3 text-sm text-slate-600">
                      <input
                        required
                        type="checkbox"
                        checked={formData.consentimentoContato}
                        onChange={(event) => {
                          setFormData({
                            ...formData,
                            consentimentoContato: event.target.checked,
                          });
                          setApiError("");
                        }}
                        className="mt-1 h-4 w-4 accent-neuro-orange"
                      />
                      <span>
                        Autorizo a NeuroPsiEdu a entrar em contato sobre a
                        Pós-Graduação.
                      </span>
                    </label>

                    {apiError && (
                      <div
                        role="alert"
                        className="flex items-start gap-2 rounded-xl bg-red-50 p-3 text-sm text-red-700"
                      >
                        <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                        <span>{apiError}</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={loading || !turnstileToken}
                      className="w-full bg-neuro-orange text-white py-6 rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-xl shadow-neuro-orange/20 hover:bg-neuro-orange-light hover:-translate-y-1 transition-all flex items-center justify-center gap-3 mt-4"
                    >
                      {loading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <ShieldCheck className="w-5 h-5" />
                      )}
                      {loading ? "Enviando..." : "Enviar e Continuar"}
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

      <CourseModuleModal
        module={selectedModule === null ? null : moduleData[selectedModule]}
        onClose={() => setSelectedModule(null)}
      />
    </section>
  );
}
