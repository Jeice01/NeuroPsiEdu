"use client";

import { Award, Microscope, GraduationCap } from "lucide-react";

export function FnpAbout() {
  const credentials = [
    {
      icon: <Microscope className="w-5 h-5 text-neuro-orange" />,
      text: "Diagnósticos Precisos e Humanizados",
    },
    {
      icon: <Award className="w-5 h-5 text-neuro-orange" />,
      text: "Experiência Clínica Comprovada",
    },
    {
      icon: <GraduationCap className="w-5 h-5 text-neuro-orange" />,
      text: "Metodologia Prática no Ensino",
    },
  ];

  return (
    <section id="sobre" className="relative py-24 bg-[#fdfdfd] text-[#1c4568] overflow-hidden">
      
      {/* Background decorations */}
      <div className="absolute top-1/2 left-0 w-[300px] h-[300px] bg-slate-50 rounded-full blur-[80px] pointer-events-none" />
      
      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column - Image & Graphic */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <div className="relative w-full max-w-[380px] aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border border-slate-100 group">
              
              {/* Picture */}
              <img
                src="/images/marilia-800.webp"
                srcSet="/images/marilia-480.webp 480w, /images/marilia-800.webp 800w, /images/marilia-1120.webp 1120w"
                sizes="(max-width: 1023px) 380px, 32vw"
                width={1120}
                height={1402}
                loading="lazy"
                decoding="async"
                alt="Marília - Fundadora da NeuroPsiEdu"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />

              {/* Floating gradient badge overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#1c4568]/80 via-transparent to-transparent opacity-80" />
              
              {/* Label inside image */}
              <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
                <p className="text-xs uppercase font-bold tracking-widest text-orange-400">Diretora Técnica</p>
                <h4 className="font-display font-black text-xl">Marília Karine</h4>
                <p className="text-[10px] text-slate-300 font-light">CRP 01/16482 · Fundadora da NeuroPsiEdu</p>
              </div>

              {/* Subtle glass container behind photo */}
              <div className="absolute -z-10 -bottom-4 -right-4 w-full h-full rounded-3xl bg-slate-100 border border-slate-200 pointer-events-none" />

            </div>
          </div>

          {/* Right Column - Text Bio */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Quem Conduz a Formação</span>
              <h2 className="font-display font-black text-3xl sm:text-4xl tracking-tight text-neuro-blue leading-tight">
                Conheça a Dra. Marília Karine e a NeuroPsiEdu
              </h2>
              <p className="text-slate-600 font-light text-base sm:text-lg leading-relaxed">
                A NeuroPsiEdu nasceu com a missão de oferecer avaliações neuropsicológicas de excelência e, ao mesmo tempo, capacitar profissionais da saúde com conhecimento prático e baseado nas melhores evidências científicas.
              </p>
            </div>

            {/* Biography text */}
            <div className="text-slate-600 text-sm leading-relaxed space-y-4 font-light">
              <p>
                A Dra. Marília Karine é especialista em Neuropsicologia, atuando com dedicação para promover clareza diagnóstica e qualidade de vida aos seus pacientes. Como educadora, lidera formações técnicas transformadoras.
              </p>
            </div>

            {/* Credentials Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
              {credentials.map((cred, idx) => (
                <div key={idx} className="flex items-start gap-3 p-2">
                  <div className="w-9 h-9 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center shrink-0">
                    {cred.icon}
                  </div>
                  <span className="text-slate-700 text-xs leading-relaxed font-medium">
                    {cred.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
