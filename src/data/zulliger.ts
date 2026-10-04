export const zulligerCourse = {
  title: "Técnica de Zulliger",
  subtitle: "Z-Teste Coletivo e Individual",
  priceCents: 60000,
  capacity: 15,
  certificateHours: 24,
  certificateDeadlineDays: 20,
  minimumAttendancePercent: 75,
  maximumInstallments: 10,
  address: "Edifício Connect Towers, QS 1, Rua 212, Bloco D, Sala 1129 (11º andar) — Águas Claras, Brasília – DF, CEP 71950-550",
  teacher: "Willian Santana",
  teacherRegistration: "CRP 01/24817",
} as const;


export const zulligerLearning = [
  { number: "01", title: "Conhecer a técnica", text: "Fundamentos do Z-Teste e sua contribuição para a avaliação da personalidade." },
  { number: "02", title: "Aplicar e tabular", text: "Administração individual e coletiva, tabulação e correção manual e informatizada." },
  { number: "03", title: "Interpretar e integrar", text: "Interpretação dos resultados e construção de uma síntese com raciocínio clínico." },
] as const;

export const zulligerSchedule = [
  { day: "06", month: "NOV", format: "ABERTURA ONLINE", title: "Fundamentos para começar", time: "Sexta-feira · início às 20h30", description: "Alinhamento conceitual e introdução às pranchas do Zulliger." },
  { day: "07", month: "NOV", format: "ENCONTRO PRESENCIAL", title: "Aplicação e tabulação, passo a passo", time: "Sábado · das 8h às 18h", description: "Aplicação prática, padronização dos procedimentos e tabulação passo a passo, com acompanhamento do professor." },
  { day: "08", month: "NOV", format: "ENCONTRO PRESENCIAL", title: "Dos dados ao raciocínio clínico", time: "Domingo · das 8h às 18h", description: "Raciocínio clínico, síntese dos dados e elaboração do laudo ou relatório, integrando os resultados da avaliação." },
] as const;

export const zulligerSupportLink = `https://wa.me/5561996436007?text=${encodeURIComponent("Olá! Tenho uma dúvida sobre o conteúdo ou formato da capacitação em Zulliger antes de me inscrever.")}`;

export const zulligerFaq = [
  { question: "Para quem é esta capacitação?", answer: "Para psicólogos e estudantes de Psicologia interessados na técnica de Zulliger. A participação no curso não substitui os requisitos legais e profissionais para uso de testes psicológicos." },
  { question: "Como será o certificado?", answer: "O certificado terá carga horária de 24 horas e será emitido em até 20 dias após o término do curso. Para obtê-lo, será necessária frequência mínima de 75% da carga horária do curso, equivalente a 18 horas, registrada pela organização." },
  { question: "Posso parcelar o investimento?", answer: "Sim. O valor-base é R$ 600,00, com parcelamento em até 10 vezes no cartão e juros por conta do comprador. O valor de cada parcela e o total com juros serão apresentados no checkout PagBank antes da confirmação." },
  { question: "O que acontece quando as vagas acabam?", answer: "A turma terá no máximo 15 participantes. Após o preenchimento, será disponibilizada uma lista de espera sem cobrança. O cadastro na lista não garante uma vaga." },
] as const;
