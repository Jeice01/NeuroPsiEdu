import assert from "node:assert/strict";
import test from "node:test";
import {
  FORMATIONS,
  captureUtms,
  formatWhatsapp,
  limitText,
  normalizeEmail,
  normalizeText,
  onlyDigits,
  parseLeadResponse,
  validateBrazilianWhatsapp,
  validateEmail,
  validateFullName,
} from "../src/lib/lead-form.ts";

test("normaliza e valida nome completo", () => {
  assert.equal(normalizeText("  Maria   Silva "), "Maria Silva");
  assert.equal(validateFullName("Maria Silva"), true);
  assert.equal(validateFullName("Maria"), false);
  assert.equal(validateFullName("A Silva"), false);
});

test("normaliza e valida e-mail sem restringir o domínio", () => {
  assert.equal(normalizeEmail(" JEICE@EXEMPLO.COM.BR "), "jeice@exemplo.com.br");
  assert.equal(validateEmail("pessoa+curso@exemplo.org"), true);
  assert.equal(validateEmail("email-invalido"), false);
  assert.equal(validateEmail(`${"a".repeat(250)}@x.com`), false);
});

test("valida, normaliza e formata WhatsApp brasileiro", () => {
  assert.equal(onlyDigits("(61) 99876-5432"), "61998765432");
  assert.equal(validateBrazilianWhatsapp("(61) 99876-5432"), true);
  assert.equal(validateBrazilianWhatsapp("(10) 99876-5432"), false);
  assert.equal(validateBrazilianWhatsapp("(61) 99999-9999"), false);
  assert.equal(validateBrazilianWhatsapp("(61) 89876-5432"), false);
  assert.equal(formatWhatsapp("61998765432"), "(61) 99876-5432");
});

test("normaliza e limita textos opcionais", () => {
  assert.equal(limitText("  texto   de teste  ", 8), "texto de");
  assert.equal(limitText("   ", 20), null);
});

test("captura UTMs conhecidas e aplica seus limites", () => {
  const utms = captureUtms("?utm_source=Google&utm_campaign=Curso%20FANP&utm_term=teste");
  assert.deepEqual(utms, {
    utm_source: "Google",
    utm_medium: "",
    utm_campaign: "Curso FANP",
    utm_content: "",
    utm_term: "teste",
  });
});

test("mapeia as duas formações e suas mensagens", () => {
  assert.equal(FORMATIONS.fanp.name, "8ª Turma FANP");
  assert.equal(FORMATIONS.fanp.page, "https://neuropsiedu.com.br/fnp");
  assert.match(FORMATIONS.famaf.successMessage, /Manuseio de Arma de Fogo/);
});

test("interpreta sucesso, erro da API e resposta inesperada", () => {
  assert.deepEqual(parseLeadResponse(false, { error: "CAPTCHA inválido" }, "ok"), {
    ok: false,
    message: "CAPTCHA inválido",
  });
  assert.deepEqual(parseLeadResponse(true, {}, "ok"), {
    ok: false,
    message: "A resposta do servidor não confirmou o envio.",
  });
  assert.deepEqual(parseLeadResponse(true, { success: true }, "mensagem padrão"), {
    ok: true,
    message: "mensagem padrão",
  });
});
