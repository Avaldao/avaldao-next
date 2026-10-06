import { Suspense } from "react";
import Link from "next/link";
import { ArrowRight, ExternalLink, ShieldCheck } from "lucide-react";
import ContractsFactory from "@/blockchain/contracts";
import { Language, translations } from "@/translations";
import { FadeIn } from "@/components/ui/AnimatedSection";
import GuaranteeFundValue from "./GuaranteeFundValue";

const ROOTSTOCK_MAINNET_CHAIN_ID = 30;

interface HeroProps {
  language: Language;
}

export default function Hero({ language }: HeroProps) {
  const t = (key: string) => translations[key]?.[language] ?? key;

  // La landing siempre muestra el fondo real (Rootstock Mainnet), independientemente de DEFAULT_CHAIN_ID.
  const chainId = ROOTSTOCK_MAINNET_CHAIN_ID;
  const { vault: vaultAddress, explorerUrl, networkName, tokens } = ContractsFactory.getNetworkInfo(chainId)!;

  return (
    <section className="relative overflow-hidden bg-[url('/images/slide-bg1.jpg')] bg-cover bg-center bg-no-repeat">
      <div className="absolute inset-0 bg-linear-to-r from-white/90 via-white/75 to-white/30" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1.4fr_1fr] lg:gap-16 lg:px-8 lg:py-28">
        <FadeIn className="flex flex-col items-start">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-700 sm:text-sm">
            {t("hero.eyebrow")}
          </span>

          <h1 className="mt-5 font-heading text-3xl font-bold leading-tight tracking-tight text-slate-950 sm:text-4xl md:text-5xl">
            {t("hero.title")}
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-700 sm:text-lg sm:leading-8">
            {t("hero.description")}
          </p>

          <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Link
              href="/avales/new"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-linear-to-r from-violet-600 to-fuchsia-600 px-6 py-3 font-heading text-sm font-semibold uppercase tracking-wide text-white shadow-lg shadow-violet-600/40 transition-all duration-300 hover:from-violet-700 hover:to-fuchsia-700 hover:shadow-xl hover:shadow-violet-600/60 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 sm:px-8 sm:py-3.5 sm:text-base"
            >
              {t("hero.cta.request")}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/auth/signup"
              className="inline-flex items-center justify-center rounded-full border border-violet-300 bg-white px-6 py-3 font-heading text-sm font-semibold uppercase tracking-wide text-violet-700 shadow-sm transition-all duration-300 hover:border-violet-500 hover:bg-violet-50 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 sm:px-8 sm:py-3.5 sm:text-base"
            >
              {t("hero.cta.merchant")}
            </Link>
          </div>

          <a
            href="#como-funciona"
            className="mt-5 text-sm font-semibold text-violet-700 underline-offset-4 hover:underline"
          >
            {t("hero.cta.how")} ↓
          </a>
        </FadeIn>

        {/* Prueba en vivo: saldo del fondo de garantía */}
        <FadeIn delay={0.15}>
          <div className="rounded-3xl border border-violet-100 bg-white/90 p-6 shadow-[0_24px_80px_rgba(91,33,182,0.18)] backdrop-blur-sm sm:p-8">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <ShieldCheck className="h-5 w-5 text-violet-600" />
                {t("hero.fund.label")}
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
                {t("hero.fund.live")}
              </span>
            </div>

            <div className="mt-4 flex items-baseline gap-2 font-heading text-4xl font-bold text-slate-950 sm:text-5xl">
              <Suspense fallback={<div className="h-12 w-40 animate-pulse rounded-md bg-violet-100" />}>
                <GuaranteeFundValue chainId={chainId} docAddress={tokens?.doc!} />
              </Suspense>
              <span className="text-xl text-slate-500 sm:text-2xl">USD</span>
            </div>
            <p className="mt-1 text-xs text-slate-500">{t("dashboard.guarantee-fund.clarification")}</p>

            <a
              href={`${explorerUrl}/address/${vaultAddress}?tab=tokens`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-violet-700 hover:text-violet-900"
            >
              {t("hero.fund.verify")} ({networkName})
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
