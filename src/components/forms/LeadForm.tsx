"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

type FormData = {
  nome: string;
  telefone: string;
  email: string;
  curso: string;
};

type Errors = {
  nome?: string;
  telefone?: string;
  email?: string;
  curso?: string;
};

export function LeadForm() {
  const [telefone, setTelefone] = useState<string>("");
  const [errors, setErrors] = useState<Errors>({});
  const [globalError, setGlobalError] = useState<string>("");
  // CORREÇÃO: Adicionando o estado que faltava
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const validate = (data: FormData): Errors => {
    const newErrors: Errors = {};
    if (!data.nome.trim()) newErrors.nome = "Nome completo é obrigatório.";
    const phoneRegex = /^([0-9]{2})\s?([0-9]{9})$/;
    if (!phoneRegex.test(data.telefone))
      newErrors.telefone = "Telefone deve estar no formato: 61 996360647.";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[cC][oO][mM]$/;
    if (!emailRegex.test(data.email))
      newErrors.email = "E‑mail inválido (deve conter @ e terminar em .com).";
    if (!data.curso) newErrors.curso = "Selecione um curso (botão radio).";
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setGlobalError("");
    setStatus("idle");
    const form = e.currentTarget;
    const formData: FormData = {
      nome: (form.elements.namedItem("nome") as HTMLInputElement).value,
      telefone: telefone,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      curso: (form.elements.namedItem("curso") as HTMLInputElement).value,
    };

    const validationErrors = validate(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});

    try {
      setStatus("sending");
      const { error } = await supabase.from("tab_pos").insert([
        {
          nome: formData.nome,
          whatsapp: formData.telefone,
          email: formData.email,
          curso: formData.curso,
          status: "novo",
        },
      ]);

      if (error) throw error;
      setStatus("success");
      setTelefone("");
      form.reset();
    } catch (err: unknown) {
      console.error(err);
      setGlobalError(err instanceof Error ? err.message : "Falha ao enviar o lead.");
      setStatus("error");
    }
  };

  return (
    <section className="max-w-xl mx-auto p-6 bg-white/80 backdrop-blur-md rounded-lg glass-card">
      <h2 className="text-2xl font-bold text-neuro-blue mb-4">
        Garanta sua vaga na pós
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Nome completo */}
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="nome">
            Nome completo
          </label>
          <input
            id="nome"
            name="nome"
            type="text"
            required
            className="w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-neuro-orange"
            placeholder="Seu nome completo"
          />
          {errors.nome && (
            <p className="text-red-600 text-sm mt-1">{errors.nome}</p>
          )}
        </div>

        {/* Telefone */}
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="telefone">
            Telefone (ex.: 61 996360647)
          </label>
          <input
            id="telefone"
            name="telefone"
            type="tel"
            required
            className="w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-neuro-orange"
            placeholder="61 996360647"
            value={telefone}
            onChange={(e) => {
              const cleaned = e.target.value.replace(/[^0-9\s]/g, "");
              setTelefone(cleaned);
            }}
          />
          {errors.telefone && (
            <p className="text-red-600 text-sm mt-1">{errors.telefone}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="email">
            E‑mail
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-neuro-orange"
            placeholder="seu@email.com"
          />
          {errors.email && (
            <p className="text-red-600 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        {/* Curso – botões radio */}
        <fieldset className="space-y-2">
          <legend className="block text-sm font-medium mb-1">
            Escolha o curso (obrigatório)
          </legend>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-1">
              <input type="radio" name="curso" value="Pós‑Graduação 1" required />
              <span>Pós‑Graduação 1</span>
            </label>
            <label className="flex items-center gap-1">
              <input type="radio" name="curso" value="Pós‑Graduação 2" />
              <span>Pós‑Graduação 2</span>
            </label>
          </div>
          {errors.curso && (
            <p className="text-red-600 text-sm mt-1">{errors.curso}</p>
          )}
        </fieldset>

        {/* Mensagens globais */}
        {globalError && (
          <p className="text-red-600 text-sm font-medium">{globalError}</p>
        )}
        {status === "success" && (
          <p className="text-green-600 text-sm font-medium">
            🎉 Lead enviado com sucesso!
          </p>
        )}

        <button
          type="submit"
          disabled={status === "sending"}
          className="w-full bg-neuro-orange text-white py-2 rounded-lg hover:bg-neuro-orange/90 transition-colors disabled:opacity-50"
        >
          {status === "sending" ? "Enviando..." : "Enviar"}
        </button>
      </form>
    </section>
  );
}