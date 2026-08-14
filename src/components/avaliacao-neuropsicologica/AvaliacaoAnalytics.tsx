"use client";

import { useEffect, type AnchorHTMLAttributes, type ReactNode } from "react";

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
  }
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
    track("view_avaliacao");

    const handleWhatsappClick = (event: MouseEvent) => {
      const link = (event.target as Element | null)?.closest<HTMLAnchorElement>(
        'a[href^="https://wa.me/"]'
      );

      if (link) {
        track("click_whatsapp_avaliacao", link.dataset.ctaOrigin || "global");
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
