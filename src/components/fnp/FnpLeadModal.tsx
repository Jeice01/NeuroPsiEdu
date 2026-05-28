"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2, AlertCircle, Loader2, ArrowRight, ShieldCheck } from "lucide-react";

// ─── Edge Function URL ───────────────────────────────────────────────────────
const EDGE_FN_URL =
  "https://avfzuudrjnglqrkyxwkz.supabase.co/functions/v1/create-lead-formacao";
// ─────────────────────────────────────────────────────────────────────────────

const PERFIS = [
  "Psicólogo(a)",
  "Neuropsicólogo(a)",
  "Estudante de Psicologia a partir do 8º período",
  "Outro",
];

const INTERESSES = [
  "Iniciar na Avaliação Neuropsicológica",
  "Ganhar mais segurança na prática clínica",
  "Aprender sobre testes, análise e laudos",
  "Desenvolver raciocínio clínico",
  "Quero informações sobre matrícula",
  "Outro",
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
  botaoOrigem: string;
}

interface FormState {
  nome: string;
  whatsapp: string;
  email: string;
  perfil: string;
  crp_ou_instituicao: string;
  cidade_estado: string;
  interesse_principal: string;
  mensagem: string;
  consentimento_contato: boolean;
}

const INITIAL_FORM: FormState = {
  nome: "",
  whatsapp: "",
  email: "",
  perfil: "",
  crp_ou_instituicao: "",
  cidade_estado: "",
  interesse_principal: "",
  mensagem: "",
  consentimento_contato: false,
};

function getUtms() {
  if (typeof window === "undefined") return {};
  const p = new URLSearchParams(window.location.search);
  return {
    utm_source: p.get("utm_source") ?? "",
    utm_medium: p.get("utm_medium") ?? "",
    utm_campaign: p.get("utm_campaign") ?? "",
    utm_content: p.get("utm_content") ?? "",
    utm_term: p.get("utm_term") ?? "",
  };
}

function normalizePhone(v: string) {
  return v.replace(/\D/g, "");
}

