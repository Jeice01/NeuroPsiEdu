"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { RegistrationConfig } from "@/lib/cursos/config";
import { existingContinuation, registrationRequest, type RegistrationStatus } from "@/lib/cursos/client";
import { RegistrationSummary } from "./RegistrationSummary";
import { zulligerSupportLink } from "@/data/zulliger";

export function PaymentResult({ config }: { config: RegistrationConfig | null }) {
  const [state, setState] = useState<{ status: RegistrationStatus; token: string } | null>(null);
  const [loading, setLoading] = useState(true), [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    const token = existingContinuation(config?.turmaId);
    if (!config || !token) { setLoading(false); return; }
    registrationRequest(config.endpoint, token).then(status => { if (active && status) setState({ status, token }); })
      .catch(() => { if (active) setError(config.recoveryEnabled
        ? "Não foi possível consultar sua inscrição. Volte ao formulário para recuperar o acesso pelo e-mail."
        : "Não foi possível consultar sua inscrição. Tente novamente ou fale com a equipe pelo WhatsApp."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [config]);
  return <section className="z-form-card" aria-labelledby="payment-result-title" data-clarity-mask="true">
    <h2 id="payment-result-title">Situação da inscrição</h2>
    <noscript><p>Ative o JavaScript para consultar sua inscrição ou entre em contato com a equipe.</p></noscript>
    {loading ? <p role="status">Consultando sua inscrição…</p> : state && config ?
      <RegistrationSummary status={state.status} token={state.token} config={config} onStatus={status => setState({ ...state, status })} /> :
      <><p role={error ? "alert" : undefined}>{error || (config?.recoveryEnabled
        ? "Recupere o acesso pelo e-mail do cadastro para consultar sua inscrição."
        : "Não há uma inscrição acessível nesta aba. A recuperação por e-mail ainda está indisponível; fale com a equipe pelo WhatsApp.")}</p></>}
    <p className="z-form-help">Voltar do PagBank não confirma o pagamento. A situação acima depende da conferência pelo nosso sistema.</p>
    <Link className="z-text-link" href={config?.registrationPath ?? "/curso-zulliger/inscricao/"}>{config?.recoveryEnabled ? "Voltar à inscrição / recuperar acesso" : "Voltar à inscrição"}</Link>
    <p><a href={zulligerSupportLink} target="_blank" rel="noopener noreferrer">Precisa de ajuda? Fale com a equipe pelo WhatsApp.</a></p>
  </section>;
}
