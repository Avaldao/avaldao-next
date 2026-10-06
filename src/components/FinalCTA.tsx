import Link from "next/link";
import { getLanguageCookie } from "@/lib/cookies";
import { translations } from "@/translations";
import { FadeIn } from "@/components/ui/AnimatedSection";

export default async function FinalCTA() {
  const language = await getLanguageCookie();
  const t = (key: string) => translations[key]?.[language] ?? key;

  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <FadeIn className="rounded-3xl bg-linear-to-br from-violet-600 to-fuchsia-600 px-6 py-12 text-center text-white shadow-[0_24px_80px_rgba(91,33,182,0.3)] sm:px-12">
          <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">{t("final-cta.title")}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-violet-50 sm:text-lg">{t("final-cta.description")}</p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/auth/signup"
              className="inline-flex items-center justify-center rounded-full bg-white px-8 py-3.5 font-heading text-sm font-semibold uppercase tracking-wide text-violet-700 shadow-lg transition-all duration-300 hover:bg-violet-50 sm:text-base"
            >
              {t("final-cta.signup")}
            </Link>
            <Link
              href="/avales/new"
              className="inline-flex items-center justify-center rounded-full border border-white/60 px-8 py-3.5 font-heading text-sm font-semibold uppercase tracking-wide text-white transition-all duration-300 hover:bg-white/10 sm:text-base"
            >
              {t("final-cta.request")}
            </Link>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