export function FnpLeadModal({ isOpen, onClose, botaoOrigem }: Props) {
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [apiError, setApiError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof FormState, string>>>({});

  // Reset ao abrir
  useEffect(() => {
    if (isOpen) {
      setForm(INITIAL_FORM);
      setLoading(false);
      setSuccess(false);
      setSuccessMessage("");
      setApiError("");
      setFieldErrors({});
    }
  }, [isOpen]);

  // Fecha com Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    if (isOpen) document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  // Trava scroll do body
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const set = (key: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const value = e.target.type === "checkbox"
        ? (e.target as HTMLInputElement).checked
        : e.target.value;
      setForm((prev) => ({ ...prev, [key]: value }));
      setFieldErrors((prev) => ({ ...prev, [key]: "" }));
    };

  const validate = (): boolean => {
    const errs: Partial<Record<keyof FormState, string>> = {};
    if (!form.nome.trim()) errs.nome = "Nome é obrigatório.";
    const digits = normalizePhone(form.whatsapp);
    if (digits.length < 10 || digits.length > 11) {
      errs.whatsapp = "Informe um WhatsApp válido com DDD (ex: 61 99999-9999).";
    }
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      errs.email = "Informe um e-mail válido.";
    }
    if (!form.consentimento_contato) {
      errs.consentimento_contato = "É necessário autorizar o contato para prosseguir.";
    }
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setApiError("");

    const payload = {
      nome: form.nome.trim(),
      whatsapp: normalizePhone(form.whatsapp),
      email: form.email.trim(),
      perfil: form.perfil || null,
      crp_ou_instituicao: form.crp_ou_instituicao.trim() || null,
      cidade_estado: form.cidade_estado.trim() || null,
      interesse_principal: form.interesse_principal || null,
      mensagem: form.mensagem.trim() || null,
      formacao_interesse: "8ª Turma FANP",
      pagina_origem: "https://neuropsiedu.com.br/fnp",
      botao_origem: botaoOrigem,
      consentimento_contato: true,
      ...getUtms(),
    };

    try {
      const res = await fetch(EDGE_FN_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({})) as { success?: boolean; message?: string; error?: string };

      if (!res.ok) {
        throw new Error(
          data.error || "Não foi possível enviar. Por favor, tente novamente."
        );
      }

      setSuccessMessage(
        data.message ||
        "Recebemos seus dados! Nossa equipe entrará em contato pelo WhatsApp com as informações da 8ª Turma FANP."
      );
      setSuccess(true);
    } catch (err: unknown) {
      setApiError(
        err instanceof Error
          ? err.message
          : "Erro inesperado. Tente novamente em instantes."
      );
    } finally {
      setLoading(false);
    }
  };

  const inputBase =
    "w-full bg-white/5 border rounded-xl py-3 px-4 text-white placeholder-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-neuro-orange/30 focus:border-neuro-orange/40 transition-all";
  const selectBase =
    "w-full bg-[#0d1e2e] border rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-neuro-orange/30 focus:border-neuro-orange/40 transition-all appearance-none";

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/85 backdrop-blur-md"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 24 }}
            transition={{ type: "spring", damping: 26, stiffness: 320 }}
            className="relative w-full max-w-2xl max-h-[92vh] flex flex-col rounded-3xl bg-[#0d1e2e] border border-white/10 shadow-[0_40px_80px_rgba(0,0,0,0.6)]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* ── Header ─────────────────────────────── */}
            <div className="flex-shrink-0 px-6 sm:px-8 pt-7 pb-5 border-b border-white/[0.07]">
              <button
                onClick={onClose}
                aria-label="Fechar"
                className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="pr-12">
                <span className="inline-block text-[10px] font-black text-neuro-orange uppercase tracking-[0.25em] mb-2">
                  8ª Turma FANP · Vagas Limitadas
                </span>
                <h2 className="font-display font-black text-xl sm:text-2xl text-white leading-tight">
                  Garanta sua vaga na 8ª Turma FANP
                </h2>
                <p className="text-slate-400 text-sm mt-2 leading-relaxed">
                  Preencha seus dados para receber as informações da Formação em Avaliação Clínica e Neuropsicológica. Nossa equipe entrará em contato pelo WhatsApp para orientar você sobre matrícula, investimento e próximos passos.
                </p>
              </div>
            </div>

            {/* ── Body (scrollável) ───────────────────── */}
            <div className="flex-1 overflow-y-auto px-6 sm:px-8 py-6">
              {success ? (
                /* ── Sucesso ── */
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
                      {successMessage}
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="mt-2 px-8 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-sm font-semibold border border-white/10 transition-colors"
                  >
                    Fechar
                  </button>
                </motion.div>
              ) : (
                /* ── Formulário ── */
                <form onSubmit={handleSubmit} noValidate className="space-y-5">

                  {/* Erro de API */}
                  {apiError && (
                    <div className="flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                      <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                      <p>{apiError}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                    {/* Nome */}
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                        Nome Completo <span className="text-neuro-orange">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Seu nome completo"
                        required
                        value={form.nome}
                        onChange={set("nome")}
                        className={`${inputBase} ${fieldErrors.nome ? "border-red-500/40" : "border-white/10"}`}
                      />
                      {fieldErrors.nome && (
                        <p className="mt-1 text-xs text-red-400">{fieldErrors.nome}</p>
                      )}
                    </div>

                    {/* WhatsApp */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                        WhatsApp <span className="text-neuro-orange">*</span>
                      </label>
                      <input
                        type="tel"
                        placeholder="(61) 99999-9999"
                        required
                        value={form.whatsapp}
                        onChange={set("whatsapp")}
                        className={`${inputBase} ${fieldErrors.whatsapp ? "border-red-500/40" : "border-white/10"}`}
                      />
                      {fieldErrors.whatsapp && (
                        <p className="mt-1 text-xs text-red-400">{fieldErrors.whatsapp}</p>
                      )}
                    </div>

                    {/* E-mail */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                        E-mail <span className="text-neuro-orange">*</span>
                      </label>
                      <input
                        type="email"
                        placeholder="seu@email.com"
                        required
                        value={form.email}
                        onChange={set("email")}
                        className={`${inputBase} ${fieldErrors.email ? "border-red-500/40" : "border-white/10"}`}
                      />
                      {fieldErrors.email && (
                        <p className="mt-1 text-xs text-red-400">{fieldErrors.email}</p>
                      )}
                    </div>

                    {/* Perfil */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                        Você é
                      </label>
                      <select
                        value={form.perfil}
                        onChange={set("perfil")}
                        className={`${selectBase} border-white/10`}
                      >
                        <option value="" className="bg-slate-900">Selecione...</option>
                        {PERFIS.map((p) => (
                          <option key={p} value={p} className="bg-slate-900">{p}</option>
                        ))}
                      </select>
                    </div>

                    {/* CRP / Instituição */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                        CRP ou Instituição de Ensino
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: CRP 01/12345 ou UnB"
                        value={form.crp_ou_instituicao}
                        onChange={set("crp_ou_instituicao")}
                        className={`${inputBase} border-white/10`}
                      />
                    </div>

                    {/* Cidade / Estado */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                        Cidade / Estado
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: Brasília / DF"
                        value={form.cidade_estado}
                        onChange={set("cidade_estado")}
                        className={`${inputBase} border-white/10`}
                      />
                    </div>

                    {/* Interesse Principal */}
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                        Principal interesse
                      </label>
                      <select
                        value={form.interesse_principal}
                        onChange={set("interesse_principal")}
                        className={`${selectBase} border-white/10`}
                      >
                        <option value="" className="bg-slate-900">Selecione...</option>
                        {INTERESSES.map((i) => (
                          <option key={i} value={i} className="bg-slate-900">{i}</option>
                        ))}
                      </select>
                    </div>

                    {/* Mensagem */}
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                        Mensagem ou dúvida
                      </label>
                      <textarea
                        placeholder="Alguma dúvida ou informação que queira nos passar?"
                        rows={3}
                        value={form.mensagem}
                        onChange={set("mensagem")}
                        className={`${inputBase} border-white/10 resize-none`}
                      />
                    </div>

                  </div>

                  {/* ── Consentimento LGPD ── */}
                  <div
                    className={`rounded-xl border p-4 transition-colors ${
                      fieldErrors.consentimento_contato
                        ? "border-red-500/30 bg-red-500/5"
                        : "border-white/10 bg-white/[0.02]"
                    }`}
                  >
                    <label className="flex items-start gap-3 cursor-pointer select-none">
                      {/* Custom checkbox */}
                      <div className="flex-shrink-0 mt-0.5" onClick={() => {
                        setForm((prev) => ({ ...prev, consentimento_contato: !prev.consentimento_contato }));
                        setFieldErrors((prev) => ({ ...prev, consentimento_contato: "" }));
                      }}>
                        <div
                          className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all cursor-pointer ${
                            form.consentimento_contato
                              ? "bg-neuro-orange border-neuro-orange"
                              : "bg-transparent border-white/25 hover:border-white/50"
                          }`}
                        >
                          {form.consentimento_contato && (
                            <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                              <path
                                d="M2 6l3 3 5-5"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          )}
                        </div>
                      </div>
                      <span className="text-xs text-slate-400 leading-relaxed">
                        Autorizo a NeuroPsiEdu a entrar em contato comigo por WhatsApp, telefone ou e-mail para
                        enviar informações sobre a 8ª Turma FANP — Formação em Avaliação Clínica e
                        Neuropsicológica.{" "}
                        <span className="text-neuro-orange font-bold">*</span>
                      </span>
                    </label>
                    {fieldErrors.consentimento_contato && (
                      <p className="mt-2 text-xs text-red-400 pl-8">
                        {fieldErrors.consentimento_contato}
                      </p>
                    )}
                  </div>

                  {/* ── Botão de envio ── */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 rounded-xl font-bold text-[15px] text-white bg-gradient-to-r from-neuro-orange to-orange-600 hover:from-orange-500 hover:to-orange-700 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300 shadow-[0_0_30px_rgba(242,140,40,0.2)] hover:shadow-[0_0_40px_rgba(242,140,40,0.35)] flex items-center justify-center gap-3 active:scale-[0.98]"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        Enviar meus dados e garantir atendimento
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>

                  {/* LGPD note */}
                  <div className="flex items-center justify-center gap-2 text-xs text-slate-600">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Dados protegidos conforme a LGPD. Não compartilhamos com terceiros.</span>
                  </div>

                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
