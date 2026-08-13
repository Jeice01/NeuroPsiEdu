import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

type LeadModalSuccessStateProps = {
  message: string;
  onClose: () => void;
};

export function LeadModalSuccessState({
  message,
  onClose,
}: LeadModalSuccessStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-12 text-center gap-5"
    >
      <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
        <CheckCircle2 className="w-10 h-10 text-emerald-400" />
      </div>
      <div className="space-y-2">
        <h3 className="text-xl font-bold text-white">Recebemos seus dados!</h3>
        <p className="text-slate-400 text-sm leading-relaxed max-w-sm mx-auto">
          {message}
        </p>
      </div>
      <button
        type="button"
        onClick={onClose}
        className="mt-2 px-8 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-sm font-semibold border border-white/10 transition-colors"
      >
        Fechar
      </button>
    </motion.div>
  );
}
