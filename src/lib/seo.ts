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
  ogImage: "/images/background.jpg",
  xHandle: "@avaldao",
};

export function getBaseUrl() {
  return new URL(siteConfig.siteUrl);
}

export function getAbsoluteUrl(path = "/") {
  return new URL(path, getBaseUrl()).toString();
}