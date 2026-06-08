"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Loader2,
  ShieldCheck,
  X,
} from "lucide-react";

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
  }
}

const EDGE_FN_URL =
  "https://avfzuudrjnglqrkyxwkz.supabase.co/functions/v1/create-lead-formacao";

const PERFIS = [
  "Psicólogo(a)",
  "Estudante de Psicologia",
  "Profissional interessado(a) na área",
  "Outro",
];

const INTERESSES = [
  "Quero informações sobre matrícula",
  "Quero conhecer o conteúdo completo",
  "Tenho interesse na supervisão",
  "Quero entender como funciona o credenciamento",
  "Quero saber sobre investimento",
  "Outro",
];

type ManuseioArmaLeadModalProps = {
  isOpen: boolean;
  onClose: () => void;
  buttonOrigin: string;
};

type FormState = {
  nome: string;
  whatsapp: string;
  email: string;
  perfil: string;
  crp_ou_instituicao: string;
  cidade_estado: string;
  interesse_principal: string;
  mensagem: string;
  consentimento_contato: boolean;
};

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

const VALID_DDDS = new Set([
  "11","12","13","14","15","16","17","18","19",
  "21","22","24","27","28",
  "31","32","33","34","35","37","38",
  "41","42","43","44","45","46","47","48","49",
  "51","53","54","55",
  "61","62","63","64","65","66","67","68","69",
  "71","73","74","75","77","79",
  "81","82","83","84","85","86","87","88","89",
  "91","92","93","94","95","96","97","98","99",
]);

const BLOCKED_NUMBERS = new Set([
  "99999999999",
  "11111111111",
  "00000000000",
  "61999999999",
  "11999999999",
  "21999999999",
  "61900000000",
  "11900000000",
]);

function onlyDigits(value: string) {
  return value.replace(/\D/g, "");
}

function hasAllSameDigits(value: string): boolean {
  return /^(\d)\1+$/.test(value);
}

function validateFullName(value: string): boolean {
  const normalized = value.trim().replace(/\s+/g, " ");
  const parts = normalized.split(" ");

  if (normalized.length < 6) return false;
  if (parts.length < 2) return false;

  return parts.every((part) => part.length >= 2);
}

function validateBrazilianWhatsapp(value: string): boolean {
  const digits = onlyDigits(value);

  if (digits.length !== 11) return false;

  const ddd = digits.slice(0, 2);
  const mobileNumber = digits.slice(2);

  if (!VALID_DDDS.has(ddd)) return false;
  if (digits[2] !== "9") return false;
  if (hasAllSameDigits(digits)) return false;
  if (hasAllSameDigits(mobileNumber)) return false;
  if (BLOCKED_NUMBERS.has(digits)) return false;

  return true;
}

