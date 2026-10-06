import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProjectTimeline from "@/components/ProjectTimeline";
import { getAbsoluteUrl, getLanguageAlternates, openGraphLocales, siteConfig } from "@/lib/seo";
import { translations } from "@/translations";
import { Language, languages, localizeHref } from "@/translations/locales";
import Link from "next/link";
import { Clock, Wrench, ArrowLeft } from "lucide-react";

type PageProps = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const language = (await params).lang as Language;
  const t = (key: string) => translations[key]?.[language] ?? key;

  return {
    title: t("meta.invest.title"),
    description: t("meta.invest.description"),
    alternates: getLanguageAlternates("/invertir", language),
    openGraph: {
      type: "website",
      siteName: siteConfig.name,
      locale: openGraphLocales[language],
      alternateLocale: languages.filter((l) => l !== language).map((l) => openGraphLocales[l]),
      title: t("meta.invest.title"),
      description: t("meta.invest.description"),
      url: getAbsoluteUrl(localizeHref("/invertir", language)),
    },
  };
}

export default async function InvertirPage({ params }: PageProps) {
  const language = (await params).lang as Language;

  const isEs = language === "es";

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100">
      <Header />
      <div className="h-16" />

      <main>
        {/* Hero section */}
        <section className="bg-linear-to-br from-[#f6f0ff] via-white to-[#eef2ff] py-24">
          <div className="mx-auto max-w-4xl px-6 text-center lg:px-8">
            <div className="mb-6 flex justify-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-white px-5 py-2 text-sm font-semibold uppercase tracking-[0.16em] text-violet-700 shadow-sm">
                <Clock className="h-4 w-4" />
                {isEs ? "En desarrollo" : "In development"}
              </span>
            </div>

            <h1 className="font-heading text-4xl font-bold tracking-tight text-slate-950 md:text-5xl lg:text-6xl">
              {isEs
                ? "La funcionalidad de invertir aún no está lista"
                : "The invest feature is not ready yet"}
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              {isEs
                ? "Estamos trabajando en actualizar los smart contracts para soportar la participación de inversores con rendimiento transparente y auditable."
                : "We are working on updating the smart contracts to support investor participation with transparent and auditable yield."}
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <div className="flex items-center gap-2 rounded-2xl border border-violet-100 bg-white px-5 py-3 text-sm font-medium text-slate-700 shadow-sm">
                <Wrench className="h-4 w-4 text-violet-500" />
                {isEs
                  ? "Actualizando contratos inteligentes"
                  : "Updating smart contracts"}
              </div>
              <Link
                href={localizeHref("/", language)}
                className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-600 shadow-sm transition-all hover:border-violet-200 hover:text-violet-700"
              >
                <ArrowLeft className="h-4 w-4" />
                {isEs ? "Volver al inicio" : "Back to home"}
              </Link>
            </div>
          </div>
        </section>

        {/* Roadmap section */}
        <div className="border-t border-violet-100">
          <div className="mx-auto max-w-7xl px-6 pb-4 pt-12 text-center lg:px-8">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-violet-600">
              {isEs ? "¿Cuándo estará listo?" : "When will it be ready?"}
            </p>
          </div>
          <ProjectTimeline />
        </div>
      </main>

      <Footer />
    </div>
  );
}
