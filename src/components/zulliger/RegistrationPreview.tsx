"use client";

import { useRef, useState, type FormEvent } from "react";

export function RegistrationPreview() {
  const formRef = useRef<HTMLFormElement>(null);
  const [reviewed, setReviewed] = useState(false);

  function review(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault();
    if (formRef.current?.reportValidity()) setReviewed(true);
  }

  return (
    <section className="z-form-card" aria-labelledby="registration-title">
      <span className="z-eyebrow">SEUS DADOS</span>
      <h2 id="registration-title">Dados do participante</h2>
      <p id="preview-notice" className="z-form-notice">Demonstração: use dados fictícios. Nenhuma inscrição, reserva ou cobrança será realizada nesta prévia.</p>
      <form ref={formRef} onSubmit={review} onChange={() => setReviewed(false)} aria-describedby="preview-notice">
        <button type="submit" hidden disabled aria-hidden="true" tabIndex={-1} />
        <label htmlFor="z-name">Nome completo <span>(obrigatório)</span></label>
        <input id="z-name" name="name" autoComplete="name" required minLength={2} maxLength={120} placeholder="Como deve aparecer no certificado" />
        <label htmlFor="z-email">E-mail <span>(obrigatório)</span></label>
        <input id="z-email" name="email" type="email" autoComplete="email" required maxLength={254} placeholder="voce@exemplo.com" />
        <label htmlFor="z-phone">Telefone <span>(opcional)</span></label>
        <input id="z-phone" name="phone" type="tel" autoComplete="tel" maxLength={25} placeholder="DDD + telefone" />
        <fieldset>
          <legend>Você é <span>(obrigatório)</span></legend>
          <div className="z-radio-row">
            <label><input type="radio" name="profile" value="psychologist" required /> Psicólogo(a)</label>
            <label><input type="radio" name="profile" value="student" required /> Estudante de Psicologia</label>
          </div>
        </fieldset>
        <p className="z-form-help">Consulte a política de cancelamento e as informações de privacidade abaixo.</p>
        <div className="z-form-policies">
          <details id="cancelamento">
            <summary>Política de Reembolso e Cancelamento</summary>
            <p className="z-form-notice"><strong>Minuta para revisão:</strong> estas condições ainda não estão prontas para aceite contratual.</p>
            <p><strong>Direito de Arrependimento:</strong> Nas contratações online, será respeitado o prazo legal de 7 (sete) dias, observados o marco de contagem e as condições legais aplicáveis. Quando exercido esse direito, o reembolso será integral, sem desconto de taxa do cartão, multa ou custo administrativo. O início das aulas não implica renúncia automática a esse direito.</p>
            <p><strong>Desistência Antes do Início do Curso, fora do arrependimento legal:</strong> O valor pago relativo ao curso será devolvido. A eventual retenção da taxa de processamento do cartão ainda depende de confirmação documental de que o PagBank não a restitui, definição de critério e limite e validação jurídica. Até essa validação, não haverá desconto automático da taxa.</p>
            <p><strong>Desistência Após o Início do Curso, fora do arrependimento legal:</strong> Será devolvida a parcela do preço do curso correspondente às atividades ainda não prestadas na data e hora do pedido, com apresentação do cálculo. O critério proporcional será validado com o programa final de 24 horas. Não haverá desconto adicional de custos operacionais, multa, taxa administrativa ou taxa do cartão.</p>
            <p><strong>Cancelamento pela Organização:</strong> Caso o curso seja cancelado por decisão da organização, o reembolso será 100% integral.</p>
            <p><strong>Solicitações:</strong> Envie um e-mail com os dados da compra para <a href="mailto:contato@neuropsiedu.com.br">contato@neuropsiedu.com.br</a>.</p>
          </details>
          <details id="privacidade">
            <summary>Aviso de Privacidade e Tratamento de Dados</summary>
            <p className="z-eyebrow">Transparência e Suas Escolhas</p>
            <p>Os dados coletados neste formulário são utilizados estritamente para o processamento da sua inscrição, gestão do pagamento, envio de comunicações sobre o curso e emissão do certificado.</p>
          </details>
        </div>
        <fieldset aria-describedby="consent-note">
          <legend>Uso de Imagem e Comunicações (Opcional)</legend>
          <label className="z-checkbox"><input type="checkbox" name="image" defaultChecked={false} /> <span><strong>Autorizo o uso da minha imagem e voz</strong> em gravações, fotos e materiais do curso, exclusivamente para fins educacionais e de divulgação institucional nos canais da empresa.</span></label>
          <label className="z-checkbox"><input type="checkbox" name="marketing" defaultChecked={false} /> <span><strong>Aceito receber novidades</strong>, materiais educativos e lançamentos de cursos por e-mail ou WhatsApp.</span></label>
          <p id="consent-note" className="z-form-help">As autorizações acima são totalmente voluntárias. A não autorização <strong>não impede</strong> sua participação no curso nem a emissão do seu certificado. Você poderá revogar seu consentimento a qualquer momento enviando um e-mail para <a href="mailto:contato@neuropsiedu.com.br">contato@neuropsiedu.com.br</a>.</p>
        </fieldset>
        {/* A preview must never submit personal fields through a native GET fallback. */}
        <button type="button" className="z-button z-button-full" onClick={() => review()}>Conferir demonstração <span aria-hidden="true">→</span></button>
        <p className="z-form-help">O pagamento no PagBank será habilitado após a conclusão da integração.</p>
        <div role="status" aria-live="polite">
          {reviewed && <p className="z-preview-result">Conferência concluída nesta demonstração. Na versão final, o próximo passo será o checkout PagBank. Nenhum dado foi enviado e nenhuma vaga foi reservada.</p>}
        </div>
      </form>
    </section>
  );
}
