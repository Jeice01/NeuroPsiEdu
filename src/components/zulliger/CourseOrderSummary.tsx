import { zulligerCourse as course } from "@/data/zulliger";

export function CourseOrderSummary() {
  return (
    <div className="z-order-summary">
      <div className="z-order-brand">
        <img src="/images/logo-vertical-300.webp" width="150" height="73" alt="NeuroPsiEdu" />
        <span>INSCRIÇÃO INDIVIDUAL</span>
      </div>
      <h3>{course.subtitle} — {course.title}</h3>
      <p>Com {course.teacher} · 6, 7 e 8 de novembro de 2026</p>
      <dl>
        <div><dt>Quantidade</dt><dd>1 inscrição · 1 participante</dd></div>
        <div><dt>Formato</dt><dd>Abertura online e encontros presenciais em Águas Claras — DF</dd></div>
      </dl>
      <p className="z-order-note">Cada participante deve realizar seu próprio cadastro. A matrícula depende da confirmação do pagamento.</p>
    </div>
  );
}
