export type InterestConfig = { endpoint: string; siteKey: string };

export function interestConfig(): InterestConfig | null {
  if (process.env.NEXT_PUBLIC_CURSOS_INTERESSE_ENABLED !== "true") return null;
  const siteKey = process.env.NEXT_PUBLIC_CURSOS_TURNSTILE_SITE_KEY?.trim();
  if (!siteKey) return null;
  return { endpoint: "https://ydmvbssgiffqrmwigkae.supabase.co/functions/v1/interesse-curso", siteKey };
}

export function normalizeInterestPhone(value: string): string | null {
  const trimmed = value.trim();
  if (!/^[+\d\s().-]+$/.test(trimmed)) return null;
  const digits = trimmed.replace(/\D/g, "");
  if (trimmed.startsWith("+")) return /^[1-9]\d{9,14}$/.test(digits) ? `+${digits}` : null;
  return /^\d{10,11}$/.test(digits) ? `+55${digits}` : null;
}

export function validGroupInvite(value: unknown): value is string {
  return value === "https://chat.whatsapp.com/GX3998AXL59KQkrFNt6xPQ";
}
