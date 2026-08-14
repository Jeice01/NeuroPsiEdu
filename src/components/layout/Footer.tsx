"use client";

import { MessageCircle, ArrowRight, Send } from "lucide-react";
import { TELEGRAM_LINK } from "@/lib/links";

type FooterProps = {
  whatsappHref?: string;
  whatsappLabel?: string;
};

export function Footer({
  whatsappHref = "https://wa.me/5561982088284",
  whatsappLabel = "(61) 98208-8284",
}: FooterProps = {}) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-neuro-blue text-white pt-20 pb-10 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-white/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Column */}
          <div className="space-y-6">
            <img
              src="/images/logo-vertical-300.webp"
              srcSet="/images/logo-vertical-300.webp 300w, /images/logo-vertical-600.webp 600w"
              sizes="160px"
              alt="NeuroPsiEdu"
              width={160}
              height={32}
              className="opacity-90 brightness-0 invert"
            />
            <p className="text-blue-100/70 text-sm leading-relaxed max-w-xs">
              Excelência em avaliação neuropsicológica e capacitação profissional baseada em evidências científicas.
            </p>
            <div className="flex items-center gap-4">
              <a 
                href="https://www.instagram.com/academiadaneuropsicologia" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-[#E4405F] transition-all duration-300 group"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-blue-100 group-hover:text-white"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-[#1877F2] transition-all duration-300 group"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-blue-100 group-hover:text-white"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </a>
              <a
                href={TELEGRAM_LINK}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Telegram NeuroPsiEdu"
                className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-sky-500 transition-all duration-300 group"
              >
                <Send className="w-5 h-5 text-blue-100 group-hover:text-white" />
              </a>
            </div>
          </div>

          {/* Contact Column */}
          <div className="space-y-6">
            <h4 className="text-lg font-bold text-white uppercase tracking-widest">Contato</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 group">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-neuro-orange transition-colors shrink-0">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-blue-200 group-hover:text-white"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                </div>
                <div>
                  <p className="text-xs font-bold text-blue-200/50 uppercase tracking-wider">E-mail</p>
                  <a href="mailto:contato@neuropsiedu.com.br" className="text-blue-100 hover:text-white transition-colors">
                    contato@neuropsiedu.com.br
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3 group">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-[#25D366] transition-all duration-300 shrink-0">
                  <MessageCircle className="w-5 h-5 text-blue-200 group-hover:text-white fill-current" />
                </div>
                <div>
                  <p className="text-xs font-bold text-blue-200/50 uppercase tracking-wider">WhatsApp</p>
                  <a href={whatsappHref} className="text-blue-100 hover:text-white transition-colors">
                    {whatsappLabel}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3 group">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-sky-500 transition-all duration-300 shrink-0">
                  <Send className="w-5 h-5 text-blue-200 group-hover:text-white" />
                </div>
                <div>
                  <p className="text-xs font-bold text-blue-200/50 uppercase tracking-wider">Telegram</p>
                  <a
                    href={TELEGRAM_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-100 hover:text-white transition-colors"
                  >
                    NeuroPsiEdu
                  </a>
                </div>
              </li>
            </ul>
          </div>

          {/* Location Column */}
          <div className="space-y-6 lg:col-span-2">
            <h4 className="text-lg font-bold text-white uppercase tracking-widest">Localização</h4>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1 space-y-4">
                <div className="flex items-start gap-4 group">
                  <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-neuro-orange transition-colors shrink-0">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-blue-200 group-hover:text-white"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                  </div>
                  <div className="space-y-2">
                    <p className="text-blue-100 leading-relaxed text-sm">
                      Ed. Conect Towers - QS 1 BLOCO D - Águas Claras, Brasília - DF<br />
                      11º andar - Sala 1129
                    </p>
                    <a 
                      href="https://maps.app.goo.gl/QMxDcdBXVTqtWstG7" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-neuro-orange font-bold text-sm hover:underline group/maps"
                    >
                      Ver no Google Maps
                      <ArrowRight className="w-4 h-4 transition-transform group-hover/maps:translate-x-1" />
                    </a>
                  </div>
                </div>
              </div>
              
              {/* Visible Map Preview */}
              <div className="flex-1 h-40 rounded-2xl overflow-hidden border border-white/10 relative group cursor-pointer">
                <a 
                  href="https://maps.app.goo.gl/QMxDcdBXVTqtWstG7" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="absolute inset-0 z-20 bg-neuro-blue/20 group-hover:bg-transparent transition-colors duration-500"
                />
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3838.319344464871!2d-48.0286119!3d-15.8422222!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x935a3311822c7f47%3A0xc3f8c057697c11f!2sConect%20Towers!5e0!3m2!1spt-BR!2sbr!4v1715545000000!5m2!1spt-BR!2sbr"
                  width="100%" 
                  height="100%" 
                  style={{ border: 0, filter: "invert(90%) hue-rotate(180deg) brightness(0.8) contrast(1.2)" }} 
                  allowFullScreen={false} 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  className="grayscale hover:grayscale-0 transition-all duration-700 pointer-events-none"
                ></iframe>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center md:items-start gap-1">
            <p className="text-blue-200/40 text-xs">
              © {new Date().getFullYear()} NeuroPsiEdu. Todos os direitos reservados.
            </p>
            <p className="text-blue-200/30 text-[10px] font-medium tracking-wider">
              CNPJ: 34.800.411/0001-83
            </p>
          </div>
          
          <button 
            onClick={scrollToTop}
            className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-blue-100 hover:text-neuro-orange transition-colors group"
          >
            Voltar ao topo
            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-neuro-orange transition-colors">
              <ArrowRight className="w-4 h-4" />
            </div>
          </button>
        </div>
      </div>
    </footer>
  );
}
