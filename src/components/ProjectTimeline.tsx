import { getLanguageCookie } from "@/lib/cookies";
import { translations } from "@/translations";

const milestones = [
  {
    phaseKey: "timeline.phase.current",
    titleKey: "timeline.current.title",
    descriptionKey: "timeline.current.description",
    badgeClass: "bg-slate-100 text-slate-700 border-slate-300",
    dotClass: "bg-slate-500",
  },
  {
    phaseKey: "timeline.phase.next",
    titleKey: "timeline.next.title",
    descriptionKey: "timeline.next.description",
    badgeClass: "bg-violet-100 text-violet-700 border-violet-300",
    dotClass: "bg-violet-500",
  },
  {
    phaseKey: "timeline.phase.future",
    titleKey: "timeline.future.title",
    descriptionKey: "timeline.future.description",
    badgeClass: "bg-fuchsia-100 text-fuchsia-700 border-fuchsia-300",
    dotClass: "bg-fuchsia-500",
  },
];

export default async function ProjectTimeline() {
  const language = await getLanguageCookie();
  const t = (key: string) => translations[key]?.[language] ?? key;

  return (
    <section className="bg-linear-to-br from-[#f6f0ff] via-white to-[#eef2ff] py-24 text-slate-900">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex rounded-full border border-violet-200 bg-white px-4 py-1 text-sm font-semibold uppercase tracking-[0.2em] text-violet-700 shadow-sm">
            {t("timeline.eyebrow")}
          </span>
          <h2 className="mt-6 font-heading text-4xl font-bold tracking-tight text-slate-950 md:text-5xl">
            {t("timeline.title")}
          </h2>
          <p className="mt-5 text-lg leading-8 text-slate-600">
            {t("timeline.description")}
          </p>
        </div>

        <div className="relative mt-16">
          <div className="absolute left-0 right-0 top-6 hidden h-px bg-linear-to-r from-transparent via-violet-300 to-transparent md:block" />

          <div className="grid gap-6 md:grid-cols-3">
            {milestones.map((item, index) => (
              <article
                key={item.titleKey}
                className="relative rounded-3xl border border-violet-100 bg-white p-6 shadow-[0_24px_80px_rgba(76,29,149,0.08)]"
              >
                <div className="mb-5 flex items-center justify-between">
                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${item.badgeClass}`}
                  >
                    {t(item.phaseKey)}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className={`h-3 w-3 rounded-full ${item.dotClass}`} />
                    <span className="text-sm font-semibold text-slate-500">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                </div>

                <h3 className="text-2xl font-semibold text-slate-900">
                  {t(item.titleKey)}
                </h3>
                <p className="mt-3 leading-7 text-slate-600">
                  {t(item.descriptionKey)}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}