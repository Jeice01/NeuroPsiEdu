"use client";

import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { TurnstileWidget } from "@/components/forms/TurnstileWidget";
import { RegistrationSummary } from "./RegistrationSummary";
import type { RegistrationConfig } from "@/lib/cursos/config";
import { zulligerSupportLink } from "@/data/zulliger";
import { clearContinuation, continuationToken, existingContinuation, registrationRequest, RegistrationError, TURMA_ID, type RegistrationStatus } from "@/lib/cursos/client";

export function RegistrationForm({ config }: { config: RegistrationConfig }) {
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [challenge, setChallenge] = useState("");
  const [challengeKey, setChallengeKey] = useState(0);
  const [error, setError] = useState("");
  const [status, setStatus] = useState<RegistrationStatus | null>(null);
  const [recovery, setRecovery] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [email, setEmail] = useState("");
  const [frozen, setFrozen] = useState(false);
  const token = useRef("");
  const restoreToken = useRef<string | null>(null);
  const inFlight = useRef(false);
  const attempted = useRef<Record<string, unknown> | null>(null);
  const feedback = useRef<HTMLParagraphElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const onChallenge = useCallback((value: string) => setChallenge(value), []);

  useEffect(() => {
    let active = true;
    if (!token.current) {
      restoreToken.current = existingContinuation(config?.turmaId);
      token.current = restoreToken.current || continuationToken(config?.turmaId);
    }
    const previous = restoreToken.current;
    if (!previous) { setReady(true); return; }
    registrationRequest(config.endpoint, previous).then((saved) => { if (active) setStatus(saved); })
      .catch((reason) => {
        if (active && !(reason instanceof RegistrationError && reason.status === 404)) {
          setError(config.recoveryEnabled
            ? "Não foi possível consultar seu cadastro. Tente novamente ou recupere o acesso pelo e-mail."
            : "Não foi possível consultar seu cadastro. Tente novamente ou fale com a equipe.");
        }
      })
      .finally(() => { if (active) setReady(true); });
    return () => { active = false; };
  }, [config.endpoint, config.recoveryEnabled, config.turmaId]);
  useEffect(() => { if (error) feedback.current?.focus(); }, [error]);
  useEffect(() => { if (status || recovery) heading.current?.focus(); }, [status, recovery]);

  async function checkSaved() {
    const saved = await registrationRequest(config.endpoint, token.current);
    setStatus(saved);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inFlight.current) return;
    if (!challenge) { setError("Conclua a verificação de segurança antes de continuar."); return; }
    const fields = new FormData(event.currentTarget);
    inFlight.current = true; setBusy(true); setError("");
    try {
      if (recovery) {
        const recoveryEmail = String(fields.get("email") ?? email).trim().toLowerCase();
        setEmail(recoveryEmail);
        await registrationRequest(config.endpoint, token.current, {
          action: codeSent ? "validar_codigo" : "solicitar_codigo", email: recoveryEmail,
          turma_id: config.turmaId ?? TURMA_ID, turnstile_token: challenge,
          ...(codeSent ? { codigo: String(fields.get("codigo")) } : {}),
        });
        if (codeSent) {
          try { await checkSaved(); }
          catch (reason) {
            if (reason instanceof RegistrationError && reason.status === 404) {
              setError("Não foi possível localizar uma inscrição acessível nesta turma. Fale com a equipe para continuar.");
            } else throw reason;
          }
        } else setCodeSent(true);
      } else {
        if (!attempted.current) {
          let phone = String(fields.get("telefone")).replace(/[ ()-]/g, "");
          if (/^\d{10,11}$/.test(phone)) phone = `+55${phone}`;
          attempted.current = {
            turma_id: config.turmaId ?? TURMA_ID, nome: String(fields.get("nome")), email: String(fields.get("email")), telefone: phone,
            aceita_termos: fields.get("termos") === "on", aceita_imagem: fields.get("imagem") === "on",
            aceita_marketing: fields.get("marketing") === "on", termo_versao: config.termsVersion,
            aviso_privacidade_versao: config.privacyVersion,
          };
          setEmail(String(attempted.current.email));
        }
        setFrozen(true);
        await registrationRequest(config.endpoint, token.current, { ...attempted.current, turnstile_token: challenge });
        try { await checkSaved(); }
        catch (reason) {
          if (reason instanceof RegistrationError && reason.status === 404) {
            if (config.recoveryEnabled) setRecovery(true);
            else setError("Não foi possível acessar uma inscrição com esta autorização. A recuperação por e-mail ainda está indisponível. Fale com a equipe para continuar.");
          }
          else throw reason;
        }
      }
    } catch (reason) {
      const code = reason instanceof RegistrationError ? reason.message : "";
      if (!recovery && reason instanceof RegistrationError && [400, 409, 413, 415].includes(reason.status) && code !== "reenvio_divergente") {
        attempted.current = null; setFrozen(false);
      }
      setError(code === "codigo_invalido" ? "Código inválido ou expirado. Confira o código ou solicite outro."
        : reason instanceof RegistrationError && reason.status === 429 ? "Muitas tentativas. Aguarde 15 minutos e tente novamente."
        : code === "dados_invalidos" ? "Confira os dados e o telefone com DDD antes de tentar novamente."
        : code === "termos_desatualizados" ? "Os termos foram atualizados. Recarregue a página antes de continuar."
        : "Não foi possível concluir. Seus dados permanecem nesta página. Tente novamente ou fale com a equipe.");
    } finally {
      inFlight.current = false; setBusy(false); setChallenge(""); setChallengeKey((value) => value + 1);
    }
  }

  return <section className="z-form-card" aria-labelledby="registration-title" data-clarity-mask="true">
    <span className="z-eyebrow">{status ? "RESUMO" : recovery ? "RECUPERAR ACESSO" : "SEUS DADOS"}</span>
    <h2 id="registration-title" ref={heading} tabIndex={-1}>{status ? "Situação da inscrição" : recovery ? "Continue com seu e-mail" : "Dados do participante"}</h2>
    <noscript><p>Ative o JavaScript para enviar o formulário com segurança ou entre em contato com a equipe.</p></noscript>
    {status ? <>
      <RegistrationSummary status={status} token={token.current} config={config} onStatus={setStatus} />
      <button type="button" className="z-text-link" onClick={() => {
        clearContinuation(config?.turmaId); token.current = continuationToken(config?.turmaId); restoreToken.current = null;
        attempted.current = null; setFrozen(false); setStatus(null); setRecovery(config.recoveryEnabled);
        setCodeSent(false); setEmail(""); setError("");
      }}>Encerrar acesso neste navegador</button>
    </> : <form method="post" onSubmit={submit} aria-busy={busy}>
      {recovery ? <fieldset disabled={!ready || busy}>
        <legend>{codeSent ? "Código de acesso" : "Confirme a posse do e-mail"}</legend>
        <p className="z-form-help">Use o e-mail informado no cadastro. Esta etapa não altera seus dados nem cria uma reserva.</p>
        <label htmlFor="z-recovery-email">E-mail do cadastro (obrigatório)</label>
        <input id="z-recovery-email" name="email" type="email" autoComplete="email" required maxLength={254} value={email} readOnly={codeSent} onChange={(event) => setEmail(event.target.value)} />
        {codeSent && <><p role="status">Solicitação recebida. Confira sua caixa de entrada e a pasta de spam.</p><label htmlFor="z-code">Código de oito dígitos</label><input id="z-code" name="codigo" autoComplete="one-time-code" inputMode="numeric" pattern="[0-9]{8}" minLength={8} maxLength={8} required /></>}
      </fieldset> : <fieldset disabled={!ready || busy || frozen}>
        <legend className="z-form-help">Preencha seus dados para salvar o cadastro. Isso ainda não reserva vaga.</legend>
        <label htmlFor="z-name">Nome completo (obrigatório)</label><input id="z-name" name="nome" autoComplete="name" required minLength={2} maxLength={120} />
        <label htmlFor="z-email">E-mail (obrigatório)</label><input id="z-email" name="email" type="email" autoComplete="email" required maxLength={254} />
        <label htmlFor="z-phone">Telefone com DDD (obrigatório)</label><input id="z-phone" name="telefone" type="tel" autoComplete="tel" required minLength={10} maxLength={25} aria-describedby="phone-help" /><p id="phone-help" className="z-form-help">No Brasil, informe DDD e número. Para outro país, inclua + e o código do país.</p>
        <label className="z-checkbox"><input name="termos" type="checkbox" required /><span>Li e aceito os <a href={config.termsUrl} target="_blank" rel="noopener noreferrer">termos do curso</a> e li o <a href={config.privacyUrl} target="_blank" rel="noopener noreferrer">aviso de privacidade</a>.</span></label>
        {!config.sandbox && <><label className="z-checkbox"><input name="imagem" type="checkbox" /><span>Autorizo uso de imagem e voz conforme os termos (opcional).</span></label>
        <label className="z-checkbox"><input name="marketing" type="checkbox" /><span>Aceito receber novidades por e-mail ou WhatsApp (opcional).</span></label>
        <p className="z-form-help">As autorizações opcionais não impedem a inscrição.</p></>}
      </fieldset>}
      <TurnstileWidget key={challengeKey} siteKey={config.siteKey} action="cadastro_curso" onTokenChange={onChallenge} />
      <p ref={feedback} tabIndex={-1} role="alert" className="z-registration-error">{error}</p>
      <button type="submit" className="z-button z-button-full" disabled={!ready || busy}>{busy ? "Aguarde…" : recovery ? codeSent ? "Validar código" : "Enviar código de acesso" : frozen ? "Tentar novamente" : "Salvar e continuar"}</button>
      {recovery && codeSent && <button type="button" className="z-text-link" disabled={busy} onClick={() => { setCodeSent(false); setError(""); }}>Solicitar outro código ou corrigir e-mail</button>}
      {recovery && <button type="button" className="z-text-link" disabled={busy} onClick={() => {
        clearContinuation(config?.turmaId); token.current = continuationToken(config?.turmaId); restoreToken.current = null;
        attempted.current = null; setFrozen(false); setRecovery(false); setCodeSent(false); setError("");
      }}>Voltar ao cadastro</button>}
      {!recovery && config.recoveryEnabled && <button type="button" className="z-text-link" disabled={!ready || busy} onClick={() => { clearContinuation(config?.turmaId); token.current = continuationToken(config?.turmaId); setRecovery(true); setError(""); }}>Já me cadastrei / recuperar acesso</button>}
      {!config.recoveryEnabled && <p className="z-form-help">A recuperação por e-mail ainda está indisponível. Para retomar um cadastro sem acesso neste navegador, fale com a equipe.</p>}
    </form>}
    <p className="z-form-help"><a href={zulligerSupportLink} target="_blank" rel="noopener noreferrer">Precisa de ajuda? Fale com a equipe pelo WhatsApp.</a></p>
  </section>;
}
