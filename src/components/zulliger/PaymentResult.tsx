"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { RegistrationConfig } from "@/lib/cursos/config";
import { existingContinuation, registrationRequest, type RegistrationStatus } from "@/lib/cursos/client";
import { RegistrationSummary } from "./RegistrationSummary";

export function PaymentResult({ config }: { config: RegistrationConfig | null }) {
  const [state, setState] = useState<{ status: RegistrationStatus; token: string } | null>(null);
  const [loading, setLoading] = useState(true), [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    const token = existingContinuation();
    if (!config || !token) { setLoading(false); return; }
    registrationRequest(config.endpoint, token).then(status => { if (active && status) setState({ status, token }); })
      .catch(() => { if (active) setError("Não foi possível consultar sua inscrição. Volte ao formulário para recuperar o acesso pelo e-mail."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [config]);
  return <section className="z-form-card" aria-labelledby="payment-result-title" data-clarity-mask="true">
    <h2 id="payment-result-title">Situação da inscrição</h2>
    <noscript><p>Ative o JavaScript para consultar sua inscrição ou entre em contato com a equipe.</p></noscript>
    {loading ? <p role="status">Consultando sua inscrição…</p> : state && config ?
      <RegistrationSummary status={state.status} token={state.token} config={config} onStatus={status => setState({ ...state, status })} /> :
      <><p role={error ? "alert" : undefined}>{error || "Recupere o acesso pelo e-mail do cadastro para consultar sua inscrição."}</p></>}
    <p className="z-form-help">Voltar do PagBank não confirma o pagamento. A situação acima depende da conferência pelo nosso sistema.</p>
    <Link className="z-text-link" href="/curso-zulliger/inscricao/">Voltar à inscrição / recuperar acesso</Link>
    <p><a href="mailto:contato@neuropsiedu.com.br">Precisa de ajuda? Fale com a equipe.</a></p>
  </section>;
}
