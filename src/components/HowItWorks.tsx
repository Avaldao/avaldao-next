import { getLanguageCookie } from "@/lib/cookies";
import { translations } from "@/translations";

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
    <section className="relative overflow-hidden bg-slate-950 py-24 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(168,85,247,0.35),_transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(91,33,182,0.28),_transparent_28%)]" />
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex rounded-full border border-violet-400/40 bg-violet-500/10 px-4 py-1 text-sm font-semibold uppercase tracking-[0.24em] text-violet-200">
            {t("how.eyebrow")}
          </span>
          <h2 className="mt-6 font-heading text-4xl font-bold tracking-tight text-white md:text-5xl">
            {t("how.title")}
          </h2>
          <p className="mt-5 text-lg leading-8 text-slate-300">
            {t("how.description")}
          </p>
        </div>

        <div className="relative mt-16">
          <div className="absolute left-0 right-0 top-10 hidden h-px bg-gradient-to-r from-transparent via-violet-400/40 to-transparent lg:block" />

          <div className="flex gap-6 overflow-x-auto pb-4 lg:grid lg:grid-cols-5 lg:gap-5 lg:overflow-visible lg:pb-0">
            {steps.map((step, index) => (
              <article
                key={step.titleKey}
                className="relative min-w-[17rem] flex-1 rounded-3xl border border-white/10 bg-white/6 p-6 shadow-[0_24px_80px_rgba(76,29,149,0.28)] backdrop-blur-sm"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-400 to-fuchsia-500 text-lg font-bold text-slate-950 shadow-lg shadow-violet-900/40">
                    {index + 1}
                  </div>
                  <span className="inline-flex rounded-full border border-violet-300/20 bg-violet-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-violet-100">
                    {t(step.roleKey)}
                  </span>
                </div>

                <h3 className="mt-6 text-xl font-semibold leading-7 text-white">
                  {t(step.titleKey)}
                </h3>
                <p className="mt-3 text-sm leading-7 text-slate-300 md:text-base">
                  {t(step.descriptionKey)}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}