import { getLanguageCookie } from "@/lib/cookies";
import { translations } from "@/translations";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/AnimatedSection"

const items = [
  {
    questionKey: "faq.item1.question",
    answerKey: "faq.item1.answer",
  },
  {
    questionKey: "faq.item2.question",
    answerKey: "faq.item2.answer",
  },
  {
    questionKey: "faq.item3.question",
    answerKey: "faq.item3.answer",
  },
  {
    questionKey: "faq.item4.question",
    answerKey: "faq.item4.answer",
  },
  {
    questionKey: "faq.item5.question",
    answerKey: "faq.item5.answer",
  },
];

export default async function FAQ() {
  const language = await getLanguageCookie();
  const t = (key: string) => translations[key]?.[language] ?? key;

  return (
    <section className="bg-linear-to-b from-violet-50 via-white to-white py-24 text-slate-900">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <FadeIn>
          <span className="inline-flex rounded-full border border-violet-200 bg-white px-4 py-1 text-sm font-semibold uppercase tracking-[0.24em] text-violet-700 shadow-sm">
            {t("faq.eyebrow")}
          </span>
          <h2 className="mt-6 font-heading text-4xl font-bold tracking-tight text-slate-950 md:text-5xl">
            {t("faq.title")}
          </h2>
          <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600">
            {t("faq.description")}
          </p>
        </FadeIn>

        <StaggerContainer className="space-y-4">
          {items.map((item, index) => (
            <StaggerItem key={item.questionKey}>
              <details
                open={index === 0}
                className="group overflow-hidden rounded-3xl border border-violet-100 bg-white shadow-[0_20px_70px_rgba(91,33,182,0.08)]"
              >
                <summary
                  className="flex cursor-pointer list-none items-center justify-between gap-6 px-6 py-5 text-left marker:hidden md:px-8"
                >
                  <span className="text-lg font-semibold text-slate-900 md:text-xl">
                    {t(item.questionKey)}
                  </span>
                  <span
                    aria-hidden="true"
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-violet-200 bg-violet-50 text-2xl font-light text-violet-700 transition group-open:border-violet-500 group-open:bg-violet-600 group-open:text-white"
                  >
                    <span className="group-open:hidden">+</span>
                    <span className="hidden group-open:block">−</span>
                  </span>
                </summary>

                <div className="grid grid-rows-[0fr] transition-all duration-300 ease-out group-open:grid-rows-[1fr]">
                  <div className="overflow-hidden">
                    <p className="px-6 pb-6 text-base leading-7 text-slate-600 md:px-8 md:pb-8">
                      {t(item.answerKey)}
                    </p>
                  </div>
                </div>
              </details>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}