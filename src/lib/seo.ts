import { Language, languages, localizeHref } from "@/translations/locales";

const defaultSiteUrl = "https://avaldao.org";

export const siteConfig = {
  name: "AvalDAO",
  shortName: "AvalDAO",
  description:
    "AvalDAO es una Sociedad de Garantia Reciproca descentralizada que conecta a personas y microempresas con garantias onchain para acceder a financiamiento.",
  keywords: [
    "AvalDAO",
    "SGR descentralizada",
    "garantias onchain",
    "blockchain",
    "microempresas",
    "financiamiento",
    "credito comercial",
    "Rootstock",
    "Web3",
  ],
  locale: "es_AR",
  alternateLocale: "en_US",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? defaultSiteUrl,
  xHandle: "@avaldao",
};

export function getBaseUrl() {
  return new URL(siteConfig.siteUrl);
}

export function getAbsoluteUrl(path = "/") {
  return new URL(path, getBaseUrl()).toString();
}

export const openGraphLocales: Record<Language, string> = {
  es: "es_AR",
  en: "en_US",
};

/** Canonical y hreflang de una página pública localizada (`path` sin prefijo de idioma). */
export function getLanguageAlternates(path: string, language: Language) {
  return {
    canonical: localizeHref(path, language),
    languages: {
      ...Object.fromEntries(languages.map((l) => [l, localizeHref(path, l)])),
      "x-default": path,
    },
  };
}