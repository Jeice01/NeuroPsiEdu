export type RegistrationConfig = {
  endpoint: string; siteKey: string; termsVersion: string; privacyVersion: string;
  termsUrl: string; privacyUrl: string;
  checkoutEndpoint?: string;
  recoveryEnabled: boolean;
  turmaId?: string;
  sandbox?: boolean;
  registrationPath?: string;
};

export function registrationConfig(sandbox = false): RegistrationConfig | null {
  if ((sandbox ? process.env.NEXT_PUBLIC_CURSOS_SANDBOX_ENABLED : process.env.NEXT_PUBLIC_CURSOS_ENABLED) !== "true") return null;
  const turmaId = sandbox ? process.env.NEXT_PUBLIC_CURSOS_SANDBOX_TURMA_ID : undefined;
  if (sandbox && (!turmaId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(turmaId)
    || turmaId.toLowerCase() === "b43bce5c-7764-42a1-b361-5134c7b0370a")) return null;
  const config = {
    endpoint: process.env.NEXT_PUBLIC_CURSOS_FUNCTION_URL ?? "",
    siteKey: process.env.NEXT_PUBLIC_CURSOS_TURNSTILE_SITE_KEY ?? "",
    termsVersion: process.env.NEXT_PUBLIC_CURSOS_TERMS_VERSION ?? "",
    privacyVersion: process.env.NEXT_PUBLIC_CURSOS_PRIVACY_VERSION ?? "",
    termsUrl: process.env.NEXT_PUBLIC_CURSOS_TERMS_URL ?? "",
    privacyUrl: process.env.NEXT_PUBLIC_CURSOS_PRIVACY_URL ?? "",
  };
  if (Object.values(config).some((value) => !value.trim())) return null;
  if (config.endpoint !== "https://ydmvbssgiffqrmwigkae.supabase.co/functions/v1/cadastro-curso") return null;
  for (const link of [config.termsUrl, config.privacyUrl]) {
    try {
      const url = new URL(link);
      if (url.protocol !== "https:" || url.username || url.password || url.port || !["neuropsiedu.com.br", "www.neuropsiedu.com.br"].includes(url.hostname)) return null;
    } catch { return null; }
  }
  return { ...config, turmaId, sandbox, registrationPath: sandbox ? "/curso-zulliger/teste/" : "/curso-zulliger/inscricao/",
    recoveryEnabled: process.env.NEXT_PUBLIC_CURSOS_RECOVERY_ENABLED === "true",
    checkoutEndpoint: sandbox || process.env.NEXT_PUBLIC_CURSOS_CHECKOUT_SANDBOX_ENABLED === "true"
    ? "https://ydmvbssgiffqrmwigkae.supabase.co/functions/v1/checkout-curso" : undefined };
}
