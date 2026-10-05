import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { interestConfig } from "@/lib/cursos/interest";

export function RegistrationLink({ className, label = "Faça a sua inscrição" }: { className: string; label?: string }) {
  return <Link className={className} href="/curso-zulliger/inscricao/">{process.env.ZULLIGER_INFORMATION_ONLY === "true" ? interestConfig() ? "Entrar na lista de interesse" : "Inscrições em breve" : label} <ArrowRight size={18} aria-hidden="true" /></Link>;
}
