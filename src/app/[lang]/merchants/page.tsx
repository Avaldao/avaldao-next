import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CalendarClock, Coins, Wallet } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getAbsoluteUrl, getLanguageAlternates, openGraphLocales, siteConfig } from "@/lib/seo";
import { translations } from "@/translations";
import { Language, languages, localizeHref } from "@/translations/locales";

type PageProps = { params: Promise<{ lang: string }> };

const steps = ["step1", "step2", "step3", "step4", "step5"];

const notes = [
  { key: "note1", icon: CalendarClock },
  { key: "note2", icon: Wallet },
  { key: "note3", icon: Coins },
];

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const language = (await params).lang as Language;
  const t = (key: string) => translations[key]?.[language] ?? key;

  return {
    title: t("meta.merchants.title"),
    description: t("meta.merchants.description"),
    alternates: getLanguageAlternates("/merchants", language),
    openGraph: {
      type: "website",
      siteName: siteConfig.name,
      locale: openGraphLocales[language],
      alternateLocale: languages.filter((l) => l !== language).map((l) => openGraphLocales[l]),
      title: t("meta.merchants.title"),
      description: t("meta.merchants.description"),
      url: getAbsoluteUrl(localizeHref("/merchants", language)),
    },
  };
}

export default async function ComerciosPage({ params }: PageProps) {
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
              {t("merchants.eyebrow")}
            </span>
            <h1 className="mt-4 font-heading text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl md:text-5xl">
              {t("merchants.title")}
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
              {t("merchants.description")}
            </p>
          </div>

          <h2 className="mt-14 font-heading text-xl font-bold text-slate-900 sm:text-2xl">
            {t("merchants.steps.title")}
          </h2>
          <ol className="mt-6 space-y-4 sm:space-y-5">
            {steps.map((key, index) => (
              <li
                key={key}
                className="flex gap-4 rounded-2xl border border-violet-100 bg-white p-5 shadow-[0_20px_70px_rgba(91,33,182,0.08)] sm:gap-5 sm:rounded-3xl sm:p-6"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-violet-600 to-fuchsia-600 text-base font-bold text-white shadow-lg shadow-violet-600/30 sm:h-12 sm:w-12 sm:rounded-2xl sm:text-lg">
                  {index + 1}
                </div>
                <div className="min-w-0">
                  <h3 className="font-heading text-lg font-bold text-slate-900 sm:text-xl">
                    {t(`merchants.${key}.title`)}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">
                    {t(`merchants.${key}.description`)}
                  </p>
                </div>
              </li>
            ))}
          </ol>

          <h2 className="mt-14 font-heading text-xl font-bold text-slate-900 sm:text-2xl">
            {t("merchants.notes.title")}
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {notes.map(({ key, icon: Icon }) => (
              <div
                key={key}
                className="rounded-2xl border border-violet-100 bg-linear-to-br from-violet-50 to-fuchsia-50/60 p-5"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-violet-600 shadow-sm ring-1 ring-violet-100">
                  <Icon className="h-5 w-5" />
                </div>
                <p className="mt-3 font-heading text-base font-semibold text-slate-900">
                  {t(`merchants.${key}.title`)}
                </p>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  {t(`merchants.${key}.description`)}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/auth/signup"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-linear-to-r from-violet-600 to-fuchsia-600 px-8 py-3.5 font-heading text-sm font-semibold uppercase tracking-wide text-white shadow-lg shadow-violet-600/40 transition-all duration-300 hover:from-violet-700 hover:to-fuchsia-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 sm:w-auto sm:text-base"
            >
              {t("merchants.cta.signup")}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href={localizeHref("/request", language)}
              className="inline-flex w-full items-center justify-center rounded-full border border-violet-300 bg-white px-8 py-3.5 font-heading text-sm font-semibold uppercase tracking-wide text-violet-700 shadow-sm transition-all duration-300 hover:border-violet-500 hover:bg-violet-50 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 sm:w-auto sm:text-base"
            >
              {t("merchants.cta.how")}
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
