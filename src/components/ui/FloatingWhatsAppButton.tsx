"use client";

import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

export function FloatingWhatsAppButton() {
  return (
    <motion.a
      href="https://wa.me/5561982088284"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar com a NeuroPsiEdu pelo WhatsApp"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="fixed bottom-[18px] right-[18px] md:bottom-6 md:right-6 z-50 flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full bg-neuro-orange text-white shadow-[0_4px_14px_rgba(242,140,40,0.4)] hover:shadow-[0_8px_25px_rgba(242,140,40,0.6)] group"
    >
      <div className="absolute inset-0 rounded-full bg-neuro-orange animate-ping opacity-20"></div>
      <MessageCircle className="w-6 h-6 md:w-7 md:h-7 relative z-10" />
      
      {/* Tooltip */}
      <span className="absolute right-full mr-4 px-3 py-1.5 bg-white text-slate-800 text-sm font-semibold rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-slate-100">
        Falar com a NeuroPsiEdu pelo WhatsApp
      </span>
    </motion.a>
  );
}
