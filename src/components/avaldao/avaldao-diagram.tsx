

import { FC } from "react";
import Image from "next/image";
import { Language, translations } from "@/translations";


interface AvalDaoDiagramProps {
  language: Language;
}

const AvalDaoDiagram: FC<AvalDaoDiagramProps> = ({ language }) => {
  const t = (key: string) => translations[key]?.[language] ?? key;
  
  return (
    <div className="relative mx-auto w-full max-w-6xl rounded-2xl bg-white/95 px-4 py-10 backdrop-blur-sm sm:px-6 sm:rounded-3xl md:px-8 md:py-12 lg:px-10 lg:py-14">
      
      {/* Background decoration */}
      <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-violet-50/30 to-transparent opacity-50 sm:rounded-3xl" />

      <div className="relative flex flex-col items-center gap-y-6 md:grid md:grid-cols-[1fr_200px_1fr] md:grid-rows-3 md:place-items-center">

        {/* Central circle - AvalDAO */}
        <div className="col-start-2 row-start-2">
          <div className="relative flex flex-col items-center">
            <div className="relative h-48 w-48 md:h-52 md:w-52">
              <div className="absolute inset-0 rounded-full bg-linear-to-r from-violet-600 to-fuchsia-500 p-1 shadow-xl shadow-violet-500/30">
                <div className="flex h-full w-full items-center justify-center rounded-full bg-white">
                  <Image
                    src="/images/avaldao.svg"
                    alt="AvalDAO logo"
                    width={160}
                    height={160}
                    className="mb-4 object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Investors - Left */}
        <div className="col-start-1 row-start-2 flex flex-col items-center justify-self-end space-y-3 md:items-start md:self-start md:pr-6 lg:pr-10">
          <div className="flex items-center space-x-3">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-violet-100 to-fuchsia-100 shadow-md shadow-violet-200/50 transition-all duration-300 hover:shadow-lg hover:shadow-violet-300/50 sm:h-16 sm:w-16">
              <Image
                src="/images/d-investor.png"
                alt="Investors"
                width={48}
                height={48}
                className="transition-transform duration-300 hover:scale-110"
              />
            </div>
            <h3 className="text-base font-semibold text-slate-900 sm:text-lg">{t("actors.investors.title")}</h3>
          </div>
          <p className="max-w-md text-justify text-sm leading-6 text-slate-600 md:max-w-xs sm:text-base sm:leading-7">
            {t("actors.investors.description")}
          </p>
        </div>

        {/* SMEs - Bottom */}
        <div className="col-start-2 col-span-2 row-start-3 justify-self-start pt-4 md:pl-12 lg:pl-20">
          <div className="flex flex-col items-center space-y-3 md:items-start">
            <div className="flex items-center space-x-3">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-violet-100 to-fuchsia-100 shadow-md shadow-violet-200/50 transition-all duration-300 hover:shadow-lg hover:shadow-violet-300/50 sm:h-16 sm:w-16">
                <Image 
                  src="/images/d-pymes.png" 
                  alt="SMEs" 
                  width={48} 
                  height={48}
                  className="transition-transform duration-300 hover:scale-110"
                />
              </div>
              <h3 className="text-base font-semibold text-slate-900 sm:text-lg">{t("actors.smes.title")}</h3>
            </div>
            <p className="max-w-md text-justify text-sm leading-6 text-slate-600 md:max-w-xs sm:text-base sm:leading-7">
              {t("actors.smes.description")}
            </p>
          </div>
        </div>

        {/* Shops - Top Right */}
        <div className="col-start-3 row-start-1 md:self-end md:justify-self-start">
          <div className="flex flex-col items-center space-y-3 md:items-start">
            <div className="flex items-center space-x-3">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-violet-100 to-fuchsia-100 shadow-md shadow-violet-200/50 transition-all duration-300 hover:shadow-lg hover:shadow-violet-300/50 sm:h-16 sm:w-16">
                <Image 
                  src="/images/d-commerce.png" 
                  alt="Shops" 
                  width={48} 
                  height={48}
                  className="transition-transform duration-300 hover:scale-110"
                />
              </div>
              <h3 className="text-base font-semibold text-slate-900 sm:text-lg">{t("actors.shops.title")}</h3>
            </div>
            <p className="max-w-md text-justify text-sm leading-6 text-slate-600 md:max-w-xs sm:text-base sm:leading-7">
              {t("actors.shops.description")}
            </p>
          </div>
        </div>
      </div>
      
      {/* Footer section */}
      <div className="relative mt-10 text-center md:mt-12 md:pt-6">
        <h4 className="bg-linear-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-xl font-semibold text-transparent sm:text-2xl">
          {t("we-trust")}
        </h4>
        <div className="mx-auto mt-3 h-0.5 w-16 rounded-full bg-linear-to-r from-violet-600 to-fuchsia-600 shadow-md shadow-violet-400/50"></div>
      </div>

    </div>
  );
};

export default AvalDaoDiagram;
