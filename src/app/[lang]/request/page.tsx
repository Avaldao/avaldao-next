import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ExternalLink, Wallet } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getAbsoluteUrl, getLanguageAlternates, openGraphLocales, siteConfig } from "@/lib/seo";
import { translations } from "@/translations";
import { Language, languages, localizeHref } from "@/translations/locales";

type PageProps = { params: Promise<{ lang: string }> };

const steps = [
  { key: "step1", roleKey: "request-steps.role.you" },
  { key: "step2", roleKey: "request-steps.role.platform" },
  { key: "step3", roleKey: "request-steps.role.you" },
  { key: "step4", roleKey: "request-steps.role.platform" },
  { key: "step5", roleKey: "request-steps.role.participants" },
];

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const language = (await params).lang as Language;
  const t = (key: string) => translations[key]?.[language] ?? key;

  return {
    title: t("meta.request.title"),
    description: t("meta.request.description"),
    alternates: getLanguageAlternates("/request", language),
    openGraph: {
      type: "website",
      siteName: siteConfig.name,
      locale: openGraphLocales[language],
      alternateLocale: languages.filter((l) => l !== language).map((l) => openGraphLocales[l]),
      title: t("meta.request.title"),
      description: t("meta.request.description"),
      url: getAbsoluteUrl(localizeHref("/request", language)),
    },
  };
}

export default async function SolicitarPage({ params }: PageProps) {
  const language = (await params).lang as Language;
  const t = (key: string) => translations[key]?.[language] ?? key;

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100">
      <Header />
      <div className="h-16" />

      <main className="bg-linear-to-br from-[#f6f0ff] via-white to-[#eef2ff] py-16 sm:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-700 sm:text-sm">
              {t("request-steps.eyebrow")}
            </span>
            <h1 className="mt-4 font-heading text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl md:text-5xl">
              {t("request-steps.title")}
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
              {t("request-steps.description")}
            </p>
          </div>

          <ol className="mt-12 space-y-4 sm:space-y-5">
            {steps.map(({ key, roleKey }, index) => (
              <li
                key={key}
                className="relative flex gap-4 rounded-2xl border border-violet-100 bg-white p-5 shadow-[0_20px_70px_rgba(91,33,182,0.08)] sm:gap-5 sm:rounded-3xl sm:p-6"
              >
                <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-violet-600 to-fuchsia-600 text-base font-bold text-white shadow-lg shadow-violet-600/30 sm:h-12 sm:w-12 sm:rounded-2xl sm:text-lg">
                  {index + 1}
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-heading text-lg font-bold text-slate-900 sm:text-xl">
                      {t(`request-steps.${key}.title`)}
                    </h2>
                    <span className="inline-flex rounded-full bg-violet-50 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-violet-700 sm:text-xs">
                      {t(roleKey)}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">
                    {t(`request-steps.${key}.description`)}
                  </p>
                  {key === "step5" && (
                    <div className="mt-5 flex flex-col gap-4 rounded-2xl border border-violet-100 bg-linear-to-br from-violet-50 to-fuchsia-50/60 p-4 sm:flex-row sm:items-start sm:p-5">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-violet-600 shadow-sm ring-1 ring-violet-100">
                        <Wallet className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-heading text-base font-semibold text-slate-900">
                            {t("request-steps.wallet.title")}
                          </p>
                          <span className="rounded-md border border-slate-200 bg-white px-1.5 text-xs font-medium text-slate-500">
                            {t("request-steps.wallet.free")}
                          </span>
                        </div>
                        <p className="mt-1 text-sm leading-6 text-slate-600">
                          {t("request-steps.wallet.description")}
                        </p>
                        <a
                          href="https://metamask.io/download/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-3 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-violet-700 shadow-sm ring-1 ring-violet-200 transition-all duration-200 hover:bg-violet-600 hover:text-white hover:ring-violet-600 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2"
                        >
                          {t("request-steps.wallet.cta")}
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/auth/signup"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-linear-to-r from-violet-600 to-fuchsia-600 px-8 py-3.5 font-heading text-sm font-semibold uppercase tracking-wide text-white shadow-lg shadow-violet-600/40 transition-all duration-300 hover:from-violet-700 hover:to-fuchsia-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 sm:w-auto sm:text-base"
            >
              {t("request-steps.cta.signup")}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/avales/new"
              className="inline-flex w-full items-center justify-center rounded-full border border-violet-300 bg-white px-8 py-3.5 font-heading text-sm font-semibold uppercase tracking-wide text-violet-700 shadow-sm transition-all duration-300 hover:border-violet-500 hover:bg-violet-50 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 sm:w-auto sm:text-base"
            >
              {t("request-steps.cta.request")}
            </Link>
          </div>

          <div className="mt-8 text-center">
            <Link
              href={localizeHref("/", language)}
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-violet-700"
            >
              <ArrowLeft className="h-4 w-4" />
              {t("request-steps.back")}
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
