import Link from "next/link";
import { ArrowRight, HandCoins, HeartHandshake, Store, UserRound } from "lucide-react";
import { getLanguage } from "@/lib/cookies";
import { translations } from "@/translations";
import { localizeHref } from "@/translations/locales";
import { StaggerContainer, StaggerItem, FadeIn } from "@/components/ui/AnimatedSection";

const audiences = [
  { key: "merchant", icon: Store, href: "/auth/signup" },
  { key: "applicant", icon: HeartHandshake, href: "/avales/new" },
  { key: "guaranteed", icon: UserRound, href: "/auth/signup" },
  { key: "contributor", icon: HandCoins, href: "/invertir" },
] as const;

export default async function Audiences() {
  const language = await getLanguage();
  const t = (key: string) => translations[key]?.[language] ?? key;

  return (
    <section id="aval" className="relative scroll-mt-20 overflow-hidden bg-white py-12 sm:py-16 md:py-20 lg:py-24">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn className="mx-auto max-w-3xl text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-700 sm:text-sm sm:tracking-[0.24em]">
            {t("audiences.eyebrow")}
          </span>
          <h2 className="mt-4 font-heading text-3xl font-bold tracking-tight text-slate-950 sm:mt-6 sm:text-4xl md:text-5xl">
            {t("audiences.title")}
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-600 sm:mt-5 sm:text-lg sm:leading-8">
            {t("audiences.description")}
          </p>
        </FadeIn>

        <StaggerContainer className="mt-10 grid grid-cols-1 gap-5 sm:mt-12 sm:grid-cols-2 sm:gap-6 xl:grid-cols-4">
          {audiences.map(({ key, icon: Icon, href }) => (
            <StaggerItem key={key}>
              <article className="flex h-full flex-col rounded-2xl border border-violet-100 bg-white p-6 shadow-[0_20px_70px_rgba(91,33,182,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_80px_rgba(91,33,182,0.14)] sm:rounded-3xl">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-600/30">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 font-heading text-xl font-bold text-slate-900">{t(`audiences.${key}.title`)}</h3>

                <p className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-violet-700">{t("audiences.gain")}</p>
                <p className="mt-1 text-sm leading-6 text-slate-800">{t(`audiences.${key}.gain`)}</p>

                <p className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{t("audiences.do")}</p>
                <p className="mt-1 text-sm leading-6 text-slate-600">{t(`audiences.${key}.do`)}</p>

                <Link
                  href={localizeHref(href, language)}
                  className="mt-auto inline-flex items-center gap-1.5 pt-6 text-sm font-semibold text-violet-700 hover:text-violet-900"
                >
                  {t(`audiences.${key}.cta`)}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </article>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
