"use client";

import { useState, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
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
        <nav className="hidden md:flex items-center gap-10">
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
        <div className="hidden md:flex items-center gap-8">
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
          className="md:hidden text-slate-600 dark:text-slate-300"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-slate-200 p-6 flex flex-col gap-6 shadow-xl"
        >
          <Link href="/#inicio" className="text-lg font-semibold text-neuro-blue/90 hover:text-neuro-orange transition-colors" onClick={() => setMobileMenuOpen(false)}>Início</Link>
          <Link href="/#atendimento" className="text-lg font-semibold text-neuro-blue/90 hover:text-neuro-orange transition-colors" onClick={() => setMobileMenuOpen(false)}>Atendimentos</Link>
          <Link href="/#cursos" className="text-lg font-semibold text-neuro-blue/90 hover:text-neuro-orange transition-colors" onClick={() => setMobileMenuOpen(false)}>Capacitação</Link>
          <Link href="/#sobre" className="text-lg font-semibold text-neuro-blue/90 hover:text-neuro-orange transition-colors" onClick={() => setMobileMenuOpen(false)}>Sobre Nós</Link>
          <Link href="/blog" className="text-lg font-semibold text-neuro-blue/90 hover:text-neuro-orange transition-colors" onClick={() => setMobileMenuOpen(false)}>Blog</Link>
          <hr className="border-slate-200" />
          <a href="https://academia.neuropsiedu.com.br/" className="flex items-center gap-2 text-lg font-bold text-neuro-orange" onClick={() => setMobileMenuOpen(false)}>
            <User className="w-5 h-5" />
            Área do Aluno
          </a>
          <a
            href="https://wa.me/5561982088284?text=Quero%20uma%20avalia%C3%A7%C3%A3o%2C%20pode%20me%20ajudar%3F"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-neuro-blue text-white text-center font-semibold shadow-md"
            onClick={() => setMobileMenuOpen(false)}
          >
            <CalendarHeart className="w-5 h-5" />
            Agendar Avaliação
          </a>
        </motion.div>
      )}
    </motion.header>
  );
}
