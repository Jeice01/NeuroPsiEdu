"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { TurnstileWidget } from "@/components/forms/TurnstileWidget";
import { normalizeInterestPhone, validGroupInvite, type InterestConfig } from "@/lib/cursos/interest";

export function InterestForm({ config }: { config: InterestConfig }) {
  const [challenge, setChallenge] = useState("");
  const [challengeKey, setChallengeKey] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [group, setGroup] = useState<string | null>(null);
  const success = useRef<HTMLHeadingElement>(null);

  useEffect(() => { if (saved) success.current?.focus(); }, [saved]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy || !challenge) return;
    setError("");
    const fields = new FormData(event.currentTarget);
    const phone = normalizeInterestPhone(String(fields.get("telefone") ?? ""));
    if (!phone) { setError("Informe um WhatsApp válido com DDD. Para números internacionais, inclua + e o código do país."); return; }
    const acceptsGroup = fields.get("grupo") === "on";
    setBusy(true);
    try {
      const response = await fetch(config.endpoint, {
        method: "POST", headers: { "Content-Type": "application/json" },
        signal: AbortSignal.timeout(15000), credentials: "omit", redirect: "error",
        body: JSON.stringify({
          nome: String(fields.get("nome") ?? ""), email: String(fields.get("email") ?? ""),
          telefone: phone, perfil: String(fields.get("perfil") ?? ""),
          pergunta: String(fields.get("pergunta") ?? ""), aceita_contato: fields.get("contato") === "on",
          aceita_grupo: acceptsGroup, website: String(fields.get("website") ?? ""), turnstile_token: challenge,
        }),
      });
      if (!response.ok) {
        setError(response.status === 429 ? "Muitas tentativas. Aguarde alguns minutos antes de tentar novamente."
          : "Não foi possível salvar seu interesse. Confira os dados e tente novamente. Se o problema continuar, fale com a equipe.");
        return;
      }
      const result: unknown = await response.json();
      if (response.status !== 202 || !result || typeof result !== "object" || !("status" in result)
        || result.status !== "interesse_recebido") throw new Error("Resposta inválida");
      setGroup(acceptsGroup && "grupo_url" in result && validGroupInvite(result.grupo_url) ? result.grupo_url : null);
      setSaved(true);
    } catch {
      setError("Não conseguimos confirmar o envio. Verifique sua conexão e tente novamente. Reenviar com o mesmo email não duplica o cadastro.");
    } finally {
      setBusy(false); setChallenge(""); setChallengeKey(key => key + 1);
    }
  }

  return <section className="z-form-card z-interest-card" aria-labelledby="interest-title">
    <p className="z-eyebrow">INSCRIÇÕES EM BREVE</p>
    {saved ? <>
      <h2 id="interest-title" ref={success} tabIndex={-1}>Interesse registrado!</h2>
      <p>Seu cadastro foi recebido. A equipe poderá entrar em contato sobre a abertura das inscrições e as informações do curso.</p>
      <p>Entrar na lista ou no grupo não reserva vaga, não confirma matrícula e não gera cobrança.</p>
      {group && <div className="z-interest-success">
        <h3>Participe do grupo do Zulliger</h3>
        <p>Clique no convite e confirme sua entrada no WhatsApp. Seu telefone poderá ficar visível aos participantes.</p>
        <a className="z-button" href={group} target="_blank" rel="noopener noreferrer">Entrar no grupo do WhatsApp <span aria-hidden="true">↗</span></a>
      </div>}
    </> : <>
      <h2 id="interest-title">Entre na lista de interesse</h2>
      <p>Receba informações sobre o curso e a abertura das inscrições. Este cadastro não reserva vaga e não gera cobrança.</p>
      <form onSubmit={submit} aria-busy={busy}>
        <fieldset disabled={busy}>
          <legend className="z-form-help">Os campos indicados como obrigatórios precisam ser preenchidos.</legend>
          <label htmlFor="interest-name">Nome completo (obrigatório)</label>
          <input id="interest-name" name="nome" autoComplete="name" required minLength={2} maxLength={120} />
          <label htmlFor="interest-email">Email (obrigatório)</label>
          <input id="interest-email" name="email" type="email" autoComplete="email" required maxLength={254} />
          <label htmlFor="interest-phone">WhatsApp com DDD (obrigatório)</label>
          <input id="interest-phone" name="telefone" type="tel" autoComplete="tel" required maxLength={30} aria-describedby="interest-phone-help" />
          <p id="interest-phone-help" className="z-form-help">Exemplo: 61 99999-0000. Fora do Brasil, inclua + e o código do país.</p>
          <fieldset className="z-interest-profile">
            <legend>Seu perfil (obrigatório)</legend>
            <label className="z-interest-choice"><input type="radio" name="perfil" value="psicologo" required /> Psicólogo(a)</label>
            <label className="z-interest-choice"><input type="radio" name="perfil" value="estudante" required /> Estudante de Psicologia</label>
          </fieldset>
          <label htmlFor="interest-question">Qual dúvida ou tema sobre o Zulliger você gostaria de abordar? (opcional)</label>
          <textarea id="interest-question" name="pergunta" rows={4} maxLength={1000} aria-describedby="interest-question-help" />
          <p id="interest-question-help" className="z-form-help">Até 1.000 caracteres. Não inclua dados de pacientes ou informações clínicas pessoais.</p>
          <div className="z-interest-honeypot" aria-hidden="true"><label htmlFor="interest-website">Site</label><input id="interest-website" name="website" tabIndex={-1} autoComplete="off" /></div>
          <div className="z-interest-privacy" id="interest-privacy">
            <h3>Como usamos seus dados</h3>
            <p>A NeuroPsiEdu usa seus dados para organizar a lista e entrar em contato sobre esta capacitação. A equipe e os responsáveis pelo curso poderão consultar a lista em uma planilha de acesso restrito. Para solicitar a exclusão dos seus dados ou cancelar os contatos, escreva para <a href="mailto:contato@neuropsiedu.com.br">contato@neuropsiedu.com.br</a>.</p>
          </div>
          <label className="z-interest-choice"><input type="checkbox" name="contato" required aria-describedby="interest-privacy" /> Autorizo o uso dos meus dados e o contato por email ou WhatsApp sobre o curso Zulliger (obrigatório).</label>
          <label className="z-interest-choice"><input type="checkbox" name="grupo" aria-describedby="interest-group-help" /> Quero participar do grupo do curso no WhatsApp (opcional).</label>
          <p id="interest-group-help" className="z-form-help">Após o cadastro, você receberá o convite na tela e decidirá se entra no grupo. Seu telefone poderá ficar visível aos demais participantes.</p>
        </fieldset>
        <TurnstileWidget key={challengeKey} siteKey={config.siteKey} action="interesse_curso" onTokenChange={setChallenge} />
        <p className="z-registration-error" role="alert">{error}</p>
        <button className="z-button z-button-full" type="submit" disabled={busy || !challenge}>{busy ? "Salvando seu interesse…" : "Quero receber as informações"}</button>
      </form>
    </>}
  </section>;
}
