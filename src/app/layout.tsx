import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { FloatingWhatsAppButton } from "@/components/ui/FloatingWhatsAppButton";

export const metadata: Metadata = {
  title: "NeuroPsiEdu",
  description: "Excelência em Avaliação Neuropsicológica e Ensino",
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
              "@type": "MedicalClinic",
              "name": "NeuroPsiEdu",
              "description": "Avaliação neuropsicológica especializada infantil, adulto e idoso.",
              "url": "https://neuropsiedu.com.br",
              "logo": "https://neuropsiedu.com.br/images/logo-vertical.png",
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
            }),
          }}
        />

        {/* Google Tag Manager */}
        <Script
          id="gtm-head"
          strategy="afterInteractive"
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
