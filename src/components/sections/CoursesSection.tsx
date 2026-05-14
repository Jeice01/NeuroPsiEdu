"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap, Calendar, Award, BookOpen, ArrowRight, Star, Clock, CheckCircle2, Activity, Network, Sparkles, Users, Brain, X, Send, User, Mail, Phone, Briefcase } from "lucide-react";
import { supabase } from "@/lib/supabase";

export function CoursesSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formStep, setFormStep] = useState(1); // 1: Form, 2: Success
  
  const [formData, setFormData] = useState({
    nome: "",
    telefone: "",
    email: "",
    isPsicologo: "sim"
  });

  const handleSubmit = async (e: React.FormEvent) => {
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
  const modules = [
    { num: "01", title: "Transtorno do Des. Intelectual (DI) e Altas Habilidades", desc: "Avaliação Clínica e Neuropsicológica avançada." },
    { num: "02", title: "TDAH (Déficit de Atenção e Hiperatividade)", desc: "Protocolos de avaliação clínica e neuropsicológica." },
    { num: "03", title: "TEA (Transtorno do Espectro Autista)", desc: "Diagnóstico diferencial e avaliação clínica especializada." },
    { num: "04", title: "Transtornos de Aprendizagem e Dislexia", desc: "Abordagem neuropsicológica focada na aprendizagem." },
    { num: "05", title: "Avaliação da Pessoa Idosa", desc: "Foco clínico em declínio cognitivo e demências." },
    { num: "06", title: "Personalidade e Dinâmica das Emoções", desc: "Avaliação técnica de traços e regulação emocional." },
    { num: "07", title: "Escrita de Laudos e Raciocínio Clínico", desc: "Prática de redação técnica e fechamento de casos." },
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
            <span className="text-[11px] font-black text-slate-500 tracking-[0.2em] uppercase italic">Elite Educacional</span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-bold text-neuro-blue leading-[1.1] mb-8 max-w-4xl"
          >
            Formação de <span className="text-neuro-orange">Elite</span> para quem busca o topo da <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-neuro-blue via-[#3b82f6] to-neuro-blue bg-[length:200%_auto] animate-gradient">
              Neuropsicologia
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_3s_infinite] pointer-events-none" />
            </span>
          </motion.h2>

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

        {/* FEATURED PROGRAM: Pós-Graduação Stripe/Apple Style */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative group rounded-[3.5rem] bg-[#0a1e30] p-1 md:p-2 mb-24 overflow-hidden shadow-[0_40px_100px_-20px_rgba(10,30,48,0.3)] transition-all duration-700 hover:shadow-[0_50px_120px_-20px_rgba(243,130,26,0.15)]"
        >
          {/* Animated Internal Glow */}
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-neuro-orange/10 rounded-full blur-[100px] translate-x-1/3 -translate-y-1/3 opacity-50 pointer-events-none group-hover:opacity-70 transition-opacity" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-neuro-cyan/10 rounded-full blur-[80px] -translate-x-1/3 translate-y-1/3 opacity-30 pointer-events-none" />

          <div className="relative z-10 bg-gradient-to-br from-[#122f47] to-[#0a1e30] rounded-[3.2rem] p-8 md:p-16 flex flex-col lg:flex-row gap-16 items-center">
            <div className="flex-1">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-10 group/badge relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover/badge:translate-x-full transition-transform duration-1000" />
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-neuro-orange animate-pulse shadow-[0_0_12px_#f3821a]" />
                  <span className="text-[10px] font-black text-blue-100/60 tracking-[0.2em] uppercase">Pós-Graduação</span>
                </div>
                <div className="h-4 w-[1px] bg-white/10" />
                <span className="text-[10px] font-black text-neuro-orange tracking-[0.2em] uppercase animate-gradient bg-clip-text text-transparent bg-gradient-to-r from-neuro-orange to-[#ffb347]">
                  Inscrições em Breve
                </span>
              </motion.div>
              
              <h3 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8 leading-tight">
                Pós-Graduação em <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-blue-200">Neuropsicologia</span>
              </h3>
              
              <p className="text-blue-100/70 text-lg leading-relaxed mb-12 max-w-2xl">
                Uma experiência de imersão definitiva que combina o rigor acadêmico com a vivência clínica intensiva. Projetada para transformar sua carreira em uma jornada de autoridade.
              </p>

              {/* Trust Badges Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
                {badges.map((badge, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all group/badge">
                    <div className="w-10 h-10 rounded-xl bg-neuro-orange/10 flex items-center justify-center text-neuro-orange group-hover/badge:scale-110 transition-transform">
                      <badge.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-white font-bold text-sm leading-none mb-1">{badge.label}</p>
                      <p className="text-blue-100/40 text-[10px] font-medium uppercase tracking-wider">{badge.sub}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-8">
                <button 
                  onClick={() => {
                    setFormStep(1);
                    setIsModalOpen(true);
                  }}
                  className="relative w-full sm:w-auto overflow-hidden bg-[#f3821a] hover:bg-[#ff8c1a] text-white px-12 py-6 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-[0_20px_40px_-10px_rgba(243,130,26,0.5)] active:scale-95 text-center group"
                >
                  <span className="relative z-10 flex items-center justify-center gap-3">
                    Garantir Minha Vaga
                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </span>
                </button>
                <div className="flex items-center gap-3">
                  <span className="text-blue-100/40 text-xs font-bold uppercase tracking-widest">+100 profissionais inscritos</span>
                </div>
              </div>
            </div>

            {/* Premium Stamp Seal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
              whileInView={{ opacity: 1, scale: 1, rotate: -15 }}
              viewport={{ once: true }}
              className="absolute top-10 right-10 w-40 h-40 rounded-full border-[6px] border-neuro-orange/30 flex items-center justify-center p-1.5 group-hover:scale-110 transition-transform duration-700 hidden lg:flex"
            >
              <div className="w-full h-full rounded-full border-2 border-neuro-orange/50 border-dashed flex flex-col items-center justify-center text-neuro-orange">
                <span className="text-[12px] font-black uppercase tracking-[0.2em] leading-none">Lançamento</span>
                <span className="text-2xl font-black uppercase leading-tight mt-1">Em Breve</span>
                <div className="w-12 h-[1px] bg-neuro-orange/30 my-2" />
                <span className="text-[10px] font-bold uppercase opacity-60">NeuroPsiEdu</span>
              </div>
            </motion.div>

            {/* Aspirational Side Visual (Brain) */}
            <div className="hidden lg:block w-[350px] h-[350px] relative">
              <div className="absolute inset-0 bg-gradient-to-r from-neuro-orange/20 to-transparent rounded-full blur-[80px]" />
              <Brain className="w-full h-full text-white/5" strokeWidth={0.5} />
            </div>
          </div>
        </motion.div>

        {/* CURRICULUM: Linear/Apple Style Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          <div className="lg:col-span-4 lg:sticky lg:top-32">
            <h4 className="text-3xl font-bold text-neuro-blue mb-6">Formação Continuada em Avaliação Neuropsicológica</h4>
            <p className="text-slate-500 mb-10 leading-relaxed text-lg">
              Um treinamento intensivo focado em testes e raciocínio clínico neuropsicológico e da personalidade.
            </p>
            
            <div className="space-y-4">
              <div className="p-6 rounded-[2rem] bg-white border border-slate-200 shadow-sm flex items-center gap-6">
                <div className="w-14 h-14 rounded-2xl bg-neuro-blue/5 flex items-center justify-center text-neuro-blue">
                  <Calendar className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Periodicidade</p>
                  <p className="text-lg font-bold text-neuro-blue">Um final de semana por mês</p>
                </div>
              </div>
              <div className="p-6 rounded-[2rem] bg-white border border-slate-200 shadow-sm flex items-center gap-6">
                <div className="w-14 h-14 rounded-2xl bg-neuro-orange/5 flex items-center justify-center text-neuro-orange">
                  <Clock className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Carga Horária</p>
                  <p className="font-bold text-neuro-blue">7 Módulos | 220h de Prática</p>
                </div>
              </div>
            </div>

            <div className="mt-10">
              <button className="group flex items-center gap-3 text-neuro-orange font-black text-sm uppercase tracking-widest hover:gap-5 transition-all bg-neuro-orange/5 px-8 py-4 rounded-2xl border border-neuro-orange/10 hover:bg-neuro-orange hover:text-white duration-500">
                Saber Mais Sobre Este Curso
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            {modules.map((mod, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="group relative bg-white rounded-[2rem] p-8 border border-slate-100 hover:border-neuro-orange/30 shadow-sm hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.05)] transition-all duration-500 overflow-hidden"
              >
                {/* Micro-Interaction Hover Glow */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-neuro-orange/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="relative z-10">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 font-black text-sm flex items-center justify-center mb-6 group-hover:bg-neuro-orange group-hover:text-white transition-all duration-500 shadow-sm">
                    {mod.num}
                  </div>
                  <h5 className="font-bold text-neuro-blue mb-3 text-lg leading-tight group-hover:text-neuro-orange transition-colors">
                    {mod.title}
                  </h5>
                  <p className="text-sm text-slate-500 leading-relaxed opacity-70 group-hover:opacity-100 transition-opacity">
                    {mod.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

        </div>

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
    </section>
  );
}
