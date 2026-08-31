"use client";

import { useEffect, type AnchorHTMLAttributes, type ReactNode } from "react";

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
    gtag?: (...args: unknown[]) => void;
  }
}

const GOOGLE_ADS_ID = "AW-18178022445";
const GOOGLE_ADS_WHATSAPP_EVENT = "ads_conversion_Pre_cadastro_1";

function configureGoogleAds() {
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function gtag() {
    // Google Tag uses the native arguments object as a dataLayer command.
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer?.push(arguments as unknown as Record<string, unknown>);
  };

  window.gtag("config", GOOGLE_ADS_ID);
}

function trackGoogleAdsWhatsappConversion() {
  window.gtag?.("event", GOOGLE_ADS_WHATSAPP_EVENT, {
    event_timeout: 2000,
  });
}

function track(event: "view_avaliacao" | "click_whatsapp_avaliacao", origin?: string) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event,
    page_path: "/avaliacao-neuropsicologica/",
    ...(origin ? { cta_origin: origin } : {}),
  });
}

export function AvaliacaoPageView() {
  useEffect(() => {
    configureGoogleAds();
    track("view_avaliacao");

    const handleWhatsappClick = (event: MouseEvent) => {
      const link = (event.target as Element | null)?.closest<HTMLAnchorElement>(
        'a[href^="https://wa.me/"]'
      );

      if (link) {
        track("click_whatsapp_avaliacao", link.dataset.ctaOrigin || "global");
        trackGoogleAdsWhatsappConversion();
      }
    };

    document.addEventListener("click", handleWhatsappClick);
    return () => document.removeEventListener("click", handleWhatsappClick);
  }, []);

  return null;
}

type WhatsappLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  children: ReactNode;
  href: string;
  origin: string;
};

export function AvaliacaoWhatsappLink({
  children,
  href,
  origin,
  ...props
}: WhatsappLinkProps) {
  return (
    <a
      {...props}
      href={href}
      data-cta-origin={origin}
    >
      {children}
    </a>
  );
}
