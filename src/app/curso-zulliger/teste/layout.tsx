import Link from "next/link";
import "../zulliger.css";
import "../inscricao/inscricao.css";

export default function SandboxLayout({ children }: { children: React.ReactNode }) {
  return <div className="z-page z-registration-page">
    <a className="z-skip" href="#conteudo">Pular para o conteúdo</a>
    <div className="z-preview-bar">SANDBOX · TESTES <span>Sem cobrança ou matrícula real</span></div>
    <header className="z-header"><div className="z-container z-nav">
      <Link href="/" aria-label="NeuroPsiEdu — início"><img src="/images/logo-vertical-300.webp" width="150" height="73" alt="NeuroPsiEdu" className="z-logo" /></Link>
      <Link href="/curso-zulliger/" className="z-text-link">Voltar ao curso</Link>
    </div></header>
    <main id="conteudo" tabIndex={-1} className="z-container z-registration-main z-result-main">
      {children}
    </main>
    <footer className="z-footer"><div className="z-container"><p>NeuroPsiEdu · Ambiente de testes</p></div></footer>
  </div>;
}
