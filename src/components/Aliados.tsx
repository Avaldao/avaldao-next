import Image from "next/image"
import { getLanguageCookie } from "@/lib/cookies"
import { translations } from "@/translations"
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/AnimatedSection"

const aliados = [
  { name: "ACDI", url: "https://www.acdi.org.ar", logo: "/aliados/acdi.png" },
  { name: "El Futuro Está en el Monte", url: "https://elfuturoestaenelmonte.org", logo: "/aliados/el-futuro-esta-en-el-monte.png" },
  { name: "BID Lab", url: "https://bidlab.org", logo: "/aliados/IDB-Lab.gif" },
  { name: "Rootstock", url: "https://www.rsk.co", logo: "/aliados/rootstock.svg" },
]

export default async function Aliados() {
  const language = await getLanguageCookie()
  const t = (key: string) => translations[key]?.[language] ?? key

  return (
    <section className="relative overflow-hidden bg-white py-12 sm:py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn className="mx-auto max-w-2xl text-center mb-10 sm:mb-14">
          <span className="inline-flex rounded-full border border-violet-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-violet-700 shadow-sm sm:px-4 sm:text-sm sm:tracking-[0.24em]">
            {t("aliados.eyebrow")}
          </span>
          <h2 className="mt-4 font-heading text-3xl font-bold tracking-tight text-slate-950 sm:mt-6 sm:text-4xl">
            {t("aliados.title")}
          </h2>
        </FadeIn>

        <StaggerContainer className="flex flex-wrap justify-center items-center gap-12 sm:gap-16 lg:gap-24">
          {aliados.map(({ name, url, logo }) => (
            <StaggerItem key={name}>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${name} — abre en nueva pestaña`}
                className="group relative flex items-center justify-center h-14 w-32 sm:h-16 sm:w-40 transition-all duration-300 hover:grayscale-0 hover:opacity-100 hover:scale-105"
              >
                <Image
                  src={logo}
                  alt={name}
                  fill
                  className="object-contain"
                  sizes="(max-width: 640px) 128px, 160px"
                />
              </a>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  )
}
