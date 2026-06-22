import { getLanguageCookie } from "@/lib/cookies";
import { translations } from "@/translations";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/AnimatedSection"

const steps = [
  {
    titleKey: "how.step1.title",
    descriptionKey: "how.step1.description",
    roleKey: "how.step1.role",
  },
  {
    titleKey: "how.step2.title",
    descriptionKey: "how.step2.description",
    roleKey: "how.step2.role",
  },
  {
    titleKey: "how.step3.title",
    descriptionKey: "how.step3.description",
    roleKey: "how.step3.role",
  },
  {
    titleKey: "how.step4.title",
    descriptionKey: "how.step4.description",
    roleKey: "how.step4.role",
  },
  {
    titleKey: "how.step5.title",
    descriptionKey: "how.step5.description",
    roleKey: "how.step5.role",
  },
];

export default async function HowItWorks() {
  const language = await getLanguageCookie();
  const t = (key: string) => translations[key]?.[language] ?? key;

  return (
    <section className="relative overflow-hidden bg-slate-950 py-12 text-white sm:py-16 md:py-20 lg:py-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(168,85,247,0.35),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(91,33,182,0.28),transparent_28%)]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn className="mx-auto max-w-3xl text-center">
          <span className="inline-flex rounded-full border border-violet-400/40 bg-violet-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-violet-200 sm:px-4 sm:text-sm sm:tracking-[0.24em]">
            {t("how.eyebrow")}
          </span>
          <h2 className="mt-4 font-heading text-3xl font-bold tracking-tight text-white sm:mt-6 sm:text-4xl md:text-5xl">
            {t("how.title")}
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-300 sm:mt-5 sm:text-lg sm:leading-8">
            {t("how.description")}
          </p>
        </FadeIn>

        <div className="relative mt-10 sm:mt-12 md:mt-16">
          <div className="absolute left-0 right-0 top-10 hidden h-px bg-linear-to-r from-transparent via-violet-400/40 to-transparent lg:block" />

          <StaggerContainer className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-5 xl:gap-6">
            {steps.map((step, index) => (
              <StaggerItem key={step.titleKey}>
                <article className="relative flex flex-col rounded-2xl border border-white/10 bg-white/6 p-5 shadow-[0_24px_80px_rgba(76,29,149,0.28)] backdrop-blur-sm transition-all duration-300 hover:bg-white/10 hover:border-violet-400/30 sm:rounded-3xl sm:p-6 h-full">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-violet-400 to-fuchsia-500 text-base font-bold text-slate-950 shadow-lg shadow-violet-900/40 sm:h-12 sm:w-12 sm:rounded-2xl sm:text-lg">
                      {index + 1}
                    </div>
                    <span className="inline-flex w-fit rounded-full border border-violet-300/20 bg-violet-400/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-violet-100 sm:px-3 sm:py-1 sm:text-xs sm:tracking-[0.18em]">
                      {t(step.roleKey)}
                    </span>
                  </div>

                  <h3 className="mt-4 text-lg font-semibold leading-6 text-white sm:mt-6 sm:text-xl sm:leading-7">
                    {t(step.titleKey)}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-300 sm:mt-3 sm:leading-7">
                    {t(step.descriptionKey)}
                  </p>
                </article>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </div>
    </section>
  );
}