"use client";

import { useState, useEffect } from "react";
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import { Menu, X, User, CalendarHeart } from "lucide-react";
import Link from "next/link";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navControls = useAnimation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    navControls.set({ y: -100 });
    navControls.start({ y: 0, transition: { duration: 0.5, ease: "easeOut" } });
  }, [navControls]);

  return (
    <motion.header
      animate={navControls}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm py-4"
          : "bg-transparent py-6"
      }`}
    >
      <div className="container mx-auto px-4 xs:px-6 md:px-12 lg:px-16 max-w-screen-2xl flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center group">
          <div className="relative transition-transform group-hover:scale-[1.02]">
            <img 
              src="/images/logo-vertical.png" 
              alt="NeuroPsiEdu Logo" 
              className="h-[34px] md:h-[40px] lg:h-[48px] w-auto object-contain"
            />
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-10">
          <Link href="/#inicio" className="text-[15px] font-bold text-neuro-blue hover:text-neuro-orange transition-colors duration-200">
            Início
          </Link>
          <Link href="/#atendimento" className="text-[15px] font-bold text-neuro-blue hover:text-neuro-orange transition-colors duration-200">
            Atendimentos
          </Link>
          <Link href="/#cursos" className="text-[15px] font-bold text-neuro-blue hover:text-neuro-orange transition-colors duration-200">
            Capacitação
          </Link>
          <Link href="/#sobre" className="text-[15px] font-bold text-neuro-blue hover:text-neuro-orange transition-colors duration-200">
            Sobre Nós
          </Link>
          <Link href="/blog" className="text-[15px] font-bold text-neuro-blue hover:text-neuro-orange transition-colors duration-200">
            Blog
          </Link>
        </nav>

        {/* Action Button */}
        <div className="hidden lg:flex items-center gap-8">
          <a
            href="https://academia.neuropsiedu.com.br/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-[15px] font-bold text-neuro-orange hover:opacity-80 transition-all"
          >
            <User className="w-5 h-5 fill-current" />
            <span>Área do Aluno</span>
          </a>
          <a
            href="https://wa.me/5561982088284?text=Quero%20uma%20avalia%C3%A7%C3%A3o%2C%20pode%20me%20ajudar%3F"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 px-6 py-3 rounded-xl bg-neuro-blue text-white font-bold text-[14px] hover:bg-neuro-blue-dark transition-all shadow-[0_10px_20px_-5px_rgba(28,69,104,0.3)]"
          >
            <CalendarHeart className="w-4 h-4" />
            Agendar Avaliação
          </a>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="lg:hidden text-slate-600 dark:text-slate-300 cursor-pointer"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden fixed inset-0 bg-[#0a1e30] z-40"
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3, ease: "easeInOut" }}
              className="lg:hidden fixed top-0 right-0 bottom-0 w-[280px] xs:w-[320px] bg-white z-50 shadow-2xl p-6 flex flex-col gap-6"
            >
              {/* Header with close button */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <img 
                  src="/images/logo-vertical.png" 
                  alt="NeuroPsiEdu Logo" 
                  className="h-[30px] w-auto object-contain" 
                />
                <button 
                  onClick={() => setMobileMenuOpen(false)} 
                  className="text-slate-600 hover:text-neuro-orange transition-colors cursor-pointer"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Links */}
              <nav className="flex flex-col gap-5 mt-4">
                <Link href="/#inicio" className="text-base font-bold text-neuro-blue hover:text-neuro-orange transition-colors" onClick={() => setMobileMenuOpen(false)}>Início</Link>
                <Link href="/#atendimento" className="text-base font-bold text-neuro-blue hover:text-neuro-orange transition-colors" onClick={() => setMobileMenuOpen(false)}>Atendimentos</Link>
                <Link href="/#cursos" className="text-base font-bold text-neuro-blue hover:text-neuro-orange transition-colors" onClick={() => setMobileMenuOpen(false)}>Capacitação</Link>
                <Link href="/#sobre" className="text-base font-bold text-neuro-blue hover:text-neuro-orange transition-colors" onClick={() => setMobileMenuOpen(false)}>Sobre Nós</Link>
                <Link href="/blog" className="text-base font-bold text-neuro-blue hover:text-neuro-orange transition-colors" onClick={() => setMobileMenuOpen(false)}>Blog</Link>
              </nav>

              <hr className="border-slate-100 my-2" />

              {/* Actions */}
              <div className="flex flex-col gap-4 mt-auto">
                <a
                  href="https://academia.neuropsiedu.com.br/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-neuro-orange/10 border-2 border-neuro-orange text-neuro-orange font-bold text-sm hover:bg-neuro-orange hover:text-white transition-all duration-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <User className="w-5 h-5 fill-current" />
                  <span>Área do Aluno</span>
                </a>
                <a
                  href="https://wa.me/5561982088284?text=Quero%20uma%20avalia%C3%A7%C3%A3o%2C%20pode%20me%20ajudar%3F"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2.5 w-full py-3.5 rounded-xl bg-neuro-blue text-white font-bold text-sm hover:bg-neuro-blue-dark transition-all shadow-[0_10px_20px_-5px_rgba(28,69,104,0.3)]"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <CalendarHeart className="w-4 h-4" />
                  Agendar Avaliação
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
