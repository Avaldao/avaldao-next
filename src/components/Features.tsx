import Image from "next/image"
import AvalDaoDiagram from "./avaldao/avaldao-diagram"
import { getLanguageCookie } from "@/lib/cookies"
import { translations } from "@/translations";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/AnimatedSection"



export default async function Features() {

  const language = await getLanguageCookie();
  const t = (key: string) => translations[key]?.[language] ?? key;

  const features = [
    {
      title: t("features.security.title"),
      description: t("features.security.description")
    },
    {
      title: t("features.autonomy.title"),
      description: t("features.autonomy.description")
    },
    {
      title: t("features.transparency.title"),
      description: t("features.transparency.description")
    }
  ]

  const services = [
    {
      img: "/images/inversor.png",
      title: t("services.investor.title"),
      description: t("services.investor.description"),
    },
    {
      img: "/images/solicitante.png",
      title: t("services.applicant.title"),
      description: t("services.applicant.description"),
    }
  ]

  return (
    <>
      <section className="relative overflow-hidden bg-linear-to-b from-violet-50 via-white to-white py-12 sm:py-16 md:py-20 lg:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.15),transparent_50%)]" />
        
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Qué es AvalDAO */}
          <FadeIn id="que-es" className="mx-auto max-w-3xl text-center mb-12 sm:mb-16">
            <span className="inline-flex rounded-full border border-violet-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-violet-700 shadow-sm sm:px-4 sm:text-sm sm:tracking-[0.24em]">
              {t("about.avaldao.eyebrow")}
            </span>
            <h2 className="mt-4 font-heading text-3xl font-bold tracking-tight text-slate-950 sm:mt-6 sm:text-4xl md:text-5xl">
              {t("about.avaldao.title")}
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-600 sm:mt-5 sm:text-lg sm:leading-8">
              {t("about.avaldao.description")}
            </p>
            <button className="mt-6 inline-flex items-center rounded-full bg-linear-to-r from-violet-600 to-fuchsia-600 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white shadow-lg shadow-violet-600/30 transition-all duration-300 hover:shadow-xl hover:shadow-violet-600/50 hover:from-violet-700 hover:to-fuchsia-700 sm:mt-8 sm:px-8 sm:py-3.5 sm:text-base">
              {t("about.avaldao.know-more")}
            </button>
          </FadeIn>

          {/* Características principales */}
          <StaggerContainer className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6 lg:gap-8 max-w-7xl mx-auto">
            {features.map((feature, index) => (
              <StaggerItem key={index}>
                <article className="group relative overflow-hidden rounded-2xl border border-violet-100 bg-white p-6 shadow-[0_20px_70px_rgba(91,33,182,0.08)] transition-all duration-300 hover:shadow-[0_24px_80px_rgba(91,33,182,0.14)] hover:-translate-y-1 sm:rounded-3xl sm:p-8 h-full">
                  <div className="absolute inset-0 bg-linear-to-br from-violet-50/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <div className="relative">
                    <h3 className="text-xl font-bold text-violet-600 mb-3 font-heading sm:text-2xl sm:mb-4">{feature.title}</h3>
                    <p className="text-sm leading-7 text-slate-600 sm:text-base sm:leading-7">{feature.description}</p>
                  </div>
                </article>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Servicios */}
      <section className="relative overflow-hidden bg-slate-950 py-12 sm:py-16 md:py-20 lg:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(168,85,247,0.25),transparent_40%),radial-gradient(circle_at_bottom_right,rgba(91,33,182,0.2),transparent_35%)]" />
        <div className="absolute inset-0 bg-[url('/images/background.jpg')] bg-repeat opacity-10" style={{ backgroundSize: '110px 110px' }} />
        
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm sm:rounded-3xl sm:p-6 md:p-8">
            <div className="mb-6 sm:mb-8">
              <AvalDaoDiagram language={language} />
            </div>
            
            <StaggerContainer className="grid grid-cols-1 gap-5 md:grid-cols-2 sm:gap-6 lg:gap-8">
              {services.map((service, index) => (
                <StaggerItem key={index}>
                  <article className="group overflow-hidden rounded-2xl border border-white/10 bg-white shadow-[0_24px_80px_rgba(76,29,149,0.28)] transition-all duration-300 hover:shadow-[0_28px_90px_rgba(76,29,149,0.35)] hover:-translate-y-1 sm:rounded-3xl h-full">
                    <div className="relative overflow-hidden">
                      <Image
                        src={service.img}
                        alt={service.title}
                        width={500}
                        height={500}
                        className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-105 sm:h-56 md:h-60"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-slate-900/20 to-transparent" />
                    </div>

                    <div className="p-5 sm:p-6 md:p-8">
                      <h3 className="text-xl font-semibold text-slate-900 font-heading mb-3 sm:text-2xl sm:mb-4">
                        {service.title}
                      </h3>
                      <p className="text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">
                        {service.description}
                      </p>
                    </div>
                  </article>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </div>
      </section>
    </>
  )
}