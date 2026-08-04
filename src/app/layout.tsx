import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { FloatingWhatsAppButton } from "@/components/ui/FloatingWhatsAppButton";
import {
  absoluteUrl,
  DEFAULT_DESCRIPTION,
  DEFAULT_SOCIAL_IMAGE,
  SITE_NAME,
  SITE_URL,
} from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "NeuroPsiEdu | Avaliação Neuropsicológica e Formação",
    template: "%s | NeuroPsiEdu",
  },
  description: DEFAULT_DESCRIPTION,
  applicationName: SITE_NAME,
  alternates: { canonical: absoluteUrl("/") },
  openGraph: {
    title: "NeuroPsiEdu | Avaliação Neuropsicológica e Formação",
    description: DEFAULT_DESCRIPTION,
    url: absoluteUrl("/"),
    siteName: SITE_NAME,
    locale: "pt_BR",
    type: "website",
    images: [{ url: absoluteUrl(DEFAULT_SOCIAL_IMAGE), alt: SITE_NAME }],
  },
  twitter: {
    card: "summary_large_image",
    title: "NeuroPsiEdu | Avaliação Neuropsicológica e Formação",
    description: DEFAULT_DESCRIPTION,
    images: [absoluteUrl(DEFAULT_SOCIAL_IMAGE)],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="scroll-smooth">
      <head>
        <link
          rel="preload"
          href="/fonts/inter-latin.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/outfit-latin.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        {/* Cookiebot — deve ser o primeiro script do <head> */}
        <Script
          id="Cookiebot"
          src="https://consent.cookiebot.com/uc.js"
          data-cbid="bb101498-b476-4898-bc7d-7917299af0af"
          data-blockingmode="auto"
          type="text/javascript"
          strategy="beforeInteractive"
        />

        {/* Structured Data — Local Business / Medical Clinic */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": ["MedicalClinic", "LocalBusiness"],
                  "@id": "https://neuropsiedu.com.br/#clinic",
                  "name": "NeuroPsiEdu",
                  "description": "Avaliação neuropsicológica especializada infantil, adulto e idoso.",
                  "url": "https://neuropsiedu.com.br",
                  "logo": "https://neuropsiedu.com.br/images/logo-vertical-600.webp",
                  "image": "https://neuropsiedu.com.br/images/logo-vertical-600.webp",
                  "email": "contato@neuropsiedu.com.br",
                  "telephone": "+55-61-98208-8284",
                  "sameAs": ["https://www.instagram.com/academiadaneuropsicologia"],
                  "address": {
                    "@type": "PostalAddress",
                    "streetAddress": "Ed. Conect Towers - QS 1 BLOCO D, 11º andar - Sala 1129",
                    "addressLocality": "Águas Claras, Brasília",
                    "addressRegion": "DF",
                    "addressCountry": "BR"
                  },
                  "contactPoint": {
                    "@type": "ContactPoint",
                    "telephone": "+55-61-98208-8284",
                    "contactType": "Atendimento"
                  }
                },
                {
                  "@type": "WebSite",
                  "@id": "https://neuropsiedu.com.br/#website",
                  "url": "https://neuropsiedu.com.br/",
                  "name": "NeuroPsiEdu",
                  "inLanguage": "pt-BR"
                }
              ]
            }),
          }}
        />

        {/* Google Tag Manager */}
        <Script
          id="gtm-head"
              strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-54TNTKLF');`,
          }}
        />
      </head>
      <body className="antialiased">
        {/* Google Tag Manager (noscript fallback) */}
        <noscript
          dangerouslySetInnerHTML={{
            __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-54TNTKLF" height="0" width="0" style="display:none;visibility:hidden"></iframe>`,
          }}
        />
        {children}
        <FloatingWhatsAppButton />
      </body>
    </html>
  );
}
