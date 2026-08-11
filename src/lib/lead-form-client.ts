import { captureUtms, parseLeadResponse } from "@/lib/lead-form";

export const LEAD_EDGE_FUNCTION_URL =
  "https://avfzuudrjnglqrkyxwkz.supabase.co/functions/v1/create-lead-formacao";

export type LeadPayload = Record<string, unknown>;
export type LeadAnalyticsEvent = {
  event: "lead_formacao";
  formacao: string;
  pagina: string;
  perfil: string;
  botao_origem: string;
  interesse_principal?: string;
};

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
  }
}

export function captureBrowserUtms() {
  return typeof window === "undefined" ? {} : captureUtms(window.location.search);
}

export function pushLeadEvent(event: LeadAnalyticsEvent) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(event);
}

export async function submitLead(
  payload: LeadPayload,
  fallbackSuccessMessage: string,
): Promise<string> {
  const response = await fetch(LEAD_EDGE_FUNCTION_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data: unknown = await response.json().catch(() => ({}));
  const result = parseLeadResponse(response.ok, data, fallbackSuccessMessage);
  if (!result.ok) throw new Error(result.message);
  return result.message;
}
