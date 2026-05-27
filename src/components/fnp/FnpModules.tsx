"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, BookOpen, Target } from "lucide-react";

export function FnpModules() {
  const [activeModule, setActiveModule] = useState<number | null>(0);

  const modules = [
    {
      num: "01",
      title: "Avaliação Clínica e Neuropsicológica do Transtorno do Desenvolvimento Intelectual (DI) e das Altas Habilidades/Superdotação (AH/SD)",
      duration: "Módulo Presencial · 1 Encontro",
      summary: "Na avaliação da inteligência, o DI e o AH/SD exigem avaliação clínica criteriosa. Vai além de um escore.",
      topics: [
        "Teoria e conceitos gerais sobre inteligência;",
        "Critérios diagnósticos do Transtorno do Desenvolvimento Intelectual — Deficiência Intelectual;",
        "Conceitos e fundamentos teóricos sobre Superdotação e Altas Habilidades.",
      ],
      instruments: [
        "Aplicação, correção e análise dos resultados:",
        "Wechsler de Inteligência para Crianças — WISC-IV;",
        "Escala Wechsler de Inteligência para Adultos — WAIS-III;",
        "Inventários.",
      ],
    },
    {
      num: "02",
      title: "Avaliação Clínica e Neuropsicológica do Transtorno do Déficit de Atenção e Hiperatividade (TDAH)",
      duration: "Módulo Presencial · 1 Encontro",
      summary: "Compreenda os prejuízos na atenção e funções executivas, os critérios diagnósticos e prejuízos funcionais relacionados ao TDAH.",
      topics: [
        "Teoria e conceitos gerais sobre atenção;",
        "Tipos de atenção: concentrada, sustentada, seletiva, alternada e dividida;",
        "Teoria e conceitos gerais sobre Funções Executivas;",
        "Análise de laudos e históricos clínicos com déficits atencionais e alterações nas Funções Executivas;",
        "Avaliação clínica do TDAH;",
        "Critérios diagnósticos do TDAH.",
      ],
      instruments: [
        "Aplicação, correção e análise dos resultados:",
        "Bateria Psicológica da Atenção (BPA);",
        "Teste D-2-R;",
        "Teste dos Cinco Dígitos (FDT);",
        "Bateria de Disfunções Executivas de Barkley (BDEFS);",
        "Escala de Prejuízos Funcionais do TDAH (EPF-TDAH);",
        "Escala de Transtorno do Déficit de Atenção e Hiperatividade (ETDAH-AD);",
        "Inventários e material de apoio diagnóstico do TDAH.",
      ],
    },
    {
      num: "03",
      title: "Avaliação Clínica e Neuropsicológica do Transtorno do Espectro Autista — TEA",
      duration: "Módulo Presencial · 1 Encontro",
      summary: "Compreenda como avaliar os sinais clínicos do TEA considerando história do desenvolvimento, linguagem, comportamento, interação social, funcionamento adaptativo e raciocínio diferencial.",
      topics: [
        "Teoria e conceitos gerais sobre o Transtorno do Espectro Autista;",
        "Critérios diagnósticos do TEA;",
        "Desenvolvimento da linguagem e sua relação com o TEA;",
        "Análise da história do desenvolvimento do paciente;",
        "Compreensão do comportamento, da interação social e do funcionamento adaptativo;",
        "Raciocínio diferencial na avaliação clínica e neuropsicológica do TEA.",
      ],
      instruments: [
        "Aplicação, correção e análise dos resultados:",
        "Anamnese clínica;",
        "PROTEA-R — Sistema de Avaliação da Suspeita de Transtorno do Espectro Autista;",
        "Escala de Responsividade Social — SRS-2;",
        "M-CHAT;",
        "CARS;",
        "Escala de Traços Autísticos — ATA;",
        "Inventários de avaliação complementar;",
        "Outros materiais de apoio à avaliação do TEA.",
      ],
    },
    {
      num: "04",
      title: "Avaliação Clínica e Neuropsicológica dos Transtornos Específicos de Aprendizagem — Dislexia, Discalculia e Disortografia",
      duration: "Módulo Presencial · 1 Encontro",
      summary: "Compreenda que nem toda dificuldade escolar é dislexia e que nem todo baixo desempenho acadêmico indica um transtorno específico de aprendizagem.",
      topics: [
        "Teoria e conceitos gerais sobre os Transtornos Específicos de Aprendizagem;",
        "Características clínicas da Dislexia;",
        "Características clínicas da Discalculia;",
        "Características clínicas da Disortografia;",
        "Critérios diagnósticos dos Transtornos Específicos de Aprendizagem;",
        "Raciocínio clínico para diferenciar dificuldades escolares, baixo desempenho acadêmico e transtornos específicos de aprendizagem.",
      ],
      instruments: [
        "Aplicação, correção e análise dos resultados:",
        "CONFIAS — Consciência Fonológica: Instrumento de Avaliação Sequencial;",
        "PROLEC — Provas de Avaliação dos Processos de Leitura;",
        "TDE II — Teste de Desenvolvimento Escolar;",
        "TENA — Teste de Nomeação Automática.",
      ],
    },
    {
      num: "05",
      title: "Avaliação Neuropsicológica da Pessoa Idosa",
      duration: "Módulo Presencial · 1 Encontro",
      summary: "Compreenda como avaliar memória, funcionamento cognitivo e transtornos neurocognitivos na pessoa idosa, incluindo demências, rebaixamentos cognitivos e prejuízos funcionais associados.",
      topics: [
        "Teoria e conceitos gerais sobre memória;",
        "Avaliação da memória na pessoa idosa;",
        "Transtornos neurocognitivos;",
        "Demências e rebaixamentos cognitivos;",
        "Análise de laudos e históricos clínicos com déficits cognitivos;",
        "Relação entre prejuízos cognitivos, funcionalidade e autonomia;",
        "Inventários e recursos de apoio para análise clínica.",
      ],
      instruments: [
        "Aplicação, correção e análise dos resultados:",
        "RAVLT — Teste de Aprendizagem Auditivo-Verbal de Rey;",
        "NEUPSILIN — Instrumento de Avaliação Neuropsicológica Breve;",
        "MTL — Bateria Montreal-Toulouse de Avaliação da Linguagem;",
        "CDR — Clinical Dementia Rating;",
        "NPI — Inventário Neuropsiquiátrico;",
        "Escala de Katz;",
        "Recursos complementares de análise clínica para avaliação da pessoa idosa.",
      ],
    },
    {
      num: "06",
      title: "Avaliação de Traços da Personalidade e da Dinâmica das Emoções",
      duration: "Módulo Presencial · 1 Encontro",
      summary: "Compreenda que não basta aplicar um teste e analisar o resultado de forma isolada: é preciso interpretar o funcionamento emocional, os traços predominantes e a forma como o paciente se organiza diante das demandas clínicas.",
      topics: [
        "Teoria e conceitos gerais sobre personalidade;",
        "Compreensão dos traços predominantes da personalidade;",
        "Análise da dinâmica emocional do paciente;",
        "Relação entre funcionamento emocional, comportamento e queixa clínica;",
        "Interpretação integrada dos resultados dos instrumentos;",
        "Raciocínio clínico para compreender como o paciente se organiza diante das demandas da avaliação.",
      ],
      instruments: [
        "Aplicação, correção e análise dos resultados:",
        "Pirâmides Coloridas de Pfister;",
        "Teste Palográfico na Avaliação da Personalidade;",
        "BFP — Bateria Fatorial de Personalidade.",
      ],
    },
    {
      num: "07",
      title: "Escrita de Laudos Neuropsicológicos e Raciocínio Clínico",
      duration: "Módulo Presencial · 1 Encontro",
      summary: "Compreenda que o laudo neuropsicológico é resultado de todo o processo avaliativo e precisa expressar, com clareza e fundamentação técnica, a análise clínica, o raciocínio clínico, a interpretação dos dados e a resposta à demanda inicial.",
      topics: [
        "Resolução nº 6 do CFP sobre elaboração de documentos escritos produzidos pela(o) psicóloga(o) no exercício profissional;",
        "Etapas de elaboração de um laudo neuropsicológico;",
        "Escrita de resultados de forma assertiva, técnica e conclusiva;",
        "Tipos de raciocínio clínico voltados para responder à demanda do laudo neuropsicológico;",
        "Organização e interpretação dos dados da avaliação neuropsicológica;",
        "Construção de gráficos e tabelas para apresentação dos resultados;",
        "Uso da Inteligência Artificial como ferramenta de apoio à escrita do laudo neuropsicológico.",
      ],
      instruments: [
        "Aplicação prática, estruturação e análise dos resultados:",
        "Construção da estrutura do laudo neuropsicológico;",
        "Organização das informações clínicas e dos dados da avaliação;",
        "Escrita técnica dos resultados;",
        "Formulação da conclusão e resposta à demanda;",
        "Elaboração de gráficos e tabelas interpretativas;",
        "Uso de IA como recurso complementar para apoio à escrita, revisão e organização do laudo.",
      ],
    },
  ];

  return (
    <section id="modulos" className="relative py-24 bg-[#fdfdfd] text-[#1c4568] overflow-hidden">
      
      <div className="absolute top-1/3 left-0 w-[300px] h-[300px] bg-slate-100 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-0 w-[400px] h-[400px] bg-blue-50 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-6 max-w-5xl relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Conteúdo Programático</span>
          <h2 className="font-display font-black text-3xl sm:text-4xl tracking-tight text-neuro-blue leading-tight">
            Estrutura Completa dos Módulos
          </h2>
          <p className="text-slate-600 font-light text-base sm:text-lg">
            Cada módulo presencial foi cuidadosamente pensado e planejado para oferecer o conhecimento teórico/prático real do processo de avaliação neuropsicológica.
          </p>
        </div>

        {/* Expandable Accordions */}
        <div className="space-y-4">
          {modules.map((mod, idx) => {
            const isOpen = activeModule === idx;
            return (
              <div
                key={idx}
                className={`bg-white border rounded-2xl transition-all duration-300 ${
                  isOpen
                    ? "border-neuro-blue/20 shadow-[0_15px_40px_rgba(28,69,104,0.06)]"
                    : "border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:border-slate-200"
                }`}
              >
                {/* Header (Trigger) */}
                <button
                  onClick={() => setActiveModule(isOpen ? null : idx)}
                  className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 cursor-pointer"
                >
                  <div className="flex items-center gap-4 sm:gap-6">
                    {/* Number badge */}
                    <span className="font-display font-black text-2xl sm:text-3xl text-slate-300 tracking-tight shrink-0">
                      {mod.num}
                    </span>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-neuro-orange tracking-wider block mb-1">
                        {mod.duration}
                      </span>
                      <h3 className="font-display font-bold text-base sm:text-lg text-neuro-blue">
                        {mod.title}
                      </h3>
                    </div>
                  </div>
                  <div
                    className={`w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center shrink-0 transition-transform duration-300 ${
                      isOpen ? "rotate-180 bg-neuro-orange/10 text-neuro-orange" : "text-slate-400"
                    }`}
                  >
                    <ChevronDown className="w-5 h-5" />
                  </div>
                </button>

                {/* Body (Details) */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 pt-2 border-t border-slate-100/60 space-y-6">
                        
                        {/* Summary */}
                        <p className="text-slate-600 text-sm font-light leading-relaxed">
                          {mod.summary}
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                          {/* Topics List */}
                          <div className="space-y-3">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                              <BookOpen className="w-3.5 h-3.5 text-neuro-orange" />
                              O que você vai aprender:
                            </h4>
                            <ul className="space-y-2">
                              {mod.topics.map((topic, tIdx) => (
                                <li key={tIdx} className="text-slate-600 text-xs flex items-start gap-2 font-light">
                                  <span className="text-neuro-orange mt-0.5">•</span>
                                  <span>{topic}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Instruments/Practice Card */}
                          <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl space-y-2">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                              <Target className="w-3.5 h-3.5 text-neuro-orange" />
                              Foco Prático & Instrumentos:
                            </h4>
                            {Array.isArray(mod.instruments) ? (
                              <ul className="space-y-1">
                                {mod.instruments.map((item: string, i: number) => (
                                  <li key={i} className="text-slate-600 text-xs leading-relaxed font-light flex items-start gap-1.5">
                                    <span className="text-neuro-orange mt-0.5">•</span>
                                    <span>{item}</span>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-slate-600 text-xs leading-relaxed font-light">
                                {mod.instruments}
                              </p>
                            )}
                          </div>
                        </div>

                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
