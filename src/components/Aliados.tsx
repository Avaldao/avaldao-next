import Image from "next/image"
import { getLanguageCookie } from "@/lib/cookies"
import { translations } from "@/translations"

const aliados = [
  { name: "ACDI", url: "https://www.acdi.org.ar", logo: "/aliados/acdi.png" },
  { name: "El Futuro Está en el Monte", url: "https://elfuturoestaenelmonte.org", logo: "/aliados/el-futuro-esta-en-el-monte.png" },
  { name: "BID Lab", url: "https://bidlab.org", logo: "/aliados/IDB-Lab.gif" },
  { name: "Rootstock", url: "https://www.rsk.co", logo: "/aliados/rootstock.svg" },
]

/** Franja compacta de aliados, pensada para ir debajo del hero como prueba social. */
export default async function Aliados() {
  const language = await getLanguageCookie()
  const t = (key: string) => translations[key]?.[language] ?? key

  return (
    <section aria-labelledby="aliados-title" className="border-y border-violet-100 bg-white py-8 sm:py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-4 sm:px-6 lg:flex-row lg:gap-12 lg:px-8">
        <p
          id="aliados-title"
          className="shrink-0 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 sm:text-sm"
        >
          {t("aliados.eyebrow")}
        </p>

        <ul className="flex flex-1 flex-wrap items-center justify-center gap-x-10 gap-y-6 sm:gap-x-14 lg:justify-between">
          {aliados.map(({ name, url, logo }) => (
            <li key={name}>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${name} — abre en nueva pestaña`}
                className="relative flex h-10 w-28 items-center justify-center transition-transform duration-300 hover:scale-105 sm:h-12 sm:w-32"
              >
                <Image
                  src={logo}
                  alt={name}
                  fill
                  className="object-contain"
                  sizes="(max-width: 640px) 112px, 128px"
                />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
