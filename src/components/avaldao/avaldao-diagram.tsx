

import { FC } from "react";
import Image from "next/image";
import { Language, translations } from "@/translations";


interface AvalDaoDiagramProps {
  language: Language;
}

const AvalDaoDiagram: FC<AvalDaoDiagramProps> = ({ language }) => {
  const t = (key: string) => translations[key]?.[language] ?? key;

  const actors = [
    { src: "/images/d-investor.png", titleKey: "actors.investors.title", descKey: "actors.investors.description" },
    { src: "/images/d-commerce.png", titleKey: "actors.shops.title",    descKey: "actors.shops.description" },
    { src: "/images/d-pymes.png",    titleKey: "actors.smes.title",      descKey: "actors.smes.description" },
  ] as const;

  return (
    <div className="relative overflow-hidden bg-white/95 backdrop-blur-sm rounded-2xl border border-slate-200/30 shadow-xl p-8 md:p-12 lg:p-16">

      {/* Background blobs */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-violet-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-fuchsia-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* ── Mobile: stacked ── */}
      <div className="flex flex-col items-center gap-5 md:hidden">

        {/* Hub */}
        <div className="relative w-36 h-36 shrink-0">
          <div className="absolute inset-0 rounded-full p-1 bg-linear-to-tr from-violet-600 to-fuchsia-500 shadow-xl shadow-violet-500/30">
            <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
              <Image src="/images/avaldao.svg" alt="AvalDAO" width={96} height={96} className="object-contain h-auto" />
            </div>
          </div>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-24 h-6 bg-violet-500/20 blur-xl rounded-full" />
        </div>

        {actors.map(({ src, titleKey, descKey }) => (
          <div key={titleKey} className="w-full max-w-sm bg-white rounded-xl p-5 border border-slate-200/70 shadow-md">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-50">
                <Image src={src} alt={t(titleKey)} width={36} height={36} className="object-contain" />
              </div>
              <h3 className="font-semibold text-slate-900">{t(titleKey)}</h3>
            </div>
            <p className="text-sm leading-relaxed text-slate-600">{t(descKey)}</p>
          </div>
        ))}
      </div>

      {/* ── Desktop: hub-and-spoke ── */}
      <div className="relative hidden md:block" style={{ minHeight: "520px" }}>

        {/* SVG connector lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <line x1="29" y1="50" x2="44" y2="50"  stroke="#7c3aed" strokeWidth="0.4" strokeDasharray="1.8 1.4" opacity="0.4" />
          <path d="M 57 42 Q 67 31, 72 18"     fill="none" stroke="#7c3aed" strokeWidth="0.4" strokeDasharray="1.8 1.4" opacity="0.4" />
          <path d="M 57 58 Q 67 69, 72 82"     fill="none" stroke="#7c3aed" strokeWidth="0.4" strokeDasharray="1.8 1.4" opacity="0.4" />
        </svg>

        {/* Central hub */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          <div className="relative w-44 h-44 lg:w-52 lg:h-52">
            <div className="absolute inset-0 rounded-full p-1 bg-linear-to-tr from-violet-600 to-fuchsia-500 shadow-xl shadow-violet-500/30">
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                <Image
                  src="/images/avaldao.svg"
                  alt="AvalDAO logo"
                  width={128}
                  height={128}
                  className="object-contain h-auto"
                />
              </div>
            </div>
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-28 h-8 bg-violet-500/20 blur-xl rounded-full" />
          </div>
        </div>

        {/* Inversores — Left, vertically centered */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-56 lg:w-64 bg-white rounded-xl p-5 border border-slate-200/70 shadow-md hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-50">
              <Image src="/images/d-investor.png" alt="Investors" width={36} height={36} className="object-contain transition-transform duration-300 hover:scale-110" />
            </div>
            <h3 className="font-semibold text-slate-900 text-sm lg:text-base">{t("actors.investors.title")}</h3>
          </div>
          <p className="text-xs lg:text-sm leading-relaxed text-slate-600">{t("actors.investors.description")}</p>
        </div>

        {/* Comercios — Top Right */}
        <div className="absolute right-0 top-8 w-56 lg:w-64 bg-white rounded-xl p-5 border border-slate-200/70 shadow-md hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-50">
              <Image src="/images/d-commerce.png" alt="Shops" width={36} height={36} className="object-contain transition-transform duration-300 hover:scale-110" />
            </div>
            <h3 className="font-semibold text-slate-900 text-sm lg:text-base">{t("actors.shops.title")}</h3>
          </div>
          <p className="text-xs lg:text-sm leading-relaxed text-slate-600">{t("actors.shops.description")}</p>
        </div>

        {/* PyMEs — Bottom Right */}
        <div className="absolute right-0 bottom-8 w-56 lg:w-64 bg-white rounded-xl p-5 border border-slate-200/70 shadow-md hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-50">
              <Image src="/images/d-pymes.png" alt="SMEs" width={36} height={36} className="object-contain transition-transform duration-300 hover:scale-110" />
            </div>
            <h3 className="font-semibold text-slate-900 text-sm lg:text-base">{t("actors.smes.title")}</h3>
          </div>
          <p className="text-xs lg:text-sm leading-relaxed text-slate-600">{t("actors.smes.description")}</p>
        </div>

      </div>

      {/* Footer */}
      <div className="relative z-10 mt-10 md:mt-16 text-center">
        <p className="bg-linear-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent font-semibold text-xl sm:text-2xl">
          {t("we-trust")}
        </p>
        <div className="w-24 h-1 bg-linear-to-r from-violet-600 to-fuchsia-600 mx-auto mt-4 rounded-full opacity-50" />
      </div>

    </div>
  );
};

export default AvalDaoDiagram;