function formatWhatsapp(value: string): string {
  const digits = onlyDigits(value).slice(0, 11);

  if (digits.length <= 2) return digits;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;

  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

function getUtms() {
  if (typeof window === "undefined") return {};

  const params = new URLSearchParams(window.location.search);

  return {
    utm_source: params.get("utm_source") ?? "",
    utm_medium: params.get("utm_medium") ?? "",
    utm_campaign: params.get("utm_campaign") ?? "",
    utm_content: params.get("utm_content") ?? "",
    utm_term: params.get("utm_term") ?? "",
  };
}

export function ManuseioArmaLeadModal({
  isOpen,
  onClose,
  buttonOrigin,
}: ManuseioArmaLeadModalProps) {
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [apiError, setApiError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<keyof FormState, string>>
  >({});

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

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    if (isOpen) document.addEventListener("keydown", handler);

    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  function setField(key: keyof FormState) {
    return (
      event: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      const value =
        event.target.type === "checkbox"
          ? (event.target as HTMLInputElement).checked
          : event.target.value;

      setForm((prev) => ({ ...prev, [key]: value }));
      setFieldErrors((prev) => ({ ...prev, [key]: "" }));
    };
  }

  function validate(): boolean {
    const errors: Partial<Record<keyof FormState, string>> = {};

    if (!validateFullName(form.nome)) {
      errors.nome = "Informe seu nome completo, com nome e sobrenome.";
    }

    if (!validateBrazilianWhatsapp(form.whatsapp)) {
      errors.whatsapp =
        "Informe um WhatsApp válido com DDD. Exemplo: (61) 99999-9999.";
    }

    if (
      !form.email.trim() ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())
    ) {
      errors.email = "Informe um e-mail válido.";
    }

    if (!form.consentimento_contato) {
      errors.consentimento_contato =
        "É necessário autorizar o contato para prosseguir.";
    }

    setFieldErrors(errors);

    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (!validate()) return;

    setLoading(true);
    setApiError("");

    const payload = {
      nome: form.nome.trim().replace(/\s+/g, " "),
      whatsapp: onlyDigits(form.whatsapp),
      email: form.email.trim(),
      perfil: form.perfil || null,
      crp_ou_instituicao: form.crp_ou_instituicao.trim() || null,
      cidade_estado: form.cidade_estado.trim() || null,
      interesse_principal: form.interesse_principal || null,
      mensagem: form.mensagem.trim() || null,
      formacao_interesse:
        "Formação em Avaliação Psicológica para Manuseio de Arma de Fogo",
      pagina_origem:
        "https://neuropsiedu.com.br/formacao-manuseio-arma",
      botao_origem: buttonOrigin,
      consentimento_contato: true,
      ...getUtms(),
    };

    try {
      const response = await fetch(EDGE_FN_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = (await response.json().catch(() => ({}))) as {
        success?: boolean;
        message?: string;
        error?: string;
      };

      if (!response.ok) {
        throw new Error(
          data.error || "Não foi possível enviar. Por favor, tente novamente."
        );
      }

      setSuccessMessage(
        data.message ||
          "Recebemos seus dados! Nossa equipe entrará em contato pelo WhatsApp com todas as informações da Formação em Avaliação Psicológica para Manuseio de Arma de Fogo."
      );
      setSuccess(true);

      if (typeof window !== "undefined") {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          event: "lead_formacao_manuseio_arma",
          formacao_interesse:
            "Formação em Avaliação Psicológica para Manuseio de Arma de Fogo",
          botao_origem: buttonOrigin,
        });
      }
    } catch (error: unknown) {
      setApiError(
        error instanceof Error
          ? error.message
          : "Erro inesperado. Tente novamente em instantes."
      );
    } finally {
      setLoading(false);
    }
  }

  const inputBase =
    "w-full bg-white/5 border rounded-xl py-3 px-4 text-white placeholder-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-neuro-orange/30 focus:border-neuro-orange/40 transition-all";

  const selectBase =
    "w-full bg-[#0d1e2e] border rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-neuro-orange/30 focus:border-neuro-orange/40 transition-all appearance-none";

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/85 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 24 }}
            transition={{ type: "spring", damping: 26, stiffness: 320 }}
            className="relative w-full max-w-2xl max-h-[92vh] flex flex-col rounded-3xl bg-[#0d1e2e] border border-white/10 shadow-[0_40px_80px_rgba(0,0,0,0.6)]"
            onClick={(event) => event.stopPropagation()}
          >
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
                  Turma limitada a 10 participantes
                </span>

                <h2 className="font-display font-black text-xl sm:text-2xl text-white leading-tight">
                  Formação em Avaliação Psicológica para Manuseio de Arma de
                  Fogo
                </h2>

                <p className="text-slate-400 text-sm mt-2 leading-relaxed">
                  Preencha seus dados para receber as informações da formação.
                  Nossa equipe entrará em contato pelo WhatsApp para orientar
                  sobre matrícula, investimento, contrato e próximos passos.
                </p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 sm:px-8 py-6">
              {success ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-12 text-center gap-5"
                >
                  <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                    <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-white">
                      Recebemos seus dados!
                    </h3>

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
                <form onSubmit={handleSubmit} noValidate className="space-y-5">
                  {apiError && (
                    <div className="flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                      <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                      <p>{apiError}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                        Nome Completo <span className="text-neuro-orange">*</span>
                      </label>
                      <input
                        value={form.nome}
                        onChange={setField("nome")}
                        placeholder="Seu nome completo"
                        className={`${inputBase} ${
                          fieldErrors.nome
                            ? "border-red-500/50"
                            : "border-white/10"
                        }`}
                      />
                      {fieldErrors.nome && (
                        <p className="mt-1.5 text-xs text-red-400">
                          {fieldErrors.nome}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                        WhatsApp <span className="text-neuro-orange">*</span>
                      </label>
                      <input
                        value={form.whatsapp}
                        onChange={(event) => {
                          setForm((prev) => ({
                            ...prev,
                            whatsapp: formatWhatsapp(event.target.value),
                          }));
                          setFieldErrors((prev) => ({
                            ...prev,
                            whatsapp: "",
                          }));
                        }}
                        placeholder="(61) 99999-9999"
                        className={`${inputBase} ${
                          fieldErrors.whatsapp
                            ? "border-red-500/50"
                            : "border-white/10"
                        }`}
                      />
                      {fieldErrors.whatsapp && (
                        <p className="mt-1.5 text-xs text-red-400">
                          {fieldErrors.whatsapp}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                        E-mail <span className="text-neuro-orange">*</span>
                      </label>
                      <input
                        value={form.email}
                        onChange={setField("email")}
                        placeholder="seuemail@email.com"
                        className={`${inputBase} ${
                          fieldErrors.email
                            ? "border-red-500/50"
                            : "border-white/10"
                        }`}
                      />
                      {fieldErrors.email && (
                        <p className="mt-1.5 text-xs text-red-400">
                          {fieldErrors.email}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                        Perfil
                      </label>
                      <select
                        value={form.perfil}
                        onChange={setField("perfil")}
                        className={`${selectBase} border-white/10`}
                      >
                        <option value="">Selecione</option>
                        {PERFIS.map((perfil) => (
                          <option key={perfil} value={perfil}>
                            {perfil}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                        CRP ou Instituição
                      </label>
                      <input
                        value={form.crp_ou_instituicao}
                        onChange={setField("crp_ou_instituicao")}
                        placeholder="CRP ou instituição de ensino"
                        className={`${inputBase} border-white/10`}
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                        Cidade/Estado
                      </label>
                      <input
                        value={form.cidade_estado}
                        onChange={setField("cidade_estado")}
                        placeholder="Brasília/DF"
                        className={`${inputBase} border-white/10`}
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                        Principal interesse
                      </label>
                      <select
                        value={form.interesse_principal}
                        onChange={setField("interesse_principal")}
                        className={`${selectBase} border-white/10`}
                      >
                        <option value="">Selecione</option>
                        {INTERESSES.map((interesse) => (
                          <option key={interesse} value={interesse}>
                            {interesse}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                        Mensagem
                      </label>
                      <textarea
                        value={form.mensagem}
                        onChange={setField("mensagem")}
                        rows={3}
                        placeholder="Escreva sua dúvida, se desejar."
                        className={`${inputBase} border-white/10 resize-none`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="flex items-start gap-3 text-sm text-slate-400">
                      <input
                        type="checkbox"
                        checked={form.consentimento_contato}
                        onChange={setField("consentimento_contato")}
                        className="mt-1 h-4 w-4 rounded border-white/20 bg-white/5 accent-orange-500"
                      />
                      <span>
                        Autorizo a NeuroPsiEdu a entrar em contato pelo
                        WhatsApp e/ou e-mail para enviar informações sobre a
                        formação.
                      </span>
                    </label>

                    {fieldErrors.consentimento_contato && (
                      <p className="mt-1.5 text-xs text-red-400">
                        {fieldErrors.consentimento_contato}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="group w-full rounded-xl bg-gradient-to-r from-neuro-orange to-orange-600 px-8 py-4 text-base font-bold text-white shadow-[0_0_30px_rgba(242,140,40,0.3)] transition-all duration-300 hover:from-orange-500 hover:to-orange-700 disabled:cursor-not-allowed disabled:opacity-70 flex items-center justify-center gap-3"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        Quero receber informações
                        <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                      </>
                    )}
                  </button>

                  <div className="flex items-start gap-2 text-xs text-slate-500">
                    <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-orange-300" />
                    Seus dados serão usados apenas para contato sobre a formação.
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
