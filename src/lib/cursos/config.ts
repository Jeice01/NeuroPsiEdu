export type RegistrationConfig = {
  endpoint: string; siteKey: string; termsVersion: string; privacyVersion: string;
  termsUrl: string; privacyUrl: string;
  checkoutEndpoint?: string;
};

export function registrationConfig(): RegistrationConfig | null {
  if (process.env.NEXT_PUBLIC_CURSOS_ENABLED !== "true") return null;
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
      if (url.protocol !== "https:" || !["neuropsiedu.com.br", "www.neuropsiedu.com.br"].includes(url.hostname)) return null;
    } catch { return null; }
  }
  return { ...config, checkoutEndpoint: process.env.NEXT_PUBLIC_CURSOS_CHECKOUT_SANDBOX_ENABLED === "true"
    ? "https://ydmvbssgiffqrmwigkae.supabase.co/functions/v1/checkout-curso" : undefined };
}
