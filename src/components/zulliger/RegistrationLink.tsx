import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function RegistrationLink({ className, label = "Faça a sua inscrição" }: { className: string; label?: string }) {
  return <Link className={className} href="/curso-zulliger/inscricao/">{process.env.ZULLIGER_INFORMATION_ONLY === "true" ? "Inscrições em breve" : label} <ArrowRight size={18} aria-hidden="true" /></Link>;
}
