"use client";

export function AboutPlaceholder() {
  return (
    <section id="sobre" className="py-24 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
      <div className="container mx-auto px-6 max-w-7xl text-center">
        <h2 className="text-3xl font-display font-bold text-slate-900 dark:text-white mb-6">Sobre Nós</h2>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          [Placeholder] Seção dedicada a apresentar a clínica, os profissionais e a metodologia.
        </p>
      </div>
    </section>
  );
}

export function ServicesPlaceholder() {
  return (
    <section id="avaliacoes" className="py-24 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800">
      <div className="container mx-auto px-6 max-w-7xl text-center">
        <h2 className="text-3xl font-display font-bold text-slate-900 dark:text-white mb-6">Atendimentos</h2>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          [Placeholder] Detalhamento das avaliações infantis, adultos e idosos.
        </p>
      </div>
    </section>
  );
}

export function CoursesPlaceholder() {
  return (
    <section id="cursos" className="py-24 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
      <div className="container mx-auto px-6 max-w-7xl text-center">
        <h2 className="text-3xl font-display font-bold text-slate-900 dark:text-white mb-6">Capacitação Profissional</h2>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          [Placeholder] Lista de cursos, workshops e mentorias para profissionais da saúde.
        </p>
      </div>
    </section>
  );
}

export function FooterPlaceholder() {
  return (
    <footer className="py-12 bg-slate-900 text-slate-400 text-center text-sm border-t border-slate-800">
      <div className="container mx-auto px-6 max-w-7xl">
        <p>&copy; {new Date().getFullYear()} NeuroPsiEdu. Todos os direitos reservados.</p>
        <p className="mt-2">[Placeholder] Links do rodapé, redes sociais e informações de contato.</p>
      </div>
    </footer>
  );
}
