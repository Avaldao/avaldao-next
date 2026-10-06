import { notFound } from "next/navigation";
import { isLanguage, languages } from "@/translations/locales";

// Solo existen /es y /en; cualquier otro primer segmento que no sea una ruta conocida es 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return languages.map((lang) => ({ lang }));
}

export default async function LanguageLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  const { lang } = await params;
  if (!isLanguage(lang)) notFound();

  return children;
}
