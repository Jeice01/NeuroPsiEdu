"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight } from "lucide-react";
import Link from "next/link";

export function FnpNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const menuItems = [
    { label: "O Programa", href: "#diferencial" },
    { label: "Módulos", href: "#modulos" },
    { label: "Calendário", href: "#calendario" },
    { label: "Professora", href: "#sobre" },
    { label: "FAQ", href: "#faq" },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl transition-all duration-300 rounded-2xl ${
          scrolled
            ? "glass-dark bg-slate-950/80 shadow-[0_20px_50px_rgba(0,0,0,0.3)] border-white/10"
            : "bg-transparent border-transparent"
        }`}
      >
        <div className="px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link href="/fnp" className="flex items-center gap-2 group">
            <span className="font-display font-black text-xl tracking-tight text-white">
              NeuroPsi<span className="text-neuro-orange">EDU</span>
            </span>
            <span className="bg-white/10 text-white/70 text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider">
              8ª Turma ANP
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-8">
            {menuItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-sm font-medium text-slate-300 hover:text-white transition-colors duration-200"
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-4">
            <a
              href="#investimento"
              className="relative group overflow-hidden px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-neuro-orange to-orange-600 transition-all duration-300 hover:shadow-[0_0_20px_rgba(242,140,40,0.4)] flex items-center gap-2"
            >
              <span className="relative z-10">Garantir Vaga</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-xl text-slate-300 hover:text-white bg-white/5 border border-white/10 transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </motion.nav>

      {/* Drawer Overlay for Mobile */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-[320px] bg-slate-950 border-l border-white/10 p-6 flex flex-col justify-between lg:hidden shadow-2xl"
            >
              <div>
                <div className="flex items-center justify-between pb-8 border-b border-white/10">
                  <span className="font-display font-black text-xl tracking-tight text-white">
                    NeuroPsi<span className="text-neuro-orange">EDU</span>
                  </span>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 rounded-xl text-slate-400 hover:text-white bg-white/5 border border-white/10 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex flex-col gap-6 mt-8">
                  {menuItems.map((item) => (
                    <a
                      key={item.label}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className="text-lg font-medium text-slate-300 hover:text-white transition-colors duration-200 py-1"
                    >
                      {item.label}
                    </a>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-4 pt-8 border-t border-white/10">
                <a
                  href="#investimento"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center py-3.5 px-6 rounded-xl font-semibold text-white bg-gradient-to-r from-neuro-orange to-orange-600 shadow-lg hover:shadow-orange-500/20 flex items-center justify-center gap-2"
                >
                  <span>Garantir Vaga</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
                <span className="text-center text-xs text-slate-500">
                  8ª Turma ANP · Vagas Limitadas
                </span>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
