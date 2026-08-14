import type { Metadata } from "next";
import { AvaliacaoNeuropsicologicaPage } from "@/components/avaliacao-neuropsicologica/AvaliacaoNeuropsicologicaPage";
import { AVALIACAO_FAQS, AVALIACAO_PATH } from "@/data/avaliacao-neuropsicologica";
import { absoluteUrl, createPageMetadata } from "@/lib/seo";

const title = "Avaliação Neuropsicológica em Brasília";
const description =
  "Avaliação neuropsicológica para crianças, adolescentes, adultos e idosos em Brasília. Entenda as etapas e converse com a NeuroPsiEdu.";

export const metadata: Metadata = createPageMetadata({
  title,
  description,
  path: AVALIACAO_PATH,
});

export default function AvaliacaoNeuropsicologicaRoute() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${absoluteUrl(AVALIACAO_PATH)}#service`,
        name: "Avaliação Neuropsicológica",
        description,
        url: absoluteUrl(AVALIACAO_PATH),
        serviceType: "Avaliação neuropsicológica",
        provider: { "@id": "https://neuropsiedu.com.br/#clinic" },
        areaServed: {
          "@type": "AdministrativeArea",
          name: "Brasília, Distrito Federal",
        },
        audience: [
          { "@type": "Audience", audienceType: "Crianças e adolescentes" },
          { "@type": "Audience", audienceType: "Adultos" },
          { "@type": "Audience", audienceType: "Idosos" },
        ],
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${absoluteUrl(AVALIACAO_PATH)}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Início", item: absoluteUrl("/") },
          {
            "@type": "ListItem",
            position: 2,
            name: "Avaliação Neuropsicológica",
            item: absoluteUrl(AVALIACAO_PATH),
          },
        ],
      },
      {
        "@type": "FAQPage",
        "@id": `${absoluteUrl(AVALIACAO_PATH)}#faq`,
        mainEntity: AVALIACAO_FAQS.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <AvaliacaoNeuropsicologicaPage />
    </>
  );
}

