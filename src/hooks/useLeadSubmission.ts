"use client";

import { useCallback, useState } from "react";
import { LeadPayload, submitLead } from "@/lib/lead-form-client";

export function useLeadSubmission() {
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [turnstileResetKey, setTurnstileResetKey] = useState(0);
  const [captchaError, setCaptchaError] = useState("");

  const handleTurnstileToken = useCallback((token: string) => {
    setTurnstileToken(token);
    if (token) setCaptchaError("");
  }, []);

  const reset = useCallback(() => {
    setLoading(false);
    setApiError("");
    setHoneypot("");
    setTurnstileToken("");
    setTurnstileResetKey((value) => value + 1);
    setCaptchaError("");
  }, []);

  const submit = useCallback(async (
    payload: LeadPayload,
    fallbackSuccessMessage: string,
  ) => {
    setLoading(true);
    setApiError("");
    try {
      return await submitLead(payload, fallbackSuccessMessage);
    } catch (error: unknown) {
      setTurnstileToken("");
      setTurnstileResetKey((value) => value + 1);
      setApiError(error instanceof Error ? error.message : fallbackSuccessMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    apiError,
    setApiError,
    honeypot,
    setHoneypot,
    turnstileToken,
    handleTurnstileToken,
    turnstileResetKey,
    captchaError,
    setCaptchaError,
    reset,
    submit,
  };
}
