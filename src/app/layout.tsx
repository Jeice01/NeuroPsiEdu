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

        {/* Google Analytics */}
        <Script
          id="gtag-js"
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-CQDBDNJ5XH"
        />
        <Script
          id="gtag-config"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-CQDBDNJ5XH');
            `,
          }}
        />

        {/* Meta Pixel */}
        <Script
          id="meta-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '876555499360577');
              fbq('track', 'PageView');
            `,
          }}
        />
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=876555499360577&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
      </head>
      <body className="antialiased">
        {children}
        <FloatingWhatsAppButton />
      </body>
    </html>
  );
}
