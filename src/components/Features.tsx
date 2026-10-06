import { CircleAlert, FileCheck2, Lightbulb, LockKeyhole, ScanSearch } from "lucide-react"
import { getLanguage } from "@/lib/cookies"
import { translations } from "@/translations";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/AnimatedSection"

export default async function Features() {

  const language = await getLanguage();
  const t = (key: string) => translations[key]?.[language] ?? key;

  const pillars = [
    {
      icon: LockKeyhole,
      title: t("about.pillar.reserved.title"),
      description: t("about.pillar.reserved.description")
    },
    {
      icon: FileCheck2,
      title: t("about.pillar.rules.title"),
      description: t("about.pillar.rules.description")
    },
    {
      icon: ScanSearch,
      title: t("about.pillar.verifiable.title"),
      description: t("about.pillar.verifiable.description")
    }
  ]

  return (
    <section id="que-es" className="relative scroll-mt-20 overflow-hidden bg-linear-to-b from-violet-50 via-white to-white py-12 sm:py-16 md:py-20 lg:py-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.15),transparent_50%)]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn className="mx-auto max-w-3xl text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-700 sm:text-sm sm:tracking-[0.24em]">
            {t("about.eyebrow")}
          </span>
          <h2 className="mt-4 font-heading text-3xl font-bold tracking-tight text-slate-950 sm:mt-6 sm:text-4xl md:text-5xl">
            {t("about.title")}
          </h2>
        </FadeIn>

        {/* Problema → Solución */}
        <div className="mx-auto mt-10 grid max-w-5xl grid-cols-1 gap-5 sm:mt-12 md:grid-cols-2 sm:gap-6">
          <FadeIn className="h-full">
            <article className="h-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:rounded-3xl sm:p-8">
              <div className="flex items-center gap-3">
                <CircleAlert className="h-6 w-6 text-slate-500" />
                <h3 className="font-heading text-xl font-bold text-slate-900 sm:text-2xl">{t("about.problem.title")}</h3>
              </div>
              <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">{t("about.problem.description")}</p>
            </article>
          </FadeIn>
          <FadeIn delay={0.1} className="h-full">
            <article className="h-full rounded-2xl border border-violet-200 bg-linear-to-br from-violet-600 to-fuchsia-600 p-6 text-white shadow-[0_20px_70px_rgba(91,33,182,0.25)] sm:rounded-3xl sm:p-8">
              <div className="flex items-center gap-3">
                <Lightbulb className="h-6 w-6 text-white" />
                <h3 className="font-heading text-xl font-bold sm:text-2xl">{t("about.solution.title")}</h3>
              </div>
              <p className="mt-4 text-sm leading-7 text-violet-50 sm:text-base">{t("about.solution.description")}</p>
            </article>
          </FadeIn>
        </div>

        {/* Pilares */}
        <StaggerContainer className="mx-auto mt-10 grid max-w-7xl grid-cols-1 gap-5 sm:mt-12 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6 lg:gap-8">
          {pillars.map(({ icon: Icon, title, description }) => (
            <StaggerItem key={title}>
              <article className="group relative h-full overflow-hidden rounded-2xl border border-violet-100 bg-white p-6 shadow-[0_20px_70px_rgba(91,33,182,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_80px_rgba(91,33,182,0.14)] sm:rounded-3xl sm:p-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-50 text-violet-600">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 font-heading text-xl font-bold text-slate-900 sm:text-2xl">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">{description}</p>
              </article>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  )
}
