import type { Metadata } from "next";

export const SITE_NAME = "NeuroPsiEdu";
export const SITE_URL = "https://neuropsiedu.com.br";
export const DEFAULT_DESCRIPTION =
  "Avaliação neuropsicológica especializada e formação profissional em Neuropsicologia, presencial e online.";
export const DEFAULT_SOCIAL_IMAGE = "/images/logo-vertical-600.webp";
export const FAMAF_CANONICAL_PATH = "/formacao-manuseio-arma/";

export function absoluteUrl(path: string): string {
  return new URL(path, SITE_URL).toString();
}

type PageMetadataOptions = {
  title: string;
  description: string;
  path: string;
  image?: string;
  noIndex?: boolean;
};

export function createPageMetadata({
  title,
  description,
  path,
  image = DEFAULT_SOCIAL_IMAGE,
  noIndex = false,
}: PageMetadataOptions): Metadata {
  const url = absoluteUrl(path);
  const imageUrl = absoluteUrl(image);

  return {
    title,
    description,
    alternates: { canonical: url },
    robots: noIndex ? { index: false, follow: true } : undefined,
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      locale: "pt_BR",
      type: "website",
      images: [{ url: imageUrl, alt: SITE_NAME }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}
