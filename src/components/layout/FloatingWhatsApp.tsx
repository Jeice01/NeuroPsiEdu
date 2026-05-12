"use client";

import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

export function FloatingWhatsApp() {
  return (
    <motion.a
      href="https://wa.me/5561982088284"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Fale no WhatsApp"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      transition={{ duration: 0.3 }}
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-[#f3821a] text-white shadow-[0_8px_30px_rgba(243,130,26,0.4)] hover:shadow-[0_10px_40px_rgba(243,130,26,0.6)] group"
    >
      <div className="absolute inset-0 rounded-full bg-[#f3821a] animate-ping opacity-20"></div>
      <MessageCircle className="w-7 h-7 relative z-10" />
      
      {/* Tooltip */}
      <span className="absolute right-full mr-4 px-3 py-1.5 bg-white text-slate-800 text-sm font-semibold rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-slate-100">
        Fale no WhatsApp
      </span>
    </motion.a>
  );
}
