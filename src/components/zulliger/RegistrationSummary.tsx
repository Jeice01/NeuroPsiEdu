"use client";
import { useEffect, useRef, useState } from "react";
import type { RegistrationConfig } from "@/lib/cursos/config";
import { checkoutAttemptKey, checkoutRequest, registrationRequest, RegistrationError, resetCheckoutAttempt, type RegistrationStatus } from "@/lib/cursos/client";
import { CourseOrderSummary } from "./CourseOrderSummary";

const messages: Record<string, string> = {
  lead_capturado: "Cadastro recebido. Sua vaga será reservada ao continuar para o pagamento.",
  cadastro_sem_checkout: "Seu cadastro está salvo e ainda não houve início do pagamento. Você pode continuar abaixo.",
  checkout_iniciado: "Checkout iniciado. A matrícula será confirmada após a verificação do pagamento.",
  pagamento_pendente: "Estamos aguardando a confirmação do pagamento. Não faça um novo pagamento enquanto verificamos esta tentativa.",
  pagamento_em_analise: "O PagBank está analisando o pagamento. Sua matrícula ainda não está confirmada.",
  matricula_confirmada: "Sua matrícula está confirmada.",
  checkout_abandonado: "O checkout anterior expirou sem pagamento confirmado. Você pode tentar novamente, conforme a disponibilidade de vagas.",
  revisao_necessaria: "Sua inscrição precisa de conferência pela equipe. Não faça outro pagamento; entre em contato para acompanhar.",
  reembolsada: "Foi registrado um reembolso. Consulte a equipe para acompanhar sua inscrição.",
  cancelada: "Sua inscrição foi cancelada. Entre em contato com a equipe se precisar de ajuda.",
};
export function RegistrationSummary({ status, token, config, onStatus }: {
  status: RegistrationStatus; token: string; config: RegistrationConfig; onStatus: (status: RegistrationStatus) => void;
}) {
  const [busy, setBusy] = useState(false), [error, setError] = useState(""), [notice, setNotice] = useState("");
  const inFlight = useRef(false), attempt = useRef(""), feedback = useRef<HTMLParagraphElement>(null);
  const canPay = ["lead_capturado", "cadastro_sem_checkout", "checkout_abandonado", "checkout_iniciado", "expirado"].includes(status.etapa_funil);
  useEffect(() => { if (error) feedback.current?.focus(); }, [error]);
  useEffect(() => {
    if (["checkout_abandonado", "expirado"].includes(status.etapa_funil)) {
      resetCheckoutAttempt(); attempt.current = "";
    }
  }, [status.etapa_funil]);
  async function run(pay: boolean) {
    if (inFlight.current) return;
    inFlight.current = true; setBusy(true); setError(""); setNotice("");
    try {
      if (pay && config.checkoutEndpoint) {
        if (!attempt.current) attempt.current = checkoutAttemptKey();
        const url = await checkoutRequest(config.checkoutEndpoint, token, attempt.current);
        if (url) { window.location.assign(url); return; }
        setNotice("Estamos verificando a tentativa de pagamento. Aguarde e atualize a situação antes de tentar novamente.");
      } else {
        const current = await registrationRequest(config.endpoint, token);
        if (current) { onStatus(current); setNotice("Situação atualizada."); }
      }
    } catch (reason) {
      const code = reason instanceof RegistrationError ? reason.message : "";
      if (["nova_tentativa_necessaria", "pagamento_indisponivel"].includes(code)) { resetCheckoutAttempt(); attempt.current = ""; }
      setError(code === "vagas_esgotadas" ? "As vagas estão esgotadas. Nenhuma cobrança foi criada. Fale com a equipe sobre a lista de espera."
        : code === "oferta_alterada" ? "O valor da oferta mudou. Consulte a equipe antes de continuar."
        : reason instanceof RegistrationError && [401, 404].includes(reason.status) ? "Seu acesso expirou. Volte à inscrição e recupere o acesso pelo e-mail."
        : "Não foi possível concluir a consulta. Atualize a situação antes de tentar novamente. Se persistir, fale com a equipe.");
    } finally { inFlight.current = false; setBusy(false); }
  }
  return <div aria-busy={busy}>
    <CourseOrderSummary />
    <p role="status">{messages[status.etapa_funil] || "Consulte a equipe para acompanhar sua inscrição."}</p>
    <p className="z-registration-price"><span>Valor de 1 inscrição</span><strong>{new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(status.valor_centavos / 100)}</strong></p>
    {canPay && <><button type="button" className="z-button z-button-full" disabled={busy || !config.checkoutEndpoint} onClick={() => void run(true)}>{busy ? "Aguarde…" : "Ir para pagamento"}</button>
      <p className="z-form-help">{config.checkoutEndpoint ? "Ambiente de testes do PagBank. Não use dados reais de pagamento." : "Pagamento online ainda indisponível. Salvar o cadastro não reserva vaga."}</p></>}
    <button type="button" className="z-text-link" disabled={busy} onClick={() => void run(false)}>Atualizar situação</button>
    <p aria-live="polite">{notice}</p>
    <p ref={feedback} tabIndex={-1} role="alert" className="z-registration-error">{error}</p>
  </div>;
}
