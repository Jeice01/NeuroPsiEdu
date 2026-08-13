import { AnimatePresence, motion } from "framer-motion";
import { Activity, ArrowRight, CheckCircle2, X } from "lucide-react";

export type CourseModule = {
  num: string;
  title: string;
  resumo: string;
  conteudos: string[];
  testes: string[];
};

type CourseModuleModalProps = {
  module: CourseModule | null;
  onClose: () => void;
};

export function CourseModuleModal({ module, onClose }: CourseModuleModalProps) {
  return (
    <AnimatePresence>
      {module && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#0a1e30]/90 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 30 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative bg-white rounded-[1.5rem] xs:rounded-[2.5rem] w-full max-w-2xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="bg-[#122f47] p-5 xs:p-8 relative flex-shrink-0">
              <button
                onClick={onClose}
                aria-label="Fechar detalhes do módulo"
                className="absolute top-4 right-4 xs:top-6 xs:right-6 text-white/40 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-neuro-orange/20 border border-neuro-orange/30 mb-3 xs:mb-4">
                <span className="text-[10px] font-black text-neuro-orange tracking-[0.2em] uppercase">
                  Módulo {module.num}
                </span>
              </div>
              <h4 className="text-lg xs:text-xl md:text-2xl font-bold text-white leading-snug pr-10">
                {module.title}
              </h4>
            </div>

            <div className="overflow-y-auto flex-1 p-5 xs:p-8 space-y-6 xs:space-y-8">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Sobre o Módulo</p>
                <p className="text-slate-600 text-sm leading-relaxed">{module.resumo}</p>
              </div>

              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Conteúdos Teóricos</p>
                <ul className="space-y-2">
                  {module.conteudos.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-neuro-blue/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle2 className="w-3 h-3 text-neuro-blue" />
                      </div>
                      <span className="text-slate-600 text-sm leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {module.testes.length > 0 && (
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Testes e Instrumentos</p>
                  <ul className="space-y-2">
                    {module.testes.map((item) => (
                      <li key={item} className="flex items-start gap-3">
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

            <div className="p-5 pt-3 xs:p-8 xs:pt-4 flex-shrink-0 border-t border-slate-100">
              <a
                href={`https://wa.me/5561982088284?text=${encodeURIComponent(`Olá! Tenho interesse em me inscrever no Módulo ${module.num} — ${module.title}. Pode me ajudar?`)}`}
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
  );
}
